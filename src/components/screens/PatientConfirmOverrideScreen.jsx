import { Button, Text, View } from "react-native";
import Styles from "../../styles/main";
import { useRoute } from "@react-navigation/native";
import PatientContext from "../PatientContext";
import { useContext, useEffect } from "react";
import Stepper from "../comps/Stepper";
import CurrentFlowSettingsContext from "../CurrentFlowSettingsContext";
import UniformPageWrapper from "../comps/UniformPageWrapper";
import ConfirmCancelCombo from "../comps/ConfirmCancelCombo";
import LayoutSkeleton from "../comps/LayoutSkeleton";
import PatientInfoPane from "../comps/PatientInfoPane";

const patientProfile = {
    firstName: "Ron",
    lastName: "Smith",
    mrn: "157849",
    visitNumber: "2163",
    dob: "03/14/1992"
};

const info = patientProfile;

//Very similar to PatientConfirmScreen, but doing this with the override section instead.
//I figured having separate screens would be easier for the override side of the app if we wanted to change things around -dt
function PatientConfirmOverrideScreen({ navigation }) {
    const route = useRoute();
    // const { isOverride } = route.params || { isOverride: false };

    // const [info, setInfo] = useContext(PatientContext);

    // useEffect(() => {
    //     setInfo(patientProfile);
    // }, []);

    // *** SHOWOVERRIDES IS THE UNLINK CASE ***
    // *** SHOWOVERRIDES IS THE UNLINK CASE ***
    // const { showOverrides } = route.params || { showOverrides: false };
    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    const { showOverrides } = getCurrentFlowSettings();

    return (
        // <View style={[Styles.container]}>
        //     <Stepper step={2} />
        //     <Text style={[Styles.h4]}>
        //         <Text style={{ color: "white", fontWeight: "bold" }}>
        //             {showOverrides ? "Patient Unlink" : "Patient Override"}
        //         </Text>
        //     </Text>

        //     <Text style={[Styles.h6]}>
        //         {showOverrides
        //             ? "Confirm that this is the correct patient to unlink from the device"
        //             : "This device is already linked to a patient, please confirm to continue."}
        //     </Text>
        //     <View style={{ height: 10 }}></View>

        //     {/* <View style={[Styles.container, { width: 250, height: 250, backgroundColor: Styles.colors.GEPurple }]}>
        //         <Text style={{ color: "white", textAlign: "center", padding: 50 }}>(patient picture)</Text>
        //     </View> */}

        //     <View style={{ height: 10 }}></View>
        //     <Text style={[Styles.h5]}>
        //         {patientProfile?.lastName}, {patientProfile?.firstName}
        //     </Text>

        //     <Text style={[Styles.h5]}>{patientProfile?.dob}</Text>
        //     <Text style={[Styles.h6]}>MRN: {patientProfile?.mrn}</Text>
        //     <Text style={[Styles.h6]}>Visit number: {patientProfile?.visitNumber}</Text>
        //     <View style={{ height: 10 }}></View>
        //     {/*Navigation buttons for override screen. -dt*/}
        //     {/*Didn't create more override screens because

        //     I'm unsure if we want to set the text on other screens with a variable changing with ?
        //     or if we want separate screens. Separate screens might lead to lots of overlap/content. -dt*/}

        //     {/* Need to conditionally render the two buttons for either progressing in override case or progressing
        //     in the case of unlinking and just going back to the main menu*/}
        //     {!showOverrides && <Button title="Override Patient" onPress={() => navigation.push("Enter Patient Info")} />}

        //     {showOverrides && <Button title="Unlink This Patient" onPress={() => navigation.push("Confirm Link")} />}

        //     <Button title="Choose Another Device" onPress={() => navigation.push("Device Select")} />
        //     <View style={{ height: 10 }}></View>
        // </View>
        <UniformPageWrapper>
            <LayoutSkeleton
                title={showOverrides ? "Patient Unlink" : "Patient Override"}
                subtitle={
                    showOverrides
                        ? "Confirm that this is the correct patient to unlink from the device"
                        : "This device is already linked to a patient, please confirm to continue"
                }
                stepper={showOverrides ? 2 : 1}
            >
                <PatientInfoPane profile={patientProfile} />
                <ConfirmCancelCombo
                    cancelText="Cancel"
                    confirmText={!showOverrides ? "Confirm override" : "Unlink this patient"}
                    onCancel={() => {
                        navigation.pop();
                    }}
                    onConfirm={() => {
                        navigation.push(showOverrides ? "Confirm Link" : "Enter Patient Info");
                    }}
                />
            </LayoutSkeleton>
        </UniformPageWrapper>
    );
}

export default PatientConfirmOverrideScreen;
