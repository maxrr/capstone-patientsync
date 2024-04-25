import { Button, Text, View } from "react-native";
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
        firstName: patientInfo.first,
        lastName: patientInfo.last,
        mrn: patientInfo.mrn,
        visitNumber: patientInfo.visit,
        dob: patientInfo.month + "/" + patientInfo.day + "/" + patientInfo.year
    };
    const { reused } = route.params;

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
