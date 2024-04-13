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
import PatientConfirmOverrideScreen from "./screens/PatientConfirmOverrideScreen";
import PatientContext from "./PatientContext";
import { useState } from "react";

const Stack = createNativeStackNavigator();
export default function ConnectPlusApp(props) {
    // Context for current patient info
    const [info, setInfo] = useState(null);

    return (
        // Maybe we could use context stores to keep track of the selected patient and device, instead of having to do prop tunneling? ~mr
        <NavigationContainer>
            <PatientContext.Provider value={[info, setInfo]}>
                <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#FFF" } }}>
                    {/* `name`d these screens below with their corresponding Figma screen name, feel free to change ~mr */}
                    {/* Also, feel free to change order AND feel free to consolidate these screens into one each (ie. one per "step") ~mr */}
                    <Stack.Screen name="Home" options={{ headerShown: false }} component={MainMenuScreen} />
                    <Stack.Screen name="Device Select" options={Styles.screenSkeleton} component={DeviceSelectScreen} />
                    <Stack.Screen name="Device Screen" options={Styles.screenSkeleton} component={ConnectedDevicesScreen} />
                    <Stack.Screen
                        name="Enter Patient Info"
                        options={Styles.screenSkeleton}
                        component={PatientSelectScreen}
                    />
                    <Stack.Screen name="Scan Barcode" options={Styles.screenSkeleton} component={CameraScanScreen} />
                    <Stack.Screen name="Confirm Patient" options={Styles.screenSkeleton} component={PatientConfirmScreen} />
                    <Stack.Screen name="Confirm Link" options={Styles.screenSkeleton} component={LinkConfirmScreen} />

                    {/* I renamed this page from "Link Successsful" to "Link Complete", because it may not be a success */}
                    <Stack.Screen name="Link Complete" options={Styles.screenSkeleton} component={LinkCompleteScreen} />

                    {/*Override Screens */}
                    <Stack.Screen
                        name="Confirm Override Patient"
                        options={Styles.screenSkeleton}
                        component={PatientConfirmOverrideScreen}
                    />
                </Stack.Navigator>
            </PatientContext.Provider>
        </NavigationContainer>
    );
}
