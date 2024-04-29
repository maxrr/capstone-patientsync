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
import BluetoothManagerContext from "../BluetoothManagerContext";
import { fetchPatient } from "../utils/FetchPatient";

function PatientConfirmScreen({ route, navigation }) {
    // const { bluetoothConnectedDevice } = useContext(BluetoothManagerContext);
    const [getPatientProfiles, setPatientProfiles] = useContext(PatientContext);
    const { newPatient } = getPatientProfiles();
    // const { showOverrides } = route.params;
    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    const { flowType, areOverridingPatient } = getCurrentFlowSettings();
    const { reused } = route.params;

    // check if patient being overriden and patient being linked have exact same information
    // let match = false;
    // if (showOverrides) {
    //     // TODO: input MRN from connected C+ device
    //     fetchPatient(bluetoothConnectedDevice.cur_patient_mrn).then((ret) => {
    //         match = true;
    //         for (const [key, value] of Object.entries(ret)) {
    //             if (patientInfo[key] != value) {
    //                 match = false;
    //             }
    //         }
    //         if (match) {
    //             Alert.alert(
    //                 "Patient already linked",
    //                 "The patient whose info you have input is already linked to this device.",
    //                 [{ text: "OK" }, { text: "Return to home screen", onPress: () => returnHome() }]
    //             );
    //         } else {
    //             // devicePatient = patientProfile;
    //             setPatientInfo({
    //                 ...ret,
    //                 dob: ret.month + "/" + ret.day + "/" + ret.year
    //             });
    //         }
    //     });
    // }

    // NOTE: Functionality moved to src/components/bluetooth/FetchPatient.js ~mr
    // fetch the info of the patient from the MRN associated with the C+ device
    // async function fetchPatient(mrn) {
    //     // fetch to database for provided MRN
    //     const resp = await fetch(`http://vpn.rountree.me:6969/getPatientInfo?mrn=${mrn}`);
    //     const fetchedInfo = await resp.json();
    //     devicePatient = {
    //         first: fetchedInfo.first.trim(),
    //         last: fetchedInfo.last.trim(),
    //         mrn: mrn,
    //         visit: fetchedInfo.visit.trim(),
    //         dob: fetchedInfo.month + "/" + fetchedInfo.day + "/" + fetchedInfo.year
    //     };
    // }

    return (
        // Maybe we could pre-populate the manual information page with the results from the scan on this page? ~mr
        <UniformPageWrapper>
            <LayoutSkeleton title={"Patient Select"} subtitle={"Is this the right patient?"} stepper={2}>
                {/* <PatientInfoPane profile={patientProfile} /> */}
                <PatientInfoPane profile={newPatient} />
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
            </LayoutSkeleton>
        </UniformPageWrapper>
    );
}

export default PatientConfirmScreen;
