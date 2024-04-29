import { createContext } from "react";

/**
 * Patient profile format:
 * {
 *      first: first name,                         string,
 *      last:  last name,                          string,
 *      dob:   date of birth in MM/DD/YYYY format, string,
 *      mrn:   medical record number,              string,
 *      visit: visit number,                       string
 * }
 */

export const CONTEXT_PATIENT_DEFAULT_VALUE = {
    newPatient: null,
    existingPatient: null
};

// Context used to keep track of current user preferences
const PatientContext = createContext(CONTEXT_PATIENT_DEFAULT_VALUE);

export default PatientContext;
