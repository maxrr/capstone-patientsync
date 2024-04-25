import { Text, View } from "react-native";
import Styles from "../../styles/main";
import Stepper from "./Stepper";

function LayoutSkeleton({ title = "", subtitle = "", stepper = 1, children }) {
    return (
        <>
            <Stepper step={stepper} />
            <Text style={[Styles.h4]}>
                <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>{title}</Text>
            </Text>
            {subtitle.length > 0 ? <Text style={[Styles.h6, { textAlign: "center" }]}>{subtitle}</Text> : <></>}

            <View style={{ marginVertical: Styles.gapIncrement }} />
            {children}
        </>
    );
}

export default LayoutSkeleton;
