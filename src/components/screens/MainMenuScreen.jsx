import { useContext, useEffect } from "react";
import { Text, View, Pressable, SafeAreaView } from "react-native";
import Styles from "../../styles/main";

import SafeAreaViewAndroid from "../comps/SafeAreaViewAndroid";
import CurrentFlowSettingsContext, {
    CONTEXT_CURRENTFLOWSETTINGS_LINKING,
    CONTEXT_CURRENTFLOWSETTINGS_UNLINKING
} from "../CurrentFlowSettingsContext";
import PatientContext from "../PatientContext";

function MainMenuScreen({ navigation }) {
    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    const [_, setPatientProfiles] = useContext(PatientContext);

    // Uncomment to show settings button in top right
    // useEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => <SettingsButtonHome navigation={navigation} />
    //     });
    // });

    useEffect(() => {
        setPatientProfiles(null);
    }, []);

    return (
        <SafeAreaView style={SafeAreaViewAndroid.AndroidSafeArea}>
            <View style={[Styles.container, { justifyContent: "space-between" }]}>
                <Text></Text>
                <View style={[Styles.container, { height: "auto", marginBottom: 120 }]}>
                    <Text style={[Styles.hero, { color: "white", fontWeight: "bold" }]}>Welcome</Text>
                    <Text style={[Styles.h6]}>To begin, select an action</Text>

                    {/**Using Pressable instead of button because then we can customize it w/ stylesheet -DT */}
                    <Pressable
                        style={Styles.button}
                        onPress={() => {
                            setCurrentFlowSettings((a) => {
                                a.flowType = CONTEXT_CURRENTFLOWSETTINGS_LINKING;
                                return a;
                            });
                            navigation.navigate("Device Select");
                        }}
                    >
                        <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple }]}>
                            Link patient
                        </Text>
                    </Pressable>

                    <Text style={[Styles.h5]}>or</Text>

                    {/* <Button style={[Styles.button]} title="Link patient with a ConnectPlus device" onPress={() => navigation.push("Device Select")} /> */}

                    <Pressable
                        style={Styles.button}
                        onPress={() => {
                            // Set flow type to unlinking
                            setCurrentFlowSettings((a) => {
                                a.flowType = CONTEXT_CURRENTFLOWSETTINGS_UNLINKING;
                                return a;
                            });
                            navigation.navigate("Device Select");
                        }}
                    >
                        <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple }]}>
                            Unlink a patient
                        </Text>
                    </Pressable>
                </View>
                <View
                    style={{
                        padding: 8,
                        backgroundColor: Styles.colors.Background,
                        borderRadius: 8,
                        shadowColor: "black",
                        shadowOpacity: 0,
                        shadowOffset: { height: 2, width: 0 },
                        shadowRadius: 16
                    }}
                >
                    <Text style={{ color: "white" }}>GE Connect+ PatientLink v0.4</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default MainMenuScreen;
