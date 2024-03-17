import { Button, Text, View } from "react-native";
import Styles from "../../styles/main";

function LinkConfirmScreen({ navigation }) {
    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.h4]}><Text style={{color: "white", fontWeight: "bold"}}>Link</Text></Text>
            <Text style={[Styles.h6]}>Ready to link?</Text>
            <Button title="Link" onPress={() => navigation.push("Link Complete")} />
            <View style={{height: 50}}></View>
        </View>
    );
}

export default LinkConfirmScreen;
