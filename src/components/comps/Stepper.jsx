import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";


//<FontAwesome name="unlink" size={24} color="black" />

export default function Stepper(props) {
    //Default to the linking case, AKA linking stepper being true.
    const route = useRoute();
    const { linkingStepper } = route.params || { linkingStepper: true };

    return (
        <>
            <View style={{ display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}>
                <View
                    style={{
                        width: 40,
                        height: 15,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    {props.step > 1 ? (
                        <FontAwesome name="check-circle" size={15} color="green" />
                    ) : props.step == 1 ? (
                        <FontAwesome name="caret-down" size={15} color="white" />
                    ) : (
                        <></>
                    )}
                </View>
                <View style={{ width: 48, height: 4 }} />
                <View
                    style={{
                        width: 40,
                        height: 15,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    {props.step > 2 ? (
                        <FontAwesome name="check-circle" size={15} color="green" />
                    ) : props.step == 2 ? (
                        <FontAwesome name="caret-down" size={15} color="white" />
                    ) : (
                        <></>
                    )}
                </View>
                <View style={{ width: 48, height: 4 }} />
                <View
                    style={{
                        width: 40,
                        height: 15,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    {props.step > 3 ? (
                        <FontAwesome name="check-circle" size={15} color="green" />
                    ) : props.step == 3 ? (
                        <FontAwesome name="caret-down" size={15} color="white" />
                    ) : (
                        <></>
                    )}
                </View>
            </View>
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
                    <FontAwesome name={linkingStepper ? "link" : "unlink"} size={24} color={props.step > 3 ? "white" : "black"} />
                </View>
            </View>
        </>
    );
}
