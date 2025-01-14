import { useState, useEffect, useRef } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import ConnectPlusApp from "../ConnectPlusApp";

import {
    ENABLE_BLE_FUNCTIONALITY,
    SERVICE_PATIENTSYNC_UUID,
    CHAR_CUR_PATIENT_UUID,
    CHAR_CUR_ROOM_UUID,
    CHAR_LAST_EDIT_TIME_UUID,
    CHAR_LAST_EDIT_USER_ID_UUID,
    BLE_MGR_STATE_OFFLINE,
    BLE_MGR_STATE_IDLE,
    BLE_MGR_STATE_SEARCHING,
    BLE_MGR_STATE_STOPPING,
    BLE_MGR_STATE_CONNECTING,
    BLE_MGR_STATE_CONNECTED,
    BLE_MGR_STATE_DISCONNECTING,
    BLE_MGR_STATE_DISABLED,
    BLE_MGR_STATE_UNKNOWN,
    BLE_MGR_STATES_STRS,
    BLE_MGR_VALID_ENTRY_STATES,
    BLE_MGR_ALL_STATES
} from "./BleMgrConfig";

const config = {
    CHARACTERISTIC_UUID_MAP: {
        [CHAR_CUR_ROOM_UUID]: "cur_room",
        [CHAR_CUR_PATIENT_UUID]: "cur_patient_mrn",
        [CHAR_LAST_EDIT_TIME_UUID]: "last_edit_time",
        [CHAR_LAST_EDIT_USER_ID_UUID]: "last_edit_user_id"
    },
    SECONDS_TO_SCAN_FOR: 45,
    // NOTE: Filtering is also done in handleDiscoverPeripheral
    SERVICE_UUIDS: [SERVICE_PATIENTSYNC_UUID.toLocaleLowerCase()],
    ALLOW_DUPLICATES: true,
    SCAN_STOP_TIMEOUT: 5000
};

function BleMgrWrapper() {
    // List of all peripherals currently known by the manager
    // const [peripherals, setPeripherals] = useState(new Map());
    // useEffect(
    //     // Update formatted 'devices' on peripherals update
    //     () => {
    //         // console.log("peripherals update, now:", peripherals);
    //         setDevices(transformPeripheralsToDevices(peripherals));
    //     },
    //     [peripherals]
    // );

    // Denylist for peripherals that did not contain the correct service UUID
    const knownInvalidPeripherals = useRef(new Set());
    const resetKnownInvalidPeripherals = () => {
        knownInvalidPeripherals.current = new Set();
    };

    // Raw peripheral data from the Bluetooth manager
    const peripherals = useRef(new Map());
    const getPeripherals = () => {
        return peripherals.current;
    };
    const setPeripherals = (newPeripherals) => {
        // let changed = false;
        // if (cur.has(peripherals.id)) {
        //     if (!cur.get(peripherals.id).equals(newPeripherals.get(peripherals.id))) {
        //         changed = true;
        //     }
        // }
        const cur = getPeripherals();
        let temp;
        if (typeof newPeripherals == "function") {
            temp = newPeripherals(cur);
        } else if (typeof newPeripherals == "object" && newPeripherals instanceof Map) {
            temp = newPeripherals;
        } else {
            console.error(`[BleMgr] Unexpected \`newPeripherals\` type: ${typeof newPeripherals}`);
        }

        if (!Object.is(Array.from(temp.keys()), Array.from(cur.keys()))) {
            // console.log({ temp, cur, same: Object.is(temp, cur) });
            // console.log(`[BleMgr] Committing changes to \`devices\``);
            setDevices(transformPeripheralsToDevices(temp));
        }

        peripherals.current = temp;
    };

    /* Transformed list of devices (stripped properties and properly formatted), adapted from peripherals
        Device format: {
            name:       string,  (canonical name of device)
            room:       string,  (advertised room)
            isOverride: boolean, (whether a patient is currently associated with this device)
            id:         string,  (mac address of the device)
            rssi:       int      (signal strength of device (bigger is better, but should be negative))
        }
    */
    const [devices, setDevices] = useState([]);

    // Currrently-connected device
    const [connectedDevice, setConnectedDevice] = useState(null);

    // Device that is in the process of connecting
    const [connectingDevice, setConnectingDevice] = useState(null);

    // Band-aid for weird module stuff
    const [isManagerScanning, setIsManagerScanning] = useState(false);

    // Current state of the bluetooth manager
    // const [managerState, setManagerState] = useState(BLE_MGR_STATE_OFFLINE);
    // useEffect(() => {
    //     if (stateTimeout && stateTimeout.cancelTimeout) {
    //         cancelTimeout(stateTimeout);
    //         console.debug("[BleMgr] Cancelled state timeout");
    //     }
    //     console.debug(
    //         `[BleMgr] managerState updated to ${managerState} (${BLE_MGR_STATES_STRS[managerState] ?? "(no str)"})`
    //     );
    // }, [managerState]);
    const [hookedManagerState, setHookedManagerState] = useState(BLE_MGR_STATE_OFFLINE);
    const managerState = useRef(BLE_MGR_STATE_OFFLINE);
    const getManagerState = () => {
        return managerState.current;
    };
    const setManagerState = (newState) => {
        if (BLE_MGR_ALL_STATES.includes(newState)) {
            console.log(`[BleMgr] Manager state now: ${newState} (${BLE_MGR_STATES_STRS[newState]})`);
            managerState.current = newState;
            clearStateTimeout();
            setHookedManagerState(newState);
        } else {
            console.log(`[BleMgr] Tried to set manager state to invalid state: ${newState}`);
        }
    };

    // useEffect(() => {
    //     console.log(`[BleMgr] [DEBUG] Hooked manager state changed to: ${hookedManagerState}`);
    // }, [hookedManagerState]);

    // Current instance of the manager
    const [manager, setManager] = useState(null);

    // Registered event listeners
    const [eventListeners, setEventListeners] = useState([]);

    // const [stateTimeout, setStateTimeout] = useState(null);
    const stateTimeout = useRef(null);
    const getStateTimeout = () => {
        return stateTimeout.current;
    };
    const setStateTimeout = (newTimeout) => {
        clearStateTimeout();
        // console.log(`[BleMgr] New timeout registered: ${newTimeout}`);
        stateTimeout.current = newTimeout;
    };
    const clearStateTimeout = () => {
        const cur = getStateTimeout();
        if (cur) {
            // console.log(`[BleMgr] Destroying old state timeout: ${cur}`);
            clearTimeout(cur);
        }
        stateTimeout.current = null;
        // console.log("[BleMgr] Cleared state timeout");
    };

    const [rssiPending, setRssiPending] = useState([]);

    // Choice-enabled module things
    // NOTE: Left off here!
    const [BleScanCallbackType, setBleScanCallbackType] = useState(null);
    const [BleScanMatchMode, setBleScanMatchMode] = useState(null);
    const [BleScanMode, setBleScanMode] = useState(null);

    // Helper functions
    /**
     * Takes in an array of peripheral devices, formats them to behave better on screens
     */
    const transformPeripheralsToDevices = (peripherals) => {
        let devs = [];
        for (const [id, peripheral] of peripherals) {
            // console.log("peripheral:", peripheral);
            if (peripheral) {
                const temp = transformPeripheralToDevice(peripheral);
                if (temp.name && temp.room && temp.id && temp.rssi) devs.push(temp);
            }
        }

        devs.sort((a, b) => a.rssi - b.rssi);
        return devs;
    };

    const transformPeripheralToDevice = (peripheral, extraData = {}) => {
        return (props = {
            name: peripheral.name ?? undefined,
            room: peripheral?.customData?.curRoom ?? undefined,
            isOverride: peripheral?.customData?.isPatientAssociated,
            id: peripheral?.id ?? undefined,
            rssi: peripheral.rssi ?? undefined,
            ...extraData
        });
    };

    /**
     * Takes in an array of bytes, outputs { curRoom: string, isPatientAssociated: boolean }
     */
    const decodeManufacturerCustomField = (bytes) => {
        const isPatientAssociated = bytes[1] == 1;
        const curRoom = bytes
            .slice(2)
            .map((byte) => {
                return String.fromCharCode(byte);
            })
            .join("");
        return { read: true, curRoom, isPatientAssociated };
    };

    /**
     *
     * Takes in `rawData` on BLE device discovery, returns data
     * @param {Array} data
     * @returns
     */
    const decodeRawAdvertisingData = (data) => {
        if (!data) return;

        let field_types = {};

        let ptr = 0;
        while (ptr < data.length) {
            const field_length = data[ptr];
            ptr++;

            const field_data_bytes = data.slice(ptr, ptr + field_length + 1);
            const field_type = field_data_bytes[0];
            ptr += field_length;

            const field_data_bytes_as_str = field_data_bytes
                .map((byte) => {
                    return String.fromCharCode(byte);
                })
                .join("");

            field_types[field_type] = {
                bytes: field_data_bytes,
                str: field_data_bytes_as_str
            };

            // console.log({ field_length, field_type, field_data_bytes, field_data_bytes_as_str });
        }

        // console.log(field_types);

        return field_types;
    };

    // const togglePeripheralConnection = async (peripheral) => {
    //     if (peripheral && peripheral.connected) {
    //         try {
    //             await BleManager.disconnect(peripheral.id);
    //         } catch (error) {
    //             console.error(
    //                 `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
    //                 error
    //             );
    //         }
    //     } else {
    //         await connectPeripheral(peripheral);
    //     }
    // };

    const retrieveConnected = async () => {
        const validStates = [
            BLE_MGR_STATE_CONNECTED,
            BLE_MGR_STATE_CONNECTING,
            BLE_MGR_STATE_DISCONNECTING,
            BLE_MGR_STATE_IDLE,
            BLE_MGR_STATE_SEARCHING,
            BLE_MGR_STATE_STOPPING
        ];

        if (validStates.includes(getManagerState())) {
            console.log("[BleMgr] Retrieving connected peripherals");
            try {
                const connectedPeripherals = await manager.getConnectedPeripherals();
                if (connectedPeripherals.length === 0) {
                    console.debug("[BleMgr] No connected peripherals found");
                    return;
                }

                // console.debug("[BleMgr] Found these connected peripherals:", connectedPeripherals);

                // pendingChange = getPeripherals();

                for (var i = 0; i < connectedPeripherals.length; i++) {
                    const peripheral = connectedPeripherals[i];
                    // const p = pendingChange.get(peripheral.id) ?? peripheral;
                    // pendingChange.set(p.id, p);
                    // setPeripherals((map) => {
                    //     let p = map.get(peripheral.id) ?? peripheral;
                    //     p.connected = true;
                    //     return new Map(map.set(p.id, p));
                    // });
                    console.log(`[BleMgr] Found connected peripheral with id ${peripheral.id}, disconnecting...`);
                    try {
                        await manager.disconnect(peripheral.id);
                    } catch (error) {
                        console.error(
                            `[BleMgr] Error occurred while trying to disconnect from previously-connected device with id ${peripheral.id}:`,
                            error
                        );
                    }
                }

                // setPeripherals(pendingChange);
            } catch (error) {
                console.error("[BleMgr] Unable to retrieve connected peripherals:", error);
            }
        } else {
            console.log(
                `[BleMgr] Could not retrieve connected peripherals, current state ${BLE_MGR_STATES_STRS[getManagerState()]}, expected one of: ${validStates}`
            );
        }
    };

    const connectPeripheral = async (peripheral) => {
        const validStates = BLE_MGR_VALID_ENTRY_STATES[BLE_MGR_STATE_CONNECTING];

        if (validStates.includes(getManagerState())) {
            try {
                if (peripheral) {
                    if (managerState == BLE_MGR_STATE_SEARCHING) {
                        stopScan();
                    }

                    console.log(`[BleMgr] Attempting connection with: ${peripheral ?? "(none)"}`);
                    setPeripherals((map) => {
                        let p = map.get(peripheral.id);
                        if (p) {
                            p.connecting = true;
                            return new Map(map.set(p.id, p));
                        }
                        return map;
                    });

                    setConnectingDevice(transformPeripheralToDevice(peripheral));

                    // NOTE: Sleep for a short period, hopefully help states update and should stabilize connection
                    await sleep(750);

                    await manager.connect(peripheral.id);
                    console.debug(`[BleMgr] [${peripheral.id}] connected`);

                    setPeripherals((map) => {
                        let p = map.get(peripheral.id);
                        if (p) {
                            p.connecting = false;
                            p.connected = true;
                            return new Map(map.set(p.id, p));
                        }
                        return map;
                    });

                    // before retrieving services, it is often a good idea to let bonding & connection finish properly
                    await sleep(900);

                    /* Test read current RSSI value, retrieve services first */
                    const peripheralData = await manager.retrieveServices(peripheral.id);
                    // console.debug(`[BleMgr] [${peripheral.id}] retrieved peripheral services:`, peripheralData);

                    // setPeripherals((map) => {
                    //     let p = map.get(peripheral.id);
                    //     if (p) {
                    //         return new Map(map.set(p.id, p));
                    //     }
                    //     return map;
                    // });

                    // NOTE: Not sure if we need this
                    // if (peripheralData.characteristics) {
                    //     for (let characteristic of peripheralData.characteristics) {
                    //         if (characteristic.descriptors) {
                    //             for (let descriptor of characteristic.descriptors) {
                    //                 try {
                    //                     let data = await manager.readDescriptor(
                    //                         peripheral.id,
                    //                         characteristic.service,
                    //                         characteristic.characteristic,
                    //                         descriptor.uuid
                    //                     );
                    //                     // console.debug(
                    //                     //     `[BleMgr] [${peripheral.id}] ${characteristic.service} ${characteristic.characteristic} ${descriptor.uuid} descriptor read as:`,
                    //                     //     data
                    //                     // );
                    //                 } catch (error) {
                    //                     console.error(
                    //                         `[BleMgr] [${peripheral.id}] failed to retrieve descriptor ${descriptor?.toString() ?? descriptor} for characteristic ${characteristic?.toString() ?? characteristic}:`,
                    //                         error
                    //                     );
                    //                     throw error;
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }

                    // TODO: Maybe run this during device discovery? Not sure if it is already run.
                    const rssi = await manager.readRSSI(peripheral.id);
                    console.debug(`[BleMgr] [${peripheral.id}] retrieved current RSSI value: ${rssi}`);
                    setPeripherals((map) => {
                        let p = map.get(peripheral.id);
                        if (p) {
                            p.rssi = rssi;
                            return new Map(map.set(p.id, p));
                        }
                        return map;
                    });

                    const queryData = await queryConnectedPeripheral(peripheral);
                    const transformed = transformPeripheralToDevice(peripheral, queryData);
                    setConnectedDevice(transformed);
                    return transformed;

                    // navigation.navigate("PeripheralDetails", { peripheralData: peripheralData });
                } else {
                    console.log("[BleMgr] Invalid peripheral supplied for connection");
                }
            } catch (error) {
                console.error(`[BleMgr] [${peripheral.id}] connectPeripheral error:`, error);
            } finally {
                // Give us 500ms of time to allow screens to continue properly
                setTimeout(() => {
                    setConnectingDevice(null);
                }, 500);
            }
        } else {
            console.log(
                `[BleMgr] Could not connect attempt peripheral connection, current state ${BLE_MGR_STATES_STRS[getManagerState()]}, expected one of: ${validStates}`
            );
        }
    };

    const queryConnectedPeripheral = async (peripheral) => {
        const VALID_DESCRIPTORS = [
            CHAR_CUR_PATIENT_UUID,
            CHAR_CUR_ROOM_UUID,
            CHAR_LAST_EDIT_TIME_UUID,
            CHAR_LAST_EDIT_USER_ID_UUID
        ].map((a) => a.toLowerCase());
        try {
            const peripheralData = await manager.retrieveServices(peripheral.id);
            // console.log(peripheralData);

            let data = {};

            if (peripheralData.characteristics) {
                for (const characteristic of peripheralData.characteristics) {
                    // console.log(`\t> characteristic: ${characteristic.characteristic}`);
                    if (VALID_DESCRIPTORS.includes(characteristic?.characteristic?.toLowerCase())) {
                        const key = characteristic.characteristic;
                        // console.log(
                        //     key,
                        //     key.toUpperCase(),
                        //     key.toUpperCase() in config.CHARACTERISTIC_UUID_MAP,
                        //     config.CHARACTERISTIC_UUID_MAP[key.toUpperCase()]
                        // );
                        // console.log(config.CHARACTERISTIC_UUID_MAP);
                        const prettyName =
                            key.toUpperCase() in config.CHARACTERISTIC_UUID_MAP
                                ? config.CHARACTERISTIC_UUID_MAP[key.toUpperCase()]
                                : key;
                        const raw = await manager.read(peripheral.id, characteristic.service, key);
                        const value = raw
                            .map((byte) => {
                                return String.fromCharCode(byte);
                            })
                            .join("");
                        data[prettyName] = value;
                    }
                }
            }

            // Make a deep copy of peripheral (unsure if this is necessary)
            // data["peripheral"] = JSON.parse(JSON.stringify(peripheral));
            data["device_name"] = peripheral.advertising.localName ?? "ERROR: NO NAME FOUND";

            console.log(`\t[!!] >> read from ${peripheral.id}: `, data);

            if (data["cur_room"]) {
                setPeripherals((map) => {
                    let p = map.get(peripheral.id);
                    if (p) {
                        p.customData = p?.customData ?? { read: false, curRoom: undefined, isPatientAssociated: undefined };
                        p.customData.curRoom = data["cur_room"];
                        return new Map(map.set(peripheral.id, p));
                    }
                    return map;
                });
            }

            return data;
        } catch (error) {
            console.error(`[queryConnectedPeripheral][${peripheral.id}] queryConnectedPeripheral error`, error);
        }
    };

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const verifyAndroidPermissions = () => {
        if (Platform.OS === "android" && Platform.Version >= 31) {
            PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
            ]).then((result) => {
                if (result) {
                    // TODO: Implement permissions verification
                    console.debug("[BleMgr] User accepts runtime permissions android 12+:", result);
                } else {
                    console.error("[BleMgr] User refuses runtime permissions android 12+");
                }
            });
        } else if (Platform.OS === "android" && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((checkResult) => {
                if (checkResult) {
                    console.debug("[BleMgr] runtime permission Android <12 already OK");
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((requestResult) => {
                        if (requestResult) {
                            console.debug("[BleMgr] User accepts runtime permission android <12");
                        } else {
                            console.error("[BleMgr] User refuses runtime permission android <12");
                        }
                    });
                }
            });
        }
    };

    // Event handlers
    const handleStopScan = (ec) => {
        // https://developer.android.com/reference/android/bluetooth/le/ScanCallback#constants_1
        if (ec == null) {
            ec = { status: 0xff }; // Placeholder in case things get funky
        }
        const { status } = ec;
        if (status != 1) {
            // TODO: Figure out if this is the right place to set manager state
            console.debug(`[BleMgr] Scan has been stopped (status ${status})`);
            setIsManagerScanning(false);
            setManagerState(BLE_MGR_STATE_IDLE);
        } else {
            console.debug(`[BleMgr] Scan start attempted, but scan is ongoing`);
            setManagerState(BLE_MGR_STATE_SEARCHING);
        }
    };

    const handleConnectPeripheral = (event) => {
        // TODO: Figure out if this is the right place to set manager state
        setManagerState(BLE_MGR_STATE_CONNECTED);
        console.log(`[BleMgr] [${event.peripheral}] has connected`);
    };

    const handleDisconnectedPeripheral = (event) => {
        // TODO: Figure out if this is the right place to set manager state
        if (getManagerState() == BLE_MGR_STATE_DISCONNECTING) {
            console.debug(`[BleMgr] [${event.peripheral}] confirmed disconnection`);
            setManagerState(BLE_MGR_STATE_IDLE);
        } else {
            console.debug(`[BleMgr] [${event.peripheral}] has unexpectedly disconnected`);
        }
        setPeripherals((map) => {
            let p = map.get(event.peripheral);
            if (p) {
                p.connected = false;
                return new Map(map.set(event.peripheral, p));
            }
            return map;
        });
    };

    const handleUpdateValueForCharacteristic = (data) => {
        console.debug(
            `[BleMgr] Received updated characteristic data from '${data.peripheral}' with char='${data.characteristic}' and val='${data.value}'`
        );
    };

    const handleDiscoverPeripheral = (peripheral, manager) => {
        // DEBUG:
        if (!getPeripherals().has(peripheral.id)) {
            // console.log(`[DEBUG] New peripheral: ${peripheral.id}`);
        }

        // If we've already processed this device, then disregard
        if (knownInvalidPeripherals.current.has(peripheral.id) || getPeripherals().has(peripheral.id)) {
            return;
        }

        // Decode custom data
        peripheral.customData = { read: false, curRoom: undefined, isPatientAssociated: undefined };
        decoded = decodeRawAdvertisingData(peripheral?.advertising?.rawData?.bytes);
        if (255 in decoded) {
            peripheral.customData = decodeManufacturerCustomField(decoded[255].bytes);
        }

        // Filter discovered device
        if (peripheral?.advertising?.serviceUUIDs?.includes(SERVICE_PATIENTSYNC_UUID.toLowerCase())) {
            if (peripheral.id && peripheral.name) {
                // console.log(`[BleMgr] Peripheral ${peripheral.id} passed UUID check`);
                setPeripherals((map) => {
                    return new Map(map.set(peripheral.id, peripheral));
                });

                if (!manager?.readRSSI) console.debug(`[BleMgr] manager.readRSSI doesn't exist! manager:`, manager);

                // TODO: Maybe run this during device discovery? Not sure if it is already run. (that's what we're trying to do, thanks past max!)
                // FIXME: This does not work and I have no idea why ~mr
                // console.log(manager.readRSSI, rssiPending.includes(peripheral.id));
                // if (manager?.readRSSI != null && !rssiPending.includes(peripheral.id)) {
                //     console.log("RSSI pass");
                //     setRssiPending((a) => {
                //         a.push(peripheral.id);
                //         return a;
                //     });

                //     manager
                //         ?.readRSSI(peripheral.id)
                //         .then((rssi) => {
                //             console.debug(`[BleMgr] RSSI for ${peripheral.id}: ${rssi}`);
                //             peripheral = peripherals.get(peripheral.id) ?? peripheral;
                //             peripheral.rssi = rssi;
                //             setPeripherals((map) => {
                //                 return new Map(map.set(peripheral.id, peripheral));
                //             });
                //         })
                //         .catch((error) => {
                //             console.log(`[BleMgr] Error while retrieving peripheral ${peripheral.id} RSSI:`, error);
                //         });
                // }
            }
        } else {
            // console.log(`[BleMgr] Peripheral ${peripheral.id} does not include service UUID: ${SERVICE_PATIENTSYNC_UUID}`);
            // console.log(peripheral?.advertising?.serviceUUIDs);
            if (!knownInvalidPeripherals.current.has(peripheral.id)) {
                console.log(`[BleMgr] Peripheral ${peripheral.id} does not have valid Service UUID, adding to denylist`);
                knownInvalidPeripherals.current.add(peripheral.id);
            }
        }

        // console.log("peripherals:", peripherals.entries());
        // console.log("devices:", devices);
    };

    // Main functions
    const initialize = () => {
        console.log(`[BleMgr] !!!!!!!!!!!!!!!! initialize() firing, this should only happen once!`);
        if (ENABLE_BLE_FUNCTIONALITY) {
            const validStates = BLE_MGR_VALID_ENTRY_STATES[BLE_MGR_STATE_IDLE];
            if (validStates.includes(getManagerState())) {
                console.log("[BleMgr] Starting manager");
                try {
                    // https://stackoverflow.com/questions/36367532/how-can-i-conditionally-import-an-es6-module ~mr
                    import("react-native-ble-manager")
                        .then((mgrModule) => {
                            const mgr = mgrModule.default;
                            setManager(mgr);
                            mgr.start({ showAlert: false })
                                .then(() => {
                                    console.debug("[BleMgr] Manager started");
                                    // if (isScanning) poll();
                                })
                                .catch((error) => console.error("[BleMgr] Manager could not be started:", error));

                            setEventListeners([
                                mgr.addListener("BleManagerDiscoverPeripheral", (peripheral) =>
                                    handleDiscoverPeripheral(peripheral, mgr)
                                ),
                                mgr.addListener("BleManagerStopScan", handleStopScan),
                                mgr.addListener("BleManagerDisconnectPeripheral", handleDisconnectedPeripheral),
                                mgr.addListener(
                                    "BleManagerDidUpdateValueForCharacteristic",
                                    handleUpdateValueForCharacteristic
                                ),
                                mgr.addListener("BleManagerConnectPeripheral", handleConnectPeripheral)
                            ]);

                            verifyAndroidPermissions();

                            setBleScanCallbackType(mgrModule.BleScanCallbackType);
                            setBleScanMatchMode(mgrModule.BleScanMatchMode);
                            setBleScanMode(mgrModule.BleScanMode);

                            setManagerState(BLE_MGR_STATE_IDLE);
                        })
                        .catch((error) => console.error("[BleMgr] Manager could not be imported:", error));
                } catch (error) {
                    console.error("[BleMgr] Unexpected error while starting manager:", error);
                    return;
                }
            } else {
                console.log(
                    `[BleMgr] Unable to initialize, current state ${getManagerState()}, expected one of: ${validStates}`
                );
            }
        } else {
            console.log("[BleMgr] Bluetooth functionality is disabled, should use placeholder devices instead");
        }
    };

    const removeListeners = () => {
        console.debug("[BleMgr] Removing all listeners");
        for (const listener of eventListeners) {
            listener.remove();
        }
        console.debug("[BleMgr] All listeners removed");
    };

    const startScan = () => {
        const validStates = BLE_MGR_VALID_ENTRY_STATES[BLE_MGR_STATE_SEARCHING];
        if (validStates.includes(getManagerState())) {
            try {
                setIsManagerScanning(true);
                console.debug("[BleMgr] Resetting before scan");
                setPeripherals(new Map());
                // resetKnownInvalidPeripherals();
                clearKnownBluetoothDevices()
                    .then(() => {
                        retrieveConnected()
                            .then(() => {
                                // FIXME: Once a scan's timer is started, you can call stopScan, but this will not stop it from stopping the scan once the timer runs out if another scan is started.
                                setManagerState(BLE_MGR_STATE_SEARCHING);

                                sleep(750)
                                    .then(() => {
                                        console.debug("[BleMgr] Starting scan");

                                        manager
                                            .scan(
                                                config.SERVICE_UUIDS,
                                                config.SECONDS_TO_SCAN_FOR,
                                                config.ALLOW_DUPLICATES,
                                                {
                                                    matchMode: BleScanMatchMode.Sticky,
                                                    scanMode: BleScanMode.LowLatency,
                                                    callbackType: BleScanCallbackType.AllMatches,
                                                    legacy: false
                                                }
                                            )
                                            .then(() => {
                                                console.debug("[BleMgr] Scan started");
                                            })
                                            .catch((error) => {
                                                console.error("[BleMgr] Scan was not able to start:", error);
                                                setManagerState(BLE_MGR_STATE_IDLE);
                                            });
                                    })
                                    .catch((error) => {
                                        console.error("[BleMgr] sleep() returned an error:", error);
                                    });
                            })
                            .catch((error) => {
                                console.error(`[BleMgr] Error while retrieving connected devices:`, error);
                            });
                    })
                    .catch((error) => {
                        console.error(`[BleMgr] Error while clearing known devices:`, error);
                    });
            } catch (error) {
                console.error("[BleMgr] Unexpected error while starting scan:", error);
            }
        } else if (getManagerState() == BLE_MGR_STATE_SEARCHING) {
            clearKnownBluetoothDevices();
        } else if (getManagerState() == BLE_MGR_STATE_CONNECTED) {
            // console.debug("[startScan] firing...");
            disconnectFromDevice()
                .then(() => {
                    sleep(5000)
                        .then(() => {
                            startScan();
                        })
                        .catch((error) => {
                            console.error("[BleMgr] sleep() returned an error:", error);
                        });
                })
                .catch((err) => {
                    console.error("[BleMgr] Error while disconnecting before scan start", err);
                });
        } else {
            console.log(
                `[BleMgr] Unable to start scan, current state ${getManagerState()}, expected one of: ${validStates}`
            );
        }
    };

    // FIXME: This is not working properly when a user leaves the device select screen
    const stopScan = () => {
        const validStates = BLE_MGR_VALID_ENTRY_STATES[BLE_MGR_STATE_STOPPING];
        if (validStates.includes(getManagerState())) {
            manager
                ?.stopScan()
                .then(() => {
                    console.log("[BleMgr] Stopping scan...");
                    setManagerState(BLE_MGR_STATE_STOPPING);

                    const timeout = setTimeout(() => {
                        console.debug(
                            `[BleMgr] Manager took more than ${config.SCAN_STOP_TIMEOUT} ms to stop, assuming something is broken and going back to idle state`
                        );
                        setManagerState(BLE_MGR_STATE_IDLE);
                    }, config.SCAN_STOP_TIMEOUT);

                    // console.log(`[BleMgr] [DEBUG] Created new timeout: ${timeout}`);
                    setStateTimeout(timeout);
                    // clearStateTimeout();
                })
                .catch((error) => {
                    console.error("[BleMgr] Error thrown while stopping scan:", error);
                })
                .finally(() => {
                    // setIsScanning(false);
                    // setManagerState(BLE_MGR_STATE_IDLE);
                });
        } else if (getManagerState() != BLE_MGR_STATE_IDLE) {
            console.log(`[BleMgr] Unable to stop scan, current state ${getManagerState()}, expected one of: ${validStates}`);
        }
    };

    const connectToDevice = async (id) => {
        const peripheral = getPeripherals().get(id);
        if (peripheral) {
            if (connectingDevice || connectedDevice) {
                console.debug(
                    `[BleMgr] User tried to select peripheral ${id}, but already connecting/connected to ${connectingDevice?.id ?? connectedDevice.id}, disconnecting from there...`
                );
                // console.debug("[connectToDevice] firing...");
                await disconnectFromDevice();
            }

            await manager.stopScan();
            const deviceData = await connectPeripheral(peripheral);
            // console.debug("[BleMgr] (debug) device data:", deviceData);

            // await sleep(1000);

            // TODO: Add error checking
            // await manager.disconnect(peripheral.id);
            // console.log(deviceData);
            // confirmSelectedDevice(deviceData);
            return deviceData;
        } else {
            console.debug(`[BleMgr] No peripheral found with id: ${id}`);
        }
    };

    const disconnectFromDevice = async () => {
        // TODO: Check for incoming states

        const id = connectingDevice?.id ?? connectedDevice?.id;
        if (id && getPeripherals().get(id)) {
            // if (getPeripherals().get(id)?.connected) {
            console.log(`[BleMgr] Disconnecting from ${id}`);
            setManagerState(BLE_MGR_STATE_DISCONNECTING);

            // const peripheral = getPeripherals().get(id);
            try {
                await manager.disconnect(id);
                console.log(`[BleMgr] Disconnected from ${id}`);
                setManagerState(isManagerScanning ? BLE_MGR_STATE_SEARCHING : BLE_MGR_STATE_IDLE);
                knownInvalidPeripherals.current.delete(id);
                setPeripherals((map) => {
                    map.delete(id);
                    return map;
                });
            } catch (error) {
                console.error(`[BleMgr] Error occurred while trying to disconnect from peripheral:`, error);
            } finally {
                // setManagerState(BLE_MGR_STATE_IDLE);
                setConnectedDevice(null);
                setConnectingDevice(null);
            }
            // } else {
            //     console.log(`[BleMgr] Tried to disconnect from ${id}, but this device is not marked as connected.`);
            // }
        } else {
            console.log(`[BleMgr] Tried to disconnect from device, but no connected device found`);
        }
    };

    const performSyncWithDevice = async (peripheralId, mrn, changeUserId, statusCallback = () => {}) => {
        if (peripheralId) {
            if (mrn && changeUserId) {
                const uuidMapping = {
                    [CHAR_CUR_PATIENT_UUID]: [mrn, "patient MRN"],
                    [CHAR_LAST_EDIT_USER_ID_UUID]: [changeUserId, "editor ID"],
                    [CHAR_LAST_EDIT_TIME_UUID]: [Math.floor(Date.now() / 1000).toString(), "edit time"]
                };
                // console.log(uuidMapping);
                for (const key in uuidMapping) {
                    const [val, prettyName] = uuidMapping[key];
                    // console.log(key);
                    statusCallback(`Writing ${prettyName} to device...`);
                    try {
                        let byteArray = [];
                        for (let i = 0; i < val.length; i++) {
                            byteArray.push(val.charCodeAt(i));
                        }

                        // console.log(`Encoded ${val} to:`, byteArray);

                        await manager.write(peripheralId, SERVICE_PATIENTSYNC_UUID, key, byteArray);
                    } catch (error) {
                        console.error(`[BleMgr] Error thrown while writing ${key}=${val} to ${peripheralId}:`, error);
                        throw new Error(
                            `Error occurred while writing characteristic "${prettyName}" (${[key]}). Please try again.`
                        );
                    }
                    await sleep(800);
                }

                return true;
            } else {
                throw new Error("Invalid MRN, or editor identifier, please try again.");
            }
        } else {
            throw new Error("Invalid peripheral identifier supplied, please try again.");
        }
    };

    const clearKnownBluetoothDevices = async () => {
        // TODO:
        // await manager.disconnect();
        // console.debug("[clearKnownBluetoothDevices] firing...");
        await disconnectFromDevice();
        resetKnownInvalidPeripherals();
        // try {
        //     manager.refreshCache();
        // } catch (error) {
        //     console.error(`[BleMgr] Error while trying to refresh manager cache:`, error);
        // }
        setPeripherals(() => new Map());
    };

    const publicCollection = {
        // bluetoothGetPeripherals: getPeripherals,
        bluetoothDevices: devices,
        bluetoothConnectingDevice: connectingDevice,
        bluetoothConnectedDevice: connectedDevice,
        bluetoothManagerState: hookedManagerState,
        bluetoothManagerIsScanning: isManagerScanning,
        bluetoothManagerGetImmediateState: getManagerState,
        bluetoothInitialize: initialize,
        bluetoothStartScan: startScan,
        bluetoothStopScan: stopScan,
        bluetoothRemoveListeners: removeListeners,
        bluetoothConnectToDevice: connectToDevice,
        bluetoothDisconnectFromDevice: disconnectFromDevice,
        bluetoothPerformSyncWithDevice: performSyncWithDevice,
        bluetoothResetSeenDevices: clearKnownBluetoothDevices
    };

    return <ConnectPlusApp {...publicCollection} />;
}

export default BleMgrWrapper;
