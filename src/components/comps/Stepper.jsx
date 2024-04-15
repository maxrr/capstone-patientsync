import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function Stepper(props) {
    return (
        <View style={{ marginBottom: 6, display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}>
            <View
                style={{
                    width: 40,
                    height: 40,
                    backgroundColor: props.step > 1 ? "green" : props.step === 1 ? "white" : "gray",
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <FontAwesome name="bluetooth" size={24} color={props.step > 1 ? "white" : "black"} />
            </View>
            <View style={{ width: 48, height: 4, backgroundColor: "gray", borderRadius: 4 }} />
            <View
                style={{
                    width: 40,
                    height: 40,
                    backgroundColor: props.step > 2 ? "green" : props.step === 2 ? "white" : "gray",
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <FontAwesome name="user" size={24} color={props.step > 2 ? "white" : "black"} />
            </View>
            <View style={{ width: 48, height: 4, backgroundColor: "gray", borderRadius: 4 }} />
            <View
                style={{
                    width: 40,
                    height: 40,
                    backgroundColor: props.step > 3 ? "green" : props.step === 3 ? "white" : "gray",
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <FontAwesome name="link" size={24} color={props.step > 3 ? "white" : "black"} />
            </View>
        </View>
    );
}
