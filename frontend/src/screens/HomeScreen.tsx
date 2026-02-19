import { useLocation } from "@/src/hooks";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import AlertsButton from "../components/AlertsButton";

export default function HomeScreen() {
  const { location, loading, error } = useLocation();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Getting your location...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Unable to get location</Text>
      </View>
    );
  }

  return (
    <>  
      <AlertsButton />
      <View style={styles.container}>
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
      </View>
    </>
  );
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
