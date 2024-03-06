import { Text, View, Button, Modal, Pressable, TextInput, TouchableOpacity, Image } from "react-native";
import React from 'react';
import { useState, useEffect } from "react";
import Styles from "../../styles/main";
import { CameraView, useCameraPermissions } from 'expo-camera/next';

function CameraScanScreen({ navigation }) {

    // variables for manual input modal
    const [modalVisible, setModalVisible] = useState(false);
    const [text, onChangeText] = React.useState('');

    // variables for camera functionality
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraState, setCameraState] = useState(false);
    const [scanResult, setScanResult] = useState('');
    const [scanBool, setScanBool] = useState(false);

    // store scanned information
    useEffect(() => {
        if (scanResult.length != 0) {
            console.log(scanResult.data)
            console.log(scanResult.type)
            setScanResult('')
            setScanBool(false)
            navigation.push("Confirm Patient")
        }
    }, [scanResult])

    function confirmInput() {
        // TODO: store patient ID num
        navigation.push("Confirm Patient")
        onChangeText('')
        setModalVisible(o => !o)
    }

    // if camera is on, scan for barcode
    if (cameraState && permission) {
        return (
            <View style={Styles.cameraContainer}>
                <CameraView
                    style={Styles.camera}
                    facing={'back'}
                    barCodeScannerSettings={{
                        barCodeTypes: ['pdf417', 'code39', 'code128'],
                    }}
                    onBarcodeScanned={(scanningResult) => {
                        if (scanningResult.type != '256' && !scanBool) {
                            // NOTE: temp fix to prevent repeated scanning
                            setCameraState(false)
                            setScanBool(true)
                            setScanResult(scanningResult)
                        }
                    }}
                >
                    <View style={Styles.cameraButtonContainer}>
                        <TouchableOpacity style={Styles.cameraButton} onPress={() => setCameraState(false)}>
                            <Text style={Styles.h5}>Close Camera</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </View>
        );
    }

    else {
        return (
            <View style={[Styles.container]}>

                {/* Modal popup for manual patient ID input */}
                <Modal
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}>
                    <View style={[Styles.container]}>
                        <Text style={[Styles.h4]}><Text style={{ color: "white", fontWeight: "bold" }}>Enter Patient ID Number</Text></Text>
                        <TextInput
                            style={[Styles.input]}
                            onChangeText={onChangeText}
                            value={text}
                        ></TextInput>
                        <View style={[Styles.buttonRow]}>
                            <Button title="go back" color="red" onPress={() => setModalVisible(o => !o)}></Button>
                            <Button title="confirm" color="#5A0CB5" onPress={() => confirmInput()}></Button>
                        </View>
                    </View>
                </Modal>

                <Text style={[Styles.h4]}><Text style={{ color: "white", fontWeight: "bold" }}>Patient Select</Text></Text>
                <Text style={[Styles.h6]}>Scan a patient's barcode to continue</Text>
                <View style={{ height: 20 }}></View>
                <Pressable onPress={() => { requestPermission(); setCameraState(true) }}>
                    <View style={[Styles.container, { width: 250, height: 250, backgroundColor: Styles.colors.GEPurple }]}>
                        <Image source={require('../../../assets/camera_icon.webp')} />
                    </View>
                </Pressable>
                <Text style={[Styles.h5, { marginTop: 50 }]}>Not working?</Text>
                <Button title="Enter manually" onPress={() => setModalVisible(true)} />
                <View style={{ height: 50 }}></View>
            </View>
        );
    }

}

export default CameraScanScreen;
