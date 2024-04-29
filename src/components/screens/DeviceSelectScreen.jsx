import { useState, useContext, useEffect, useCallback, useRef } from "react";
import { Text, View, ActivityIndicator, Alert, Pressable, BackHandler } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import Styles from "../../styles/main";
import UniformPageWrapper from "../comps/UniformPageWrapper";
import LayoutSkeleton from "../comps/LayoutSkeleton";
import BluetoothManagerContext from "../BluetoothManagerContext";

import CurrentFlowSettingsContext, {
    CONTEXT_CURRENTFLOWSETTINGS_LINKING,
    CONTEXT_CURRENTFLOWSETTINGS_UNLINKING
} from "../CurrentFlowSettingsContext";
import { BLE_MGR_STATE_CONNECTED, BLE_MGR_STATE_SEARCHING, ENABLE_BLE_FUNCTIONALITY } from "../comps/BleMgrConfig";
import DeviceInfoPane from "../comps/DeviceInfoPane";
import StyledModal from "../comps/StyledModal";
import StyledTextInput from "../comps/StyledTextInput";
import PatientContext from "../PatientContext";
import { fetchPatient } from "../utils/FetchPatient";
import LabeledIconButton from "../comps/LabeledIconButton";
import { useFocusEffect } from "@react-navigation/native";

function StartStopScanButton({ icon, onPress }) {
    return (
        <Pressable onPress={onPress}>
            <FontAwesome name={icon} size={20} color={Styles.colors.Background} />
        </Pressable>
    );
}

function DeviceSelectScreen({ navigation }) {
    // Context to store device info

    const {
        bluetoothDevices,
        bluetoothConnectingDevice,
        bluetoothConnectedDevice,
        bluetoothManagerIsScanning,
        bluetoothStartScan,
        bluetoothStopScan,
        bluetoothManagerState,
        bluetoothManagerGetImmediateState,
        bluetoothConnectToDevice,
        bluetoothDisconnectFromDevice
    } = useContext(BluetoothManagerContext);

    // Use state variable to keep track of what is being searched
    const [currSearch, setCurrSearch] = useState("");
    const [searchedDevices, setSearchedDevices] = useState([]);
    const [connectionModalVisible, setConnectionModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const isDeviceConnecting = useRef(false);

    useEffect(() => {
        if (refreshing) {
            setRefreshing(bluetoothManagerIsScanning);
        }
    }, [bluetoothManagerState]);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (bluetoothConnectingDevice || bluetoothConnectedDevice) {
                    return true;
                }
            };

            const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () => subscription.remove();
        }, [bluetoothConnectingDevice])
    );

    // Completely changing how this was done, before it was a lot of hardcoded buttons, now going to map
    // and then filter them based on search use state. Could use ? visibility for each button but that seems
    // a lot worse than this imo -dt
    // All hardcoded as of right now.
    // const placeholderDeviceList = [
    //     { name: "GECP2427170", room: "412A", isOverride: false, id: "00:00:00:00:00:01", rssi: 20 },
    //     { name: "GECP4167318", room: "413B", isOverride: false, id: "00:00:00:00:00:02", rssi: 20 },
    //     { name: "GECP9834313(patient connected)", room: "311C", isOverride: true, id: "00:00:00:00:00:03", rssi: 20 },
    //     { name: "GECP4934123(patient connected)", room: "214A", isOverride: true, id: "00:00:00:00:00:04", rssi: 20 },
    //     { name: "GECP3018493(patient connected)", room: "104D", isOverride: true, id: "00:00:00:00:00:05", rssi: 20 },
    //     { name: "GECP5813938(patient connected)", room: "503C", isOverride: true, id: "00:00:00:00:00:06", rssi: 20 },
    //     { name: "GECP6847242(patient connected)", room: "204E", isOverride: true, id: "00:00:00:00:00:07", rssi: 20 },
    //     { name: "GECP7892324(patient connected)", room: "513B", isOverride: true, id: "00:00:00:00:00:08", rssi: 20 },
    //     { name: "GECP9342422(patient connected)", room: "321A", isOverride: true, id: "00:00:00:00:00:09", rssi: 20 },
    //     { name: "GECP8432742(patient connected)", room: "102F", isOverride: true, id: "00:00:00:00:00:0A", rssi: 20 },
    //     { name: "GECP1032338(patient connected)", room: "401C", isOverride: true, id: "00:00:00:00:00:0B", rssi: 20 },
    //     { name: "GECP1238549(patient connected)", room: "201A", isOverride: true, id: "00:00:00:00:00:0C", rssi: 20 }
    // ];

    // Test to see if override only (since unlinking case)
    // const showOverrides = route.params?.showOverrides || false;
    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    const { flowType } = getCurrentFlowSettings();

    const [_, setPatientProfiles] = useContext(PatientContext);

    // Searched devices is a list of devices which have been filtered based on what is typed
    // Casted everything to lowercase so none of this is case sensitive -dt note 3/17/24 change

    useEffect(() => {
        // console.log("[DEBUG] bluetoothDevices or currSearch triggered render");
        setSearchedDevices(
            bluetoothDevices.filter(
                (device) =>
                    // Devices pass this filter if their name, room, or id matches the filter AND we are either linking (and therefore want to show all devices), or are unlinking and are associated with a patient (since it would not make sense to try to unlink a device that does not have an associated patient)
                    (device.name.toLocaleLowerCase().includes(currSearch.toLocaleLowerCase()) ||
                        device.room.toLocaleLowerCase().includes(currSearch.toLocaleLowerCase()) ||
                        device.id.toLocaleLowerCase().includes(currSearch.toLocaleLowerCase())) &&
                    (flowType == CONTEXT_CURRENTFLOWSETTINGS_LINKING ||
                        (flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING && device.isOverride))
            )
        );
    }, [bluetoothDevices, currSearch]);

    // Start a scan when this page is navigated to,
    useEffect(() => {
        // bluetoothStartScan();
        return () => {
            bluetoothStopScan();
        };
    }, []);

    // TODO: This block should execute when we back out of the next screen, but this is good enough for now
    useEffect(() => {
        return navigation.addListener("focus", () => {
            console.debug("[DeviceSelectScreen focus] firing...");
            isDeviceConnecting.current = true;
            setTimeout(() => {
                isDeviceConnecting.current = false;
            }, 1500);
            setPatientProfiles(null);
            bluetoothDisconnectFromDevice()
                .then(() => {
                    bluetoothStartScan();
                })
                .catch((error) => {
                    console.error(`[DeviceSelectScreen] Error while disconnecting from device:`, error);
                });
        });
    }, [navigation]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <StartStopScanButton
                    icon={bluetoothManagerIsScanning ? "stop" : "play"}
                    onPress={() => {
                        if (bluetoothManagerIsScanning) {
                            bluetoothStopScan();
                        } else {
                            bluetoothStartScan();
                        }
                    }}
                />
            )
        });
    });

    const doRefresh = () => {
        // bluetoothResetSeenDevices();
        bluetoothStartScan();
    };

    const selectDevice = async (device) => {
        if (!connectionModalVisible) setConnectionModalVisible(true);
        try {
            const deviceInfo = await bluetoothConnectToDevice(device.id);
            if (bluetoothManagerGetImmediateState() == BLE_MGR_STATE_CONNECTED) {
                setCurrentFlowSettings((a) => {
                    if ((deviceInfo && deviceInfo.isOverride == null) || deviceInfo.isOverride == undefined) {
                        throw new Error(`Expected deviceInfo to define \`.isOverride\`, is: ${deviceInfo?.isOverride}`);
                    }

                    if (flowType == CONTEXT_CURRENTFLOWSETTINGS_LINKING) a.areOverridingPatient = deviceInfo.isOverride;
                    return a;
                });

                if (deviceInfo.cur_patient_mrn != "-1") {
                    const patientProfile = await fetchPatient(deviceInfo.cur_patient_mrn, true);
                    setPatientProfiles({
                        existingPatient: patientProfile
                    });
                }
            } else {
                throw new Error("Device didn't actually connect!");
            }
        } catch (error) {
            console.error(`[DeviceSelectScreen] Error while trying to connect to device:`, error);
            throw error;
        }
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
                </StyledModal>

                {/* Added searchbar to search through connectplus devices -dt 3/17/2024 change */}
                <StyledTextInput
                    placeholder="Search by device room, name or id"
                    onChangeText={setCurrSearch}
                    value={currSearch}
                />

                {flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING ? (
                    <Text
                        style={[
                            Styles.h6,
                            {
                                color: "#ff3d3d",
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
                                if (
                                    !bluetoothConnectingDevice &&
                                    !bluetoothConnectingDevice &&
                                    !isDeviceConnecting.current
                                ) {
                                    isDeviceConnecting.current = true;
                                    selectDevice(device)
                                        .then(() => {
                                            isDeviceConnecting.current = false;
                                            setConnectionModalVisible(false);
                                            if (flowType == CONTEXT_CURRENTFLOWSETTINGS_LINKING) {
                                                navigation.push("Device Details");
                                            } else {
                                                navigation.push("Confirm Link");
                                            }
                                        })
                                        .catch((error) => {
                                            setConnectionModalVisible(false);
                                            Alert.alert(
                                                "A problem occurred while connecting to this device.",
                                                "Please try again."
                                            );
                                            console.error(
                                                "[BleMgr] Frontend error when trying to connect to device:",
                                                error
                                            );
                                        });
                                }
                            }}
                            showOverrides={flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING}
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
                        {bluetoothManagerIsScanning ? (
                            <>
                                <Text style={{ fontSize: 14, color: "#aaa", textAlign: "center" }}>
                                    Scanning for Connect+ devices...
                                </Text>
                                <ActivityIndicator animating={true} />
                            </>
                        ) : (
                            <Text style={{ fontSize: 14, color: "#aaa", textAlign: "center", lineHeight: 16 }}>
                                Don't see the device you're looking for? Refresh by pulling down or with the refresh button
                                in the top right.
                            </Text>
                        )}
                    </View>
                </View>
            </LayoutSkeleton>
        </UniformPageWrapper>
    );
}

export default DeviceSelectScreen;
