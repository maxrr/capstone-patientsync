import { Text, Pressable, View } from "react-native";
import Styles from "../../styles/main";
import { FontAwesome } from "@expo/vector-icons";

function LabeledIconButton({
    icon = "",
    text = "Button",
    style = {},
    styles = [],
    textStyle = {},
    innerViewStyle = {},
    iconColor = "white",
    iconSize = 24,
    iconOnRight = false,
    onPress = () => {},
    disabled = false
}) {
    const finalStyles = [Styles.btnIconGeneric].concat(styles);
    if (disabled) {
        finalStyles.push(Styles.btnIconGenericDisabled);
    }
    finalStyles.push(style);

    return (
        <Pressable style={finalStyles} onPress={onPress} disabled={disabled}>
            {/* <Text>{"<-"}</Text> */}
            <View
                style={[
                    {
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: Styles.consts.gapIncrement
                    },
                    innerViewStyle
                ]}
            >
                {!iconOnRight ? <FontAwesome name={icon} size={iconSize} color={iconColor} /> : <></>}
                {text && text.length > 0 ? (
                    <Text style={[{ color: "white", fontWeight: 500, fontSize: 16 }, textStyle]}>{text}</Text>
                ) : (
                    <></>
                )}
                {iconOnRight ? <FontAwesome name={icon} size={iconSize} color={iconColor} /> : <></>}
            </View>
        </Pressable>
    );
}

export default LabeledIconButton;
