# CS 639 — GE Healthcare: Patient Device Association "PatientSync"

An app that aims to allow nurses to quickly and easily associate a patient with a GE Connect+ device, which would be physically connected to multiple medical devices.

This document will outline how to get the project running on your machine. These instructions were created for Windows 10 or 11. There are likely MacOS and Linux alternatives, but you'll have to search those out yourself.

This project was created using [expo](https://docs.expo.dev/tutorial/create-your-first-app/)'s `pnpx create-expo-app` with Node.js version 20.5.1, and npm version 9.8.0.

## Overview

This project contains multiple components:

1. Mobile app
    - Tested and demoed on Android, untested but should be buildable on iOS
    - Built using React Native
2. Placeholder ("Fake") GE Connect+ device
    - Built in Python using Google's [bumble](https://github.com/google/bumble) module
3. Placeholder backend
    - Built using (TBA)

## Project Setup

There are **two options** for getting the project up and running, steps unique to each option are listed below.

## Option 1: Using Android Studio with an Android Virtual Device

### Prerequisites

- [Node.js and npm](https://nodejs.org/)
- [Android Studio (version TBA)](https://developer.android.com/studio)
  - Req'd tools and packages TBA
- [Python 3.12 or later](https://www.python.org/downloads/)
- Machine to host lightweight placeholder backend
  - System requirements TBA

### Installation

1. Install project packages by navigating to the project directory and executing `npm i`
1. Install [eas-cli](https://expo.dev/tools#cli) by executing `npm i -g eas-cli`
1. Log into Expo App Services by executing `eas login`
1. Build the .apk by executing `eas build`
1. Create and start an Android Virtual Device through Android Studio
    - OS version TBA
1. Install the .apk on the Android Virtual Device by dragging and dropping

### Launching

1. Start the Android Virtual Device through Android Studio
1. Start the Expo server with `npm run android`
    - This will launch the app

## Option 2: Using a real Android Device

### Prerequisites

- [Node.js and npm](https://nodejs.org/)
- Android device (OS version TBA)
- Compatible Bluetooth adapter
  - Bluetooth adapters must have a Realtek radio chip
  - You must be able to locate the `.bin` firmware associated with it
  - Some Realtek firmware DL sources: [(1)](https://git.kernel.org/pub/scm/linux/kernel/git/firmware/linux-firmware.git/plain/rtl_bt), [(2)](https://github.com/Realtek-OpenSource/android_hardware_realtek/raw/rtk1395/bt/rtkbt/Firmware/BT), [(3)](https://anduin.linuxfromscratch.org/sources/linux-firmware/rtl_bt)
  - The Bluetooth adapter we used for this project and our demos is [this one](https://www.amazon.com/dp/B09DMP6T22)
- Machine to host lightweight placeholder backend
  - System requirements TBA
