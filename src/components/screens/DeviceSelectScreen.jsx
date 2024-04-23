import { useState, useContext, useEffect } from "react";
import { Text, View, Pressable, TextInput, ActivityIndicator, Modal } from "react-native";

import Styles from "../../styles/main";
import Stepper from "../comps/Stepper";
import UniformPageWrapper from "../comps/UniformPageWrapper";
import DeviceContext from "../DeviceContext";
import BluetoothManagerContext from "../BluetoothManagerContext";
import { BLE_MGR_STATE_SEARCHING, ENABLE_BLE_FUNCTIONALITY } from "../comps/BleMgrConfig";
import DeviceInfoPane from "../comps/DeviceInfoPane";
import StyledModal from "../comps/StyledModal";

function DeviceSelectScreen({ navigation, route }) {
    // Context to store device info
    const [deviceInfo, setDeviceInfo] = useContext(DeviceContext);

    const {
        bluetoothDevices,
        bluetoothConnectingDevice,
        bluetoothConnectedDevice,
        bluetoothStartScan,
        bluetoothStopScan,
        bluetoothManagerState,
        bluetoothConnectToDevice,
        bluetoothDisconnectFromDevice
    } = useContext(BluetoothManagerContext);

    // Use state variable to keep track of what is being searched
    const [currSearch, setCurrSearch] = useState("");

    const [searchedDevices, setSearchedDevices] = useState([]);

    const [connectionModalVisible, setConnectionModalVisible] = useState(false);

    // Completely changing how this was done, before it was a lot of hardcoded buttons, now going to map
    // and then filter them based on search use state. Could use ? visibility for each button but that seems
    // a lot worse than this imo -dt
    // All hardcoded as of right now.
    const deviceList = [
        { name: "GECP2427170", room: "412A", isOverride: false, id: "00:00:00:00:00:01", rssi: 20 },
        { name: "GECP4167318", room: "413B", isOverride: false, id: "00:00:00:00:00:02", rssi: 20 },
        { name: "GECP9834313(patient connected)", room: "311C", isOverride: true, id: "00:00:00:00:00:03", rssi: 20 },
        { name: "GECP4934123(patient connected)", room: "214A", isOverride: true, id: "00:00:00:00:00:04", rssi: 20 },
        { name: "GECP3018493(patient connected)", room: "104D", isOverride: true, id: "00:00:00:00:00:05", rssi: 20 },
        { name: "GECP5813938(patient connected)", room: "503C", isOverride: true, id: "00:00:00:00:00:06", rssi: 20 },
        { name: "GECP6847242(patient connected)", room: "204E", isOverride: true, id: "00:00:00:00:00:07", rssi: 20 },
        { name: "GECP7892324(patient connected)", room: "513B", isOverride: true, id: "00:00:00:00:00:08", rssi: 20 },
        { name: "GECP9342422(patient connected)", room: "321A", isOverride: true, id: "00:00:00:00:00:09", rssi: 20 },
        { name: "GECP8432742(patient connected)", room: "102F", isOverride: true, id: "00:00:00:00:00:0A", rssi: 20 },
        { name: "GECP1032338(patient connected)", room: "401C", isOverride: true, id: "00:00:00:00:00:0B", rssi: 20 },
        { name: "GECP1238549(patient connected)", room: "201A", isOverride: true, id: "00:00:00:00:00:0C", rssi: 20 }
    ];

    // Test to see if override only (since unlinking case)
    const showOverrides = route.params?.showOverrides || false;

    // Searched devices is a list of devices which have been filtered based on what is typed
    // Casted everything to lowercase so none of this is case sensitive -dt note 3/17/24 change

    useEffect(() => {
        console.log("[DEBUG] bluetoothDevices or currSearch triggered render");
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
        console.log("[DEBUG] initial load triggered render");
        bluetoothStartScan();
        return () => {
            bluetoothStopScan();
        };
    }, []);

    // TODO: This block should execute when we back out of the next screen, but this is good enough for now
    useEffect(() => {
        console.log("[DEBUG] navigation triggered render");
        return navigation.addListener("focus", () => {
            bluetoothDisconnectFromDevice();
        });
    }, [navigation]);

    // DEBUG:
    useEffect(() => {
        console.log("[DEBUG] DeviceSelectScreen rendered");
    });

    // const sampleDevice = {
    //     name: "Sample GEHC C+",
    //     id: "SA:MP:LE:DE:VI:CE",
    //     room: "777B"
    // };

    return (
        <UniformPageWrapper>
            <StyledModal visible={connectionModalVisible}>
                <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>Connecting to...{"\n"}</Text>
                <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>
                    {bluetoothConnectingDevice?.name} in room {bluetoothConnectingDevice?.room}{" "}
                    <Text style={{ color: "#999" }}>
                        ({bluetoothConnectingDevice?.id}){"\n"}
                    </Text>
                </Text>

                <ActivityIndicator style={{ marginBottom: Styles.consts.gapIncrement * 2 }} />
                {/* TODO: Add progress bar */}
                {/* <Pressable onPress={() => setConnectionModalVisible(false)} style={{ width: "100%" }}>
                    <Text
                        style={{
                            color: "white",
                            backgroundColor: Styles.colors.GEPurple,
                            width: "100%",
                            textAlign: "center",
                            padding: Styles.consts.gapIncrement,
                            borderRadius: Styles.consts.gapIncrement
                        }}
                    >
                        Cancel
                    </Text>
                </Pressable> */}
            </StyledModal>
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

            {showOverrides ? (
                <Text
                    style={{
                        color: "red",
                        // fontWeight: "bold",
                        textAlign: "center"
                    }}
                >
                    ⚠ Warning, you are UNLINKING!
                </Text>
            ) : (
                <></>
            )}
            <View
                style={{
                    gap: Styles.consts.gapIncrement,
                    backgroundColor: "292A2B",
                    width: "100%"
                }}
            >
                {searchedDevices.map((device) => (
                    <DeviceInfoPane
                        key={device?.id}
                        device={device}
                        onPress={() => {
                            // const deviceStore = {
                            //     name: device.name,
                            //     room: device.room,
                            //     isOverride: device.isOverride
                            // };

                            if (!connectionModalVisible) setConnectionModalVisible(true);

                            // DEBUG:
                            bluetoothConnectToDevice(device.id)
                                .then(() => {
                                    setConnectionModalVisible(false);
                                    navigation.push("Device Details", {
                                        isOverride: device.isOverride || false,
                                        showOverrides: showOverrides
                                    });
                                })
                                .catch((error) =>
                                    console.error("[BleMgr] Frontend error when trying to connect to device:", error)
                                );
                        }}
                        showOverrides={showOverrides}
                    />
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
        </UniformPageWrapper>
    );
}

export default DeviceSelectScreen;
