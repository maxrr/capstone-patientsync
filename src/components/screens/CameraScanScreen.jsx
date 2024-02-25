import { Pressable, Text, View, Button } from "react-native";
import Styles from "../../styles/main";

function CameraScanScreen({ navigation }) {
    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.h4]}>Patient Select</Text>
            <Text style={[Styles.h6]}>Scan a patient's barcode to continue</Text>
            <Pressable onPress={() => navigation.push("Confirm Patient")}>
                <View style={[Styles.container, { width: 250, height: 250, backgroundColor: Styles.colors.GEPurple }]}>
                    <Text style={{ color: "white", textAlign: "center", padding: 50 }}>
                        (please tap camera to simulate scanning)
                    </Text>
                </View>
            </Pressable>
            <Text style={[Styles.h5, { marginTop: 50 }]}>Not working?</Text>
            <Button title="Enter manually" onPress={() => alert("Not yet implemented")} />
        </View>
    );
}

export default CameraScanScreen;
