import { Button, Text, View } from "react-native";
import Styles from "../../styles/main";
import PatientContext from "../PatientContext";
import { useContext } from "react";
import Stepper from "../comps/Stepper";

function PatientConfirmScreen({ route, navigation }) {
    const [info, setInfo] = useContext(PatientContext);
    const patientProfile = {
        firstName: info.first,
        lastName: info.last,
        mrn: info.mrn,
        visitNumber: info.visit,
        dob: info.month + "/" + info.day + "/" + info.year
    };


    const { reused } = route.params;
    const { isOverride } = route.params;

    return (
        // Maybe we could pre-populate the manual information page with the results from the scan on this page? ~mr
        <View style={[Styles.container]}>
            <Stepper step={2}/>
            <Text style={[Styles.h4]}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Patient Select</Text>
            </Text>
            <Text style={[Styles.h6]}>Is this the right patient?</Text>
            <View style={{ height: 10 }}></View>
            {/* <View style={[Styles.container, { width: 250, height: 250, backgroundColor: Styles.colors.GEPurple }]}>
                <Text style={{ color: "white", textAlign: "center", padding: 50 }}>(patient picture)</Text>
            </View> */}
            <View style={{ height: 10 }}></View>

            <Text style={[Styles.h4]}>
                {patientProfile.lastName}, {patientProfile.firstName}
            </Text>
            <Text style={[Styles.h5]}>{patientProfile.dob}</Text>
            <Text style={[Styles.h6]}>MRN: {patientProfile.mrn}</Text>
            <Text style={[Styles.h6]}>Visit number: {patientProfile.visitNumber}</Text>
            <View style={{ height: 10 }}></View>
            <Button title="Yes" onPress={() => navigation.push("Confirm Link", {isOverride})} />
            <Button title="No, re-enter patient info" onPress={() => {
                if(!reused)navigation.pop(2)
                else navigation.pop(1)
                }} />
            <View style={{ height: 10 }}></View>
        </View>
    );
}

export default PatientConfirmScreen;
