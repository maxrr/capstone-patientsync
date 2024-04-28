import { useContext } from "react";
import { Text, View, Pressable } from "react-native";

import PatientContext from "../PatientContext";
import CurrentFlowSettingsContext from "../CurrentFlowSettingsContext";

import Styles from "../../styles/main";
import Stepper from "../comps/Stepper";
import LayoutSkeleton from "../comps/LayoutSkeleton";
import UniformPageWrapper from "../comps/UniformPageWrapper";

function PatientSelectScreen({ route, navigation }) {
    // const showOverrides = route.params ? route.params.showOverrides : false;
    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    const { showOverrides } = getCurrentFlowSettings();

    // Context for patient info
    const [info, setInfo] = useContext(PatientContext);

    return (
        <UniformPageWrapper centerContent={true}>
            <LayoutSkeleton
                title={showOverrides ? "Patient Override" : "Patient Select"}
                subtitle={"Choose method to input patient info"}
                stepper={2}
            >
                {/*Updating buttons for Patient Select screen -DT */}
                {/**Using Pressable instead of button because then we can customize it w/ stylesheet -DT */}
                <Pressable style={Styles.button} onPress={() => navigation.push("Scan Barcode", { manual: false })}>
                    <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple }]}>
                        Scan Patient Barcode
                    </Text>
                </Pressable>

                <Text style={[Styles.h5]}>or</Text>

                <Pressable style={Styles.button} onPress={() => navigation.push("Scan Barcode", { manual: true })}>
                    <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple }]}>
                        Manually Enter Patient Info
                    </Text>
                </Pressable>

                {info != null ? (
                    <View style={{ alignItems: "center" }}>
                        <Text style={[Styles.h5]}>or</Text>
                        <Pressable
                            style={Styles.smallButton}
                            onPress={() => navigation.push("Confirm Patient", { reused: true })}
                        >
                            <Text style={[Styles.smallButton, Styles.buttonText, { backgroundColor: "blue" }]}>
                                Use Information For {"\n"}
                                {info.first} {info.last}
                            </Text>
                        </Pressable>
                    </View>
                ) : (
                    <></>
                )}
            </LayoutSkeleton>
        </UniformPageWrapper>
    );
}

export default PatientSelectScreen;
