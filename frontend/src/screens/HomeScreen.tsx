import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Text, Platform, TouchableOpacity } from "react-native";
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, MarkerAnimated } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocation } from "@/src/hooks";
import AlertsButton from "../components/AlertsButton";
import { colors } from "../constants";


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
  const { location, loading, error } = useLocation();

  const mapRef = useRef<MapView | null>(null);

  const [buses, setBuses] = useState<any[]>([]);
  const busCoordsRef = useRef<Record<string, any>>({});
  const markerImg = require('../assets/images/bus.png');

  // Initialize bus positions when location is available

  useEffect(() => {
    if (!location) return;
    const initial = [
       // Example Bus Locations
      {
        id: "bus1",
        coordinate: {
          latitude: 44.5653355,
          longitude: -123.284433,
        },
        heading: 0,
      },
      {
        id: "bus2",
        coordinate: {
          latitude: 44.5653355,
          longitude: -123.284433,
        },
        heading: 0,
      },
      {
        id: "bus3",
        coordinate: {
          latitude: 44.5653355,
          longitude: -123.284433,
        },
        heading: 0,
      },
    ];
    setBuses(initial);
    initial.forEach((b) => {
      busCoordsRef.current[b.id] = new AnimatedRegion({
        latitude: b.coordinate.latitude,
        longitude: b.coordinate.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
      });
    });
  }, [location]);

  // animate AnimatedRegion values whenever buses change
  useEffect(() => {
    buses.forEach((bus) => {
      const coord = busCoordsRef.current[bus.id];
      if (coord && coord.timing) {
        coord.timing({
          latitude: bus.coordinate.latitude,
          longitude: bus.coordinate.longitude,
          latitudeDelta: 0,
          longitudeDelta: 0,
        }).start();
      } else if (!coord) {
        busCoordsRef.current[bus.id] = new AnimatedRegion({
          latitude: bus.coordinate.latitude,
          longitude: bus.coordinate.longitude,
          latitudeDelta: 0,
          longitudeDelta: 0,
        });
      }
    });
  }, [buses]);

  // Simulate bus movement every second (for test purposes)

  useEffect(() => {
    const id = setInterval(() => {
      setBuses((prev) =>
      prev.map(bus => ({
        ...bus,
        coordinate: {
          latitude: bus.coordinate.latitude + (Math.random() - 0.5) * 0.001,
          longitude: bus.coordinate.longitude + (Math.random() - 0.5) * 0.001,
        },
      }))
      );
    }, 1000);
    return () => clearInterval(id);
  }, [setBuses]);

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
              rotation={bus.heading}
              image={markerImg}
            />
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
});