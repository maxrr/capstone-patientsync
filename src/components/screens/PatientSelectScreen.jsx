import { useContext, useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";

import PatientContext from "../PatientContext";
import CurrentFlowSettingsContext from "../CurrentFlowSettingsContext";

import Styles from "../../styles/main";
import LayoutSkeleton from "../comps/LayoutSkeleton";
import UniformPageWrapper from "../comps/UniformPageWrapper";
import PatientInfoPane from "../comps/PatientInfoPane";

function PatientSelectScreen({ navigation }) {
    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    const { areOverridingPatient } = getCurrentFlowSettings();

    // Context for patient info
    const [getPatientProfiles, setPatientProfiles] = useContext(PatientContext);
    const [{ newPatient }, setPatientProfilesState] = useState(getPatientProfiles());
    // let { newPatient } = getPatientProfiles();

    // useEffect(() => {
    //     const { newPatient: tempNewPatient } = getPatientProfiles();
    //     newPatient = tempNewPatient;
    // });

    useEffect(() => {
        return navigation.addListener("focus", () => {
            const { newPatient: tempNewPatient } = getPatientProfiles();
            // newPatient = tempNewPatient;
            setPatientProfilesState(getPatientProfiles());
            console.log("[PatientSelectScreen] focus firing", newPatient);
        });
    }, [navigation]);

    return (
        <UniformPageWrapper centerContent={true}>
            <LayoutSkeleton
                title={areOverridingPatient ? "Patient Override" : "Patient Select"}
                subtitle={"Choose method to input patient info"}
                stepper={2}
            >
                {/*Updating buttons for Patient Select screen -DT */}
                {/**Using Pressable instead of button because then we can customize it w/ stylesheet -DT */}
                <Pressable style={Styles.button} onPress={() => navigation.push("Scan Barcode", { manual: false })}>
                    <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple }]}>
                        Scan patient barcode
                    </Text>
                </Pressable>

                <Text style={[Styles.h5, { textAlign: "center", marginTop: 4 }]}>or</Text>

                <Pressable style={Styles.button} onPress={() => navigation.push("Scan Barcode", { manual: true })}>
                    <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple }]}>
                        Manually enter patient info
                    </Text>
                </Pressable>

                {newPatient != null ? (
                    <>
                        <Text style={[Styles.h5, { marginVertical: 8 }]}>or reuse info for</Text>
                        {/* <Pressable
                            style={Styles.button}
                            onPress={() => navigation.push("Confirm Patient", { reused: true })}
                        >
                            <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple }]}>
                                Select {newPatient.first} {newPatient.last}
                            </Text>
                        </Pressable> */}
                        <PatientInfoPane
                            profile={newPatient}
                            style={{ width: 335 }}
                            onPress={() => navigation.push("Confirm Patient", { reused: true })}
                        />
                        <Text style={{ color: Styles.colors.TextColor, textAlign: "center", width: "90%" }}>
                            You are being shown the above option because you just input {newPatient.first} {newPatient.last}
                            's information.
                        </Text>
                    </>
                ) : (
                    <></>
                )}
                {/* </View> */}
            </LayoutSkeleton>
        </UniformPageWrapper>
    );
}

export default PatientSelectScreen;
