import { Tabs } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TransactionProvider } from "@/context/TransactionContext";

export default function TabRoot() {
  return (
    <TransactionProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#4f46e5", // Tailwind: indigo-600
          tabBarInactiveTintColor: "#9ca3af", // Tailwind: gray-400
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb", // gray-200
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            header: () => (
              <View className="flex-row justify-between items-center mt-5 p-7 bg-white">
                <View>
                  <Text className="text-gray-500 text-sm">Welcome back</Text>
                  <Text className="text-xl font-bold">John Doe</Text>
                </View>
                <TouchableOpacity className="bg-gray-100 rounded-full p-2">
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color="#333"
                  />
                </TouchableOpacity>
              </View>
            ),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            header: () => (
              <View style={styles.header}>
                <Text style={styles.headerTitle}>History</Text>
                <TouchableOpacity style={styles.searchButton}>
                  <MaterialIcons name="search" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            ),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "time" : "time-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="budget"
          options={{
            title: "Budget",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "wallet" : "wallet-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="analytics"
          options={{
            title: "Analytics",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "stats-chart" : "stats-chart-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </TransactionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchButton: {
    padding: 4,
  },
});
