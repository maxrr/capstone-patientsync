import json
from flask import Flask, request, jsonify

app = Flask(__name__)

f = open("patients.json")
patientsData = json.load(f)

# get info of patient
@app.route("/getPatientInfo", methods=["GET"])
def getPatientInfo():
    mrn: str = request.args.get("mrn")

    if len(mrn) != 9:
        return jsonify({"msg": f"Invalid MRN {mrn}.\nThe MRN must be 9 digits"}), 400

    if mrn not in patientsData:
        return jsonify({"msg": f"No matching patient with MRN {mrn}"}), 400

    return jsonify(patientsData[mrn]), 200


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=6969)
