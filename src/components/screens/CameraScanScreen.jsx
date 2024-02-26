import { Text, View, Button, Modal, Pressable, TextInput } from "react-native";
import React from 'react';
import { useState } from "react";
import Styles from "../../styles/main";

function CameraScanScreen({ navigation }) {

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
                            placeholder="input id here"
                        ></TextInput>
                        <Pressable
                            onPress={() => {
                                navigation.push("Confirm Patient")
                                setModalVisible(o => !o)
                            }}>
                            <Text style={{ color: 'green' }}>Confirm</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setModalVisible(o => !o)}>
                            <Text style={{ color: 'red' }}>Go back</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Text style={[Styles.h4]}>Patient Select</Text>
            <Text style={[Styles.h6]}>Scan a patient's barcode to continue</Text>
            <Pressable onPress={() => navigation.push("Confirm Patient")}>
                <View style={[Styles.container, { width: 250, height: 250, backgroundColor: Styles.colors.GEPurple }]}>
                    <Text style={{ color: "white", textAlign: "center", padding: 50 }}>
                        (please tap camera to simulate scanning)
                    </Text>
                </View>
            </Pressable>
            <Text style={[Styles.h5, { marginTop: 50 }]}>Not working?</Text>
            <Button title="Enter manually" onPress={() => setModalVisible(true)} />
        </View>
    );
}

export default CameraScanScreen;
