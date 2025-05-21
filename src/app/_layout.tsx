import { Stack } from "expo-router";
import "../../global.css";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../utils/AuthContext";
import { useAuth } from "../utils/AuthContext";
import { router } from "expo-router";
import { TransactionProvider } from "@/context/TransactionContext";

function RootLayoutNav() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login");
    }
  }, [session, loading]);

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <Stack>
      <Stack.Screen name="(tab)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="addtransaction"
        options={{
          presentation: "transparentModal", // or "modal"
          animation: "slide_from_bottom",
          headerShown: false, // optional
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <TransactionProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <RootLayoutNav />
      </AuthProvider>
    </TransactionProvider>
  );
}
