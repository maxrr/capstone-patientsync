import { StyleSheet } from "react-native";

const consts = {
    gapIncrement: 8
};

const colors = {
    GEPurple: "#5A0CB5",
    TextColor: "#D7D7D7"
};

const Styles = StyleSheet.create({
    colors,
    consts,
    container: {
        backgroundColor: "#1A1B1C",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: consts.gapIncrement,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    hero: {
        fontSize: 64,
        textAlign: "center"
        // fontFamily: "Inter"
    },
    underline: {
        textDecorationLine: 'underline',
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
            justifyContent: "center",
            // paddingBottom: 100
        }
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    button: {
    height: 115,
    width: 335,
    borderRadius: 10,
    overflow: "hidden"
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        lineHeight: 115,
        textAlign: "center",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    //Used width and height from figma, can change if needed -DT
    deviceSelectButton: {
        width: 330,
        height: 50,
        borderRadius: 5,
        overflow: "hidden"
    },
    deviceSelectButtonText: {
        color: "white",
        padding: 10,
        textAlign: "left",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: 'space-between', 
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    // Camera stuff -AA
    camera: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cameraButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    cameraButton: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
});

export default Styles;
