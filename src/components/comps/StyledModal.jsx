import { Modal, View } from "react-native";
import Styles from "../../styles/main";

function StyledModal({ children, visible, style = {}, innerStyle = {} }) {
    return (
        <Modal animationType="fade" visible={visible} transparent={true}>
            <View
                style={[
                    {
                        opacity: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                        paddingHorizontal: Styles.consts.gapIncrement * 6
                    },
                    style
                ]}
            >
                <View
                    style={[
                        {
                            backgroundColor: Styles.colors.Background,
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            shadowColor: "black",
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowOpacity: 0.5,
                            shadowRadius: Styles.consts.gapIncrement,
                            borderRadius: Styles.consts.gapIncrement,
                            padding: Styles.consts.gapIncrement * 2
                            // gap: Styles.consts.gapIncrement
                        },
                        innerStyle
                    ]}
                >
                    {children}
                </View>
            </View>
        </Modal>
    );
}

export default StyledModal;
