import { Text, View, Button, TextInput, TouchableOpacity } from "react-native";
import React from 'react';
import { useState, useEffect, useContext } from "react";
import Styles from "../../styles/main";
import { CameraView, useCameraPermissions } from 'expo-camera/next';
import PatientContext from "../PatientContext";

function CameraScanScreen({ route, navigation }) {

    // variables for manual input modal
    const { manual } = route.params;
    const [text, onChangeText] = React.useState('');

    // variables for camera functionality
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraState, setCameraState] = useState(!manual);
    const [scanBool, setScanBool] = useState(false);

    // Context for patient info
    const [info, setInfo] = useContext(PatientContext);

    function handleScan(result) {
        if(scanBool){
            return
        }
        setInfo(result.data)
        setScanBool(true)
        navigation.push("Confirm Patient")
    }

    useEffect(() => {
        if(cameraState && !permission){
            requestPermission();
        }
    }, [cameraState])

    function confirmInput() {
        setInfo(text)
        navigation.push("Confirm Patient")
        onChangeText('')
    }

    // if camera is on, scan for barcode
    if (cameraState && permission) {
        return (
            <View style={Styles.cameraContainer}>
                <CameraView
                    style={Styles.camera}
                    facing={'back'}
                    barcodeScannerSettings={{ barcodeTypes: ['pdf417', 'code39', 'code128']}}
                    onBarcodeScanned={(scanningResult) => {
                        handleScan(scanningResult)
                        console.log(scanningResult.data)
                    }}
                >
                    <View style={Styles.cameraButtonContainer}>
                        <TouchableOpacity style={Styles.cameraButton} onPress={() => { setCameraState(false) }}>
                            <Button 
                                title="Use Manual Input Instead"
                                color="red"
                                onPress={() => { setCameraState(false) }}
                                >
                            </Button>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </View>
        );
    }

    else {
        return (
            <View style={[Styles.container]}>
                <View style={[Styles.container]}>
                    <Text style={[Styles.h4]}><Text style={{ color: "white", fontWeight: "bold" }}>Enter Patient ID Number</Text></Text>
                    <TextInput
                        style={[Styles.input]}
                        onChangeText={onChangeText}
                        value={text}
                    ></TextInput>
                    <View style={[Styles.buttonRow]}>
                        <Button title="scan instead" color="red" onPress={() => { setCameraState(true) }}></Button>
                        <Button title="confirm" color="#5A0CB5" onPress={() => confirmInput()}></Button>
                    </View>
                </View>
            </View>
        );
    }

}

export default CameraScanScreen;
