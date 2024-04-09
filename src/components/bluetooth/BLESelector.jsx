import { useState, useEffect } from "react";
import BleManager, { BleScanCallbackType, BleScanMatchMode, BleScanMode } from "react-native-ble-manager";
import {
    SafeAreaView,
    StyleSheet,
    View,
    ScrollView,
    Text,
    StatusBar,
    NativeModules,
    NativeEventEmitter,
    Platform,
    PermissionsAndroid,
    FlatList,
    TouchableHighlight,
    Pressable,
    Button
} from "react-native";
import Styles from "../../styles/main";

const SERVICE_PATIENTSYNC_UUID = "50DB505C-8AC4-4738-8448-3B1D9CC09CC5";
const CHAR_CUR_ROOM_UUID = "EB6E7163-A3EA-424B-87B4-F63EB8CCB65A";
const CHAR_CUR_PATIENT_UUID = "6DF4D135-1F8A-409E-BCA4-5265DA56DF4F";
const CHAR_LAST_EDIT_TIME_UUID = "2727FACF-E0EC-4667-9799-BE56C80AB5B5";
const CHAR_LAST_EDIT_USER_ID_UUID = "6A083CD6-A9D6-41A7-A9C5-B4C9C42D7FC8";

const CHARACTERISTIC_UUID_MAP = {
    [CHAR_CUR_ROOM_UUID]: "cur_room",
    [CHAR_CUR_PATIENT_UUID]: "cur_patient_mrn",
    [CHAR_LAST_EDIT_TIME_UUID]: "last_edit_time",
    [CHAR_LAST_EDIT_USER_ID_UUID]: "last_edit_user_id"
};

const SECONDS_TO_SCAN_FOR = 15;
const SERVICE_UUIDS = [];
const ALLOW_DUPLICATES = true;

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// const devices = [
//     {
//         name: "GECP2427170",
//         room: "412A",
//         screen: "Device Screen"
//     },
//     {
//         name: "GECP2427171",
//         room: "412A",
//         screen: "Device Screen"
//     },
//     {
//         name: "GECP2427172",
//         room: "412A",
//         screen: "Device Screen"
//     },
//     {
//         name: "GECP2427173",
//         room: "412A",
//         screen: "Device Screen"
//     },
//     {
//         name: "GECP2427174",
//         room: "412A",
//         screen: "Device Screen"
//     },
//     {
//         name: "GECP2427175",
//         room: "412A",
//         screen: "Device Screen"
//     },
//     {
//         name: "GECP2427176",
//         room: "412A",
//         screen: "Device Screen"
//     },
//     {
//         name: "GECP2427177",
//         room: "412A",
//         screen: "Device Screen"
//     },
//     {
//         name: "GECP2427178",
//         room: "412A",
//         screen: "Device Screen"
//     },
//     {
//         name: "GECP2427179",
//         room: "412A",
//         screen: "Device Screen"
//     },
//     {
//         name: "GECP2427180",
//         room: "412A",
//         screen: "Device Screen"
//     },
//     {
//         name: "GECP2427181",
//         room: "412A",
//         screen: "Device Screen"
//     }
// ];

function BLESelector({ isScanning, setIsScanning, confirmSelectedDevice }) {
    const [peripherals, setPeripherals] = useState(
        // new Map<Peripheral['id'], Peripheral>(),
        new Map()
    );
    const [connectingPeripheral, setConnectingPeripheral] = useState(null);
    const [devices, setDevices] = useState([]);

    function poll() {
        startScan();
        retrieveConnected();
    }

    // useEffect(() => {
    //     setIsScanning(true);
    // }, []);

    useEffect(() => {
        console.log(`isScanning update; now: ${isScanning}`);
        if (isScanning) {
            poll();
        } else {
            stopScan();
        }
    }, [isScanning]);

    useEffect(() => {
        return stopScan;
    }, []);

    const startScan = () => {
        // if (!isScanning) {
        // reset found peripherals before scan
        //   setPeripherals(new Map<Peripheral['id'], Peripheral>());
        setPeripherals(new Map());

        try {
            console.debug("[startScan] starting scan...");
            // setIsScanning(true);
            // FIXME: Once a scan's timer is started, you can call stopScan, but this will not stop it from stopping the scan once the timer runs out if another scan is started.
            BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
                matchMode: BleScanMatchMode.Sticky,
                scanMode: BleScanMode.LowLatency,
                callbackType: BleScanCallbackType.AllMatches,
                legacy: false
            })
                // BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES)
                .then(() => {
                    console.debug("[startScan] scan promise returned successfully.");
                })
                .catch((err) => {
                    console.error("[startScan] ble scan returned in error", err);
                });
        } catch (error) {
            console.error("[startScan] ble scan error thrown", error);
        }
        // }
    };

    const stopScan = () => {
        BleManager.stopScan()
            .then(() => {
                console.log("[stopScan] manually stopping scan...");
            })
            .catch((error) => {
                console.error("[stopScan] error thrown", error);
            })
            .finally(() => {
                // setIsScanning(false);
            });
    };

    const handleStopScan = () => {
        setIsScanning(false);
        console.debug("[handleStopScan] scan is stopped.");
    };

    const handleDisconnectedPeripheral = (event) => {
        console.debug(`[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`);
        setPeripherals((map) => {
            let p = map.get(event.peripheral);
            if (p) {
                p.connected = false;
                return new Map(map.set(event.peripheral, p));
            }
            return map;
        });
    };

    const handleConnectPeripheral = (event) => {
        console.log(`[handleConnectPeripheral][${event.peripheral}] connected.`);
    };

    const handleUpdateValueForCharacteristic = (data) => {
        console.debug(
            `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`
        );
    };

    const handleDiscoverPeripheral = (peripheral) => {
        // console.debug("[handleDiscoverPeripheral] new BLE peripheral=", peripheral);
        if (!peripheral.name) {
            peripheral.name = "NO NAME";
        }

        // console.log(
        //     ">> service uuids:",
        //     peripheral?.advertising?.serviceUUIDs,
        //     SERVICE_PATIENTSYNC_UUID.toLowerCase(),
        //     peripheral?.advertising?.serviceUUIDs?.includes(SERVICE_PATIENTSYNC_UUID.toLowerCase())
        // );

        // Filter discovered device
        if (peripheral?.advertising?.serviceUUIDs?.includes(SERVICE_PATIENTSYNC_UUID.toLowerCase())) {
            setPeripherals((map) => {
                return new Map(map.set(peripheral.id, peripheral));
            });
        }
    };

    const togglePeripheralConnection = async (peripheral) => {
        if (peripheral && peripheral.connected) {
            try {
                await BleManager.disconnect(peripheral.id);
            } catch (error) {
                console.error(
                    `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
                    error
                );
            }
        } else {
            await connectPeripheral(peripheral);
        }
    };

    const retrieveConnected = async () => {
        console.log("[retrieveConnected] trying...");
        try {
            const connectedPeripherals = await BleManager.getConnectedPeripherals();
            if (connectedPeripherals.length === 0) {
                console.debug("[retrieveConnected] No connected peripherals found.");
                return;
            }

            console.debug("[retrieveConnected] connectedPeripherals", connectedPeripherals);

            for (var i = 0; i < connectedPeripherals.length; i++) {
                var peripheral = connectedPeripherals[i];
                setPeripherals((map) => {
                    let p = map.get(peripheral.id) ?? peripheral;
                    // if (p) {
                    p.connected = true;
                    return new Map(map.set(p.id, p));
                    // } else {
                    //     // console.log({ [peripheral.id]: p });
                    // }
                    return map;
                });
            }
        } catch (error) {
            console.error("[retrieveConnected] unable to retrieve connected peripherals.", error);
        }
    };

    const connectPeripheral = async (peripheral) => {
        console.log(`[connectPeripheral] trying with: ${peripheral ?? "(none)"}`);
        setConnectingPeripheral(peripheral);
        try {
            if (peripheral) {
                setPeripherals((map) => {
                    let p = map.get(peripheral.id);
                    if (p) {
                        p.connecting = true;
                        return new Map(map.set(p.id, p));
                    }
                    return map;
                });

                await BleManager.connect(peripheral.id);
                console.debug(`[connectPeripheral][${peripheral.id}] connected.`);

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
                const peripheralData = await BleManager.retrieveServices(peripheral.id);
                console.debug(`[connectPeripheral][${peripheral.id}] retrieved peripheral services`, peripheralData);

                setPeripherals((map) => {
                    let p = map.get(peripheral.id);
                    if (p) {
                        return new Map(map.set(p.id, p));
                    }
                    return map;
                });

                // TODO: Maybe run this during device discovery? Not sure if it is already run.
                const rssi = await BleManager.readRSSI(peripheral.id);
                console.debug(`[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`);

                if (peripheralData.characteristics) {
                    for (let characteristic of peripheralData.characteristics) {
                        if (characteristic.descriptors) {
                            for (let descriptor of characteristic.descriptors) {
                                try {
                                    let data = await BleManager.readDescriptor(
                                        peripheral.id,
                                        characteristic.service,
                                        characteristic.characteristic,
                                        descriptor.uuid
                                    );
                                    console.debug(
                                        `[connectPeripheral][${peripheral.id}] ${characteristic.service} ${characteristic.characteristic} ${descriptor.uuid} descriptor read as:`,
                                        data
                                    );
                                } catch (error) {
                                    console.error(
                                        `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor?.toString() ?? descriptor} for characteristic ${characteristic?.toString() ?? characteristic}:`,
                                        error
                                    );
                                }
                            }
                        }
                    }
                }

                setPeripherals((map) => {
                    let p = map.get(peripheral.id);
                    if (p) {
                        p.rssi = rssi;
                        return new Map(map.set(p.id, p));
                    }
                    return map;
                });

                return await queryConnectedPeripheral(peripheral);

                // navigation.navigate("PeripheralDetails", { peripheralData: peripheralData });
            }
        } catch (error) {
            console.error(`[connectPeripheral][${peripheral.id}] connectPeripheral error`, error);
        } finally {
            setConnectingPeripheral(null);
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
            const peripheralData = await BleManager.retrieveServices(peripheral.id);
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
                        const raw = await BleManager.read(peripheral.id, characteristic.service, key);
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

    useEffect(() => {
        try {
            BleManager.start({ showAlert: false })
                .then(() => {
                    console.debug("BleManager started.");
                    if (isScanning) poll();
                })
                .catch((error) => console.error("BeManager could not be started.", error));
        } catch (error) {
            console.error("unexpected error starting BleManager.", error);
            return;
        }

        const listeners = [
            bleManagerEmitter.addListener("BleManagerDiscoverPeripheral", handleDiscoverPeripheral),
            bleManagerEmitter.addListener("BleManagerStopScan", handleStopScan),
            bleManagerEmitter.addListener("BleManagerDisconnectPeripheral", handleDisconnectedPeripheral),
            bleManagerEmitter.addListener("BleManagerDidUpdateValueForCharacteristic", handleUpdateValueForCharacteristic),
            bleManagerEmitter.addListener("BleManagerConnectPeripheral", handleConnectPeripheral)
        ];

        handleAndroidPermissions();

        return () => {
            console.debug("[BLESelector] main component unmounting. Removing listeners...");
            for (const listener of listeners) {
                listener.remove();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAndroidPermissions = () => {
        if (Platform.OS === "android" && Platform.Version >= 31) {
            PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
            ]).then((result) => {
                // console.log(result);
                if (result) {
                    console.debug("[handleAndroidPermissions] User accepts runtime permissions android 12+");
                } else {
                    console.error("[handleAndroidPermissions] User refuses runtime permissions android 12+");
                }
            });
        } else if (Platform.OS === "android" && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((checkResult) => {
                if (checkResult) {
                    console.debug("[handleAndroidPermissions] runtime permission Android <12 already OK");
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((requestResult) => {
                        if (requestResult) {
                            console.debug("[handleAndroidPermissions] User accepts runtime permission android <12");
                        } else {
                            console.error("[handleAndroidPermissions] User refuses runtime permission android <12");
                        }
                    });
                }
            });
        }
    };

    const handleDeviceSelect = async (peripheral) => {
        if (connectingPeripheral) {
            console.debug(
                `[handleDeviceSelect] User tried to select peripheral ${peripheral?.id ?? "(no id)"} but already connecting`
            );
        }
        console.log("selecting:", peripheral);
        // togglePeripheralConnection(peripheral);
        const deviceData = await connectPeripheral(peripheral);

        // await sleep(1000);

        // TODO: Add error checking
        await BleManager.disconnect(peripheral.id);
        console.log(deviceData);
        confirmSelectedDevice(deviceData);
    };

    return (
        <View style={{ gap: 8 }}>
            {/* <Text style={{ color: "#FFF" }}>Scanning: {isScanning.toString()}</Text>
            <Text style={{ color: "#FFF" }}>
                Connecting: {connectingPeripheral?.id ?? (connectingPeripheral === null ? "(null)" : "(none)")}
            </Text> */}
            {Array.from(peripherals)
                .map((a) => a[1])
                .filter((a) => a !== null && a !== undefined)
                .sort((a, b) => a.rssi - b.rssi)
                // .sort((a, b) => a.name - b.name)
                .map((a, i) => {
                    // console.log(i, a);
                    const dev = a;
                    return (
                        <Pressable
                            key={dev.id}
                            style={Styles.deviceSelectButton}
                            onPress={() => handleDeviceSelect(dev)}
                            disabled={connectingPeripheral !== null}
                        >
                            <Text
                                style={[
                                    Styles.deviceSelectButton,
                                    Styles.deviceSelectButtonText,
                                    {
                                        backgroundColor:
                                            connectingPeripheral === null ? Styles.colors.GEPurple : Styles.colors.Disabled
                                    }
                                ]}
                            >
                                <Text style={[{ fontWeight: "bold" }]}>Name: {dev.name}</Text>
                                {"\n"}
                                ID: {dev.id}
                                {"\n"}
                                RSSI: {dev.rssi}
                                {"\n"}
                                Connectable: {dev.advertising.isConnectable ? "yes" : "no"}
                                {"\n"}
                                Connected: {dev.connected ? "yes" : "no"}
                                {"\n"}
                                Service UUIDs: {dev.advertising.serviceUUIDs.join(", ")}
                            </Text>
                        </Pressable>
                    );
                })}
        </View>
    );
}

export default BLESelector;
