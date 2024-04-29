import { Button, Text, View, Alert } from "react-native";
import Styles from "../../styles/main";
import { useRoute } from "@react-navigation/native";
import PatientContext from "../PatientContext";
import { useContext, useEffect, useState } from "react";
import CurrentFlowSettingsContext, { CONTEXT_CURRENTFLOWSETTINGS_LINKING } from "../CurrentFlowSettingsContext";
import UniformPageWrapper from "../comps/UniformPageWrapper";
import ConfirmCancelCombo from "../comps/ConfirmCancelCombo";
import LayoutSkeleton from "../comps/LayoutSkeleton";
import PatientInfoPane from "../comps/PatientInfoPane";
import BluetoothManagerContext from "../BluetoothManagerContext";
import { fetchPatient } from "../utils/FetchPatient";

// fetch the info of the patient from the MRN associated with the C+ device
// async function fetchPatient(mrn) {
//     try {
//         // fetch to database for provided MRN
//         const resp = await fetch(`http://vpn.rountree.me:6969/getPatientInfo?mrn=${mrn}`);
//         const fetchedInfo = await resp.json();
//         // if there is a msg field, the patient could not be found
//         if (fetchedInfo.msg) {
//             Alert.alert(
//                 "Patient not found",
//                 `There exists no patient with the MRN (${mrn}) already associated with this device.`,
//                 [{ text: "OK" }]
//             );
//         } else {
//             if (
//                 fetchedInfo &&
//                 fetchedInfo.visit &&
//                 fetchedInfo.first &&
//                 fetchedInfo.last &&
//                 fetchedInfo.month &&
//                 fetchedInfo.day &&
//                 fetchedInfo.year
//             ) {
//                 return {
//                     mrn: mrn,
//                     visit: fetchedInfo.visit.trim(),
//                     first: fetchedInfo.first.trim(),
//                     last: fetchedInfo.last.trim(),
//                     dob: `${fetchedInfo.month}/${fetchedInfo.day}/${fetchedInfo.year}`
//                     // year: fetchedInfo.year,
//                     // month: fetchedInfo.month,
//                     // day: fetchedInfo.day,
//                     // gender: fetchedInfo.gender
//                 };
//             } else {
//                 throw new Error("Did not receive all expected patient profile fields!");
//             }
//         }
//     } catch (error) {
//         console.log(error);
//         Alert.alert("Error", "Something went wrong", [{ text: "OK" }], { cancelable: false });
//     }
// }

// TODO: add call to fetchPatient using MRN from bluetooth device in order to fetch the patient's info
// and update patientProfile so that it displays properly

// Very similar to PatientConfirmScreen, but doing this with the override section instead.
// I figured having separate screens would be easier for the override side of the app if we wanted to change things around -dt
function PatientConfirmOverrideScreen({ navigation }) {
    // const route = useRoute();
    // const { isOverride } = route.params || { isOverride: false };

    // const [localPatientProfile, setLocalPatientProfile] = useState({
    //     first: "Not found",
    //     last: "Not found",
    //     mrn: "Not found",
    //     visit: "Not found",
    //     dob: "Not found"
    // });

    // const [info, setInfo] = useContext(PatientContext);
    const [getPatientProfiles, setPatientProfiles] = useContext(PatientContext);
    const { existingPatient } = getPatientProfiles();
    // setInfo(patientProfile);

    // const { bluetoothConnectedDevice } = useContext(BluetoothManagerContext);

    // const [loadingPatientInfo, setLoadingPatientInfo] = useState(true);
    // const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);

    // useEffect(() => {
    //     fetchPatient(bluetoothConnectedDevice.cur_patient_mrn, true).then((pp) => {
    //         setLocalPatientProfile(pp);
    //         setLoadingPatientInfo(false);
    //         setInfo(pp);
    //     }).catch(err => {
    //         if (err instanceof SyntaxError) {
    //             Alert.alert("")
    //         } else {

    //         }
    //     });
    // }, []);

    // *** SHOWOVERRIDES IS THE UNLINK CASE ***
    // *** SHOWOVERRIDES IS THE UNLINK CASE ***
    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    const { flowType, areOverridingPatient } = getCurrentFlowSettings();

    return (
        <UniformPageWrapper>
            <LayoutSkeleton
                title={areOverridingPatient ? "Patient Override" : "Patient Unlink"}
                subtitle={
                    areOverridingPatient
                        ? "This device is already linked to the patient listed below, please confirm to continue"
                        : "Confirm that this is the correct patient to unlink from the device"
                }
                stepper={areOverridingPatient ? 2 : 1}
            >
                <PatientInfoPane profile={existingPatient} />
                <ConfirmCancelCombo
                    cancelText="Cancel"
                    confirmText={
                        flowType == CONTEXT_CURRENTFLOWSETTINGS_LINKING ? "Confirm override" : "Unlink this patient"
                    }
                    confirmStyle={
                        flowType == CONTEXT_CURRENTFLOWSETTINGS_LINKING && areOverridingPatient
                            ? { backgroundColor: "#e05600" }
                            : {}
                    }
                    confirmIcon={
                        flowType == CONTEXT_CURRENTFLOWSETTINGS_LINKING && areOverridingPatient ? "exchange" : "check"
                    }
                    onCancel={() => {
                        navigation.pop();
                    }}
                    onConfirm={() => {
                        navigation.push(
                            flowType == CONTEXT_CURRENTFLOWSETTINGS_LINKING ? "Enter Patient Info" : "Confirm Link"
                        );
                    }}
                />
            </LayoutSkeleton>
        </UniformPageWrapper>
    );
}

export default PatientConfirmOverrideScreen;
