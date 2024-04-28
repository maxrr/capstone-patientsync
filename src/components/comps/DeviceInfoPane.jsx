import { ActivityIndicator, Pressable, Text } from "react-native";
import Styles from "../../styles/main";

function DeviceInfoPane({
    device,
    onPress = () => {},
    showOverrides,
    detailed = false,
    style = {},
    loading = false,
    profile = null
}) {
    if (device == null) {
        device = {
            name: "No device connected",
            room: "None",
            id: "NONE",
            isOverride: false,
            rssi: 0
        };
    }
    return loading ? (
        <ActivityIndicator />
    ) : (
        <Pressable key={device?.id} style={[Styles.deviceSelectButton, style]} onPress={onPress}>
            <Text
                style={[
                    Styles.deviceSelectButton,
                    Styles.deviceSelectButtonText,
                    { backgroundColor: Styles.colors.GEPurple }
                ]}
            >
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>Room {device?.room}</Text>
                {"\n"}
                <Text style={[{ fontWeight: "bold" }]}>
                    {device?.name} <Text style={{ color: "#bbb" }}>({device?.id})</Text>
                </Text>
                {"\n"}
                <Text
                    style={{
                        color: device?.isOverride && !showOverrides ? "#ffcf24" : "#75d14b"
                    }}
                >
                    {(device?.isOverride && !showOverrides ? "⚠" : "✓") +
                        " " +
                        (device?.isOverride
                            ? detailed
                                ? `Currently associated to ${(profile?.first ?? "Unknown") + " " + (profile?.last ?? "Unknown")}`
                                : "Has existing patient association"
                            : "No patient associated")}
                </Text>
                {/* {"\n"} */}
                {/* TODO: Implement icon showing connectivity */}
                {/* <Text>{device?.rssi}</Text> */}
                {detailed ? <></> : <></>}
            </Text>
        </Pressable>
    );
}

export default DeviceInfoPane;
