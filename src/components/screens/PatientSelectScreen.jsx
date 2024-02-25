import { Text, View, Button } from "react-native";
import Styles from "../../styles/main";

function PatientSelectScreen({ navigation }) {
    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.h4]}>Patient Select</Text>
            <Text style={[Styles.h6]}>Choose how you want to input patient information</Text>
            <Button title="Scan patient barcode" onPress={() => navigation.push("Scan Barcode")} />
            <Button title="Manually enter patient information" onPress={() => alert("Not yet implemented")} />
        </View>
    );
}

export default PatientSelectScreen;
