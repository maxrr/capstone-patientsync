import { Button, Text, View, Alert } from "react-native";
import Styles from "../../styles/main";
import { useRoute } from "@react-navigation/native";
import PatientContext from "../PatientContext";
import { useContext, useEffect, useState } from "react";
import CurrentFlowSettingsContext from "../CurrentFlowSettingsContext";
import UniformPageWrapper from "../comps/UniformPageWrapper";
import ConfirmCancelCombo from "../comps/ConfirmCancelCombo";
import LayoutSkeleton from "../comps/LayoutSkeleton";
import PatientInfoPane from "../comps/PatientInfoPane";
import BluetoothManagerContext from "../BluetoothManagerContext";

// fetch the info of the patient from the MRN associated with the C+ device
async function fetchPatient(mrn) {
    try {
        // fetch to database for provided MRN
        const resp = await fetch(`http://vpn.rountree.me:6969/getPatientInfo?mrn=${mrn}`);
        const fetchedInfo = await resp.json();
        // if there is a msg field, the patient could not be found
        if (fetchedInfo.msg) {
            Alert.alert(
                "Patient not found",
                `There exists no patient with the MRN (${mrn}) already associated with this device.`,
                [{ text: "OK" }]
            );
        } else {
            if (
                fetchedInfo &&
                fetchedInfo.visit &&
                fetchedInfo.first &&
                fetchedInfo.last &&
                fetchedInfo.month &&
                fetchedInfo.day &&
                fetchedInfo.year
            ) {
                return {
                    mrn: mrn,
                    visit: fetchedInfo.visit.trim(),
                    first: fetchedInfo.first.trim(),
                    last: fetchedInfo.last.trim(),
                    dob: `${fetchedInfo.month}/${fetchedInfo.day}/${fetchedInfo.year}`
                    // year: fetchedInfo.year,
                    // month: fetchedInfo.month,
                    // day: fetchedInfo.day,
                    // gender: fetchedInfo.gender
                };
            } else {
                throw new Error("Did not receive all expected patient profile fields!");
            }
        }
    } catch (error) {
        console.log(error);
        Alert.alert("Error", "Something went wrong", [{ text: "OK" }], { cancelable: false });
    }
}

// TODO: add call to fetchPatient using MRN from bluetooth device in order to fetch the patient's info
// and update patientProfile so that it displays properly

// Very similar to PatientConfirmScreen, but doing this with the override section instead.
// I figured having separate screens would be easier for the override side of the app if we wanted to change things around -dt
function PatientConfirmOverrideScreen({ navigation }) {
    const route = useRoute();
    const { isOverride } = route.params || { isOverride: false };

    const [localPatientProfile, setLocalPatientProfile] = useState({
        first: "Not found",
        last: "Not found",
        mrn: "Not found",
        visit: "Not found",
        dob: "Not found"
    });

    const [info, setInfo] = useContext(PatientContext);
    // setInfo(patientProfile);

    const { bluetoothConnectedDevice } = useContext(BluetoothManagerContext);

    const [loadingPatientInfo, setLoadingPatientInfo] = useState(true);

    useEffect(() => {
        fetchPatient(bluetoothConnectedDevice.cur_patient_mrn).then((pp) => {
            setLocalPatientProfile(pp);
            setLoadingPatientInfo(false);
            setInfo(pp);
        });
    }, []);

    // *** SHOWOVERRIDES IS THE UNLINK CASE ***
    // *** SHOWOVERRIDES IS THE UNLINK CASE ***
    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    const { showOverrides } = getCurrentFlowSettings();

    return (
        <UniformPageWrapper>
            <LayoutSkeleton
                title={showOverrides ? "Patient Unlink" : "Patient Override"}
                subtitle={
                    showOverrides
                        ? "Confirm that this is the correct patient to unlink from the device"
                        : "This device is already linked to a patient, please confirm to continue"
                }
                stepper={showOverrides ? 2 : 1}
            >
                <PatientInfoPane profile={localPatientProfile} loading={loadingPatientInfo} />
                <ConfirmCancelCombo
                    cancelText="Cancel"
                    confirmText={!showOverrides ? "Confirm override" : "Unlink this patient"}
                    onCancel={() => {
                        navigation.pop();
                    }}
                    onConfirm={() => {
                        navigation.push(showOverrides ? "Confirm Link" : "Enter Patient Info");
                    }}
                />
            </LayoutSkeleton>
        </UniformPageWrapper>
    );
}

export default PatientConfirmOverrideScreen;
