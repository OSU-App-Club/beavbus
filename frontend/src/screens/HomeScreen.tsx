import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, MarkerAnimated, Polyline } from "react-native-maps";
import { useLocation, getBeavBusVehiclePositions, getBeavBusRoutes, getCTSBusRoutes} from "@/src/hooks";
import AlertsButton from "../components/AlertsButton";

export default function HomeScreen() {
  const { location, loading, error } = useLocation();
  const { vehicles, refresh } = getBeavBusVehiclePositions();
  const { routes } = getCTSBusRoutes();
  const [buses, setBuses] = useState<any[]>([]);
  const busCoordsRef = useRef<Record<string, any>>({});

  // Icon for each route
  // const route54 = require('../assets/images/blue.png');
  // const route49 = require('../assets/images/yellow.png');
  // const route55 = require('../assets/images/green.png');

  //Update routes
  const drawableRoutes = (routes ?? [])
  .map((route, index) => ({
    key: `${route.Description}-${index}`,
    color: route.MapLineColor || "#db0000",
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
        {vehicles === null && (
          <Text style={styles.warn}>No bus data available</Text>
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
            />
          ))}
          {drawableRoutes.map((route) => (
            <Polyline
              key={route.key}
              coordinates={route.coordinates}
              strokeColor={route.color}
              strokeWidth={4}
            />
          ))}
        </MapView>
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
  warn: {
    fontSize: 18,
    color: "red",
    padding: 10,
    borderRadius: 5,
  },
});