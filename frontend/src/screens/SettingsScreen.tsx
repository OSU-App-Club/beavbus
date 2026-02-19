import React from "react";
import { View, StyleSheet, Text, Platform } from "react-native";

export default function SettingsScreen() {
    return (
        <View style={styles.loadingContainer}>
            <Text>Settings tab</Text>
        </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
  },
});