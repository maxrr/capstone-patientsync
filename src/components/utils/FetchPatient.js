const RETRY_LIMIT = 10;

export async function fetchPatient(mrn, placeholderOnProfileNotFound = false, retry = 0, lastErr = null) {
    // fetch to database for provided MRN
    if (retry > RETRY_LIMIT) {
        throw new Error(
            `Fetching patient information failed after ${retry} retries, last error:`,
            lastErr?.text ?? lastErr?.message ?? lastErr
        );
    } else {
        try {
            const resp = await fetch(`http://vpn.rountree.me:6969/getPatientInfo?mrn=${mrn}`);
            const fetchedInfo = await resp.json();
            if (fetchedInfo.msg) {
                throw new SyntaxError(`Patient not found: there exists no patient with the MRN: ${mrn}`);
            }

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
                return fetchPatient(
                    mrn,
                    placeholderOnProfileNotFound,
                    retry + 1,
                    new Error("fetchedInfo did not contain all required fields.")
                );
            }
        } catch (err) {
            if (!(err instanceof SyntaxError)) {
                console.error(err);
                return fetchPatient(mrn, placeholderOnProfileNotFound, retry + 1, err);
            } else {
                if (placeholderOnProfileNotFound) {
                    return {
                        first: "Unknown",
                        last: "Unknown",
                        mrn: mrn,
                        visit: "Unknown",
                        dob: "Unknown"
                    };
                } else {
                    throw err;
                }
            }
        }
    }
}
