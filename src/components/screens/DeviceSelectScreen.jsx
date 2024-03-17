import { useState, useEffect } from "react";
// import { Text, View, Pressable, ScrollView } from "react-native";
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
import BleManager, { BleScanCallbackType, BleScanMatchMode, BleScanMode } from "react-native-ble-manager";

const SECONDS_TO_SCAN_FOR = 5;
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

function DeviceSelectScreen({ navigation }) {
    const [isScanning, setIsScanning] = useState(false);
    const [peripherals, setPeripherals] = useState(
        // new Map<Peripheral['id'], Peripheral>(),
        new Map()
    );
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        startScan();
    }, []);

    const startScan = () => {
        if (!isScanning) {
            // reset found peripherals before scan
            //   setPeripherals(new Map<Peripheral['id'], Peripheral>());
            setPeripherals(new Map());

            try {
                console.debug("[startScan] starting scan...");
                setIsScanning(true);
                // BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
                //     matchMode: BleScanMatchMode.Sticky,
                //     scanMode: BleScanMode.LowLatency,
                //     callbackType: BleScanCallbackType.AllMatches
                // })
                BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES)
                    .then(() => {
                        console.debug("[startScan] scan promise returned successfully.");
                    })
                    .catch((err) => {
                        console.error("[startScan] ble scan returned in error", err);
                    });
            } catch (error) {
                console.error("[startScan] ble scan error thrown", error);
            }
        }
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
        console.debug("[handleDiscoverPeripheral] new BLE peripheral=", peripheral);
        if (!peripheral.name) {
            peripheral.name = "NO NAME";
        }
        setPeripherals((map) => {
            return new Map(map.set(peripheral.id, peripheral));
        });
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
        try {
            const connectedPeripherals = await BleManager.getConnectedPeripherals();
            if (connectedPeripherals.length === 0) {
                console.warn("[retrieveConnected] No connected peripherals found.");
                return;
            }

            console.debug("[retrieveConnected] connectedPeripherals", connectedPeripherals);

            for (var i = 0; i < connectedPeripherals.length; i++) {
                var peripheral = connectedPeripherals[i];
                setPeripherals((map) => {
                    let p = map.get(peripheral.id);
                    if (p) {
                        p.connected = true;
                        return new Map(map.set(p.id, p));
                    }
                    return map;
                });
            }
        } catch (error) {
            console.error("[retrieveConnected] unable to retrieve connected peripherals.", error);
        }
    };

    const connectPeripheral = async (peripheral) => {
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
                                        `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
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

                navigation.navigate("PeripheralDetails", { peripheralData: peripheralData });
            }
        } catch (error) {
            console.error(`[connectPeripheral][${peripheral.id}] connectPeripheral error`, error);
        }
    };

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    useEffect(() => {
        try {
            BleManager.start({ showAlert: false })
                .then(() => console.debug("BleManager started."))
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
            console.debug("[app] main component unmounting. Removing listeners...");
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
                console.log(result);
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

    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.h4]}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Device Select</Text>
            </Text>
            <Text style={[Styles.h6]}>Select a device to continue</Text>

            <Button title="Start scan" onPress={startScan} />

            <ScrollView
                contentContainerStyle={{
                    paddingTop: Styles.consts.gapIncrement,
                    paddingLeft: Styles.consts.gapIncrement * 2,
                    paddingRight: Styles.consts.gapIncrement * 2,
                    gap: Styles.consts.gapIncrement,
                    backgroundColor: "292A2B",
                    paddingBottom: 50
                }}
                style={{ width: "100%" }}
            >
                {/*Using pressable instead of button so we can design, react native is bad w/ natural buttons -DT */}
                {devices.map((a) => (
                    <Pressable key={a.name} style={Styles.deviceSelectButton} onPress={() => navigation.push(a.screen)}>
                        <Text
                            style={[
                                Styles.deviceSelectButton,
                                Styles.deviceSelectButtonText,
                                { backgroundColor: Styles.colors.GEPurple }
                            ]}
                        >
                            <Text style={[{ fontWeight: "bold" }]}>{a.name}</Text>
                            {"\n"}
                            {a.room}
                        </Text>
                    </Pressable>
                ))}
                {Array.from(peripherals, (a, i) => {
                    console.log(i, a[1]);
                    const dev = a[1];
                    return (
                        <Pressable key={dev.id} style={Styles.deviceSelectButton}>
                            <Text
                                style={[
                                    Styles.deviceSelectButton,
                                    Styles.deviceSelectButtonText,
                                    { backgroundColor: Styles.colors.GEPurple }
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
                                Service UUIDs: {dev.advertising.serviceUUIDs.join(", ")}
                            </Text>
                        </Pressable>
                    );
                })}
                {console.log({ peripherals })}

                <Text style={{ textAlign: "center", color: "white" }}>Scroll for more devices...</Text>
            </ScrollView>
        </View>
    );
}

export default DeviceSelectScreen;
