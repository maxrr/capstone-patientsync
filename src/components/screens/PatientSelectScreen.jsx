import { Text, View, Button, Modal, Pressable, TextInput } from "react-native";
import React from 'react';
import { useState } from "react";
import Styles from "../../styles/main";

function PatientSelectScreen({ route, navigation }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [text, onChangeText] = React.useState('');

    const isOverride = route.params ? route.params.isOverride : false;

    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.h4]}><Text style={{color: "white", fontWeight: "bold"}}>{isOverride ? "Patient Override" : "Patient Select"}</Text></Text>
            <Text style={[Styles.h6]}>Choose method to input patient info</Text>

            {/*Updating buttons for Patient Select screen -DT */}
            {/**Using Pressable instead of button because then we can customize it w/ stylesheet -DT */}
            <Pressable style={Styles.button} onPress={() => navigation.push("Scan Barcode", {manual: false})}>
                <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple}]}>Scan Patient Barcode</Text>
            </Pressable>

            <Text style={[Styles.h5]}>or</Text>

            <Pressable style={Styles.button} onPress={() => navigation.push("Scan Barcode", {manual: true})}>
                <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple}]}>Manually Enter Patient Info</Text>
            </Pressable>

            <View style={{height: 100}}></View>
        </View>
    );
}

export default PatientSelectScreen;
