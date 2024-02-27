import { Button, Text, View } from "react-native";
import Styles from "../../styles/main";

const patientProfile = {
    firstName: "Ron",
    lastName: "Smith",
    mrn: "157849",
    visitNumber: "2163",
    dob: "03/14/1992"
};

//Very similar to PatientConfirmScreen, but doing this with the override section instead.
//I figured having separate screens would be easier for the override side of the app if we wanted to change things around -dt
function PatientConfirmOverrideScreen({ navigation }) {
    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.h4]}>Patient Override</Text>
            <Text style={[Styles.h6]}>This device is already linked to a patient, please confirm to continue.</Text>
            <View style={[Styles.container, { width: 250, height: 250, backgroundColor: Styles.colors.GEPurple }]}>
                <Text style={{ color: "white", textAlign: "center", padding: 50 }}>(patient picture)</Text>
            </View>
            <Text style={[Styles.h5]}>
                {patientProfile.lastName}, {patientProfile.firstName}
            </Text>
            <Text style={[Styles.h5]}>{patientProfile.dob}</Text>
            <Text style={[Styles.h6]}>MRN: {patientProfile.mrn}</Text>
            <Text style={[Styles.h6]}>Visit number: {patientProfile.visitNumber}</Text>

            {/*Navigation buttons for override screen. -dt*/}
             {/*Didn't create more override screens because
             I'm unsure if we want to set the text on other screens with a variable changing with ?
             or if we want separate screens. Separate screens might lead to lots of overlap/content. -dt*/}
            <Button title="Override" onPress={() => navigation.push("Enter Patient Info")} />
            <Button title="Choose Another Device" onPress={() => navigation.push("Device Select")} />
        </View>
    );
}

export default PatientConfirmOverrideScreen;