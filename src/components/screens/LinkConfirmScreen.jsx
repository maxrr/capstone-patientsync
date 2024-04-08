import { Button, Text, View } from "react-native";
import Styles from "../../styles/main";
import PatientContext from "../PatientContext";
import DeviceContext from "../DeviceContext";
import { useContext } from "react";
import { useRoute } from "@react-navigation/native";

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

    
    const deviceList = [
        { name: "GECP2427170", room: "Room 412A", isOverride: false },
        { name: "GECP4167318", room: "Room 413B", isOverride: false },
        { name: "GECP9834313(patient connected)", room: "Room 311C", isOverride: true },
        { name: "GECP4934123(patient connected)", room: "Room 214A", isOverride: true },
        { name: "GECP3018493(patient connected)", room: "Room 104D", isOverride: true },
        { name: "GECP5813938(patient connected)", room: "Room 503C", isOverride: true },
        { name: "GECP6847242(patient connected)", room: "Room 204E", isOverride: true },
        { name: "GECP7892324(patient connected)", room: "Room 513B", isOverride: true },
        { name: "GECP9342422(patient connected)", room: "Room 321A", isOverride: true },
        { name: "GECP8432742(patient connected)", room: "Room 102F", isOverride: true },
        { name: "GECP1032338(patient connected)", room: "Room 401C", isOverride: true },
        { name: "GECP1238549(patient connected)", room: "Room 201A", isOverride: true }
    ];
    
    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.h4]}><Text style={{color: "white", fontWeight: "bold"}}>{isUnlinking ? "Unlink" : "Link"}</Text></Text>
            <Text style={[Styles.h6]}>{isUnlinking ? "Ready to unlink?" : "Ready to link?"}</Text>

            <View style={{ height: 30 }}></View>

            <View style={{ marginBottom: 6, display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}>
                <View style={{ width: 40, height: 40, backgroundColor: "green", borderRadius: 8 }} />
                <View style={{ width: 48, height: 4, backgroundColor: "green", borderRadius: 4 }} />
                <View style={{ width: 40, height: 40, backgroundColor: "green", borderRadius: 8 }} />
                <View style={{ width: 48, height: 4, backgroundColor: "green", borderRadius: 4 }} />
                <View style={{ width: 40, height: 40, backgroundColor: "white", borderRadius: 8 }} />
            </View>

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
