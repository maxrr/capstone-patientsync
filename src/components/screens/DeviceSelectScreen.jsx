import { Text, View, Button } from "react-native";
import Styles from "../../styles/main";

function DeviceSelectScreen({ navigation }) {
    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.h4]}>Device Select</Text>
            <Text style={[Styles.h6]}>Select a device to continue</Text>
            <Button title="GECP2427170" onPress={() => navigation.push("Device Screen")} />
        </View>
    );
}

export default DeviceSelectScreen;
