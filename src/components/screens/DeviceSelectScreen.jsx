import { Text, View, Button, Pressable, ScrollView, TextInput } from "react-native";
import Styles from "../../styles/main";
import { useState } from "react";

function DeviceSelectScreen({ navigation }) {
    //use state variable to keep track of what is being searched
    const [currSearch, setCurrSearch] = useState('');

    //Completely changing how this was done, before it was a lot of hardcoded buttons, now going to map
    //and then filter them based on search use state. Could use ? visibility for each button but that seems
    //a lot worse than this imo -dt
    //All hardcoded as of right now.
    const deviceList = [
        {name: 'GECP2427170', room: 'Room 412A', isOverride: false },
        {name: 'GECP4167318', room: 'Room 413B', isOverride: false },
        {name: 'GECP9834313(override case)', room: 'Room 311C', isOverride: true},
        {name: 'GECP4934123(override case)', room: 'Room 214A', isOverride: true},
        {name: 'GECP3018493(override case)', room: 'Room 104D', isOverride: true},
        {name: 'GECP5813938(override case)', room: 'Room 503C', isOverride: true},
        {name: 'GECP6847242(override case)', room: 'Room 204E', isOverride: true},
        {name: 'GECP7892324(override case)', room: 'Room 513B', isOverride: true},
        {name: 'GECP9342422(override case)', room: 'Room 321A', isOverride: true},
        {name: 'GECP8432742(override case)', room: 'Room 102F', isOverride: true},
        {name: 'GECP1032338(override case)', room: 'Room 401C', isOverride: true},
        {name: 'GECP1238549(override case)', room: 'Room 201A', isOverride: true}
        
    ]

    //searched devices is a list of devices which have been filtered based on what is typed
    //casted everything to lowercase so none of this is case sensitive -dt note 3/17/24 change
    const searchedDevices = deviceList.filter(device => device.name.toLowerCase().includes(currSearch.toLowerCase()))

    return (
        <View style={[Styles.container]}>
            <Text style={[Styles.h4]}><Text style={{color: "white", fontWeight: "bold"}}>Device Select</Text></Text>
            <Text style={[Styles.h6]}>Select a device to continue</Text>

            {/* Added searchbar to search through connectplus devices -dt 3/17/2024 change */}
            <TextInput
                style={[Styles.input]}
                placeholder="type here to search"
                placeholderTextColor={"#808080"}
                onChangeText={setCurrSearch}
                value={currSearch}
            />

            <ScrollView 
                contentContainerStyle={{
                    gap: Styles.consts.gapIncrement,
                    backgroundColor: "292A2B",
                    paddingBottom: 50
                }}
            >
                {searchedDevices.map((device) => (
                    <Pressable 
                        key={device.name}
                        style={Styles.deviceSelectButton}
                        onPress={() => navigation.push("Device Screen", { isOverride: device.isOverride || false })}
                    >
                        <Text style={[Styles.deviceSelectButton, Styles.deviceSelectButtonText, { backgroundColor: Styles.colors.GEPurple }]}>
                            <Text style={{ fontWeight: "bold", fontSize: 16 }}>{device.name}</Text>{"\n"}{device.room}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

        </View>
    );
}

export default DeviceSelectScreen;
