import React from "react";
import { StyleSheet } from "react-native";
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";

export default function SettingsScreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText variant="title">Settings tab</ThemedText>
        </ThemedView>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});