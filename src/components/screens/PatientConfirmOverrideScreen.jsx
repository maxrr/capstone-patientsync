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
            <Button title="Override" onPress={() => navigation.push("Confirm Link")} />
            <Button title="Choose Another Device" onPress={() => navigation.push("Device Select")} />
        </View>
    );
}

export default PatientConfirmOverrideScreen;
