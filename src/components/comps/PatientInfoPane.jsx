import { Pressable, Text, ActivityIndicator, View } from "react-native";
import Styles from "../../styles/main";
import { FontAwesome } from "@expo/vector-icons";

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
                <Text style={{ fontSize: 20, color: "white" }}>
                    <FontAwesome name="user" size={20} color="white" style={{ width: "auto", marginRight: 8 }} />{" "}
                    <Text style={{ fontWeight: "bold" }}>
                        {last}, {first}
                    </Text>{" "}
                    ({dob})
                    {/* {": "}
                    {mrn} */}
                </Text>
                {/* {"\n"} */}
                {/* <Text>
                    <Text style={[{ fontWeight: "bold" }]}>Visit #: </Text>
                    {visit}
                </Text> */}
                {/* {"\n"}
                <Text>
                    <Text style={[{ fontWeight: "bold" }]}>MRN: </Text>
                    {mrn}
                </Text> */}
                {"\n"}
                <Text style={{ fontSize: 18 }}>
                    <Text style={[{ fontWeight: "bold" }]}>MRN: </Text>
                    {mrn}
                </Text>
                {"\n"}
                <Text style={{ fontSize: 18 }}>
                    <Text style={[{ fontWeight: "bold" }]}>VST: </Text>
                    {visit}
                </Text>
                {/* {"\n"}
                {dob} */}
            </Text>
        </Pressable>
    );
}

export default PatientInfoPane;
