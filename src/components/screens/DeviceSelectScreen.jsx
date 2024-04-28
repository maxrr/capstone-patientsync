import { useState, useContext, useEffect } from "react";
import { Text, View, Pressable, ActivityIndicator, FlatList, Alert } from "react-native";

import Styles from "../../styles/main";
import Stepper from "../comps/Stepper";
import UniformPageWrapper from "../comps/UniformPageWrapper";
import LayoutSkeleton from "../comps/LayoutSkeleton";
import BluetoothManagerContext from "../BluetoothManagerContext";

import CurrentFlowSettingsContext from "../CurrentFlowSettingsContext";
import { BLE_MGR_STATE_CONNECTED, BLE_MGR_STATE_SEARCHING, ENABLE_BLE_FUNCTIONALITY } from "../comps/BleMgrConfig";
import DeviceInfoPane from "../comps/DeviceInfoPane";
import StyledModal from "../comps/StyledModal";
import StyledTextInput from "../comps/StyledTextInput";

function DeviceSelectScreen({ navigation, route }) {
    // Context to store device info

    const {
        bluetoothDevices,
        bluetoothConnectingDevice,
        bluetoothConnectedDevice,
        bluetoothStartScan,
        bluetoothStopScan,
        bluetoothManagerState,
        bluetoothManagerGetImmediateState,
        bluetoothConnectToDevice,
        bluetoothDisconnectFromDevice,
        bluetoothResetSeenDevices
    } = useContext(BluetoothManagerContext);

    // Use state variable to keep track of what is being searched
    const [currSearch, setCurrSearch] = useState("");

    const [searchedDevices, setSearchedDevices] = useState([]);

    const [connectionModalVisible, setConnectionModalVisible] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (refreshing) {
            setRefreshing(bluetoothManagerState === BLE_MGR_STATE_SEARCHING);
        }
    }, [bluetoothManagerState]);

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
    // const showOverrides = route.params?.showOverrides || false;
    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    const { showOverrides } = getCurrentFlowSettings();

    // Searched devices is a list of devices which have been filtered based on what is typed
    // Casted everything to lowercase so none of this is case sensitive -dt note 3/17/24 change

    useEffect(() => {
        // console.log("[DEBUG] bluetoothDevices or currSearch triggered render");
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

    // TODO: This block should execute when we back out of the next screen, but this is good enough for now
    useEffect(() => {
        return navigation.addListener("focus", () => {
            bluetoothDisconnectFromDevice();
        });
    }, [navigation]);

    // const sampleDevice = {
    //     name: "Sample GEHC C+",
    //     id: "SA:MP:LE:DE:VI:CE",
    //     room: "777B"
    // };

    const deviceSelect = (device) => {
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
                navigation.push("Device Details");
            })
            .catch((error) => console.error("[BleMgr] Frontend error when trying to connect to device:", error));
    };

    const doRefresh = () => {
        // bluetoothResetSeenDevices();
        bluetoothStartScan();
    };

    return (
        <UniformPageWrapper enableRefresh={true} refreshing={refreshing} onRefresh={doRefresh}>
            <LayoutSkeleton title={"Device Select"} subtitle={"Select a device to continue"} stepper={1}>
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
                {/* <Stepper step={1} />
                <Text style={[Styles.h4]}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>Device Select</Text>
                </Text>
                <Text style={[Styles.h6]}>Select a device to continue</Text> */}

                {/* Added searchbar to search through connectplus devices -dt 3/17/2024 change */}
                <StyledTextInput
                    placeholder="Search by device room, name or id"
                    onChangeText={setCurrSearch}
                    value={currSearch}
                />

                {showOverrides ? (
                    <Text
                        style={[
                            Styles.h6,
                            {
                                color: "red",
                                fontWeight: "bold",
                                textAlign: "center"
                            }
                        ]}
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
                    {/* <FlatList
                        data={searchedDevices}
                        renderItem={({ device }) => {
                            <DeviceInfoPane
                                device={device}
                                onPress={() => deviceSelect(device)}
                                showOverrides={showOverrides}
                            />;
                        }}
                        keyExtractor={(device) => device.id}
                    /> */}
                    {searchedDevices.map((device) => (
                        <DeviceInfoPane
                            key={device?.id}
                            device={device}
                            onPress={() => {
                                if (!connectionModalVisible) setConnectionModalVisible(true);

                                // DEBUG:
                                bluetoothConnectToDevice(device.id)
                                    .then(() => {
                                        if (bluetoothManagerGetImmediateState() == BLE_MGR_STATE_CONNECTED) {
                                            setConnectionModalVisible(false);
                                            navigation.push("Device Details");
                                        } else {
                                            throw new Error("Device didn't actually connect!");
                                        }
                                    })
                                    .catch((error) => {
                                        setConnectionModalVisible(false);
                                        Alert.alert(
                                            "It looks like there was a problem connecting to this device. Please try again."
                                        );
                                        console.error("[BleMgr] Frontend error when trying to connect to device:", error);
                                    });
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
            </LayoutSkeleton>
        </UniformPageWrapper>
    );
}

export default DeviceSelectScreen;
