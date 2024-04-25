import { Pressable, Text, View } from "react-native";
import Styles from "../../styles/main";
import { FontAwesome } from "@expo/vector-icons";
import LabeledIconButton from "./LabeledIconButton";

function ConfirmCancelCombo({
    confirmEnabled = true,
    cancelEnabled = true,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm = () => {},
    onCancel = () => {},
    cancelIcon = "arrow-left",
    confirmIcon = "check",
    cancelStyle = {},
    confirmStyle = {},
    confirmDisabled = false,
    cancelDisabled = false
}) {
    const justify = confirmEnabled && cancelEnabled ? "space-between" : cancelEnabled ? "flex-start" : "flex-end";

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: justify,
                alignItems: "center",
                alignContent: "center",
                width: "100%",
                marginTop: Styles.consts.gapIncrement
            }}
        >
            {cancelEnabled ? (
                // <Pressable style={[Styles.btnCancel, cancelStyle]} onPress={onCancel}>
                //     {/* <Text>{"<-"}</Text> */}
                //     <View
                //         style={{
                //             display: "flex",
                //             flexDirection: "row",
                //             justifyContent: "space-between",
                //             alignItems: "center",
                //             gap: Styles.consts.gapIncrement
                //         }}
                //     >
                //         <FontAwesome name={cancelIcon} size={24} color={"white"} />
                //         <Text style={{ color: "white", fontWeight: 500, fontSize: 16 }}>{cancelText}</Text>
                //     </View>
                // </Pressable>
                <LabeledIconButton
                    icon={cancelIcon}
                    onPress={onCancel}
                    styles={[Styles.btnCancel, cancelStyle]}
                    text={cancelText}
                    iconOnRight={false}
                    disabled={cancelDisabled}
                />
            ) : (
                <></>
            )}
            {confirmEnabled ? (
                // <Pressable style={[Styles.btnConfirm, confirmStyle]} onPress={onConfirm}>
                //     {/* <Text>
                //     {confirmText} {"->"}
                // </Text> */}
                //     <View
                //         style={{
                //             display: "flex",
                //             flexDirection: "row",
                //             justifyContent: "space-between",
                //             alignItems: "center",
                //             gap: Styles.consts.gapIncrement
                //         }}
                //     >
                //         <Text style={{ color: "white", fontWeight: 500, fontSize: 16 }}>{confirmText}</Text>
                //         <FontAwesome name={confirmIcon} size={24} color={"white"} />
                //     </View>
                // </Pressable>
                <LabeledIconButton
                    icon={confirmIcon}
                    onPress={onConfirm}
                    styles={[Styles.btnConfirm, confirmStyle]}
                    text={confirmText}
                    iconOnRight={true}
                    disabled={confirmDisabled}
                />
            ) : (
                <></>
            )}
        </View>
    );
}

export default ConfirmCancelCombo;
