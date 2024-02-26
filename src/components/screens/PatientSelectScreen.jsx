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
            <Text style={[Styles.h4]}>Patient Select</Text>
            <Text style={[Styles.h6]}>Choose how you want to input patient information</Text>
            <Button title="Scan patient barcode" onPress={() => navigation.push("Scan Barcode")} />
            <Button title="Manually enter patient information" onPress={() => setModalVisible(true)} />
        </View>
    );
}

export default PatientSelectScreen;
