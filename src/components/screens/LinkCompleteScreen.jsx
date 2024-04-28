import { Button, Text, View } from "react-native";
import Styles from "../../styles/main";
import PatientContext from "../PatientContext";
import DeviceContext from "../DeviceContext";
import { useContext } from "react";
import { useRoute } from "@react-navigation/native";
import Stepper from "../comps/Stepper";

function LinkCompleteScreen({ navigation }) {

    const [info, setInfo] = useContext(PatientContext);
    const [deviceInfo, setDeviceInfo] = useContext(DeviceContext);

    function returnHome() {
        navigation.popToTop()
        setInfo(null);
        setDeviceInfo(null);
    }

    const route = useRoute();
    const { isUnlinking } = route.params || { isUnlinking: false };


    //Must have hardcoded patient information when we are unlinking to display properly. We don't have the database set up to do
    //this otherwise, and obviously no info comes from scanning in this case so must be hardcoded for unlinking -DT
    const patientProfile = isUnlinking ? {
        // Hardcoded values for the unlink scenario
        firstName: "Ron",
        lastName: "Smith",
        mrn: "157849",
        visitNumber: "2163",
        dob: "03/14/1992"
    } : {
        firstName: info.first,
        lastName: info.last,
        mrn: info.mrn,
        visitNumber: info.visit,
        dob: info.month + "/" + info.day + "/" + info.year
    };
    
    return (
        // TODO: On this page, we shouldn't give the user any ability to move backwards ~mr

        <View style={[Styles.container]}>
            <Stepper step={4}/>
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

            <Text style={[Styles.h6]}>{isUnlinking ? "Unlinking Complete!" : "Link Complete!"}</Text>
            <Button title="Return home" onPress={() => returnHome()} />
            <View style={{height: 50}}></View>
        </View>
    );
}

export default LinkCompleteScreen;