import { Text, View, Button, Modal, Pressable, TextInput, TouchableOpacity, Image } from "react-native";
import React from 'react';
import { useState } from "react";
import Styles from "../../styles/main";
import { CameraView, useCameraPermissions } from 'expo-camera/next';

function CameraScanScreen({ navigation }) {

    // useState variables for manual input
    const [modalVisible, setModalVisible] = useState(false);
    const [text, onChangeText] = React.useState('');

    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraOn, setCamera] = useState(false);

    // if camera is on, scan for barcode
    if(cameraOn && permission){
        return (
            <View style={Styles.cameraContainer}>
                <CameraView 
                    style={Styles.camera}
                    facing={facing}
                    barCodeScannerSettings={{
                        barCodeTypes: ['pdf417', 'code39', 'code128'],
                    }}
                    onBarcodeScanned={() => console.log("we scanned a barcode!")}
                    >
                    <View style={Styles.cameraButtonContainer}>
                        <TouchableOpacity style={Styles.cameraButton} onPress={() => setCamera(false)}>
                            <Text style={Styles.h5}>Close Camera</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </View>
        );
    }

    else{
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
                <Pressable onPress={() => {requestPermission; setCamera(true)}}>
                    <View style={[Styles.container, { width: 250, height: 250, backgroundColor: Styles.colors.GEPurple }]}>
                        <Image source={require('../../../assets/camera_icon.webp')} />
                    </View>
                </Pressable>
                <Text style={[Styles.h5, { marginTop: 50 }]}>Not working?</Text>
                <Button title="Enter manually" onPress={() => setModalVisible(true)} />
            </View>
        );
    }

}

export default CameraScanScreen;
