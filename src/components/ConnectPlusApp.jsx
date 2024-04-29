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
import CurrentFlowSettingsContext, { CONTEXT_CURRENTFLOWSETTINGS_DEFAULT_VALUE } from "./CurrentFlowSettingsContext";

import { BLE_MGR_STATE_SEARCHING, BLE_MGR_STATE_OFFLINE } from "./comps/BleMgrConfig";

const Stack = createNativeStackNavigator();
export default function ConnectPlusApp({
    bluetoothDevices,
    bluetoothConnectingDevice,
    bluetoothConnectedDevice,
    bluetoothManagerIsScanning,
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
    // const [patientInfo, setPatientInfo] = useState(CONTEXT_PATIENT_DEFAULT_VALUE);
    const patientProfiles = useRef(CONTEXT_PATIENT_DEFAULT_VALUE);

    const getPatientProfiles = () => {
        return patientProfiles.current;
    };

    const setPatientProfiles = (n) => {
        if (n == null) {
            patientProfiles.current = CONTEXT_PATIENT_DEFAULT_VALUE;
        } else if (typeof n == "function") {
            const ret = n(getPatientProfiles());
            patientProfiles.current = {
                newPatient: ret?.newPatient ?? getPatientProfiles().newPatient,
                existingPatient: ret?.existingPatient ?? getPatientProfiles().existingPatient
            };
        } else {
            patientProfiles.current = {
                newPatient: n?.newPatient ?? getPatientProfiles().newPatient,
                existingPatient: n?.existingPatient ?? getPatientProfiles().existingPatient
            };
        }
        console.debug(`[setPatientProfiles] updated to:`, getPatientProfiles());
    };

    // Context for current flow settings
    const currentFlowSettings = useRef(CONTEXT_CURRENTFLOWSETTINGS_DEFAULT_VALUE);

    // Dummy state to trigger re-renders when currentFlowSettings changes (unsure if needed)
    // const [_, setDummyState] = useState(false);

    // Getter for currentFlowSettings
    const getCurrentFlowSettings = () => {
        return currentFlowSettings.current;
    };

    // Wrapper to upadte currentFlowSettings; only allows setting attributes defined in `CONTEXT_CURRENTFLOWSETTINGS_DEFAULT_VALUE`
    const setCurrentFlowSettings = (n) => {
        if (n == null) {
            currentFlowSettings.current = CONTEXT_CURRENTFLOWSETTINGS_DEFAULT_VALUE;
        } else if (typeof n == "function") {
            const ret = n(getCurrentFlowSettings());
            currentFlowSettings.current = {
                flowType: ret?.flowType ?? getCurrentFlowSettings().flowType,
                areOverridingPatient: ret?.areOverridingPatient ?? getCurrentFlowSettings().areOverridingPatient
            };
        } else {
            currentFlowSettings.current = {
                flowType: n?.flowType ?? getCurrentFlowSettings().flowType,
                areOverridingPatient: n?.areOverridingPatient ?? getCurrentFlowSettings().areOverridingPatient
            };
        }
        console.debug(`[setCurrentFlowSettings] updated to:`, getCurrentFlowSettings());
        // setDummyState((a) => !a);
    };

    const BleContextProviderVal = {
        bluetoothDevices,
        bluetoothConnectingDevice,
        bluetoothConnectedDevice,
        bluetoothManagerIsScanning,
        bluetoothStartScan,
        bluetoothStopScan,
        bluetoothManagerState,
        bluetoothManagerGetImmediateState,
        bluetoothConnectToDevice,
        bluetoothDisconnectFromDevice,
        bluetoothPerformSyncWithDevice,
        bluetoothResetSeenDevices
    };

    // Stop scanning and remove listeners when app is unmounted
    useEffect(() => {
        // Initialize our Bluetooth manager on launch
        bluetoothInitialize();
        return () => {
            if (bluetoothManagerState == BLE_MGR_STATE_SEARCHING) bluetoothStopScan();
            bluetoothRemoveListeners();
        };
    }, []);

    // Render loading screen if the Bluetooth Manager hasn't yet initialized
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
                    <PatientContext.Provider value={[getPatientProfiles, setPatientProfiles]}>
                        {/* <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#eee" }, headerTitle: "" }}> */}
                        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#eee" } }}>
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

                            {/* <Stack.Screen
                                name="Settings"
                                options={{ headerBackTitle: "Back", headerTitleAlign: "center" }}
                                component={SettingsScreen}
                            /> */}
                        </Stack.Navigator>
                    </PatientContext.Provider>
                </CurrentFlowSettingsContext.Provider>
            </BluetoothManagerContext.Provider>
        </NavigationContainer>
    );
}
