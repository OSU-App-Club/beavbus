import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, MarkerAnimated, Marker, Polyline } from "react-native-maps";
import { useLocation, getBeavBusVehiclePositions, getBeavBusRoutesAndStops } from "@/src/hooks";
import { ThemedText, ThemedView } from "../components"
import AlertsButton from "../components/AlertsButton";
import { borderRadius, spacing } from "../constants";

export default function HomeScreen() {
  const { location, loading, error } = useLocation();
  const { vehicles, refresh } = getBeavBusVehiclePositions();
  const { routes, stops } = getBeavBusRoutesAndStops();
  const [buses, setBuses] = useState<any[]>([]);
  const busCoordsRef = useRef<Record<string, any>>({});

  // Icon for each route
  const route54 = require('../assets/images/blue.png');
  const route49 = require('../assets/images/yellow.png');
  const route55 = require('../assets/images/green.png');

  //Update routes
  const drawableRoutes = (routes ?? [])
  .map((route, index) => ({
    key: `${route.Description}-${index}`,
    color: route.MapLineColor || "#000000",
    coordinates: route.linePoints || [],
  }))
  .filter((r) => r.coordinates.length > 1);

  // Update bus coordinates
  useEffect(() => {
    if (!vehicles) return;

    const updatedBuses = vehicles.map(vehicle => {
      const id = `bus${vehicle.VehicleID}`;
      const routeId = vehicle.RouteID;

      // If we don't have a marker for this bus yet, create one. Otherwise, animate it to the new position.
      
      if (!busCoordsRef.current[id]) {
        busCoordsRef.current[id] = new AnimatedRegion({
          latitude: vehicle.Latitude,
          longitude: vehicle.Longitude,
          latitudeDelta: 0,
          longitudeDelta: 0,
        });
      } else {
        busCoordsRef.current[id].timing({
          latitude: vehicle.Latitude,
          longitude: vehicle.Longitude,
          latitudeDelta: 0,
          longitudeDelta: 0,
          duration: 500,
          useNativeDriver: false,
        }).start();
      }
      return {
        id,
        routeId,
        coordinate: {
          latitude: vehicle.Latitude,
          longitude: vehicle.Longitude,
        },
      };
    });
    setBuses(updatedBuses);
  }, [vehicles]);

  // Refresh bus positions every second
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 500);
    return () => clearInterval(interval);
  }, [refresh]);

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
    <>  
      <AlertsButton />
      <View style={styles.container}>
        {vehicles === null && (
          <ThemedText style={styles.warn}>No bus data available</ThemedText>
        )}
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
            <MarkerAnimated
              key={bus.id}
              coordinate={busCoordsRef.current[bus.id] || bus.coordinate}
              image={bus.routeId === 49 ? route49 : bus.routeId === 55 ? route55 : route54}
              zIndex={10}
            />
          ))}
          {drawableRoutes.map((route) => (
            <Polyline
              key={route.key}
              coordinates={route.coordinates}
              strokeColor={route.color}
              strokeWidth={3}
            />
          ))}
          {stops?.map((stop) => (
            <Marker
                key={stop.RouteStopID}
                coordinate={{
                latitude: stop.Latitude,
                longitude: stop.Longitude,
                }}
            >
                <ThemedView
                    style={{
                        width: spacing.sm,
                        height: spacing.sm,
                        borderRadius: borderRadius.sm,
                        backgroundColor: stop.color,
                        borderWidth: 1,
                        borderColor: "black"
                    }}
                    />
            </Marker>
          ))}
        </MapView>
      </View>
    </>
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
  warn: {
    fontSize: 18,
    color: "red",
    padding: 10,
    borderRadius: 5,
  },
});
