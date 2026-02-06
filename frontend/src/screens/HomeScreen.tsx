import React from "react";
import { StyleSheet, Platform } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useLocation } from "@/src/hooks";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";

export default function HomeScreen() {
  const { location, loading, error } = useLocation();

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Getting your location...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  if (!location) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Unable to get location</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <MapView
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      ></MapView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
  },
});
