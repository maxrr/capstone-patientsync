import { createContext, useState, useEffect, useMemo } from "react";
import { Platform, NativeEventEmitter, PermissionsAndroid } from "react-native";
import ConnectPlusApp from "../ConnectPlusApp";

// Constants and configuration
export const ENABLE_BLE_FUNCTIONALITY = true;

export const SERVICE_PATIENTSYNC_UUID = "50DB505C-8AC4-4738-8448-3B1D9CC09CC5";
export const CHAR_CUR_ROOM_UUID = "EB6E7163-A3EA-424B-87B4-F63EB8CCB65A";
export const CHAR_CUR_PATIENT_UUID = "6DF4D135-1F8A-409E-BCA4-5265DA56DF4F";
export const CHAR_LAST_EDIT_TIME_UUID = "2727FACF-E0EC-4667-9799-BE56C80AB5B5";
export const CHAR_LAST_EDIT_USER_ID_UUID = "6A083CD6-A9D6-41A7-A9C5-B4C9C42D7FC8";

export const BLE_MGR_STATE_OFFLINE = 0x0;
export const BLE_MGR_STATE_IDLE = 0x1;
export const BLE_MGR_STATE_SEARCHING = 0x2;
export const BLE_MGR_STATE_STOPPING = 0x3;
export const BLE_MGR_STATE_CONNECTING = 0x4;
export const BLE_MGR_STATE_CONNECTED = 0x5;
export const BLE_MGR_STATE_DISCONNECTING = 0x6;
export const BLE_MGR_STATE_DISABLED = 0xfe;
export const BLE_MGR_STATE_UNKNOWN = 0xff;

export const BLE_MGR_STATES_STRS = {
    [BLE_MGR_STATE_OFFLINE]: "STATE_OFFLINE",
    [BLE_MGR_STATE_IDLE]: "STATE_IDLE",
    [BLE_MGR_STATE_SEARCHING]: "STATE_SEARCHING",
    [BLE_MGR_STATE_STOPPING]: "STATE_STOPPING",
    [BLE_MGR_STATE_CONNECTING]: "STATE_CONNECTING",
    [BLE_MGR_STATE_CONNECTED]: "STATE_CONNECTED",
    [BLE_MGR_STATE_DISCONNECTING]: "STATE_DISCONNECTING",
    [BLE_MGR_STATE_DISABLED]: "STATE_DISABLED",
    [BLE_MGR_STATE_UNKNOWN]: "STATE_UNKNOWN"
};

const BLE_MGR_ALL_STATES = [
    BLE_MGR_STATE_OFFLINE,
    BLE_MGR_STATE_IDLE,
    BLE_MGR_STATE_SEARCHING,
    BLE_MGR_STATE_STOPPING,
    BLE_MGR_STATE_CONNECTING,
    BLE_MGR_STATE_CONNECTED,
    BLE_MGR_STATE_DISCONNECTING,
    BLE_MGR_STATE_DISABLED,
    BLE_MGR_STATE_UNKNOWN
];

// TODO: Properly implement state management
export const BLE_MGR_VALID_ENTRY_STATES = {
    [BLE_MGR_STATE_OFFLINE]: BLE_MGR_ALL_STATES,
    [BLE_MGR_STATE_IDLE]: [BLE_MGR_STATE_OFFLINE, BLE_MGR_STATE_UNKNOWN],
    [BLE_MGR_STATE_SEARCHING]: [BLE_MGR_STATE_IDLE],
    [BLE_MGR_STATE_STOPPING]: [BLE_MGR_STATE_SEARCHING],
    [BLE_MGR_STATE_CONNECTING]: [BLE_MGR_STATE_SEARCHING],
    [BLE_MGR_STATE_CONNECTED]: [BLE_MGR_STATE_CONNECTING],
    [BLE_MGR_STATE_DISCONNECTING]: [BLE_MGR_STATE_CONNECTED],
    [BLE_MGR_STATE_DISABLED]: BLE_MGR_ALL_STATES,
    [BLE_MGR_STATE_UNKNOWN]: BLE_MGR_ALL_STATES
};

// export const BLE_MGR_VALID_ENTRY_STATES = {
//     [BLE_MGR_STATE_OFFLINE]: BLE_MGR_ALL_STATES,
//     [BLE_MGR_STATE_IDLE]: BLE_MGR_ALL_STATES,
//     [BLE_MGR_STATE_SEARCHING]: BLE_MGR_ALL_STATES,
//     [BLE_MGR_STATE_STOPPING]: BLE_MGR_ALL_STATES,
//     [BLE_MGR_STATE_CONNECTING]: BLE_MGR_ALL_STATES,
//     [BLE_MGR_STATE_CONNECTED]: BLE_MGR_ALL_STATES,
//     [BLE_MGR_STATE_DISCONNECTING]: BLE_MGR_ALL_STATES,
//     [BLE_MGR_STATE_DISABLED]: BLE_MGR_ALL_STATES,
//     [BLE_MGR_STATE_UNKNOWN]: BLE_MGR_ALL_STATES
// };

const config = {
    CHARACTERISTIC_UUID_MAP: {
        [CHAR_CUR_ROOM_UUID]: "cur_room",
        [CHAR_CUR_PATIENT_UUID]: "cur_patient_mrn",
        [CHAR_LAST_EDIT_TIME_UUID]: "last_edit_time",
        [CHAR_LAST_EDIT_USER_ID_UUID]: "last_edit_user_id"
    },
    SECONDS_TO_SCAN_FOR: 5,
    // NOTE: Filtering is done in handleDiscoverPeripheral
    SERVICE_UUIDS: [],
    ALLOW_DUPLICATES: true,
    SCAN_STOP_TIMEOUT: 5000
};

function BleMgrWrapper() {
    // List of all peripherals currently known by the manager
    const [peripherals, setPeripherals] = useState(new Map());
    useEffect(
        // Update formatted 'devices' on peripherals update
        () => {
            // console.log("peripherals update, now:", peripherals);
            setDevices(transformPeripheralsToDevices(peripherals));
        },
        [peripherals]
    );

    /* Transformed list of devices (stripped properties and properly formatted) adapted from peripherals
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

    // Current state of the bluetooth manager
    const [managerState, setManagerState] = useState(BLE_MGR_STATE_OFFLINE);
    useEffect(() => {
        if (stateTimeout) {
            cancelTimeout(stateTimeout);
            console.debug("[BleMgr] Cancelled state timeout");
        }
        console.debug(
            `[BleMgr] managerState updated to ${managerState} (${BLE_MGR_STATES_STRS[managerState] ?? "(no str)"})`
        );
    }, [managerState]);

    // Current instance of the manager
    const [manager, setManager] = useState(null);

    // Registered event listeners
    const [eventListeners, setEventListeners] = useState([]);

    const [stateTimeout, setStateTimeout] = useState(null);

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
                devs.push({
                    name: peripheral.name ?? "(no name)",
                    room: peripheral?.customData?.curRoom ?? "(no room)",
                    isOverride: peripheral?.customData?.isPatientAssociated,
                    id,
                    rssi: peripheral.rssi ?? "??"
                });
            }
        }

        devs.sort((a, b) => a.rssi - b.rssi);
        return devs;
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
        return { curRoom, isPatientAssociated };
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

        if (validStates.includes(managerState)) {
            console.log("[BleMgr] Retrieving connected peripherals");
            try {
                const connectedPeripherals = await manager.getConnectedPeripherals();
                if (connectedPeripherals.length === 0) {
                    console.debug("[BleMgr] No connected peripherals found");
                    return;
                }

                // console.debug("[BleMgr] Found these connected peripherals:", connectedPeripherals);

                pendingChange = peripherals;

                for (var i = 0; i < connectedPeripherals.length; i++) {
                    const peripheral = connectedPeripherals[i];
                    const p = pendingChange.get(peripheral.id) ?? peripheral;
                    pendingChange.set(p.id, p);
                    // setPeripherals((map) => {
                    //     let p = map.get(peripheral.id) ?? peripheral;
                    //     p.connected = true;
                    //     return new Map(map.set(p.id, p));
                    // });
                }

                setPeripherals(pendingChange);
            } catch (error) {
                console.error("[BleMgr] Unable to retrieve connected peripherals:", error);
            }
        } else {
            console.log(
                `[BleMgr] Could not retrieve connected peripherals, current state ${BLE_MGR_STATES_STRS[managerState]}, expected one of: ${validStates}`
            );
        }
    };

    const connectPeripheral = async (peripheral) => {
        const validStates = BLE_MGR_VALID_ENTRY_STATES[BLE_MGR_STATE_CONNECTING];

        if (validStates.includes(managerState)) {
            try {
                if (peripheral) {
                    console.log(`[BleMgr] Attempting connection with: ${peripheral ?? "(none)"}`);

                    setConnectingDevice(peripheral.id);

                    setPeripherals((map) => {
                        let p = map.get(peripheral.id);
                        if (p) {
                            p.connecting = true;
                            return new Map(map.set(p.id, p));
                        }
                        return map;
                    });

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
                    console.debug(`[BleMgr] [${peripheral.id}] retrieved peripheral services:`, peripheralData);

                    setPeripherals((map) => {
                        let p = map.get(peripheral.id);
                        if (p) {
                            return new Map(map.set(p.id, p));
                        }
                        return map;
                    });

                    console.debug(`[BleMgr] [${peripheral.id}] retrieved current RSSI value: ${rssi}`);

                    if (peripheralData.characteristics) {
                        for (let characteristic of peripheralData.characteristics) {
                            if (characteristic.descriptors) {
                                for (let descriptor of characteristic.descriptors) {
                                    try {
                                        let data = await manager.readDescriptor(
                                            peripheral.id,
                                            characteristic.service,
                                            characteristic.characteristic,
                                            descriptor.uuid
                                        );
                                        console.debug(
                                            `[BleMgr] [${peripheral.id}] ${characteristic.service} ${characteristic.characteristic} ${descriptor.uuid} descriptor read as:`,
                                            data
                                        );
                                    } catch (error) {
                                        console.error(
                                            `[BleMgr] [${peripheral.id}] failed to retrieve descriptor ${descriptor?.toString() ?? descriptor} for characteristic ${characteristic?.toString() ?? characteristic}:`,
                                            error
                                        );
                                    }
                                }
                            }
                        }
                    }

                    // TODO: Maybe run this during device discovery? Not sure if it is already run.
                    const rssi = await manager.readRSSI(peripheral.id);
                    setPeripherals((map) => {
                        let p = map.get(peripheral.id);
                        if (p) {
                            p.rssi = rssi;
                            return new Map(map.set(p.id, p));
                        }
                        return map;
                    });

                    const queryData = await queryConnectedPeripheral(peripheral);
                    setConnectedDevice(devices.get(peripheral.id));
                    return queryData;

                    // navigation.navigate("PeripheralDetails", { peripheralData: peripheralData });
                } else {
                    console.log("[BleMgr] Invalid peripheral supplied for connection");
                }
            } catch (error) {
                console.error(`[BleMgr] [${peripheral.id}] connectPeripheral error:`, error);
            } finally {
                setConnectingDevice(null);
            }
        } else {
            console.log(
                `[BleMgr] Could not connect attempt peripheral connection, current state ${BLE_MGR_STATES_STRS[managerState]}, expected one of: ${validStates}`
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
                        console.log(
                            key,
                            key.toUpperCase(),
                            key.toUpperCase() in CHARACTERISTIC_UUID_MAP,
                            CHARACTERISTIC_UUID_MAP[key.toUpperCase()]
                        );
                        console.log(CHARACTERISTIC_UUID_MAP);
                        const prettyName =
                            key.toUpperCase() in CHARACTERISTIC_UUID_MAP ? CHARACTERISTIC_UUID_MAP[key.toUpperCase()] : key;
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
    const handleStopScan = () => {
        // TODO: Figure out if this is the right place to set manager state
        setManagerState(BLE_MGR_STATE_IDLE);
        console.debug("[BleMgr] Scan is stopped.");
    };

    const handleConnectPeripheral = (event) => {
        // TODO: Figure out if this is the right place to set manager state
        setManagerState(BLE_MGR_STATE_CONNECTED);
        console.log(`[BleMgr] [${event.peripheral}] has connected`);
    };

    const handleDisconnectedPeripheral = (event) => {
        // TODO: Figure out if this is the right place to set manager state
        setManagerState(BLE_MGR_STATE_IDLE);
        console.debug(`[BleMgr] [${event.peripheral}] has disconnected`);
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

    const handleDiscoverPeripheral = (peripheral) => {
        // console.debug("[BleMgr] Discovered peripheral", peripheral.id);

        if (!peripheral.name) {
            peripheral.name = "NO NAME";
        }

        // console.log(
        //     ">> service uuids:",
        //     peripheral?.advertising?.serviceUUIDs,
        //     SERVICE_PATIENTSYNC_UUID.toLowerCase(),
        //     peripheral?.advertising?.serviceUUIDs?.includes(SERVICE_PATIENTSYNC_UUID.toLowerCase())
        // );

        peripheral.customData = { curRoom: undefined, isPatientAssociated: undefined };

        // console.log(peripheral?.advertising);
        decoded = decodeRawAdvertisingData(peripheral?.advertising?.rawData?.bytes);
        if (255 in decoded) {
            peripheral.customData = decodeManufacturerCustomField(decoded[255].bytes);
        }

        // console.log("customData", peripheral.customData);

        // console.log(peripheral);

        // Filter discovered device
        if (peripheral?.advertising?.serviceUUIDs?.includes(SERVICE_PATIENTSYNC_UUID.toLowerCase())) {
            // console.log(`[BleMgr] Peripheral ${peripheral.id} passed UUID check`);
            // TODO: Maybe run this during device discovery? Not sure if it is already run.
            setPeripherals((map) => {
                return new Map(map.set(peripheral.id, peripheral));
            });

            if (!manager?.readRSSI) console.debug(`[BleMgr] manager.readRSSI doesn't exist! manager:`, manager);

            manager
                ?.readRSSI(peripheral.id)
                .then((rssi) => {
                    peripheral = peripherals.get(peripheral.id) ?? peripheral;
                    peripheral.rssi = rssi;
                    setPeripherals((map) => {
                        return new Map(map.set(peripheral.id, peripheral));
                    });
                })
                .catch((error) => {
                    console.log(`[BleMgr] Error while retrieving peripheral ${peripheral.id} RSSI:`, error);
                });
        } else {
            // console.log(`[BleMgr] Peripheral ${peripheral.id} does not include service UUID: ${SERVICE_PATIENTSYNC_UUID}`);
            // console.log(peripheral?.advertising?.serviceUUIDs);
        }

        // console.log("peripherals:", peripherals.entries());
        // console.log("devices:", devices);
    };

    // Main functions
    const initialize = () => {
        if (ENABLE_BLE_FUNCTIONALITY) {
            const validStates = BLE_MGR_VALID_ENTRY_STATES[BLE_MGR_STATE_IDLE];
            if (validStates.includes(managerState)) {
                console.log("[BleMgr] Starting manager");
                try {
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
                                mgr.addListener("BleManagerDiscoverPeripheral", handleDiscoverPeripheral),
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
                console.log(`[BleMgr] Unable to initialize, current state ${managerState}, expected one of: ${validStates}`);
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
        if (validStates.includes(managerState)) {
            try {
                setPeripherals(new Map());
                retrieveConnected();
                console.debug("[BleMgr] Starting scan");
                // FIXME: Once a scan's timer is started, you can call stopScan, but this will not stop it from stopping the scan once the timer runs out if another scan is started.
                manager
                    .scan(config.SERVICE_UUIDS, config.SECONDS_TO_SCAN_FOR, config.ALLOW_DUPLICATES, {
                        matchMode: BleScanMatchMode.Sticky,
                        scanMode: BleScanMode.LowLatency,
                        callbackType: BleScanCallbackType.AllMatches,
                        legacy: false
                    })
                    .then(() => {
                        console.debug("[BleMgr] Scan started");
                        setManagerState(BLE_MGR_STATE_SEARCHING);
                    })
                    .catch((error) => {
                        console.error("[BleMgr] Scan was not able to start:", error);
                    });
                // .finally(() => {
                //     setManagerState(BLE_MGR_STATE_IDLE);
                // });
            } catch (error) {
                console.error("[BleMgr] Unexpected error while starting scan:", error);
            }
        } else {
            console.log(`[BleMgr] Unable to start scan, current state ${managerState}, expected one of: ${validStates}`);
        }
    };

    // FIXME: This is not working properly when a user leaves the device select screen
    const stopScan = () => {
        const validStates = BLE_MGR_VALID_ENTRY_STATES[BLE_MGR_STATE_STOPPING];
        if (validStates.includes(managerState)) {
            manager
                ?.stopScan()
                .then(() => {
                    console.log("[BleMgr] Stopping scan");
                    setManagerState(BLE_MGR_STATE_STOPPING);
                    setStateTimeout(
                        setTimeout(() => {
                            console.debug(
                                `[BleMgr] Manager took more than ${config.SCAN_STOP_TIMEOUT} ms to stop, setting state back to idle`
                            );
                            setManagerState(BLE_MGR_STATE_IDLE);
                        }, config.SCAN_STOP_TIMEOUT)
                    );

                    clearTimeout();
                })
                .catch((error) => {
                    console.error("[BleMgr] Error thrown while stopping scan:", error);
                })
                .finally(() => {
                    // setIsScanning(false);
                    // setManagerState(BLE_MGR_STATE_IDLE);
                });
        } else {
            console.log(`[BleMgr] Unable to stop scan, current state ${managerState}, expected one of: ${validStates}`);
        }
    };

    const connectToDevice = async (id) => {
        const peripheral = peripherals.get(id);
        if (peripheral) {
            if (connectingDevice) {
                console.debug(`[BleMgr] User tried to select peripheral ${id}, but already connecting`);
                return null;
            }
            const deviceData = await connectPeripheral(peripheral);
            console.debug("[BleMgr] (debug) device data:", deviceData);

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

    const publicCollection = {
        bluetoothPeripherals: peripherals,
        bluetoothDevices: devices,
        bluetoothConnectingDevice: connectingDevice,
        bluetoothConnectedDevice: connectedDevice,
        bluetoothManagerState: managerState,
        bluetoothInitialize: initialize,
        bluetoothStartScan: startScan,
        bluetoothStopScan: stopScan,
        bluetoothRemoveListeners: removeListeners
    };

    return <ConnectPlusApp {...publicCollection} />;
}

export default BleMgrWrapper;
