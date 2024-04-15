import { StyleSheet, Platform, StatusBar } from "react-native";
import Styles from "../../styles/main";

// https://stackoverflow.com/questions/51289587/how-to-use-safeareaview-for-android-notch-devices
export default StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: Styles.colors.Background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }
});
