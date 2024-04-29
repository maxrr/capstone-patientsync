import { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";

import Styles from "../../styles/main";
import UniformPageWrapper from "../comps/UniformPageWrapper";
import ConfirmCancelCombo from "../comps/ConfirmCancelCombo";

import BluetoothManagerContext from "../BluetoothManagerContext";
import DeviceInfoPane from "../comps/DeviceInfoPane";
import CurrentFlowSettingsContext, { CONTEXT_CURRENTFLOWSETTINGS_UNLINKING } from "../CurrentFlowSettingsContext";
import LayoutSkeleton from "../comps/LayoutSkeleton";

import PatientContext from "../PatientContext";

const placeholderDevices = [
    {
        name: "Ventilator (Placeholder)",
        manufacturer: "The Ventilator Company",
        id: "00847946024130"
    },
    {
        name: "Infusion Pump (Placeholder)",
        manufacturer: "MTP",
        id: "18500042541107"
    },
    {
        name: "Pulse Oximeter (Placeholder)",
        manufacturer: "VIVE",
        id: "00810041981769"
    }
];

function ConnectedDevicesScreen({ navigation }) {
    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    const [getPatientProfiles, setPatientProfiles] = useContext(PatientContext);
    const { existingPatient } = getPatientProfiles();
    // const [devicePatientProfile, setDevicePatientProfile] = useState(null);
    const { areOverridingPatient, flowType } = getCurrentFlowSettings();
    const { bluetoothConnectedDevice } = useContext(BluetoothManagerContext);

    // NOTE: This was used to fetch patient info, but this is now done during device connection
    // useEffect(() => {
    //     if (bluetoothConnectedDevice.cur_patient_mrn != "-1") {
    //         fetchPatient(bluetoothConnectedDevice.cur_patient_mrn)
    //             .then((a) => {
    //                 setDevicePatientProfile(a);
    //             })
    //             .catch((err) => {
    //                 console.error(err);
    //                 Alert.alert(
    //                     "Something went wrong.",
    //                     "Retrieving the patient connected to this device returned an error. Please try again."
    //                 );
    //                 navigation.pop();
    //             });
    //     }
    // }, []);

    return (
        <UniformPageWrapper>
            <LayoutSkeleton
                title={"Connected Devices"}
                subtitle={"Please review the medical devices connected to the ConnectPlus device below"}
                stepper={1}
            >
                <DeviceInfoPane
                    style={{ marginTop: Styles.consts.gapIncrement }}
                    device={bluetoothConnectedDevice}
                    showOverrides={flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING}
                    detailed={true}
                    loading={areOverridingPatient && existingPatient == null}
                    profile={existingPatient}
                />
                <View
                    style={{
                        gap: Styles.consts.gapIncrement,
                        display: "flex",
                        flexDirection: "column",
                        width: "100%"
                    }}
                >
                    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#999" }} />
                    {placeholderDevices.map((e, index) => (
                        <Text
                            key={index}
                            style={[
                                Styles.medDeviceSelectButton,
                                { backgroundColor: Styles.colors.GEPurple, flexWrap: "wrap", flexDirection: "row" }
                            ]}
                        >
                            <Text style={[Styles.deviceSelectButtonText]}>
                                <Text style={{ fontWeight: "bold", fontSize: 16 }}>{e.name}</Text>
                                {"\n"}
                            </Text>
                            <Text style={[Styles.deviceSelectButtonText]}>
                                {e.manufacturer}
                                {"\n"}
                            </Text>
                            <Text style={[Styles.deviceSelectButtonText]}>{e.id}</Text>
                        </Text>
                    ))}
                </View>
                <ConfirmCancelCombo
                    onConfirm={() => {
                        if (areOverridingPatient) {
                            navigation.push("Confirm Override Patient");
                        } else {
                            navigation.push("Enter Patient Info");
                        }
                    }}
                    onCancel={() => {
                        navigation.pop();
                    }}
                />
            </LayoutSkeleton>
        </UniformPageWrapper>
    );
}

export default ConnectedDevicesScreen;
