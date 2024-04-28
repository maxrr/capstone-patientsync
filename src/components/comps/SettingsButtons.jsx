import { Pressable, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Styles from "../../styles/main";

export const SettingsButton = ({ navigation }) => {
    return <FontAwesome name="gear" size={24} />;
};

export const SettingsButtonHome = ({ navigation }) => {
    return (
        <Pressable
            onPress={() => {
                navigation.push("Settings");
            }}
        >
            <View style={{ display: "flex", flexDirection: "row", gap: Styles.consts.gapIncrement, alignItems: "center" }}>
                {/* <Text style={{ fontWeight: "bold", color: "white" }}>Settings</Text> */}
                <FontAwesome name="gear" size={24} color={Styles.colors.TextColor} />
            </View>
        </Pressable>
    );
};
