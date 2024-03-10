import { Button, Text, View } from "react-native";
import Styles from "../../styles/main";
import { useRoute } from '@react-navigation/native';

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
    const route = useRoute();
    const { isOverride } = route.params || { isOverride: false };

    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.h4]}><Text style={{color: "white", fontWeight: "bold"}}>Patient Override</Text></Text>
            <Text style={[Styles.h6]}>This device is already linked to a patient, please confirm to continue.</Text>
            <View style={{height: 10}}></View>
            <View style={[Styles.container, { width: 250, height: 250, backgroundColor: Styles.colors.GEPurple }]}>
                <Text style={{ color: "white", textAlign: "center", padding: 50 }}>(patient picture)</Text>
            </View>
            <View style={{height: 10}}></View>
            <Text style={[Styles.h5]}>
                {patientProfile.lastName}, {patientProfile.firstName}
            </Text>
            <Text style={[Styles.h5]}>{patientProfile.dob}</Text>
            <Text style={[Styles.h6]}>MRN: {patientProfile.mrn}</Text>
            <Text style={[Styles.h6]}>Visit number: {patientProfile.visitNumber}</Text>
            <View style={{height: 10}}></View>
            {/*Navigation buttons for override screen. -dt*/}
             {/*Didn't create more override screens because
             I'm unsure if we want to set the text on other screens with a variable changing with ?
             or if we want separate screens. Separate screens might lead to lots of overlap/content. -dt*/}
            <Button title="Override" onPress={() => navigation.push("Enter Patient Info", { isOverride } )} />
            <Button title="Choose Another Device" onPress={() => navigation.push("Device Select")} />
            <View style={{height: 10}}></View>
        </View>
    );
}

export default PatientConfirmOverrideScreen;
