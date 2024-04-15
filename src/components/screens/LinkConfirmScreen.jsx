import { Button, Text, View } from "react-native";
import Styles from "../../styles/main";
import PatientContext from "../PatientContext";
import DeviceContext from "../DeviceContext";
import { useContext } from "react";
import { useRoute } from "@react-navigation/native";
import Stepper from "../comps/Stepper";

function LinkConfirmScreen({ navigation }) {

    const route = useRoute();
    const { isUnlinking } = route.params || { isUnlinking: false };
    const [info, setInfo] = useContext(PatientContext);
    const [deviceInfo, setDeviceInfo] = useContext(DeviceContext);

    //if unlinking, then don't have MRN and just use the patient profile we generated as an example last month
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
        <View style={[Styles.container]}>
            <Text style={[Styles.h4]}><Text style={{color: "white", fontWeight: "bold"}}>{isUnlinking ? "Unlink" : "Link"}</Text></Text>
            <Text style={[Styles.h6]}>{isUnlinking ? "Ready to unlink?" : "Ready to link?"}</Text>

            <View style={{ height: 30 }}></View>

            <Stepper step={3}/>

            <View style={{ height: 30 }}></View>

            {/* <Text style={[Styles.h3]}>
                {patientProfile.lastName}, {patientProfile.firstName}
            </Text>
            <Text style={[Styles.h5]}>{patientProfile.dob}</Text>
            <Text style={[Styles.h6]}>MRN: {patientProfile.mrn}</Text>
            <Text style={[Styles.h6]}>Visit number: {patientProfile.visitNumber}</Text> */}

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

            <View style={{ height: 30 }}></View>

            <Button title={isUnlinking ? "Unlink" : "Link"} onPress={() => navigation.push("Link Complete", {isUnlinking})} />
            <View style={{height: 50}}></View>
        </View>
    );
}

export default LinkConfirmScreen;
