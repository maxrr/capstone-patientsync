import { Text } from "react-native";
import Styles from "../../styles/main";
import PatientContext from "../PatientContext";
import { useContext } from "react";
import { useRoute } from "@react-navigation/native";
import CurrentFlowSettingsContext from "../CurrentFlowSettingsContext";
import UniformPageWrapper from "../comps/UniformPageWrapper";
import LayoutSkeleton from "../comps/LayoutSkeleton";
import PatientInfoPane from "../comps/PatientInfoPane";
import DeviceInfoPane from "../comps/DeviceInfoPane";
import LabeledIconButton from "../comps/LabeledIconButton";

function LinkCompleteScreen({ navigation }) {
    const [info, setInfo] = useContext(PatientContext);
    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    const { linkingStepper, showOverrides } = getCurrentFlowSettings();

    // const { bluetoothConnectedDevice } = useContext(BluetoothManagerContext);

    function returnHome() {
        setCurrentFlowSettings(null);
        navigation.popToTop();
        setInfo(null);
    }

    const route = useRoute();
    const { lastConnectedDeviceInfo } = route.params;

    //Must have hardcoded patient information when we are unlinking to display properly. We don't have the database set up to do
    //this otherwise, and obviously no info comes from scanning in this case so must be hardcoded for unlinking -DT
    // const patientProfile = {
    //     // Hardcoded values for the unlink scenario
    //     firstName: "Ron",
    //     lastName: "Smith",
    //     mrn: "157849",
    //     visitNumber: "2163",
    //     dob: "03/14/1992"
    // };
    const patientProfile = {
        ...info,
        dob: info.dob ?? info.month + "/" + info.day + "/" + info.year
    };

    return (
        // TODO: On this page, we shouldn't give the user any ability to move backwards ~mr

        // <View style={[Styles.container]}>
        //     <Stepper step={4} />
        //     <Text style={[Styles.h4]}>
        //         <Text style={{ color: "white", fontWeight: "bold" }}>Success</Text>
        //     </Text>

        //     <View style={Styles.deviceSelectButton}>
        //         <Text
        //             style={[
        //                 Styles.deviceSelectButton,
        //                 Styles.deviceSelectButtonText,
        //                 { backgroundColor: Styles.colors.GEPurple }
        //             ]}
        //         >
        //             <Text style={{ fontWeight: "bold", fontSize: 16 }}>
        //                 {"Patient:         " + patientProfile.lastName + ", " + patientProfile.firstName}
        //             </Text>
        //             {"\n"}
        //             {"MRN:                        " + patientProfile.mrn}
        //         </Text>
        //     </View>

        //     <View style={Styles.deviceSelectButton}>
        //         <Text
        //             style={[
        //                 Styles.deviceSelectButton,
        //                 Styles.deviceSelectButtonText,
        //                 { backgroundColor: Styles.colors.GEPurple }
        //             ]}
        //         >
        //             <Text style={{ fontWeight: "bold", fontSize: 16 }}>{lastConnectedDeviceInfo.name}</Text>
        //             {"\n"}
        //             {lastConnectedDeviceInfo.room}
        //         </Text>
        //     </View>

        //     <Text style={[Styles.h6]}>{!linkingStepper ? "Unlinking Complete!" : "Link Complete!"}</Text>
        //     <Button title="Return home" onPress={returnHome} />
        //     <View style={{ height: 50 }}></View>
        // </View>
        <UniformPageWrapper centerContent={true}>
            <LayoutSkeleton
                title="Success"
                subtitle={!linkingStepper ? "Unlinking Complete!" : "Link Complete!"}
                stepper={4}
            >
                <Text style={{ color: Styles.colors.TextColor }}>
                    You have {linkingStepper ? "" : "un"}linked the following patient:
                </Text>
                <PatientInfoPane profile={patientProfile} />
                <Text style={{ color: Styles.colors.TextColor }}>to the following Connect+ device:</Text>
                <DeviceInfoPane device={lastConnectedDeviceInfo} showOverrides={!showOverrides} />
                <LabeledIconButton
                    text="Return home"
                    icon="home"
                    onPress={returnHome}
                    style={{ marginTop: Styles.consts.gapIncrement, backgroundColor: "green" }}
                />
            </LayoutSkeleton>
        </UniformPageWrapper>
    );
}

export default LinkCompleteScreen;
