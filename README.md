# CS 639 — GE Healthcare: Patient Device Association "PatientSync"

An app that aims to allow nurses to quickly and easily associate a patient with a GE Connect+ device.

> [!NOTE]
> This document will outline the basic steps on how to get the project running. These instructions were written under the assumption that you are using a Windows 10 or 11 device to host the Expo server and the placeholder Bluetooth devices, and using a separate Linux (or WSL) machine to run the placeholder backend, but this is not the only option available. All components (with the exception of Zadig, which is only used to manage drivers when using a real Android device) are compatible with macOS and Linux, but you'll need to adapt the instructions slightly.

This project was initially created using [expo](https://docs.expo.dev/tutorial/create-your-first-app/)'s `pnpx create-expo-app` with Node.js version 20.5.1, and npm version 9.8.0.

## Overview

This project contains three components:

1. Mobile app
    - Built using [React Native](https://reactnative.dev/)
    - Tested and demoed on Android 14, untested but *should* be buildable on iOS
    - Contents of this component are the majority of this repository
2. Placeholder ("Fake") GE Connect+ device
    - Built in Python using Google's [bumble module](https://github.com/google/bumble)
3. Placeholder backend
    - Built using [Flask](https://flask.palletsprojects.com/en/3.0.x/#user-s-guide)

It is perfectly fine to host all three services on one machine, it is also okay to completely seperate them.

## Components

### Mobile App

- There are **two options** for running the app, complete steps for each option are listed below
- It is only necessary to complete the steps under the installation sections once per machine
- The mobile app's contents are the majority of the directories and loose files in this repository, excluding the `bumble_custom` and `flask_server` directories

### Placeholder / Fake GE Connect+ Device

> [!NOTE]
> Due to an apparent limitation of Google's [bumble module](https://github.com/google/bumble), it is only possible to launch one Placeholder GE Connect+ device per USB adapter using this implementation. If you choose to use the app inside of an Android Virtual Device, then you may launch several Placeholder GE Connect+ devices at once. If you'd like to launch more than once device, make sure to set the `LAUNCH_MULTIPLE_DEVICES` variable at the top of `bumble_custom/gehc_sample_devices.py` to `True`

- The files associated with the placeholder device(s) are located in the `bumble_custom` directory, with the exception of the two firmware (.bin) files floating free in the root folder of the repository
- There are also **two options** for launching this device, which directly map to your choice for how you plan to run the mobile app; the functionality of the device remains the same across options
- A sample configuration file for these devices is located at `bumble_custom/multiple_devices.json`
  - See also these sample configuration files from Bumble itself for more device-specific configuration options: [[1]](https://github.com/google/bumble/blob/main/examples/device1.json) [[2]](https://github.com/google/bumble/blob/main/examples/device2.json) [[3]](https://github.com/google/bumble/blob/main/examples/device3.json)
- The devices serve a simple [GATT](https://learn.adafruit.com/introduction-to-bluetooth-low-energy/gatt) server with a couple modifiable attributes
- The device does not support more than one simultaneous connection on purpose and does not currently implement a connection or disconnection timeout; this means that, if the app crashes (hopefully it doesn't!), the user leaves their phone somewhere for a long period of time, or for some reason the connection between the app and device is not destroyed, the device will not appear in the app; restart the placeholder device to resolve this

> [!WARNING]
> There is no use of encryption, security, or authentication in the transfer of data to or from the placeholder Bluetooth device. This placeholder device should absolutely not be used in an untrusted or unsecured environment.

#### Launching the Placeholder GE Connect+ Device(s)

Launch the devices with `python3 bumble_custom/examples/gehc_sample_devices.py (device configuration file) (interface) (path to data directory)`

- If using Android Studio with an Android Virtual Device, use `android-netsim` for `(interface)`
- If using a real Android device, use `usb:(id)` for `(interface)`, where `(id)` is replaced by the ID of the Bluetooth device as reported by [bumble's `usb_probe` app](https://github.com/google/bumble/blob/main/apps/usb_probe.py), which was downloaded along with the bumble source files during installation
  - The firmware files for the USB adapter you're using must be located in the directory that you launch the `gehc_sample_devices.py` file from; we've included the firmware files for the adapter we used (see the relevant prerequisites for a link to purchase this exact adapter)
- The device configuration file defines the starting values for devices, as well as which devices should be used
- The data directory defines where the device's GATT information should be stored
  - This includes information about the device's most recently connected patient (their MRN), the most recent time of change, along with a few other attributes
  - To clear a device's saved information (associated patient, for example), simply delete its corresponding file in the data directory
- Example using an Android Virtual Device (executed from the topmost repository directory): `python3 bumble_custom/examples/gehc_sample_devices.py bumble_custom/examples/multiple_devices.json android-netsim data`
  - Example using a real Android device (also executed from the topmost repository directory): `python3 bumble_custom/examples/gehc_sample_devices.py bumble_custom/examples/multiple_devices.json usb:0 bumble_custom/examples/data`

### Flask Server / Placeholder API

> [!NOTE]
> In the current implementation of this simple server, changes to the `patients.json` file are not taken into account, you must restart the service for these changes to be applied.

- This simple Flask server serves patient data when given an MRN. It is not recommended to use any kind of solution similar to this in a production scenario, as this lacks any notion of security
- The system that this runs on must support Python (version >= 3.12 recommended), as Flask is a Python module
- The system that this runs on must be reachable from the mobile device that the mobile app is running on

#### Launching the Flask Server

> [!IMPORTANT]
> The following instructions assume that the server host is a Linux machine (or using WSL). Please adapt the instructions if you are using another operating system to host the Flask server.

1. Copy the `flask_server` directory onto the host
1. While in the `flask_server` directory, start the server with `nohup python3 main.py`
    - To stop the server, use `ps` to find the process ID and then use `kill -9 [pid]`

## Option 1: Using Android Studio with an Android Virtual Device

### Prerequisites

- [Node.js and npm](https://nodejs.org/)
- [Android Studio (version >= 2023.2.1)](https://developer.android.com/studio)
  - The following **SDK Tools** are recommended (install or make changes by launching Android Studio, then on the Projects tab, select 'More Actions', and then 'SDK Manager'):
    - Android SDK Build-Tools
    - NDK
    - Android SDK Command-line Tools
    - CMake
    - Android Emulator
    - Android Emulator hypervisor driver (installer)
    - Android SDK Platform-Tools
    - Google Play Licensing Library
    - Google Play services
- [Python 3.12 or later](https://www.python.org/downloads/) (for the placeholder devices and Flask server)
- Somewhere to run a Flask server (see requirements in above section)

### Installation

1. Download Google's [bumble module](https://github.com/google/bumble) to a separate directory, and navigate to that directory
1. Install bumble's dependences: `python -m pip install ".[test,development,documentation]"`
1. Install the bumble module to your system: `python -m pip install -e .`
1. Navigate to this project's directory and nstall this project's packages: `npm i`
1. Install [eas-cli](https://expo.dev/tools#cli): `npm i -g eas-cli`
1. Log into Expo App Services: `eas login`
1. Build the .apk: `eas build -p android --profile preview`
    - You can also run a plain `eas build -p android` to get an .aab file, which can be uploaded to the Google Play store
    - You can ALSO run a plain `eas build` for the option to build to iOS (untested!)
1. Create and start an Android Virtual Device through Android Studio
    - Project was tested on the Pixel 8 API 34 (Android 14.0 "UpsideDownCake"), and it's recommended you use this version or later
    - You may need to enable [developer mode and USB device connections](https://developer.android.com/studio/debug/dev-options) on the device
1. Download the .apk from [Expo](https://www.expo.dev)
1. Install the .apk on the Android Virtual Device by dragging and dropping
1. You are now ready to launch!

### Launching

1. Ensure that the Flask backend is launched using the instructions in the section 'Launching the Flask Server' above
1. Launch the placeholder Bluetooth device using the instructions in the section 'Launching the Placeholder GE Connect+ Device(s)' above
1. Start the Android Virtual Device through Android Studio, and wait for it to fully boot
1. Start the Expo server for the mobile app with `npm run android`
    - This *should* automatically launch the app
    - If this doesn't launch the app, you can try pressing 'a', or opening it manually on the virtual device and inputting the IP address of the machine that the Expo server is hosted on
1. The app should now stream the required resources from the Expo server and afterwards load

## Option 2: Using a real Android Device

### Prerequisites

- [Node.js and npm](https://nodejs.org/)
- Android device (Android >= 14 recommended)
- Compatible Bluetooth adapter
  - Bluetooth adapters must have a Realtek radio chip to be compatible with the [bumble module](https://github.com/google/bumble)
  - You must be able to locate the `.bin` firmware associated with it
  - Some Realtek firmware DL sources: [(1)](https://git.kernel.org/pub/scm/linux/kernel/git/firmware/linux-firmware.git/plain/rtl_bt), [(2)](https://github.com/Realtek-OpenSource/android_hardware_realtek/raw/rtk1395/bt/rtkbt/Firmware/BT), [(3)](https://anduin.linuxfromscratch.org/sources/linux-firmware/rtl_bt)
  - The Bluetooth adapter we used for this project and our demos is [this one](https://www.amazon.com/dp/B09DMP6T22)
- [Python 3.12 or later](https://www.python.org/downloads/) (for the placeholder devices and Flask server)
- Somewhere to run a Flask server (see requirements in above section)

> [!IMPORTANT]
> It is recommended that you back up or locate the existing driver that's associated with your Bluetooth adapter before proceeding, or alternatively [create a restore point on your machine](https://support.microsoft.com/en-us/windows/create-a-system-restore-point-77e02e2a-3298-c869-9974-ef5658ea3be9). Use of a Bluetooth dongle with the fake device requires the installation of a [libusb](https://libusb.info/) driver onto your device using [Zadig](https://zadig.akeo.ie/), which will overwrite the current driver association on your machine. This should not damage or otherwise harm the internal workings of the Bluetooth adapter, only changing the driver used with it.

### Installation

1. Download Google's [bumble module](https://github.com/google/bumble) to a separate directory, and navigate to that directory
1. Install bumble's dependences: `python -m pip install ".[test,development,documentation]"`
1. Install the bumble module to your system: `python -m pip install -e .`
1. Navigate to this project's directory and nstall this project's packages: `npm i`
1. Install [eas-cli](https://expo.dev/tools#cli) by executing `npm i -g eas-cli`
1. Log into Expo App Services by executing `eas login`
1. Build the .apk by executing `eas build -p android --profile preview`
    - You can also run a plain `eas build -p android` to get an .abb file, which can be uploaded to the Google Play store
    - You can ALSO run a plain `eas build` for options to build to iOS (untested!)
1. Download the .apk from [Expo](https://www.expo.dev)
1. Transfer the .apk to the Android device that you're using
1. Navigate to the download point, and install the .apk on the Android device
    - You may need to enable [developer mode and (optionally) USB device connections](https://developer.android.com/studio/debug/dev-options) on the Android device that you're using
    - You may need to go through several UAC prompts
1. Download and extract [Zadig](https://zadig.akeo.ie/)
    - We'll use this tool to install the `libusb` driver onto the Bluetooth dongle
1. Launch Zadig and under the 'Options' toolbar, select 'List All Devices'
1. Select your Bluetooth adapter, and select `libusb-win32`, leave all other settings on their default
    - This project uses version 1.2.7.3 of libusb-win32, it is recommended to use this, or a more recent, version
1. Press 'Replace driver' and wait for the driver installation to finish
1. You are now ready to launch!

### Launching

1. Ensure that the Flask backend is launched using the instructions in the section 'Launching the Flask Server' above
1. Launch the placeholder Bluetooth device using the instructions in the section 'Launching the Placeholder GE Connect+ Device(s)' above
1. Start the Expo server for the mobile app with `npm run android`
1. Open the app on your Android device
    - If the device is connected to your host device with a USB cable, this may automatically launch the app on your device; you can also press 'a' to trigger this after launch
1. The app should now stream the required resources from the Expo server and afterwards load
