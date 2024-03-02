import { Button, Text, View, Pressable } from "react-native";
import Styles from "../../styles/main";

function MainMenuScreen({ navigation }) {
    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.hero, Styles.underline, { color: Styles.colors.GEPurple }]}>Welcome</Text>
            <Text style={[Styles.h5]}>To begin, select an action</Text>

        {/**Using Pressable instead of button because then we can customize it w/ stylesheet -DT */}
        <Pressable style={Styles.button} onPress={() => navigation.push("Device Select")}>
            <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple}]}>Link patient with a ConnectPlus device</Text>
        </Pressable>

        <Text style={[Styles.h4]}>OR</Text>

            {/* <Button style={[Styles.button]} title="Link patient with a ConnectPlus device" onPress={() => navigation.push("Device Select")} /> */}

        <Pressable style={Styles.button} onPress={() => alert("Not yet implemented")}>
            <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple}]}>Unlink a patient from a ConnectPlus device</Text>
        </Pressable>    

        </View>
    );
}

export default MainMenuScreen;
