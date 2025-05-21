import { Text, TouchableOpacity, View } from "react-native";
// import React, { Component } from 'react'
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Component } from "react";

export class AddButton extends Component {
  render() {
    return (
      <TouchableOpacity
        className="absolute bottom-20 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push("/add-expense")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    );
  }
}

export default AddButton;
