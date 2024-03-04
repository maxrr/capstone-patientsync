import { Text, View, Button, Modal, Pressable, TextInput } from "react-native";
import React from 'react';
import { useState } from "react";
import Styles from "../../styles/main";

function PatientSelectScreen({ navigation }) {

    const [modalVisible, setModalVisible] = useState(false);
    const [text, onChangeText] = React.useState('');

    return (
        <View style={[Styles.container]}>
            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}>
                <View style={[Styles.container]}>
                    <View style={[Styles.container]}>
                        <Text style={[Styles.hero]}>Enter patient ID number:</Text>
                        <TextInput
                            style={[Styles.input]}
                            onChangeText={onChangeText}
                            value={text}
                            placeholder = "input id here"
                        ></TextInput>
                        <Pressable
                            onPress={() => {
                                navigation.push("Confirm Patient")
                                setModalVisible(o => !o)
                                } }>
                            <Text style={{color: 'green'}}>Confirm</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setModalVisible(o => !o)}>
                                <Text style={{color: 'red'}}>Go back</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Text style={[Styles.h4]}><Text style={{color: "white", fontWeight: "bold"}}>Patient Select</Text></Text>
            <Text style={[Styles.h6]}>Choose method to input patient info</Text>

            {/*Updating buttons for Patient Select screen -DT */}
            {/**Using Pressable instead of button because then we can customize it w/ stylesheet -DT */}
            {/*NOTE: can we pop instead of push here? -AA*/}
            <Pressable style={Styles.button} onPress={() => navigation.push("Scan Barcode")}>
                <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple}]}>Scan Patient Barcode</Text>
            </Pressable>

            <Text style={[Styles.h5]}>or</Text>

            <Pressable style={Styles.button} onPress={() => setModalVisible(true)}>
                <Text style={[Styles.button, Styles.buttonText, { backgroundColor: Styles.colors.GEPurple}]}>Manually Enter Patient Info</Text>
            </Pressable>

            <View style={{height: 100}}></View>
        </View>
    );
}

export default PatientSelectScreen;
