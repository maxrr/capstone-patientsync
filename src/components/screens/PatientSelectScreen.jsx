import { Text, View, Pressable } from "react-native";
import React from 'react';
import Styles from "../../styles/main";
import PatientContext from "../PatientContext";
import { useContext } from "react";

function PatientSelectScreen({ route, navigation }) {

    const isOverride = route.params ? route.params.isOverride : false;

    // Context for patient info
    const [info, setInfo] = useContext(PatientContext);

    return (
        <View style={[Styles.container]}>
            <View style={{ marginBottom: 6, display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}>
                <View style={{ width: 40, height: 40, backgroundColor: "green", borderRadius: 8 }} />
                <View style={{ width: 48, height: 4, backgroundColor: "green", borderRadius: 4 }} />
                <View style={{ width: 40, height: 40, backgroundColor: "white", borderRadius: 8 }} />
                <View style={{ width: 48, height: 4, backgroundColor: "gray", borderRadius: 4 }} />
                <View style={{ width: 40, height: 40, backgroundColor: "gray", borderRadius: 8 }} />
            </View>
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

            <Text style={[Styles.h5]}>or</Text>

            {info != null ? <Pressable style={Styles.smallButton} onPress={() => navigation.push("Confirm Patient", { reused: true })}>

                <Text style={[Styles.smallButton, Styles.buttonText, { backgroundColor: "blue" }]}>
                    Use Information For {'\n'}
                    {info.first} {info.last}
                </Text>
            </Pressable> : <></>}

            <View style={{height: 100}}></View>
        </View>
    );
}

export default PatientSelectScreen;
