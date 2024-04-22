import { Button, Text, View, Pressable } from "react-native";
import Styles from "../../styles/main";
import { useState, useEffect, useContext } from "react";

function MainMenuScreen({ navigation }) {
    //Variable to dictate what stepper to show. Either show stepper for linking process, which has the last image as a link,
    //or if this is false then show the stepper for the unlinking process which is an unlink. Set this value to true by default.
    const [linkingStepper, setLinkingStepper] = useState(true);

    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.hero, { color: "white", fontWeight: "bold"}]}>Welcome</Text>
            <Text style={[Styles.h6]}>To begin, select an action</Text>

        {/**Using Pressable instead of button because then we can customize it w/ stylesheet -DT */}
        <Pressable style={Styles.button} onPress={() => {navigation.push("Device Select", {linkingStepper: true})} }>
            <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple }]}>Link patient</Text>
        </Pressable>

        <Text style={[Styles.h5]}>or</Text>

            {/* <Button style={[Styles.button]} title="Link patient with a ConnectPlus device" onPress={() => navigation.push("Device Select")} /> */}

        <Pressable style={Styles.button} onPress={() => {navigation.push("Device Select", {linkingStepper: false, showOverrides: true })} }>
            <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple}]}>Unlink a patient</Text>
        </Pressable>    

        </View>
    );
}

export default MainMenuScreen;