import { View } from "react-native";

export default function Stepper() {
    return (
        <View style={{ marginBottom: 6, display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}>
            <View style={{ width: 40, height: 40, backgroundColor: "white", borderRadius: 8 }} />
            <View style={{ width: 48, height: 4, backgroundColor: "gray", borderRadius: 4 }} />
            <View style={{ width: 40, height: 40, backgroundColor: "gray", borderRadius: 8 }} />
            <View style={{ width: 48, height: 4, backgroundColor: "gray", borderRadius: 4 }} />
            <View style={{ width: 40, height: 40, backgroundColor: "gray", borderRadius: 8 }} />
        </View>
    );
}
