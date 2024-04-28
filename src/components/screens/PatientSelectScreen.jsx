import { Text, View, Pressable } from "react-native";
import React from 'react';
import Styles from "../../styles/main";
import PatientContext from "../PatientContext";
import { useContext } from "react";
import Stepper from "../comps/Stepper";

function PatientSelectScreen({ route, navigation }) {

    const isOverride = route.params ? route.params.isOverride : false;

    // Context for patient info
    const [info, setInfo] = useContext(PatientContext);

    return (
        <View style={[Styles.container]}>
            <Stepper step={2}/>
            <Text style={[Styles.h4]}><Text style={{color: "white", fontWeight: "bold"}}>{isOverride ? "Patient Override" : "Patient Select"}</Text></Text>
            <Text style={[Styles.h6]}>Choose method to input patient info</Text>

            {/*Updating buttons for Patient Select screen -DT */}
            {/**Using Pressable instead of button because then we can customize it w/ stylesheet -DT */}
            <Pressable style={Styles.button} onPress={() => navigation.push("Scan Barcode", {isOverride}, {manual: false})}>
                <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple}]}>Scan Patient Barcode</Text>
            </Pressable>

            <Text style={[Styles.h5]}>or</Text>

            <Pressable style={Styles.button} onPress={() => navigation.push("Scan Barcode", {isOverride, manual: true})}>
                <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple}]}>Manually Enter Patient Info</Text>
            </Pressable>


            {info != null ? <View style={{ alignItems: "center"}}>
                <Text style={[Styles.h5]}>or</Text>
                <Pressable style={Styles.smallButton} onPress={() => navigation.push("Confirm Patient", { reused: true })}>

                <Text style={[Styles.smallButton, Styles.buttonText, { backgroundColor: "blue" }]}>
                    Use Information For {'\n'}
                    {info.first} {info.last}
                </Text>
            </Pressable></View> : <></>}

            <View style={{height: 100}}></View>
        </View>
    );
}

export default PatientSelectScreen;