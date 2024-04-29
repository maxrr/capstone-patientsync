import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect, useContext } from "react";
import Styles from "../../styles/main";
import { CameraView, useCameraPermissions } from "expo-camera/next";
import PatientContext from "../PatientContext";
import UniformPageWrapper from "../comps/UniformPageWrapper";
import ConfirmCancelCombo from "../comps/ConfirmCancelCombo";
import LayoutSkeleton from "../comps/LayoutSkeleton";
import LabeledIconButton from "../comps/LabeledIconButton";

import { parseBarcodeData } from "../utils/ParseBarcode";
import { fetchPatient } from "../utils/FetchPatient";

function CameraScanScreen({ route, navigation }) {
    // variables for manual input
    // const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    // const { showOverrides } = getCurrentFlowSettings();
    const { manual } = route.params;
    const [text, setText] = useState("");

    // variables for camera state and permission
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraState, setCameraState] = useState(!manual);

    // Context for patient info
    // const [info, setInfo] = useContext(PatientContext);
    const [_, setPatientProfiles] = useContext(PatientContext);

    // text to assess barcode viability
    const [scanningText, setScanningText] = useState("");

    // request permission if not already granted and camera is on
    useEffect(() => {
        if (cameraState && !permission) {
            requestPermission();
        }
    }, [cameraState]);

    // TODO: Add checks in handleScan and confirmInput to see if they match device's current patient

    // Handle barcode scan
    function handleScan(result) {
        // Parse barcode and store the resultign profile in context
        parseBarcodeData(result)
            .then((profile) => {
                setPatientProfiles({
                    newPatient: profile
                });
                navigation.navigate("Confirm Patient", { reused: false });
            })
            .catch((error) => {
                console.error(`[handleScan] Retrieving profile returned the following error:`, error);
                Alert.alert(
                    "Error retrieving profile.",
                    `There was an error looking up the user with the MRN ${result}: ${error}`
                );
            });
    }

    // Validate manual input
    async function confirmInput() {
        if (text && text.length == 9) {
            try {
                const profile = await fetchPatient(text);
                setPatientProfiles({
                    newPatient: profile
                });
                navigation.navigate("Confirm Patient", { reused: false });
            } catch (error) {
                if (error instanceof SyntaxError) {
                    console.log(`[confirmInput] Patient lookup returned no data.`);
                    Alert.alert(
                        "MRN lookup error",
                        "There was an error looking up this MRN. Please double-check and try again."
                    );
                } else {
                    console.error(`[confirmInput] Fetching patient returned an unexpected error: `, error);
                }
            }
        } else {
            Alert.alert("Invalid MRN", "MRN must be exactly 9 digits.");
        }
    }

    // if camera is on and permission is granted, scan for barcode
    if (cameraState && permission) {
        return (
            <View style={Styles.cameraContainer}>
                <CameraView
                    style={Styles.camera}
                    facing={"back"}
                    barcodeScannerSettings={{ barcodeTypes: ["pdf417", "code39", "code128"] }}
                    onBarcodeScanned={(scanningResult) => {
                        // console.log(scanningResult.data.length)

                        // if barcode is expected length, parse the information
                        if (scanningResult.data.length === 53) {
                            setScanningText("");
                            handleScan(scanningResult.data);
                        } else if (scanningResult.data.length < 53) {
                            setScanningText("Barcode is too short!");
                        } else {
                            setScanningText("Barcode is too long!");
                        }
                    }}
                >
                    <View>
                        <Text style={Styles.warning}>{scanningText}</Text>
                    </View>

                    <View style={Styles.cameraButtonContainer}>
                        <TouchableOpacity
                            style={Styles.cameraButton}
                            onPress={() => {
                                setCameraState(false);
                            }}
                        >
                            <LabeledIconButton
                                text={"Manually input instead"}
                                icon={"pencil"}
                                iconOnRight={false}
                                onPress={() => {
                                    setCameraState(false);
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </View>
        );
    } else {
        return (
            <UniformPageWrapper centerContent={true}>
                <LayoutSkeleton stepper={2} title="Enter MRN" subtitle="Enter the MRN of the target patient">
                    <View style={{ width: "85%" }}>
                        <View
                            style={[
                                {
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%"
                                }
                            ]}
                        >
                            <TextInput
                                style={[Styles.MRNinput]}
                                // onChange={setText}
                                onChangeText={setText}
                                value={text}
                                keyboardType="number-pad"
                                maxLength={9}
                                clearButtonMode="always" // ios only :(
                            />
                            <Text style={{ color: "red", fontSize: 16, fontWeight: "bold" }}>
                                {text.length > 0 && text.length != 9 ? "MRN must be 9 digits long!" : ""}
                            </Text>
                        </View>
                        <ConfirmCancelCombo
                            cancelText="Scan instead"
                            cancelIcon="camera"
                            onConfirm={confirmInput}
                            onCancel={() => setCameraState(true)}
                            confirmDisabled={text.length < 9}
                            cancelStyle={{ backgroundColor: Styles.colors.GEPurple }}
                        />
                        {/* TODO: Add 'Scan instead' button below, add back button */}
                        {/* <LabeledIconButton
                            text="Scan instead"
                            icon="camera"
                            onPress={() => setCameraState(true)}
                            styles={[Styles.btnCancel, { width: "auto" }]}
                        /> */}
                    </View>
                </LayoutSkeleton>
            </UniformPageWrapper>
        );
    }
}

export default CameraScanScreen;
