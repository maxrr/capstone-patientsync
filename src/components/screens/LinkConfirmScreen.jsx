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

function LinkConfirmScreen({ navigation }) {
    const route = useRoute();
    const { isUnlinking } = route.params || { isUnlinking: false };
    const [info, setInfo] = useContext(PatientContext);
    // const [deviceInfo, setDeviceInfo] = useContext(DeviceContext);
    const { bluetoothConnectedDevice, bluetoothPerformSyncWithDevice } = useContext(BluetoothManagerContext);

    const [linkStatusText, setLinkStatusText] = useState("");
    const [linkStatusModalVisible, setLinkStatusModalVisible] = useState(false);

    //if unlinking, then don't have MRN and just use the patient profile we generated as an example last month
    const patientProfile = isUnlinking
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

    return (
        <UniformPageWrapper>
            <Stepper step={3} />
            <Text style={[Styles.h4]}>
                <Text style={{ color: "white", fontWeight: "bold" }}>{isUnlinking ? "Unlink" : "Link"}</Text>
            </Text>
            <Text style={[Styles.h6]}>{isUnlinking ? "Ready to unlink?" : "Ready to link?"}</Text>

            {/* <Text style={[Styles.h3]}>
                {patientProfile.lastName}, {patientProfile.firstName}
            </Text>
            <Text style={[Styles.h5]}>{patientProfile.dob}</Text>
            <Text style={[Styles.h6]}>MRN: {patientProfile.mrn}</Text>
            <Text style={[Styles.h6]}>Visit number: {patientProfile.visitNumber}</Text> */}

            <Text style={{ fontSize: 14, color: "#aaa", textAlign: "center", lineHeight: 16, marginTop: 4 }}>
                You are about to link the following patient and device, please confirm all details before proceeding.
            </Text>

            <PatientInfoPane profile={patientProfile} style={{ marginTop: 10 }} />

            {/* <View style={Styles.deviceSelectButton}>
                <Text
                    style={[
                        Styles.deviceSelectButton,
                        Styles.deviceSelectButtonText,
                        { backgroundColor: Styles.colors.GEPurple }
                    ]}
                >
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                        {"Patient:         " + patientProfile.lastName + ", " + patientProfile.firstName}
                    </Text>
                    {"\n"}
                    {"MRN:                        " + patientProfile.mrn}
                </Text>
            </View> */}

            <DeviceInfoPane device={bluetoothConnectedDevice} />

            {/* <View style={Styles.deviceSelectButton}>
                <Text
                    style={[
                        Styles.deviceSelectButton,
                        Styles.deviceSelectButtonText,
                        { backgroundColor: Styles.colors.GEPurple }
                    ]}
                >
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>{bluetoothConnectedDevice.name}</Text>
                    {"\n"}
                    {bluetoothConnectedDevice.room}
                </Text>
            </View> */}

            <StyledModal visible={linkStatusModalVisible} innerStyle={{ gap: Styles.consts.gapIncrement }}>
                <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>Syncing...</Text>
                <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>{linkStatusText}</Text>
                <ActivityIndicator style={{ marginVertical: Styles.consts.gapIncrement * 2 }} />
            </StyledModal>

            <Button
                title={isUnlinking ? "Unlink" : "Link"}
                onPress={() => {
                    setLinkStatusText("Setting up...");
                    setLinkStatusModalVisible(true);
                    bluetoothPerformSyncWithDevice(
                        bluetoothConnectedDevice?.id,
                        patientProfile.mrn,
                        "SAMPLEUSERID",
                        (progress) => {
                            setLinkStatusText(progress);
                        }
                    )
                        .then((res) => {
                            console.log("res:", res);
                            setLinkStatusModalVisible(false);
                        })
                        .catch((error) => {
                            Alert.alert(error.toString());
                            console.error(error);
                        });
                }}
                // onPress={() => navigation.push("Link Complete", { isUnlinking })}
            />
        </UniformPageWrapper>
    );
}

export default LinkConfirmScreen;
