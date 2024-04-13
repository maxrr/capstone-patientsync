import { Button, Text, View } from "react-native";
import Styles from "../../styles/main";
import PatientContext from "../PatientContext";
import DeviceContext from "../DeviceContext";
import { useContext } from "react";

function LinkCompleteScreen({ navigation }) {

    const [info, setInfo] = useContext(PatientContext);
    const [deviceInfo, setDeviceInfo] = useContext(DeviceContext);

    function returnHome() {
        navigation.popToTop()
        setInfo(null);
        setDeviceInfo(null);
    }

    const patientProfile = {
        firstName: info.first,
        lastName: info.last,
        mrn: info.mrn,
        visitNumber: info.visit,
        dob: info.month + "/" + info.day + "/" + info.year
    };

    return (
        // TODO: On this page, we shouldn't give the user any ability to move backwards ~mr

        <View style={[Styles.container]}>
            <View style={{ marginBottom: 6, display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}>
                <View style={{ width: 40, height: 40, backgroundColor: "green", borderRadius: 8 }} />
                <View style={{ width: 48, height: 4, backgroundColor: "green", borderRadius: 4 }} />
                <View style={{ width: 40, height: 40, backgroundColor: "green", borderRadius: 8 }} />
                <View style={{ width: 48, height: 4, backgroundColor: "green", borderRadius: 4 }} />
                <View style={{ width: 40, height: 40, backgroundColor: "green", borderRadius: 8 }} />
            </View>
            <Text style={[Styles.h4]}><Text style={{color: "white", fontWeight: "bold"}}>Success</Text></Text>

            <View style={Styles.deviceSelectButton}>
                <Text
                    style={[
                        Styles.deviceSelectButton,
                        Styles.deviceSelectButtonText,
                        { backgroundColor: Styles.colors.GEPurple }
                    ]}
                >
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>{"Patient:         " + patientProfile.lastName + ", " + patientProfile.firstName}</Text>
                    {"\n"}
                    {"MRN:                        " + patientProfile.mrn}
                </Text>
            </View>

            <View style={Styles.deviceSelectButton}>
                <Text
                    style={[
                        Styles.deviceSelectButton,
                        Styles.deviceSelectButtonText,
                        { backgroundColor: Styles.colors.GEPurple }
                    ]}
                >
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>{deviceInfo.name}</Text>
                    {"\n"}
                    {deviceInfo.room}
                </Text>
            </View>

            <Text style={[Styles.h6]}>Link complete!</Text>
            <Button title="Return home" onPress={() => returnHome()} />
            <View style={{height: 50}}></View>
        </View>
    );
}

export default LinkCompleteScreen;
