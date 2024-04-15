import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from "react-native";
import Styles from "../../styles/main";

function UniformPageWrapper({ children }) {
    return (
        <SafeAreaView>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ minHeight: "100%" }}>
                <ScrollView contentContainerStyle={[Styles.scrollContainer]}>{children}</ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default UniformPageWrapper;
