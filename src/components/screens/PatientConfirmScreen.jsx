import { Button, Text, View, Alert } from "react-native";
import Styles from "../../styles/main";
import PatientContext from "../PatientContext";
import { useContext } from "react";
import Stepper from "../comps/Stepper";
import UniformPageWrapper from "../comps/UniformPageWrapper";
import CurrentFlowSettingsContext from "../CurrentFlowSettingsContext";
import ConfirmCancelCombo from "../comps/ConfirmCancelCombo";
import PatientInfoPane from "../comps/PatientInfoPane";
import LayoutSkeleton from "../comps/LayoutSkeleton";

function PatientConfirmScreen({ route, navigation }) {
    const [patientInfo, setPatientInfo] = useContext(PatientContext);
    // const { showOverrides } = route.params;
    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    const { showOverrides } = getCurrentFlowSettings();
    const patientProfile = {
        first: info.first,
        last: info.last,
        mrn: info.mrn,
        visit: info.visit,
        dob: info.month + "/" + info.day + "/" + info.year
    };
    const devicePatient = {
        first: "",
        last: "",
        mrn: "",
        visit: "",
        dob: ""
    };
    const { reused } = route.params;

    function returnHome() {
        navigation.popToTop();
        setInfo(null);
        setDeviceInfo(null);
    }

    // check if patient being overriden and patient being linked have exact same information
    let match = false;
    if (isOverride) {
        // TODO: input MRN from connected C+ device
        fetchPatient("placeholder");
        match = true;
        for (const [key, value] of Object.entries(patientProfile)) {
            if (devicePatient[key] != value) {
                match = false;
            }
        }
    }

    if (match) {
        Alert.alert("Patient already linked", "the patient whose info you have input is already linked to this device", [
            { text: "OK" },
            { text: "Return to home screen", onPress: () => returnHome() }
        ]);
    }

    // fetch the info of the patient from the MRN associated with the C+ device
    async function fetchPatient(mrn) {
        // fetch to database for provided MRN
        const resp = await fetch(`http://vpn.rountree.me:6969/getPatientInfo?mrn=${mrn}`);
        const fetchedInfo = await resp.json();
        devicePatient = {
            first: fetchedInfo.first.trim(),
            last: fetchedInfo.last.trim(),
            mrn: mrn,
            visit: fetchedInfo.visit.trim(),
            dob: fetchedInfo.month + "/" + fetchedInfo.day + "/" + fetchedInfo.year
        };
    }

    return (
        // Maybe we could pre-populate the manual information page with the results from the scan on this page? ~mr
        <UniformPageWrapper>
            <LayoutSkeleton title={"Patient Select"} subtitle={"Is this the right patient?"} stepper={2}>
                {/* <Stepper step={2} />
                <Text style={[Styles.h4]}>
                    <Text style={{ color: "white", fontWeight: "bold" }}></Text>
                </Text>
                <Text style={[Styles.h6]}></Text> */}
                {/* <View style={[Styles.container, { width: 250, height: 250, backgroundColor: Styles.colors.GEPurple }]}>
                <Text style={{ color: "white", textAlign: "center", padding: 50 }}>(patient picture)</Text>
            </View> */}
                {/* <Text style={[Styles.h4]}>
                {patientProfile.lastName}, {patientProfile.firstName}
            </Text>
            <Text style={[Styles.h5]}>{patientProfile.dob}</Text>
            <Text style={[Styles.h6]} selectable={true}>
                MRN: {patientProfile.mrn}
            </Text>
            <Text style={[Styles.h6]} selectable={true}>
                Visit number: {patientProfile.visitNumber}
            </Text>
            <View style={{ height: 10 }}></View>
            <Button title="Yes" onPress={() => navigation.push("Confirm Link")} />
            <Button
                title="No, re-enter patient info"
                onPress={() => {
                    if (!reused) navigation.pop(2);
                    else navigation.pop(1);
                }}
            /> */}
                <PatientInfoPane profile={patientProfile} />
                <ConfirmCancelCombo
                    confirmText="Yes"
                    cancelText="No"
                    onConfirm={() => {
                        navigation.push("Confirm Link");
                    }}
                    onCancel={() => {
                        if (!reused) navigation.pop(2);
                        else navigation.pop(1);
                    }}
                />
                {/* <View style={{ height: 10 }}></View> */}
            </LayoutSkeleton>
        </UniformPageWrapper>
    );
}

export default PatientConfirmScreen;
