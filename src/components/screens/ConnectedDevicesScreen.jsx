import { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";

import Styles from "../../styles/main";
import UniformPageWrapper from "../comps/UniformPageWrapper";
import ConfirmCancelCombo from "../comps/ConfirmCancelCombo";

import BluetoothManagerContext from "../BluetoothManagerContext";
import DeviceInfoPane from "../comps/DeviceInfoPane";
import CurrentFlowSettingsContext from "../CurrentFlowSettingsContext";
import LayoutSkeleton from "../comps/LayoutSkeleton";

import { fetchPatient } from "../bluetooth/FetchPatient";

const devices = [
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
    const [devicePatientProfile, setDevicePatientProfile] = useState(null);

    const { showOverrides } = getCurrentFlowSettings();

    const { bluetoothConnectedDevice } = useContext(BluetoothManagerContext);

    const isOverride = bluetoothConnectedDevice?.isOverride;

    useEffect(() => {
        if (bluetoothConnectedDevice.cur_patient_mrn != "-1") {
            fetchPatient(bluetoothConnectedDevice.cur_patient_mrn)
                .then((a) => {
                    setDevicePatientProfile(a);
                })
                .catch((err) => {
                    console.error(err);
                    Alert.alert(
                        "Something went wrong.",
                        "Retrieving the patient connected to this device returned an error. Please try again."
                    );
                    navigation.pop();
                });
        }
    }, []);

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
                    showOverrides={showOverrides}
                    detailed={true}
                    loading={bluetoothConnectedDevice.cur_patient_mrn != "-1" && devicePatientProfile == null}
                    profile={devicePatientProfile}
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
                    {devices.map((e, index) => (
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
                        if (isOverride || showOverrides) {
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
