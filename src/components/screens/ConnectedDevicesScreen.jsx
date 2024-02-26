import { ScrollView, Text, View, Button } from "react-native";
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
            <Text style={[Styles.h4]}>Connected Devices</Text>
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
            <Button title="Confirm" onPress={() => navigation.push("Enter Patient Info")} />
        </View>
    );
}

export default ConnectedDevicesScreen;
