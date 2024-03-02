import { ScrollView, Text, View, Button, Pressable } from "react-native";
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
    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.h4, Styles.underline]}>Connected Devices</Text>
            <Text style={[Styles.h6]}>Please review the medical devices connected to the ConnectPlus device</Text>
            <ScrollView
                contentContainerStyle={{
                    gap: Styles.consts.gapIncrement
                }}
            >
                {devices.map((e) => (
                    <View
                        key={e.id}
                        style={[
                            Styles.container,
                            { justifyContent: "flex-start", textAlign: "left", alignItems: "flex-start", gap: 0 }
                        ]}
                    >
                        <Text style={{ color: Styles.colors.TextColor }}>{e.name}</Text>
                        <Text style={{ color: Styles.colors.TextColor }}>{e.manufacturer}</Text>
                        <Text style={{ color: Styles.colors.TextColor }}>{e.id}</Text>
                    </View>
                ))}
            </ScrollView>
 

            {/*Have to add back button to connected devices screen to go back to scrollable devices page */}
            <Button title="Go Back" onPress={() => navigation.pop()} />

            <Button title="Confirm" onPress={() => navigation.push("Enter Patient Info")} />
            {/*Temp button for override case. Unsure if we want multiple screens for more override screens or just a variable to determine text -dt */}

            {/*Didn't create more override screens because
            I'm unsure if we want to set the text on other screens with a variable changing with ?
            or if we want separate screens. Separate screens might lead to lots of overlap/content. -dt*/}

            <Button title="Confirm (override temp)" onPress={() => navigation.push("Confirm Override Patient")} />
            
    
        </View>
    );
}

export default ConnectedDevicesScreen;
