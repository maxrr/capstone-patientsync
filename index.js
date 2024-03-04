// https://github.com/innoveit/react-native-ble-manager/tree/ad37080b9497dfac044333d8a9031086d6fb926b
// in your index.ios.js or index.android.js
import React, { Component } from "react";
import { AppRegistry } from "react-native";
import App from "./App"; //<-- simply point to the example js!
/* 
Note: The react-native-ble-manager/example directory is only included when cloning the repo, the above import will not work 
if trying to import react-native-ble-manager/example from node_modules
*/
AppRegistry.registerComponent("GE ConnectPlus App", () => App);
