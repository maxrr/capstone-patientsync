import { ScrollView, Text, View, Button, Pressable } from "react-native";
import { useRoute } from '@react-navigation/native';
import Styles from "../../styles/main";

const devices = [
    {
        name: "Ventilator",
        manufacturer: "The Ventilator Company",
        id: "00847946024130"
    },
    {
        name: "Infusion Pump",
        manufacturer: "MTP",
        id: "18500042541107"
    },
    {
        name: "Pulse Oximeter",
        manufacturer: "VIVE",
        id: "00810041981769"
    }
];

function ConnectedDevicesScreen({ navigation }) {
    const route = useRoute();
    const { isOverride } = route.params || { isOverride: false };

    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.h4]}><Text style={{color: "white", fontWeight: "bold"}}>Connected Devices</Text></Text>
            <Text style={[Styles.h6]}>Please review the medical devices connected to the ConnectPlus device</Text>
            <View style={{height: 15}}></View>
            <ScrollView
                contentContainerStyle={{
                    gap: Styles.consts.gapIncrement
                }}
            >
                {devices.map((e, index) => (
                    // <View
                    //     key={e.id}
                    //     style={[
                    //         Styles.container,
                    //         { justifyContent: "flex-start", textAlign: "left", alignItems: "flex-start", gap: 0 }
                    //     ]}
                    // >
                    //     <Text style={{ color: Styles.colors.TextColor }}>{e.name}</Text>
                    //     <Text style={{ color: Styles.colors.TextColor }}>{e.manufacturer}</Text>
                    //     <Text style={{ color: Styles.colors.TextColor }}>{e.id}</Text>
                    // </View>
                    <Text key={index} style={[Styles.medDeviceSelectButton, { backgroundColor: Styles.colors.GEPurple, flexWrap: "wrap", flexDirection: "row" }]}>
                        <Text style={[Styles.deviceSelectButtonText]}><Text style={{fontWeight: "bold", fontSize: 16}}>{e.name}</Text>{'\n'}</Text>
                        <Text style={[Styles.deviceSelectButtonText]}>{e.manufacturer}{'\n'}</Text>
                        <Text style={[Styles.deviceSelectButtonText]}>{e.id}</Text>
                    </Text>
                ))}
            </ScrollView>


            {/*Have to add back button to connected devices screen to go back to scrollable devices page */}
            {/* disabling temporarily because the header has a back button already */}
            {/* <Button title="Go Back" onPress={() => navigation.pop()} /> */}

            <Button title="Confirm" onPress={() => {
                    if (isOverride) {
                        navigation.push("Confirm Override Patient", { isOverride });
                    } else {
                        navigation.push("Enter Patient Info", { isOverride });
                    }
                }} />
            {/*Temp button for override case. Unsure if we want multiple screens for more override screens or just a variable to determine text -dt */}

            {/*Didn't create more override screens because
            I'm unsure if we want to set the text on other screens with a variable changing with ?
            or if we want separate screens. Separate screens might lead to lots of overlap/content. -dt*/}

            {/*Removed temp override button 3/10/24 */}
            {/* <Button title="Confirm (override temp)" onPress={() => navigation.push("Confirm Override Patient")} /> */}

            <View style={{marginBottom: 10}}></View>
        </View>
    );
}

export default ConnectedDevicesScreen;
