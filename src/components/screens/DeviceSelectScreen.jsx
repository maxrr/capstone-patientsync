import { Text, View, Pressable, ScrollView } from "react-native";
import BleManager, {
    BleDisconnectPeripheralEvent,
    BleManagerDidUpdateValueForCharacteristicEvent,
    BleScanCallbackType,
    BleScanMatchMode,
    BleScanMode
} from "react-native-ble-manager";
import Styles from "../../styles/main";

const devices = [
    {
        name: "GECP2427170",
        room: "412A",
        screen: "Device Screen"
    },
    {
        name: "GECP2427171",
        room: "412A",
        screen: "Device Screen"
    },
    {
        name: "GECP2427172",
        room: "412A",
        screen: "Device Screen"
    },
    {
        name: "GECP2427173",
        room: "412A",
        screen: "Device Screen"
    },
    {
        name: "GECP2427174",
        room: "412A",
        screen: "Device Screen"
    },
    {
        name: "GECP2427175",
        room: "412A",
        screen: "Device Screen"
    },
    {
        name: "GECP2427176",
        room: "412A",
        screen: "Device Screen"
    },
    {
        name: "GECP2427177",
        room: "412A",
        screen: "Device Screen"
    },
    {
        name: "GECP2427178",
        room: "412A",
        screen: "Device Screen"
    },
    {
        name: "GECP2427179",
        room: "412A",
        screen: "Device Screen"
    },
    {
        name: "GECP2427180",
        room: "412A",
        screen: "Device Screen"
    },
    {
        name: "GECP2427181",
        room: "412A",
        screen: "Device Screen"
    }
];

function DeviceSelectScreen({ navigation }) {
    const [isScanning, setIsScanning] = useState(false);
    const [peripherals, setPeripherals] = useState(
        // new Map<Peripheral['id'], Peripheral>(),
        new Map()
    );

    return (
        <View style={[Styles.container, { paddingTop: 12, width: "100%" }]}>
            <Text style={[Styles.h4, Styles.underline]}>Device Select</Text>
            <Text style={[Styles.h6]}>Select a device to continue</Text>

            <ScrollView
                contentContainerStyle={{
                    paddingTop: Styles.consts.gapIncrement,
                    paddingLeft: Styles.consts.gapIncrement * 2,
                    paddingRight: Styles.consts.gapIncrement * 2,
                    gap: Styles.consts.gapIncrement,
                    width: "100%",
                    backgroundColor: "292A2B"
                }}
                style={{ width: "100%" }}
            >
                {/*Using pressable instead of button so we can design, react native is bad w/ natural buttons -DT */}
                {devices.map((a) => (
                    <Pressable key={a.name} style={Styles.deviceSelectButton} onPress={() => navigation.push(a.screen)}>
                        <Text
                            style={[
                                Styles.deviceSelectButton,
                                Styles.deviceSelectButtonText,
                                { backgroundColor: Styles.colors.GEPurple }
                            ]}
                        >
                            <Text style={[{ fontWeight: "bold" }]}>{a.name}</Text>
                            {"\n"}
                            {a.room}
                        </Text>
                    </Pressable>
                ))}

                <Text style={{ textAlign: "center", color: "white" }}>Scroll for more devices...</Text>
            </ScrollView>
        </View>
    );
}

export default DeviceSelectScreen;

/**
 * 
 * Added button from figma prototype (default case) 3/2/24 -DT
                <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
                    <Text
                        style={[
                            Styles.deviceSelectButton,
                            Styles.deviceSelectButtonText,
                            { backgroundColor: Styles.colors.GEPurple }
                        ]}
                    >
                        GECP3128689{"\n"}Room 413B
                    </Text>
                </Pressable>

                <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
                    <Text
                        style={[
                            Styles.deviceSelectButton,
                            Styles.deviceSelectButtonText,
                            { backgroundColor: Styles.colors.GEPurple }
                        ]}
                    >
                        GECP2309701(override case){"\n"}Room 311C
                    </Text>
                </Pressable>

                <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
                    <Text
                        style={[
                            Styles.deviceSelectButton,
                            Styles.deviceSelectButtonText,
                            { backgroundColor: Styles.colors.GEPurple }
                        ]}
                    >
                        GECP2309701(override case){"\n"}Room 311C
                    </Text>
                </Pressable>
                <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
                    <Text
                        style={[
                            Styles.deviceSelectButton,
                            Styles.deviceSelectButtonText,
                            { backgroundColor: Styles.colors.GEPurple }
                        ]}
                    >
                        GECP2309701(override case){"\n"}Room 311C
                    </Text>
                </Pressable>
                <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
                    <Text
                        style={[
                            Styles.deviceSelectButton,
                            Styles.deviceSelectButtonText,
                            { backgroundColor: Styles.colors.GEPurple }
                        ]}
                    >
                        GECP2309701(override case){"\n"}Room 311C
                    </Text>
                </Pressable>
                <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
                    <Text
                        style={[
                            Styles.deviceSelectButton,
                            Styles.deviceSelectButtonText,
                            { backgroundColor: Styles.colors.GEPurple }
                        ]}
                    >
                        GECP2309701(override case){"\n"}Room 311C
                    </Text>
                </Pressable>
                <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
                    <Text
                        style={[
                            Styles.deviceSelectButton,
                            Styles.deviceSelectButtonText,
                            { backgroundColor: Styles.colors.GEPurple }
                        ]}
                    >
                        GECP2309701(override case){"\n"}Room 311C
                    </Text>
                </Pressable>
                <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
                    <Text
                        style={[
                            Styles.deviceSelectButton,
                            Styles.deviceSelectButtonText,
                            { backgroundColor: Styles.colors.GEPurple }
                        ]}
                    >
                        GECP2309701(override case){"\n"}Room 311C
                    </Text>
                </Pressable>
                <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
                    <Text
                        style={[
                            Styles.deviceSelectButton,
                            Styles.deviceSelectButtonText,
                            { backgroundColor: Styles.colors.GEPurple }
                        ]}
                    >
                        GECP2309701(override case){"\n"}Room 311C
                    </Text>
                </Pressable>
                <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
                    <Text
                        style={[
                            Styles.deviceSelectButton,
                            Styles.deviceSelectButtonText,
                            { backgroundColor: Styles.colors.GEPurple }
                        ]}
                    >
                        GECP2309701(override case){"\n"}Room 311C
                    </Text>
                </Pressable>
                <Pressable style={Styles.deviceSelectButton} onPress={() => navigation.push("Device Screen")}>
                    <Text
                        style={[
                            Styles.deviceSelectButton,
                            Styles.deviceSelectButtonText,
                            { backgroundColor: Styles.colors.GEPurple }
                        ]}
                    >
                        GECP2309701(override case){"\n"}Room 311C
                    </Text>
                </Pressable>
 */
