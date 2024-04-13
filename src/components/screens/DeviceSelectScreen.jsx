import { useState, useCallback, useEffect } from "react";
import { View, ScrollView, Text, Button, ActivityIndicator, SafeAreaView, RefreshControl } from "react-native";
import BLESelector from "../bluetooth/BLESelector";
import Styles from "../../styles/main";
import { useState } from "react";
import DeviceContext from "../DeviceContext";
import { useContext } from "react";
import Stepper from "../comps/Stepper";

function DeviceSelectScreen({ navigation }) {
    // FIXME: Sometimes this screen doesn't start as scanning, very annoying
    const [refreshing, setRefreshing] = useState(false);
    const [isScanning, setIsScanning] = useState(true);

    const onRefresh = () => {
        setRefreshing(true);
        setIsScanning(true);
    };

    useEffect(() => {
        if (!isScanning && refreshing) setRefreshing(false);
    }, [isScanning]);

    const confirmSelectedDevice = (data) => {
        navigation.push("Device Screen", {
            deviceData: data
        });
    };

    return (
        <SafeAreaView style={[Styles.container]}>
            {/* <ScrollView
                contentContainerStyle={[Styles.container]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            > */}
            {/* FIXME: `refreshControl`, as seen above, does not allow scrolling back upwards when not refreshing */}
            <ScrollView contentContainerStyle={[Styles.container]}>
                <Button onPress={onRefresh} title={"Temporary refresh"} />
                <Text style={[Styles.h4]}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>Device Select</Text>
                </Text>
                <Text style={[Styles.h6]}>Select a device to continue</Text>

                {/* <Button title={isScanning ? "Stop scan" : "Start scan"} onPress={() => setDesiredScanState(!isScanning)} /> */}

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
                    <BLESelector {...{ isScanning, setIsScanning, confirmSelectedDevice }} />
                    {isScanning ? <ActivityIndicator animating={isScanning} /> : <></>}
                    <Text style={{ textAlign: "center", color: "white" }}>Pull down to refresh...</Text>
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    );
}

export default DeviceSelectScreen;
