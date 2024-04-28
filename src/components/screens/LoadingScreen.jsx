import { useContext } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Styles from "../../styles/main";

import BluetoothManagerContext from "../BluetoothManagerContext";

function LoadingScreen() {
    const {
        bluetoothDevices,
        bluetoothConnectingDevice,
        bluetoothConnectedDevice,
        bluetoothStartScan,
        bluetoothStopScan,
        bluetoothManagerState,
        bluetoothConnectToDevice,
        bluetoothDisconnectFromDevice,
        bluetoothResetSeenDevices
    } = useContext(BluetoothManagerContext);

    return (
        <View
            style={[
                Styles.container,
                {
                    backgroundColor: Styles.colors.GEPurple
                }
            ]}
        >
            <Text style={[Styles.h3, { textAlign: "center", fontWeight: "bold" }]}>GE PatientSync</Text>
            <Text style={[Styles.h3, { fontSize: 16, marginTop: -10 }]}>version 0.4</Text>

            <ActivityIndicator animating={true} style={{ marginTop: 240 }} />
            <Text style={[Styles.h6, { textAlign: "center" }]}>Starting Bluetooth manager...</Text>
        </View>
    );
}

export default LoadingScreen;
