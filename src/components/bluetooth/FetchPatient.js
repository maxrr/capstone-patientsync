const RETRY_LIMIT = 10;

export async function fetchPatient(mrn, retry = 0) {
    // fetch to database for provided MRN
    if (retry > RETRY_LIMIT) {
        throw new Error(`Fetching patient information failed after ${retry} retries.`);
    } else {
        try {
            const resp = await fetch(`http://vpn.rountree.me:6969/getPatientInfo?mrn=${mrn}`);
            const fetchedInfo = await resp.json();
            if (
                fetchedInfo &&
                fetchedInfo.first &&
                fetchedInfo.last &&
                fetchedInfo.visit &&
                fetchedInfo.month &&
                fetchedInfo.day &&
                fetchedInfo.year
            ) {
                const devicePatient = {
                    first: fetchedInfo.first.trim(),
                    last: fetchedInfo.last.trim(),
                    mrn: mrn,
                    visit: fetchedInfo.visit.trim(),
                    dob: fetchedInfo.month + "/" + fetchedInfo.day + "/" + fetchedInfo.year
                };
                return devicePatient;
            } else {
                // throw new Error("Retrieving patient data from MRN failed");
                console.error("fetchedInfo did not contain all required fields:", fetchedInfo);
                return fetchPatient(mrn, retry + 1);
            }
        } catch (err) {
            console.error(err);
            return fetchPatient(mrn, retry + 1);
        }
    }
}
