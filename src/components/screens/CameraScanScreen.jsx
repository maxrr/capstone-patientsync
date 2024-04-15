import { Text, View, Button, TextInput, TouchableOpacity, Alert } from "react-native";
import React from 'react';
import { useState, useEffect, useContext } from "react";
import Styles from "../../styles/main";
import { CameraView, useCameraPermissions } from 'expo-camera/next';
import PatientContext from "../PatientContext";

function CameraScanScreen({ route, navigation }) {

    // variables for manual input
    const { manual } = route.params;
    const [text, onChangeText] = React.useState('');

    // variables for camera functionality
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraState, setCameraState] = useState(!manual);
    const [scanBool, setScanBool] = useState(false);

    // Context for patient info
    const [info, setInfo] = useContext(PatientContext);

    // function to handle barcode scan
    function handleScan(result) {
        if(scanBool){
            return
        }
        setInfo(parseData(result))
        setScanBool(true)
        
        //Adding confirmation that a barcode has been scanned for clarity and easy understanding with an Alert.
        Alert.alert(
        "Scaning Complete",
        "Barcode Successfully Scanned!",
        [
            { 
                text: "OK", 
                onPress: () => navigation.push("Confirm Patient", { reused: false }) 
            }
        ],

        { cancelable: false } 

        );
    }

    // function to parse and store data from barcode
    function parseData(data) {
        dataArray = data.split(";")

        let year
        let month

        // format year
        if(parseInt(dataArray[4][0]) >0) {
            year = parseInt("1" + dataArray[4])
        } else{ year = parseInt("2" + dataArray[4])}

        // format month
        if(dataArray[5] === "A" ){
            month = 11
        } else if(dataArray[5] === "B") {
            month = 12
        } else {
            month = parseInt(dataArray[5]) + 1
        }

        // create patient object with appropriate information
        const patient = {
            mrn: dataArray[0].trim(),
            visit: dataArray[1].trim(),
            first: dataArray[2].trim(),
            last: dataArray[3].trim(),
            year: year,
            month: month,
            day: dataArray[6],
            gender: dataArray[7]
        }

        return patient
    }

    // request permission if not already granted and camera is on
    useEffect(() => {
        if(cameraState && !permission){
            requestPermission();
        }
    }, [cameraState])

    // confirm manual input
    // #TODO: Implement call to database and setInfo with appropriate info from there
    function confirmInput() {
        setInfo(text)
        navigation.push("Confirm Patient", { reused: false })
        onChangeText('')
    }

    // if camera is on and permission is granted, scan for barcode
    if (cameraState && permission) {
        return (
            <View style={Styles.cameraContainer}>
                <CameraView
                    style={Styles.camera}
                    facing={'back'}
                    barcodeScannerSettings={{ barcodeTypes: ['pdf417', 'code39', 'code128']}}
                    onBarcodeScanned={(scanningResult) => {
                        //console.log(scanningResult.data.length)
                        if (scanningResult.data.length === 53) {
                            handleScan(scanningResult.data)
                        }
                    }}
                >
                    <View style={Styles.cameraButtonContainer}>
                        <TouchableOpacity style={Styles.cameraButton} onPress={() => { setCameraState(false) }}>
                            <Button 
                                title="Use Manual Input Instead"
                                color="#5A0CB5"
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
                    <Text style={[Styles.h4]}><Text style={{ color: "white", fontWeight: "bold" }}>Enter Patient MRN</Text></Text>
                    <TextInput
                        style={[Styles.input]}
                        onChangeText={onChangeText}
                        value={text}
                        keyboardType="number-pad"
                        maxLength = {9}
                    ></TextInput>
                    <View style={[Styles.buttonRow]}>
                        <Button title="scan instead" color="#5A0CB5" onPress={() => { setCameraState(true) }}></Button>
                        <View style={{flex:.6}}></View>
                        <Button
                            title="confirm"
                            color="green"
                            onPress={() => confirmInput()}
                            disabled={text.length < 9 }
                        ></Button>
                    </View>
                </View>
            </View>
        );
    }

}

export default CameraScanScreen;
