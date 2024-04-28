import { KeyboardAvoidingView, Platform, RefreshControl, SafeAreaView, ScrollView, View } from "react-native";
import Styles from "../../styles/main";

function UniformPageWrapper({ enableRefresh = false, refreshing, onRefresh = () => {}, children, centerContent = false }) {
    const centerContentStyles = centerContent
        ? { display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }
        : { height: "100%" };
    return (
        <SafeAreaView style={[{ backgroundColor: Styles.colors.Background, height: "100%" }, centerContentStyles]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[{ minHeight: "100%" }, centerContentStyles]}
            >
                {enableRefresh ? (
                    <ScrollView
                        contentContainerStyle={[Styles.scrollContainer, { height: "100%" }]}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    >
                        {children}
                    </ScrollView>
                ) : (
                    <ScrollView contentContainerStyle={[Styles.scrollContainer, centerContentStyles]}>{children}</ScrollView>
                )}
                {centerContent ? <View style={{ height: "10%" }} /> : <></>}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default UniformPageWrapper;
