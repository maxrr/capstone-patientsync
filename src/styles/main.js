import { StyleSheet, Dimensions } from "react-native";

const consts = {
    gapIncrement: 8
};

const colors = {
    GEPurple: "#5A0CB5",
    TextColor: "#D7D7D7"
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Styles = StyleSheet.create({
    colors,
    consts,
    container: {
        padding: 10,
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
        height: windowHeight/15,
        width: windowWidth/1.5,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: "white",
        color: 'white',
        textAlign: 'center',
        fontSize: windowHeight/35
    },
    button: {
    padding: 10,
    height: 80,
    width: 335,
    borderRadius: 10,
    overflow: "hidden",
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 45,
        textAlign: "center",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    //Used width and height from figma, can change if needed -DT
    deviceSelectButton: {
        width: 330,
        height: 60,
        borderRadius: 5,
        overflow: "hidden"
    },
    deviceSelectButtonText: {
        color: "white",
        padding: 10,
        textAlign: "left",
        flexWrap: "wrap", 
        flexDirection: "row",
        height: 70
    },
    medDeviceSelectButton: {
        padding: 10,
        width: 330,
        height: 80,
        borderRadius: 5,
        overflow: "hidden"
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
