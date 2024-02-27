import { Text, View, Button } from "react-native";
import Styles from "../../styles/main";

function DeviceSelectScreen({ navigation }) {
    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.h4]}>Device Select</Text>
            <Text style={[Styles.h6]}>Select a device to continue</Text>
            <Button title="GECP2427170" onPress={() => navigation.push("Device Screen")} />

            {/*Button for getting to the override section of code.*/}
            <Button title="GECP2309701 (override case)" onPress={() => navigation.push("Confirm Override Patient")} />
        </View>
    );
}

export default DeviceSelectScreen;
