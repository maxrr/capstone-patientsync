import { useState, useContext, useEffect } from "react";
import {
    Text,
    View,
    Button,
    Pressable,
    ScrollView,
    TextInput,
    ActivityIndicator,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform
} from "react-native";

import Styles from "../../styles/main";
import Stepper from "../comps/Stepper";
import DeviceContext from "../DeviceContext";
import BluetoothManagerContext from "../BluetoothManagerContext";
import { BLE_MGR_STATE_SEARCHING, ENABLE_BLE_FUNCTIONALITY } from "../comps/BleMgrWrapper";

function DeviceSelectScreen({ navigation, route }) {
    // Context to store device info
    const [deviceInfo, setDeviceInfo] = useContext(DeviceContext);

    const {
        bluetoothDevices,
        bluetoothConnectingDevice,
        bluetoothConnectedDevice,
        bluetoothStartScan,
        bluetoothStopScan,
        bluetoothManagerState
    } = useContext(BluetoothManagerContext);

    // Use state variable to keep track of what is being searched
    const [currSearch, setCurrSearch] = useState("");

    const [searchedDevices, setSearchedDevices] = useState([]);

    // Completely changing how this was done, before it was a lot of hardcoded buttons, now going to map
    // and then filter them based on search use state. Could use ? visibility for each button but that seems
    // a lot worse than this imo -dt
    // All hardcoded as of right now.
    const deviceList = [
        { name: "GECP2427170", room: "Room 412A", isOverride: false, id: "00:00:00:00:00:01", rssi: 20 },
        { name: "GECP4167318", room: "Room 413B", isOverride: false, id: "00:00:00:00:00:02", rssi: 20 },
        { name: "GECP9834313(patient connected)", room: "Room 311C", isOverride: true, id: "00:00:00:00:00:03", rssi: 20 },
        { name: "GECP4934123(patient connected)", room: "Room 214A", isOverride: true, id: "00:00:00:00:00:04", rssi: 20 },
        { name: "GECP3018493(patient connected)", room: "Room 104D", isOverride: true, id: "00:00:00:00:00:05", rssi: 20 },
        { name: "GECP5813938(patient connected)", room: "Room 503C", isOverride: true, id: "00:00:00:00:00:06", rssi: 20 },
        { name: "GECP6847242(patient connected)", room: "Room 204E", isOverride: true, id: "00:00:00:00:00:07", rssi: 20 },
        { name: "GECP7892324(patient connected)", room: "Room 513B", isOverride: true, id: "00:00:00:00:00:08", rssi: 20 },
        { name: "GECP9342422(patient connected)", room: "Room 321A", isOverride: true, id: "00:00:00:00:00:09", rssi: 20 },
        { name: "GECP8432742(patient connected)", room: "Room 102F", isOverride: true, id: "00:00:00:00:00:0A", rssi: 20 },
        { name: "GECP1032338(patient connected)", room: "Room 401C", isOverride: true, id: "00:00:00:00:00:0B", rssi: 20 },
        { name: "GECP1238549(patient connected)", room: "Room 201A", isOverride: true, id: "00:00:00:00:00:0C", rssi: 20 }
    ];

    // Test to see if override only (since unlinking case)
    const showOverrides = route.params?.showOverrides || false;

    // Searched devices is a list of devices which have been filtered based on what is typed
    // Casted everything to lowercase so none of this is case sensitive -dt note 3/17/24 change

    useEffect(() => {
        setSearchedDevices(
            (ENABLE_BLE_FUNCTIONALITY ? bluetoothDevices : deviceList).filter(
                (device) =>
                    (device.name.toLocaleLowerCase().includes(currSearch.toLocaleLowerCase()) ||
                        device.room.toLocaleLowerCase().includes(currSearch.toLocaleLowerCase()) ||
                        device.id.toLocaleLowerCase().includes(currSearch.toLocaleLowerCase())) &&
                    (!showOverrides || device.isOverride)
            )
        );
    }, [bluetoothDevices, currSearch]);

    useEffect(() => {
        bluetoothStartScan();
        return () => {
            bluetoothStopScan();
        };
    }, []);

    return (
        <SafeAreaView>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ minHeight: "100%" }}>
                <ScrollView contentContainerStyle={[Styles.scrollContainer]}>
                    <Stepper step={1} />
                    <Text style={[Styles.h4]}>
                        <Text style={{ color: "white", fontWeight: "bold" }}>Device Select</Text>
                    </Text>
                    <Text style={[Styles.h6]}>Select a device to continue</Text>

                    {/* Added searchbar to search through connectplus devices -dt 3/17/2024 change */}
                    <TextInput
                        style={[Styles.input, { color: "#ddd" }]}
                        placeholder="Device room, name or id"
                        placeholderTextColor={"#808080"}
                        onChangeText={setCurrSearch}
                        value={currSearch}
                    />

                    <View
                        style={{
                            gap: Styles.consts.gapIncrement,
                            backgroundColor: "292A2B",
                            width: "100%"
                        }}
                    >
                        {searchedDevices.map((device) => (
                            <Pressable
                                key={device.id}
                                style={Styles.deviceSelectButton}
                                onPress={() => {
                                    // const deviceStore = {
                                    //     name: device.name,
                                    //     room: device.room,
                                    //     isOverride: device.isOverride
                                    // };
                                    setDeviceInfo(device);
                                    navigation.push("Device Screen", {
                                        isOverride: device.isOverride || false,
                                        showOverrides: showOverrides
                                    });
                                }}
                            >
                                <Text
                                    style={[
                                        Styles.deviceSelectButton,
                                        Styles.deviceSelectButtonText,
                                        { backgroundColor: Styles.colors.GEPurple }
                                    ]}
                                >
                                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>Room {device.room}</Text>
                                    {"\n"}
                                    <Text style={[{ fontWeight: "bold" }]}>
                                        {device.name} <Text style={{ color: "#bbb" }}>({device.id})</Text>
                                    </Text>
                                    {"\n"}
                                    <Text
                                        style={{
                                            color: device.isOverride ? "#ffcf24" : "#75d14b"
                                        }}
                                    >
                                        {device.isOverride
                                            ? "⚠ Has existing patient association"
                                            : "✓ No patient associated"}
                                    </Text>
                                    {"\n"}
                                    {/* TODO: Implement icon showing connectivity */}
                                    <Text>{device.rssi}</Text>
                                </Text>
                            </Pressable>
                        ))}
                        <View
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignContent: "center",
                                flexDirection: "row",
                                gap: Styles.consts.gapIncrement,
                                marginTop: Styles.consts.gapIncrement
                            }}
                        >
                            {bluetoothManagerState == BLE_MGR_STATE_SEARCHING ? (
                                <>
                                    <Text style={{ fontSize: 14, color: "#aaa", textAlign: "center" }}>
                                        Scanning for Connect+ devices...
                                    </Text>
                                    <ActivityIndicator animating={true} />
                                </>
                            ) : (
                                <Text style={{ fontSize: 14, color: "#aaa", textAlign: "center", lineHeight: 16 }}>
                                    Don't see the device you're looking for? You can refresh this list by pulling down, or by
                                    clicking the refresh button in the top right.
                                </Text>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default DeviceSelectScreen;
