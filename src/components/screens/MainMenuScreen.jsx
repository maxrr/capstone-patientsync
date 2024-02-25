import { StyleSheet, Text, View } from "react-native";
// import MainStyles from "../../styles/main";
// const styles = StyleSheet.create(MainStyles);

function MainMenuScreen(props) {
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, marginTop: -100 }}>Welcome</Text>
            <Text style={{ width: "60%", textAlign: "center" }}>To begin, select an action</Text>
        </View>
    );
}

export default MainMenuScreen;
