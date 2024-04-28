import { useContext } from "react";
import { ActivityIndicator, Switch, Text, View } from "react-native";
import Styles from "../../styles/main";

import BluetoothManagerContext from "../BluetoothManagerContext";

function SettingsScreen() {
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
                { alignItems: "flex-start", justifyContent: "flex-start", padding: Styles.consts.gapIncrement * 2 }
            ]}
        >
            <Text style={[Styles.h6, { fontWeight: "bold" }]}>Application settings</Text>
            <Switch />
            <Text style={[Styles.h6, { fontWeight: "bold" }]}>Debug information and options</Text>
        </View>
    );
}

export default SettingsScreen;
