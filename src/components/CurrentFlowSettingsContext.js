import { createContext } from "react";

export const CONTEXT_CURRENTFLOWSETTINGS_LINKING = 0x0;
export const CONTEXT_CURRENTFLOWSETTINGS_UNLINKING = 0x1;
export const CONTEXT_CURRENTFLOWSETTINGS_LINKING_NOT_CHOSEN = 0xf;

export const CONTEXT_CURRENTFLOWSETTINGS_DEFAULT_VALUE = {
    flowType: CONTEXT_CURRENTFLOWSETTINGS_LINKING_NOT_CHOSEN, // enum above
    areOverridingPatient: false // bool
};

// Context used to keep track of current user preferences
const CurrentFlowSettingsContext = createContext(CONTEXT_CURRENTFLOWSETTINGS_DEFAULT_VALUE);

export default CurrentFlowSettingsContext;
