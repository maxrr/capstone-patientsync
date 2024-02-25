import { Button, Text, View } from "react-native";
import Styles from "../../styles/main";

function MainMenuScreen({ navigation }) {
    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.hero, { color: Styles.colors.GEPurple }]}>Welcome</Text>
            <Text style={[Styles.h5]}>To begin, select an action</Text>
            <Button title="Link patient with a ConnectPlus device" onPress={() => navigation.push("Device Select")} />
            <Button title="Unlink a patient from a ConnectPlus device" onPress={() => alert("Not yet implemented")} />
        </View>
    );
}

export default MainMenuScreen;
