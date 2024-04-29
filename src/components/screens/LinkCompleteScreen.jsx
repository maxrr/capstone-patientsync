import { useContext } from "react";
import { Text } from "react-native";
// import { useRoute } from "@react-navigation/native";

import Styles from "../../styles/main";
import PatientContext from "../PatientContext";
import CurrentFlowSettingsContext, {
    CONTEXT_CURRENTFLOWSETTINGS_LINKING,
    CONTEXT_CURRENTFLOWSETTINGS_UNLINKING
} from "../CurrentFlowSettingsContext";

import UniformPageWrapper from "../comps/UniformPageWrapper";
import LayoutSkeleton from "../comps/LayoutSkeleton";
import PatientInfoPane from "../comps/PatientInfoPane";
import DeviceInfoPane from "../comps/DeviceInfoPane";
import LabeledIconButton from "../comps/LabeledIconButton";

function LinkCompleteScreen({ navigation, route }) {
    const { lastConnectedDeviceInfo } = route.params;
    const [getPatientProfiles, setPatientProfiles] = useContext(PatientContext);
    const { newPatient, existingPatient } = getPatientProfiles();

    const [getCurrentFlowSettings, setCurrentFlowSettings] = useContext(CurrentFlowSettingsContext);
    const { flowType, areOverridingPatient } = getCurrentFlowSettings();

    function returnHome() {
        setCurrentFlowSettings(null);
        setPatientProfiles(null);
        navigation.popToTop();
    }

    return (
        <UniformPageWrapper centerContent={false}>
            <LayoutSkeleton
                title="Success"
                subtitle={flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING ? "Unlinking Complete!" : "Link Complete!"}
                stepper={4}
            >
                <Text style={{ color: Styles.colors.TextColor }}>
                    You have {flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING ? "un" : ""}linked the following patient:
                </Text>
                <PatientInfoPane
                    profile={flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING ? existingPatient : newPatient}
                />
                <Text style={{ color: Styles.colors.TextColor }}>
                    {flowType == CONTEXT_CURRENTFLOWSETTINGS_UNLINKING ? "from" : "to"} the following Connect+ device:
                </Text>
                <DeviceInfoPane
                    device={lastConnectedDeviceInfo}
                    showOverrides={!areOverridingPatient || flowType == CONTEXT_CURRENTFLOWSETTINGS_LINKING}
                    detailed={flowType == CONTEXT_CURRENTFLOWSETTINGS_LINKING}
                    profile={flowType == CONTEXT_CURRENTFLOWSETTINGS_LINKING ? newPatient : null}
                />
                {flowType == CONTEXT_CURRENTFLOWSETTINGS_LINKING && areOverridingPatient ? (
                    <>
                        <Text style={{ color: Styles.colors.TextColor }}>This action unlinked the following user:</Text>
                        <PatientInfoPane profile={existingPatient} />
                    </>
                ) : (
                    <></>
                )}

                <LabeledIconButton
                    text="Return home"
                    icon="home"
                    onPress={returnHome}
                    style={{ marginTop: Styles.consts.gapIncrement, backgroundColor: "green" }}
                />
            </LayoutSkeleton>
        </UniformPageWrapper>
    );
}

export default LinkCompleteScreen;
