import { TextInput } from "react-native";
import Styles from "../../styles/main";

function StyledTextInput({ style = {}, placeholder, onChangeText, value }) {
    return (
        <TextInput
            style={[Styles.input, { color: "#ddd" }, style]}
            placeholder={placeholder}
            placeholderTextColor={"#808080"}
            onChangeText={onChangeText}
            value={value}
        />
    );
}

export default StyledTextInput;
