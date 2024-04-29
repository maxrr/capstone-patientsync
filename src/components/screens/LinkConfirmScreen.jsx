import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text } from "react-native";

import Styles from "../../styles/main";
import DeviceInfoPane from "../comps/DeviceInfoPane";
import PatientInfoPane from "../comps/PatientInfoPane";

import PatientContext from "../PatientContext";
import BluetoothManagerContext from "../BluetoothManagerContext";
import UniformPageWrapper from "../comps/UniformPageWrapper";
import StyledModal from "../comps/StyledModal";
import CurrentFlowSettingsContext, {
    CONTEXT_CURRENTFLOWSETTINGS_LINKING,
    CONTEXT_CURRENTFLOWSETTINGS_UNLINKING
} from "../CurrentFlowSettingsContext";
import LayoutSkeleton from "../comps/LayoutSkeleton";
import ConfirmCancelCombo from "../comps/ConfirmCancelCombo";

function LinkConfirmScreen({ navigation }) {
    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    const { flowType, areOverridingPatient } = getCurrentFlowSettings();

    const [getPatientProfiles, setPatientProfiles] = useContext(PatientContext);
    const { newPatient, existingPatient } = getPatientProfiles();

    const {
        bluetoothConnectedDevice,
        bluetoothPerformSyncWithDevice,
        bluetoothResetSeenDevices,
        bluetoothDisconnectFromDevice
    } = useContext(BluetoothManagerContext);

    const [linkStatusText, setLinkStatusText] = useState("");
    const [linkStatusModalVisible, setLinkStatusModalVisible] = useState(false);

    const performLink = () => {
        setLinkStatusText("Starting...");
        setLinkStatusModalVisible(true);
        bluetoothPerformSyncWithDevice(bluetoothConnectedDevice?.id, newPatient.mrn, "SAMPLEUSERID", (progress) => {
            setLinkStatusText(progress);
        })
            .then((res) => {
                // console.log("res:", res);
                setLinkStatusModalVisible(false);
                navigation.popToTop();
                navigation.push("Link Complete", {
                    lastConnectedDeviceInfo: { ...bluetoothConnectedDevice, isOverride: true }
                });
                bluetoothResetSeenDevices();
            })
            .catch((error) => {
                Alert.alert(error.toString());
                console.error(error);
                setLinkStatusModalVisible(false);
            });
    };

    const performUnlink = () => {
        setLinkStatusText("Starting...");
        setLinkStatusModalVisible(true);
        bluetoothPerformSyncWithDevice(bluetoothConnectedDevice?.id, "-1", "SAMPLEUSERID", (progress) => {
            setLinkStatusText(progress);
        })
            .then((res) => {
                // console.log("res:", res);
                setLinkStatusModalVisible(false);
                navigation.popToTop();
                navigation.push("Link Complete", {
                    lastConnectedDeviceInfo: { ...bluetoothConnectedDevice, isOverride: false }
                });
                bluetoothResetSeenDevices();
            })
            .catch((error) => {
                Alert.alert(error.toString());
                console.error(error);
                setLinkStatusModalVisible(false);
            });
    };

    useEffect(() => {
        navigation.setOptions({
            headerTitle:
                "Confirm " + flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING
                    ? "Unlink"
                    : `${areOverridingPatient ? "Override & " : ""}Link`
        });
    });

    return (
        <UniformPageWrapper>
            <LayoutSkeleton
                title={
                    flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING
                        ? "Unlink"
                        : `${areOverridingPatient ? "Override & " : ""}Link`
                }
                subtitle={
                    flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING
                        ? "Ready to unlink?"
                        : `Ready to ${areOverridingPatient ? "override and " : ""}link?`
                }
                stepper={3}
            >
                {/* <Stepper step={3} />
                <Text style={[Styles.h4]}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>{}</Text>
                </Text>
                <Text style={[Styles.h6]}></Text> */}

                <Text style={{ fontSize: 14, color: "#aaa", textAlign: "center", lineHeight: 16, marginTop: 4 }}>
                    You are about to {flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING ? "un" : ""}link the following
                    patient and device, please confirm all details before proceeding.
                </Text>

                {flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING ? (
                    <Text
                        style={[
                            Styles.h6,
                            {
                                color: "#ff3d3d",
                                fontWeight: "bold",
                                textAlign: "center",
                                marginTop: 4
                            }
                        ]}
                    >
                        ⚠ Warning, you are unlinking!
                    </Text>
                ) : (
                    <></>
                )}

                <PatientInfoPane
                    profile={flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING ? existingPatient : newPatient}
                    style={{ marginTop: 10 }}
                />
                <DeviceInfoPane device={bluetoothConnectedDevice} showOverrides={areOverridingPatient} />

                <StyledModal visible={linkStatusModalVisible} innerStyle={{ gap: Styles.consts.gapIncrement }}>
                    <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
                        {flowType == CONTEXT_CURRENTFLOWSETTINGS_LINKING
                            ? areOverridingPatient
                                ? "Overriding"
                                : "Linking"
                            : "Unlinking"}
                        ...
                    </Text>
                    <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>{linkStatusText}</Text>
                    <ActivityIndicator style={{ marginVertical: Styles.consts.gapIncrement * 2 }} />
                </StyledModal>

                {flowType == CONTEXT_CURRENTFLOWSETTINGS_LINKING && areOverridingPatient ? (
                    <>
                        <Text style={{ color: "#ff3d3d", textAlign: "center", marginVertical: 4, fontWeight: "bold" }}>
                            By performing this action, you will remove the following user from this device:
                        </Text>
                        <PatientInfoPane profile={existingPatient} />
                    </>
                ) : (
                    <></>
                )}

                {/* <Button
                    title={!linkingStepper ? "Unlink" : "Link"}
                    onPress={!linkingStepper ? performUnlink : performLink}
                    // onPress={() => navigation.push("Link Complete", { linkingStepper })}
                /> */}
                <ConfirmCancelCombo
                    confirmText={
                        flowType == CONTEXT_CURRENTFLOWSETTINGS_LINKING
                            ? areOverridingPatient
                                ? "Override & Link"
                                : "Link"
                            : "Unlink"
                    }
                    onCancel={() => {
                        navigation.pop();
                    }}
                    confirmStyle={flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING ? { backgroundColor: "#9e0000" } : {}}
                    onConfirm={flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING ? performUnlink : performLink}
                    confirmIcon={
                        flowType == CONTEXT_CURRENTFLOWSETTINGS_LINKING
                            ? areOverridingPatient
                                ? "exchange"
                                : "link"
                            : "unlink"
                    }
                />
            </LayoutSkeleton>
        </UniformPageWrapper>
    );
}

export default LinkConfirmScreen;
