import { useEffect, useRef, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import Styles from "../styles/main";
import MainMenuScreen from "./screens/MainMenuScreen";
import DeviceSelectScreen from "./screens/DeviceSelectScreen";
import CameraScanScreen from "./screens/CameraScanScreen";
import ConnectedDevicesScreen from "./screens/ConnectedDevicesScreen";
import PatientSelectScreen from "./screens/PatientSelectScreen";
import PatientConfirmScreen from "./screens/PatientConfirmScreen";
import LinkConfirmScreen from "./screens/LinkConfirmScreen";
import LinkCompleteScreen from "./screens/LinkCompleteScreen";
import LoadingScreen from "./screens/LoadingScreen";
import PatientConfirmOverrideScreen from "./screens/PatientConfirmOverrideScreen";

import PatientContext, { CONTEXT_PATIENT_DEFAULT_VALUE } from "./PatientContext";
import BluetoothManagerContext from "./BluetoothManagerContext";
import CurrentFlowSettingsContext from "./CurrentFlowSettingsContext";

import { BLE_MGR_STATE_SEARCHING, BLE_MGR_STATE_OFFLINE } from "./comps/BleMgrConfig";
import SettingsScreen from "./screens/SettingsScreen";

const Stack = createNativeStackNavigator();
export default function ConnectPlusApp({
    bluetoothDevices,
    bluetoothConnectingDevice,
    bluetoothConnectedDevice,
    bluetoothInitialize,
    bluetoothStartScan,
    bluetoothStopScan,
    bluetoothRemoveListeners,
    bluetoothManagerState,
    bluetoothManagerGetImmediateState,
    bluetoothConnectToDevice,
    bluetoothDisconnectFromDevice,
    bluetoothPerformSyncWithDevice,
    bluetoothResetSeenDevices
}) {
    // Context for current patient & device info
    const [patientInfo, setPatientInfo] = useState(CONTEXT_PATIENT_DEFAULT_VALUE);
    const [deviceInfo, setDeviceInfo] = useState(null);

    useEffect(() => {
        bluetoothInitialize();
        return () => {
            if (bluetoothManagerState == BLE_MGR_STATE_SEARCHING) bluetoothStopScan();
            bluetoothRemoveListeners();
        };
    }, []);

    const currentFlowSettingsDefault = {
        linkingStepper: false,
        showOverrides: false
    };

    // Context for current flow settings
    const currentFlowSettings = useRef(currentFlowSettingsDefault);
    const [dummyState, setDummyState] = useState(false);

    const getCurrentFlowSettings = () => {
        return currentFlowSettings.current;
    };

    const setCurrentFlowSettings = (n) => {
        // console.debug("[DEBUG] setCurrentFlowSettings:", n);
        if (n == null) {
            setCurrentFlowSettings(currentFlowSettingsDefault);
        } else if (typeof n == "function") {
            const ret = n(currentFlowSettings.current);
            currentFlowSettings.current = ret;
            // console.log("[DEBUG] setCurrentFlowSettings func ret:", ret);
        } else {
            currentFlowSettings.current = n;
        }
        setDummyState((a) => !a);
    };

    const BleContextProviderVal = {
        bluetoothDevices,
        bluetoothConnectingDevice,
        bluetoothConnectedDevice,
        bluetoothStartScan,
        bluetoothStopScan,
        bluetoothManagerState,
        bluetoothManagerGetImmediateState,
        bluetoothConnectToDevice,
        bluetoothDisconnectFromDevice,
        bluetoothPerformSyncWithDevice,
        bluetoothResetSeenDevices
    };

    if (bluetoothManagerState == BLE_MGR_STATE_OFFLINE) {
        return (
            <BluetoothManagerContext.Provider value={BleContextProviderVal}>
                <LoadingScreen />
            </BluetoothManagerContext.Provider>
        );
    }

    return (
        <NavigationContainer>
            <BluetoothManagerContext.Provider value={BleContextProviderVal}>
                <CurrentFlowSettingsContext.Provider value={[getCurrentFlowSettings, setCurrentFlowSettings]}>
                    <PatientContext.Provider value={[patientInfo, setPatientInfo]}>
                        {/* <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#eee" }, headerTitle: "" }}> */}
                        <Stack.Navigator id="mainNavigator" screenOptions={{ headerStyle: { backgroundColor: "#eee" } }}>
                            {/* `name`d these screens below with their corresponding Figma screen name, feel free to change ~mr */}
                            {/* Also, feel free to change order AND feel free to consolidate these screens into one each (ie. one per "step") ~mr */}
                            <Stack.Screen
                                name="Home"
                                options={{
                                    headerShown: true,
                                    headerStyle: { backgroundColor: Styles.colors.Background },
                                    headerTitle: "",
                                    headerShadowVisible: false
                                }}
                                component={MainMenuScreen}
                            />
                            <Stack.Screen
                                name="Device Select"
                                options={Styles.screenSkeleton}
                                component={DeviceSelectScreen}
                            />
                            <Stack.Screen
                                name="Device Details"
                                options={Styles.screenSkeleton}
                                component={ConnectedDevicesScreen}
                            />
                            <Stack.Screen
                                name="Enter Patient Info"
                                options={Styles.screenSkeleton}
                                component={PatientSelectScreen}
                            />
                            <Stack.Screen name="Scan Barcode" options={Styles.screenSkeleton} component={CameraScanScreen} />
                            <Stack.Screen
                                name="Confirm Patient"
                                options={Styles.screenSkeleton}
                                component={PatientConfirmScreen}
                            />
                            <Stack.Screen
                                name="Confirm Link"
                                options={Styles.screenSkeleton}
                                component={LinkConfirmScreen}
                            />

                            {/* I renamed this page from "Link Successsful" to "Link Complete", because it may not be a success */}
                            <Stack.Screen
                                name="Link Complete"
                                options={Styles.screenSkeleton}
                                component={LinkCompleteScreen}
                            />

                            {/*Override Screens */}
                            <Stack.Screen
                                name="Confirm Override Patient"
                                options={Styles.screenSkeleton}
                                component={PatientConfirmOverrideScreen}
                            />

                            <Stack.Screen
                                name="Settings"
                                options={{ headerBackTitle: "Back", headerTitleAlign: "center" }}
                                component={SettingsScreen}
                            />
                        </Stack.Navigator>
                    </PatientContext.Provider>
                </CurrentFlowSettingsContext.Provider>
            </BluetoothManagerContext.Provider>
        </NavigationContainer>
    );
}
