import { Button, Text, View } from "react-native";
import Styles from "../../styles/main";
import { useRoute } from "@react-navigation/native";
import PatientContext from "../PatientContext";
import { useContext } from "react";
import Stepper from "../comps/Stepper";


const patientProfile = {
    firstName: "Not found",
    lastName: "Not found",
    mrn: "Not found",
    visitNumber: "Not found",
    dob: "Not found"
};

// fetch the info of the patient from the MRN associated with the C+ device
async function fetchPatient(mrn) {
    try {
        // fetch to database for provided MRN
        const resp = await fetch(`http://vpn.rountree.me:6969/getPatientInfo?mrn=${mrn}`)
        const fetchedInfo = await resp.json()
        // if there is a msg field, the patient could not be found
        if (fetchedInfo.msg) {
            Alert.alert(
                "Patient not found",
                `there exists no patient with the MRN (${mrn}) already associated with this device`,
                [{ text: "OK" }]
            )
        } else {
            patientProfile = {
                mrn: mrn,
                visit: fetchedInfo.visit.trim(),
                first: fetchedInfo.first.trim(),
                last: fetchedInfo.last.trim(),
                year: fetchedInfo.year,
                month: fetchedInfo.month,
                day: fetchedInfo.day,
                gender: fetchedInfo.gender
            }
        }
    } catch (e) {
        console.log(e)
        Alert.alert(
            "Error",
            "something went wrong",
            [{ text: "OK" }], { cancelable: false }
        )
    }
}

// TODO: add call to fetchPatient using MRN from bluetooth device in order to fetch the patient's info
// and update patientProfile so that it displays properly

// Very similar to PatientConfirmScreen, but doing this with the override section instead.
// I figured having separate screens would be easier for the override side of the app if we wanted to change things around -dt
function PatientConfirmOverrideScreen({ navigation }) {
    const route = useRoute();
    const { isOverride } = route.params || { isOverride: false };
    
    const [info, setInfo] = useContext(PatientContext);
    setInfo(patientProfile);

    // *** SHOWOVERRIDES IS THE UNLINK CASE ***
    // *** SHOWOVERRIDES IS THE UNLINK CASE ***
    const { showOverrides } = route.params || { showOverrides: false };

    return (
        <View style={[Styles.container]}>
            <Stepper step={2}/>
            <Text style={[Styles.h4]}>
                <Text style={{ color: "white", fontWeight: "bold" }}>{showOverrides ? 'Patient Unlink' : 'Patient Override'}</Text>
            </Text>

            <Text style={[Styles.h6]}>{showOverrides ? 'Confirm that this is the correct patient to unlink from the device' : 'This device is already linked to a patient, please confirm to continue.'}</Text>
            <View style={{ height: 10 }}></View>

            {/* <View style={[Styles.container, { width: 250, height: 250, backgroundColor: Styles.colors.GEPurple }]}>
                <Text style={{ color: "white", textAlign: "center", padding: 50 }}>(patient picture)</Text>
            </View> */}

            <View style={{ height: 10 }}></View>
            <Text style={[Styles.h5]}>
                {patientProfile.lastName}, {patientProfile.firstName}
            </Text>

            <Text style={[Styles.h5]}>{patientProfile.dob}</Text>
            <Text style={[Styles.h6]}>MRN: {patientProfile.mrn}</Text>
            <Text style={[Styles.h6]}>Visit number: {patientProfile.visitNumber}</Text>
            <View style={{ height: 10 }}></View>
            {/*Navigation buttons for override screen. -dt*/}
            {/*Didn't create more override screens because

            I'm unsure if we want to set the text on other screens with a variable changing with ?
            or if we want separate screens. Separate screens might lead to lots of overlap/content. -dt*/}

            {/* Need to conditionally render the two buttons for either progressing in override case or progressing 
            in the case of unlinking and just going back to the main menu*/}
            {!showOverrides && (
                <Button title="Override Patient" onPress={() => navigation.push("Enter Patient Info", { isOverride: true })} />
            )}

            {showOverrides && (
                <Button title="Unlink This Patient" onPress={() => navigation.push("Confirm Link", { isUnlinking: true })} />
            )}

            <Button title="Choose Another Device" onPress={() => navigation.push("Device Select", { showOverrides: showOverrides })} />
            <View style={{ height: 10 }}></View>

        </View>
    );
}

export default PatientConfirmOverrideScreen;