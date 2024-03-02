import { Text, View, Button, Pressable, ScrollView } from "react-native";
import Styles from "../../styles/main";

function DeviceSelectScreen({ navigation }) {
    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.h4, Styles.underline]}>Device Select</Text>
            <Text style={[Styles.h6]}>Select a device to continue</Text>

            <ScrollView 
                contentContainerStyle={{
                    gap: Styles.consts.gapIncrement,
                    backgroundColor: "292A2B"
                }}
            >
            {/*Using pressable instead of button so we can design, react native is bad w/ natural buttons -DT */}
            <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
            <Text style={[Styles.deviceSelectButton, Styles.deviceSelectButtonText, { backgroundColor: Styles.colors.GEPurple}]}>GECP2427170{"\n"}Room 412A</Text>
            </Pressable>

            {/*Added button from figma prototype (default case) 3/2/24 -DT*/}
            <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
            <Text style={[Styles.deviceSelectButton, Styles.deviceSelectButtonText, { backgroundColor: Styles.colors.GEPurple}]}>GECP3128689{"\n"}Room 413B</Text>
            </Pressable>

            <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
            <Text style={[Styles.deviceSelectButton, Styles.deviceSelectButtonText, { backgroundColor: Styles.colors.GEPurple}]}>GECP2309701(override case){"\n"}Room 311C</Text>
            </Pressable>

            {/*THIS IS HUGEEEE section of placeholder code. This is to show list of devices can be scrollable -DT */}
            <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
            <Text style={[Styles.deviceSelectButton, Styles.deviceSelectButtonText, { backgroundColor: Styles.colors.GEPurple}]}>GECP2309701(override case){"\n"}Room 311C</Text>
            </Pressable>
            <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
            <Text style={[Styles.deviceSelectButton, Styles.deviceSelectButtonText, { backgroundColor: Styles.colors.GEPurple}]}>GECP2309701(override case){"\n"}Room 311C</Text>
            </Pressable>
            <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
            <Text style={[Styles.deviceSelectButton, Styles.deviceSelectButtonText, { backgroundColor: Styles.colors.GEPurple}]}>GECP2309701(override case){"\n"}Room 311C</Text>
            </Pressable>
            <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
            <Text style={[Styles.deviceSelectButton, Styles.deviceSelectButtonText, { backgroundColor: Styles.colors.GEPurple}]}>GECP2309701(override case){"\n"}Room 311C</Text>
            </Pressable>
            <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
            <Text style={[Styles.deviceSelectButton, Styles.deviceSelectButtonText, { backgroundColor: Styles.colors.GEPurple}]}>GECP2309701(override case){"\n"}Room 311C</Text>
            </Pressable>
            <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
            <Text style={[Styles.deviceSelectButton, Styles.deviceSelectButtonText, { backgroundColor: Styles.colors.GEPurple}]}>GECP2309701(override case){"\n"}Room 311C</Text>
            </Pressable>
            <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
            <Text style={[Styles.deviceSelectButton, Styles.deviceSelectButtonText, { backgroundColor: Styles.colors.GEPurple}]}>GECP2309701(override case){"\n"}Room 311C</Text>
            </Pressable>
            <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
            <Text style={[Styles.deviceSelectButton, Styles.deviceSelectButtonText, { backgroundColor: Styles.colors.GEPurple}]}>GECP2309701(override case){"\n"}Room 311C</Text>
            </Pressable>
            <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
            <Text style={[Styles.deviceSelectButton, Styles.deviceSelectButtonText, { backgroundColor: Styles.colors.GEPurple}]}>GECP2309701(override case){"\n"}Room 311C</Text>
            </Pressable>

            <Text style={{textAlign: "center", color: "white"}}>Scroll for more devices...</Text>
            </ScrollView>

        </View>
    );
}

export default DeviceSelectScreen;
