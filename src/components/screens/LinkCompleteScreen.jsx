import { Button, Text, View } from "react-native";
import Styles from "../../styles/main";

function LinkCompleteScreen({ navigation }) {
    return (
        // TODO: On this page, we shouldn't give the user any ability to move backwards ~mr
        <View style={[Styles.container]}>
            <View style={{ marginBottom: 6, display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}>
                <View style={{ width: 40, height: 40, backgroundColor: "green", borderRadius: 8 }} />
                <View style={{ width: 48, height: 4, backgroundColor: "green", borderRadius: 4 }} />
                <View style={{ width: 40, height: 40, backgroundColor: "green", borderRadius: 8 }} />
                <View style={{ width: 48, height: 4, backgroundColor: "green", borderRadius: 4 }} />
                <View style={{ width: 40, height: 40, backgroundColor: "green", borderRadius: 8 }} />
            </View>
            <Text style={[Styles.h4]}><Text style={{color: "white", fontWeight: "bold"}}>Success</Text></Text>
            <Text style={[Styles.h6]}>Link complete!</Text>
            <Button title="Return home" onPress={() => navigation.popToTop()} />
            <View style={{height: 50}}></View>
        </View>
    );
}

export default LinkCompleteScreen;
