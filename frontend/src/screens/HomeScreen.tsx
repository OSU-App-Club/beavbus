import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Text, Platform, TouchableOpacity } from "react-native";
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, MarkerAnimated, Polyline, Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { getBusRoutes, getBeavBusVehiclePositions, getCTSVehiclePositions, useLocation } from "../hooks";
import AlertsButton from "../components/AlertsButton";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";


//Bus Map Colors
const OSUStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#323232" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#C67306" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#754404" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#967d5d" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#C67306" }],
  },
];

export default function HomeScreen() {

  const mapRef = useRef<MapView | null>(null);

//Temp mocked stops until we utilize API data
const mockStops = [
  { id: "1", latitude: 44.5650, longitude: -123.2780 },
  { id: "2", latitude: 44.5635, longitude: -123.2755 },
  { id: "3", latitude: 44.5620, longitude: -123.2730 },
];

  const { location, loading, error } = useLocation();
  const { vehicles: beavBusVehicles, refresh: beavBusRefresh } = getBeavBusVehiclePositions();
  const { vehicles: ctsVehicles, refresh: ctsRefresh } = getCTSVehiclePositions();
  const { routes } = getBusRoutes();
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
    if (!(beavBusVehicles && ctsVehicles)) return;

    let vehicles = beavBusVehicles.concat(ctsVehicles);

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
  }, [beavBusVehicles, ctsVehicles]);

  // Refresh bus positions every second
  useEffect(() => {
    const interval = setInterval(() => {
      beavBusRefresh();
      ctsRefresh();
    }, 500);
    return () => clearInterval(interval);
  }, [beavBusRefresh, ctsRefresh]);

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
        {(buses === null) && (
          <ThemedText style={styles.warn}>No bus data available</ThemedText>
        )}
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          customMapStyle={OSUStyle}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsTraffic={true}
        >
          {buses.map((bus) => (
            <MarkerAnimated
              key={bus.id}
              coordinate={busCoordsRef.current[bus.id] || bus.coordinate}
              image={bus.routeId === 49 ? route49 : bus.routeId === 55 ? route55 : route54}
            />
          ))}
          {drawableRoutes.map((route) => (
            <Polyline
              key={route.key}
              coordinates={route.coordinates}
              strokeColor={route.color}
              fillColor={route.color}
              strokeWidth={4}
            />
          ))}
          {mockStops.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={{
              latitude: stop.latitude,
              longitude: stop.longitude,
            }}
          >
          <ThemedView
             style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: "rgb(219, 104, 10)",
              borderWidth: 1.5,
              borderColor: "black",
              }}
            />
          </Marker>
          ))}
        </MapView>
        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={() => {
            if (mapRef.current && location) {
              mapRef.current.animateToRegion(
                {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                500
              );
            }
          }}
        >
          <MaterialIcons
            name="my-location"
            size={24}
            color="white"
          />
        </TouchableOpacity>
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

  myLocationButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#C67306",
    padding: 14,
    borderRadius: 50,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  warn: {
    fontSize: 18,
    color: "red",
    padding: 10,
    borderRadius: 5,
  },
});