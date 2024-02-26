import { StyleSheet } from "react-native";

const consts = {
    gapIncrement: 8
};

const colors = {
    GEPurple: "#5A0CB5"
};

const Styles = StyleSheet.create({
    colors,
    consts,
    container: {
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
    h1: {
        fontSize: 64
    },
    h2: {
        fontSize: 56
    },
    h3: {
        fontSize: 48
    },
    h4: {
        fontSize: 32
    },
    h5: {
        fontSize: 24
    },
    h6: {
        fontSize: 16
    },
    screenSkeleton: {
        contentStyle: {
            display: "flex",
            justifyContent: "center",
            paddingBottom: 100
        }
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export default Styles;
