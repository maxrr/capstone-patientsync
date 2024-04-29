import { Pressable, Text, ActivityIndicator } from "react-native";
import Styles from "../../styles/main";

const placeholderProfile = {
    first: "FIRST",
    last: "LAST",
    mrn: "500000005",
    visit: "10001",
    dob: "01/01/0000"
};

function PatientInfoPane({ profile = placeholderProfile, onPress = () => {}, style = {}, loading = false }) {
    if (profile == null) profile = placeholderProfile;
    const { first, last, mrn, visit, dob } = profile;
    return loading ? (
        <ActivityIndicator />
    ) : (
        <Pressable key={mrn} style={[Styles.deviceSelectButton, style]} onPress={onPress}>
            <Text
                style={[
                    Styles.deviceSelectButton,
                    Styles.deviceSelectButtonText,
                    { backgroundColor: Styles.colors.GEPurple }
                ]}
            >
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                    {last}, {first}
                </Text>
                {"\n"}
                <Text>
                    <Text style={[{ fontWeight: "bold" }]}>Visit #: </Text>
                    {visit}
                </Text>
                {"\n"}
                <Text>
                    <Text style={[{ fontWeight: "bold" }]}>MRN: </Text>
                    {mrn}
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
