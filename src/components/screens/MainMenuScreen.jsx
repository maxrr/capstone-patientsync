import { Button, Text, View, Pressable, SafeAreaView } from "react-native";
import Styles from "../../styles/main";
import SafeAreaViewAndroid from "../comps/SafeAreaViewAndroid";

function MainMenuScreen({ navigation }) {
    return (
        <SafeAreaView style={SafeAreaViewAndroid.AndroidSafeArea}>
            <View style={[Styles.container, { justifyContent: "space-between" }]}>
                <Text></Text>
                <View style={[Styles.container, { height: "auto" }]}>
                    <Text style={[Styles.hero, { color: "white", fontWeight: "bold" }]}>Welcome</Text>
                    <Text style={[Styles.h6]}>To begin, select an action</Text>

                    {/**Using Pressable instead of button because then we can customize it w/ stylesheet -DT */}
                    <Pressable style={Styles.button} onPress={() => navigation.push("Device Select")}>
                        <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple }]}>
                            Link patient
                        </Text>
                    </Pressable>

                    <Text style={[Styles.h5]}>or</Text>

                    {/* <Button style={[Styles.button]} title="Link patient with a ConnectPlus device" onPress={() => navigation.push("Device Select")} /> */}

                    <Pressable
                        style={Styles.button}
                        onPress={() => navigation.push("Device Select", { showOverrides: true })}
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
                    <Text style={{ color: "white" }}>GE Connect+ PatientSync (working title) v0.2</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default MainMenuScreen;
