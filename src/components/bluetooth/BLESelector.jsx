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

    const startScan = () => {};

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                                    Room {dev.customData?.curRoom ?? "(undefined)"}
                                </Text>
                                {"\n"}

                                <Text style={[{ fontWeight: "bold" }]}>
                                    {dev.name} <Text style={{ color: "#bbb" }}>({dev.id})</Text>
                                </Text>
                                {"\n"}
                                <Text
                                    style={{
                                        marginBottom: 8,
                                        color: dev.customData?.isPatientAssociated ? "#ffcf24" : "#75d14b"
                                    }}
                                >
                                    {dev.customData?.isPatientAssociated
                                        ? "⚠ Has existing patient association"
                                        : "✓ No patient associated"}
                                </Text>
                                {/* {"\n"} */}
                                {/* {"\n"}
                                RSSI: {dev.rssi}
                                {"\n"}
                                Connectable: {dev.advertising.isConnectable ? "yes" : "no"}
                                {"\n"}
                                Connected: {dev.connected ? "yes" : "no"}
                                {"\n"}
                                Service UUIDs: {dev.advertising.serviceUUIDs.join(", ")} */}
                            </Text>
                        </Pressable>
                    );
                })}
        </View>
    );
}

export default BLESelector;
