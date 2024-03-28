import { useState } from "react";
import { View, ScrollView, Text, Button, ActivityIndicator } from "react-native";
import BLESelector from "../bluetooth/BLESelector";
import Styles from "../../styles/main";

function DeviceSelectScreen({ navigation }) {
    const [isScanning, setIsScanning] = useState(false);
    const [desiredScanState, setDesiredScanState] = useState(false);
    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.h4]}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Device Select</Text>
            </Text>
            <Text style={[Styles.h6]}>Select a device to continue</Text>

            <Button title={isScanning ? "Stop scan" : "Start scan"} onPress={() => setDesiredScanState(!isScanning)} />

            <ScrollView
                contentContainerStyle={{
                    paddingTop: Styles.consts.gapIncrement,
                    paddingLeft: Styles.consts.gapIncrement * 2,
                    paddingRight: Styles.consts.gapIncrement * 2,
                    gap: Styles.consts.gapIncrement,
                    backgroundColor: "292A2B",
                    paddingBottom: 50
                }}
                style={{ width: "100%" }}
            >
                <BLESelector {...{ isScanning, setIsScanning, desiredScanState, setDesiredScanState }} />
                {isScanning ? <ActivityIndicator animating={isScanning} /> : <></>}
                <Text style={{ textAlign: "center", color: "white" }}>Scroll for more devices...</Text>
            </ScrollView>
        </View>
    );
}

export default DeviceSelectScreen;
