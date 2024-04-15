import { Pressable, Text } from "react-native";
import Styles from "../../styles/main";

function PatientInfoPane({ profile, onPress = () => {}, style = {} }) {
    const { firstName, lastName, mrn, visitNumber, dob } = profile;
    return (
        <Pressable key={mrn} style={[Styles.deviceSelectButton, style]} onPress={onPress}>
            <Text
                style={[
                    Styles.deviceSelectButton,
                    Styles.deviceSelectButtonText,
                    { backgroundColor: Styles.colors.GEPurple }
                ]}
            >
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                    {firstName} {lastName} ({mrn})
                </Text>
                {"\n"}
                <Text>
                    <Text style={[{ fontWeight: "bold" }]}>VISIT: </Text>
                    {visitNumber}
                </Text>
                {"\n"}
                <Text>
                    <Text style={[{ fontWeight: "bold" }]}>DOB: </Text>
                    {dob}
                </Text>
            </Text>
        </Pressable>
    );
}

export default PatientInfoPane;
