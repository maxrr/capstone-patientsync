export function parseBarcodeData(data) {
    dataArray = data.split(";");

    let year;
    let month;

    // format year
    if (parseInt(dataArray[4][0]) > 0) {
        year = parseInt("1" + dataArray[4]);
    } else {
        year = parseInt("2" + dataArray[4]);
    }

    // format month
    // months are encoded from 0-B with 0 being Jan and B being December
    if (dataArray[5] === "A") {
        month = 11;
    } else if (dataArray[5] === "B") {
        month = 12;
    } else {
        month = parseInt(dataArray[5]) + 1;
    }

    // create patient object with appropriate information
    const patient = {
        mrn: dataArray[0].trim(),
        visit: dataArray[1].trim(),
        first: dataArray[2].trim(),
        last: dataArray[3].trim(),
        dob: month + "/" + dataArray[6] + "/" + year
    };

    return patient;
}
