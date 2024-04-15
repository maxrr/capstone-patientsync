import { Pressable, Text } from "react-native";
import Styles from "../../styles/main";

function DeviceInfoPane({ device, onPress = () => {}, showOverrides, detailed = false, style = {} }) {
    return (
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
                                ? `Currently associated to ${device?.cur_patient_mrn}`
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
