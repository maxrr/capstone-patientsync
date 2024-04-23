import { StyleSheet, Dimensions } from "react-native";

const consts = {
    gapIncrement: 8
};

const colors = {
    GEPurple: "#5A0CB5",
    TextColor: "#D7D7D7",
    Disabled: "#595959",
    Background: "#1A1B1C"
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Styles = StyleSheet.create({
    colors,
    consts,
    container: {
        padding: 10,
        backgroundColor: colors.Background,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: consts.gapIncrement,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    scrollContainer: {
        padding: 10,
        backgroundColor: colors.Background,
        flexDirection: "column",
        padding: consts.gapIncrement * 4,
        minHeight: "100%",
        gap: consts.gapIncrement,
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: "center"
    },
    hero: {
        fontSize: 64,
        textAlign: "center"
        // fontFamily: "Inter"
    },
    underline: {
        textDecorationLine: "underline"
    },
    h1: {
        color: colors.TextColor,
        fontSize: 64
    },
    h2: {
        color: colors.TextColor,
        fontSize: 56
    },
    h3: {
        color: colors.TextColor,
        fontSize: 48
    },
    h4: {
        color: colors.TextColor,
        fontSize: 32
    },
    h5: {
        color: colors.TextColor,
        fontSize: 24
    },
    h6: {
        color: colors.TextColor,
        fontSize: 16
    },
    screenSkeleton: {
        contentStyle: {
            display: "flex",
            justifyContent: "center"
            // paddingBottom: 100
        }
    },
    // input: {
    //     height: windowHeight / 15,
    //     width: windowWidth / 1.5,
    //     margin: 12,
    //     borderWidth: 1,
    //     padding: 10,
    //     borderColor: "white",
    //     color: "white",
    //     textAlign: "center",
    //     fontSize: windowHeight / 35
    // },
    input: {
        width: "100%",
        margin: 6,
        borderWidth: 1,
        borderColor: "#777",
        color: "white",
        textAlign: "center",
        fontSize: 14,
        borderRadius: consts.gapIncrement
    },
    button: {
        padding: 10,
        height: 80,
        width: 335,
        borderRadius: 10,
        overflow: "hidden"
    },
    smallButton: {
        padding: 5,
        height: 110,
        width: 300,
        borderRadius: 10,
        // overflow: "hidden",
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 45,
        textAlign: "center",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center"
    },
    //Used width and height from figma, can change if needed -DT
    deviceSelectButton: {
        width: "100%",
        borderRadius: 5,
        display: "flex",
        flexDirection: "row"
    },
    deviceSelectButtonText: {
        color: "white",
        padding: 10,
        textAlign: "left",
        flexWrap: "wrap",
        flexDirection: "row"
        // height: 70
    },
    medDeviceSelectButton: {
        padding: 10,
        width: "100%",
        borderRadius: 5,
        overflow: "hidden"
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    // Camera stuff -AA
    camera: {
        flex: 1
    },
    cameraContainer: {
        flex: 1,
        justifyContent: "center"
    },
    cameraButtonContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        margin: 64
    },
    cameraButton: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center"
    }
    warning: {
        textAlign: 'center',
        textAlignVertical: 'center',
        marginTop: 600,
        fontSize: 38,
        color: 'red',
    }
});

export default Styles;