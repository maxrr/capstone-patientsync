import { Button, Text, View } from "react-native";
import Styles from "../../styles/main";

const patientProfile = {
    firstName: "John",
    lastName: "Doe",
    mrn: "1246988",
    visitNumber: "1298",
    dob: "01/23/1994"
};

function PatientConfirmScreen({ navigation }) {
    return (
        // Maybe we could pre-populate the manual information page with the results from the scan on this page? ~mr
        <View style={[Styles.container]}>
            <Text style={[Styles.h4]}><Text style={{color: "white", fontWeight: "bold"}}>Patient Select</Text></Text>
            <Text style={[Styles.h6]}>Is this the right patient?</Text>
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
            <Button title="Yes" onPress={() => navigation.push("Confirm Link")} />
            <Button title="No, scan again" onPress={() => navigation.pop()} />
            <View style={{height: 10}}></View>
        </View>
    );
}

export default PatientConfirmScreen;
