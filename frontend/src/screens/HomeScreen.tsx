import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, MarkerAnimated } from "react-native-maps";
import { useLocation } from "@/src/hooks";

export default function HomeScreen() {
  const { location, loading, error } = useLocation();

  const [buses, setBuses] = useState<any[]>([]);
  const busMarkerRef = useRef<any>(null);
  const busCoord = useRef<any | null>(null);

  // Initialize bus positions when location is available

  useEffect(() => {
    if (!location) return;
    const initial = [
      {
        // Example Bus Location
        id: "bus1",
        coordinate: {
          latitude: 44.5653355,
          longitude: -123.284433,
        },
        heading: 0,
      },
    ];
    setBuses(initial);
    busCoord.current = new AnimatedRegion({
      latitude: initial[0].coordinate.latitude,
      longitude: initial[0].coordinate.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    });
  }, [location]);

  // Bus Movement Animation

  useEffect(() => {
    if (!buses[0] || !busCoord.current) return;
    if (busCoord.current.setValue) {
      busCoord.current.setValue({
        latitude: buses[0].coordinate.latitude,
        longitude: buses[0].coordinate.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
      });
    }
  }, [buses]);

  /* Update bus location example

    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === "bus1"
          ? {
              ...bus,
              coordinate: {
                latitude: newLat,
                longitude: newLng,
              },
            }
          : bus
      )
    );
  */

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
        showsTraffic={true}
      >
        {buses.map((bus) => (
          <MarkerAnimated key={bus.id} ref={busMarkerRef} coordinate={busCoord.current} rotation={bus.heading} />
        ))}
      </MapView>
    </View>
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
