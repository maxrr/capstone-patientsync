import { useState, useEffect, useContext } from "react";
import { Button, Text, View, Pressable, SafeAreaView } from "react-native";
import Styles from "../../styles/main";
import SafeAreaViewAndroid from "../comps/SafeAreaViewAndroid";
import CurrentFlowSettingsContext from "../CurrentFlowSettingsContext";
import LabeledIconButton from "../comps/LabeledIconButton";

function MainMenuScreen({ navigation }) {
    //Variable to dictate what stepper to show. Either show stepper for linking process, which has the last image as a link,
    //or if this is false then show the stepper for the unlinking process which is an unlink. Set this value to true by default.

    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);

    return (
        <SafeAreaView style={SafeAreaViewAndroid.AndroidSafeArea}>
            <View style={[Styles.container, { justifyContent: "space-between" }]}>
                <Text></Text>
                <View style={[Styles.container, { height: "auto" }]}>
                    <Text style={[Styles.hero, { color: "white", fontWeight: "bold" }]}>Welcome</Text>
                    <Text style={[Styles.h6]}>To begin, select an action</Text>

                    {/**Using Pressable instead of button because then we can customize it w/ stylesheet -DT */}
                    <Pressable
                        style={Styles.button}
                        onPress={() => {
                            setCurrentFlowSettings((a) => {
                                a.linkingStepper = true;
                                a.showOverrides = false;
                                return a;
                            });
                            navigation.push("Device Select");
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
                            setCurrentFlowSettings((a) => {
                                a.linkingStepper = false;
                                a.showOverrides = true;
                                return a;
                            });
                            navigation.push("Device Select");
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
                    {/* <LabeledIconButton text={"test"} icon={"camera-retro"} /> */}
                    <Text style={{ color: "white" }}>GE Connect+ PatientSync (working title) v0.3</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default MainMenuScreen;
