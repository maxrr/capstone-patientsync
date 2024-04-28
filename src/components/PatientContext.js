import { createContext } from "react";

export const CONTEXT_PATIENT_DEFAULT_VALUE = {
    // newPatient: {
    //     first: undefined,
    //     last: undefined,
    //     dob: undefined,
    //     mrn: undefined,
    //     visit: undefined
    // },
    // existingPatient: {
    //     first: undefined,
    //     last: undefined,
    //     dob: undefined,
    //     mrn: undefined,
    //     visit: undefined
    // }
    first: undefined,
    last: undefined,
    dob: undefined,
    mrn: undefined,
    visit: undefined
};

// Context used to keep track of current user preferences
const PatientContext = createContext(CONTEXT_PATIENT_DEFAULT_VALUE);

export default PatientContext;
