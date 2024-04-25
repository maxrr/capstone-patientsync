import { useContext, useState } from "react";
import { ActivityIndicator, Alert, Button, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";

import Styles from "../../styles/main";
import Stepper from "../comps/Stepper";
import DeviceInfoPane from "../comps/DeviceInfoPane";
import PatientInfoPane from "../comps/PatientInfoPane";

import PatientContext from "../PatientContext";
import DeviceContext from "../DeviceContext";
import BluetoothManagerContext from "../BluetoothManagerContext";
import UniformPageWrapper from "../comps/UniformPageWrapper";
import StyledModal from "../comps/StyledModal";
import CurrentFlowSettingsContext from "../CurrentFlowSettingsContext";
import LayoutSkeleton from "../comps/LayoutSkeleton";
import ConfirmCancelCombo from "../comps/ConfirmCancelCombo";

function LinkConfirmScreen({ navigation }) {
    const route = useRoute();
    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    const { linkingStepper } = getCurrentFlowSettings();

    const [info, setInfo] = useContext(PatientContext);
    // const [deviceInfo, setDeviceInfo] = useContext(DeviceContext);
    const {
        bluetoothConnectedDevice,
        bluetoothPerformSyncWithDevice,
        bluetoothResetSeenDevices,
        bluetoothDisconnectFromDevice
    } = useContext(BluetoothManagerContext);

    const [linkStatusText, setLinkStatusText] = useState("");
    const [linkStatusModalVisible, setLinkStatusModalVisible] = useState(false);

    //if unlinking, then don't have MRN and just use the patient profile we generated as an example last month
    const patientProfile = !linkingStepper
        ? {
              // Hardcoded values for the unlink scenario
              firstName: "Ron",
              lastName: "Smith",
              mrn: "157849",
              visitNumber: "2163",
              dob: "03/14/1992"
          }
        : {
              firstName: info.first,
              lastName: info.last,
              mrn: info.mrn,
              visitNumber: info.visit,
              dob: info.month + "/" + info.day + "/" + info.year
          };
    // const patientProfile = {
    //     // Hardcoded values for the unlink scenario
    //     firstName: "Ron",
    //     lastName: "Smith",
    //     mrn: "157849",
    //     visitNumber: "2163",
    //     dob: "03/14/1992"
    // };

    const performLink = () => {
        setLinkStatusText("Starting...");
        setLinkStatusModalVisible(true);
        bluetoothPerformSyncWithDevice(bluetoothConnectedDevice?.id, patientProfile.mrn, "SAMPLEUSERID", (progress) => {
            setLinkStatusText(progress);
        })
            .then((res) => {
                console.log("res:", res);
                setLinkStatusModalVisible(false);
                navigation.popToTop();
                navigation.push("Link Complete", { lastConnectedDeviceInfo: { ...bluetoothConnectedDevice } });
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
                console.log("res:", res);
                setLinkStatusModalVisible(false);
                navigation.popToTop();
                navigation.push("Link Complete", {
                    lastConnectedDeviceInfo: { ...bluetoothConnectedDevice }
                });
                bluetoothResetSeenDevices();
            })
            .catch((error) => {
                Alert.alert(error.toString());
                console.error(error);
                setLinkStatusModalVisible(false);
            });
    };

    return (
        <UniformPageWrapper>
            <LayoutSkeleton
                title={!linkingStepper ? "Unlink" : "Link"}
                subtitle={!linkingStepper ? "Ready to unlink?" : "Ready to link?"}
                stepper={3}
            >
                {/* <Stepper step={3} />
                <Text style={[Styles.h4]}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>{}</Text>
                </Text>
                <Text style={[Styles.h6]}></Text> */}

                <Text style={{ fontSize: 14, color: "#aaa", textAlign: "center", lineHeight: 16, marginTop: 4 }}>
                    You are about to link the following patient and device, please confirm all details before proceeding.
                </Text>

                <PatientInfoPane profile={patientProfile} style={{ marginTop: 10 }} />
                <DeviceInfoPane device={bluetoothConnectedDevice} />

                <StyledModal visible={linkStatusModalVisible} innerStyle={{ gap: Styles.consts.gapIncrement }}>
                    <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>Syncing...</Text>
                    <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>{linkStatusText}</Text>
                    <ActivityIndicator style={{ marginVertical: Styles.consts.gapIncrement * 2 }} />
                </StyledModal>

                {/* <Button
                    title={!linkingStepper ? "Unlink" : "Link"}
                    onPress={!linkingStepper ? performUnlink : performLink}
                    // onPress={() => navigation.push("Link Complete", { linkingStepper })}
                /> */}
                <ConfirmCancelCombo
                    confirmText={!linkingStepper ? "Unlink" : "Link"}
                    onCancel={() => {
                        navigation.pop();
                    }}
                    onConfirm={!linkingStepper ? performUnlink : performLink}
                    confirmIcon={linkingStepper ? "link" : "unlink"}
                />
            </LayoutSkeleton>
        </UniformPageWrapper>
    );
}

export default LinkConfirmScreen;
