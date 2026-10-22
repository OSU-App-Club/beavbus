import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, {
  AnimatedRegion,
  Marker,
  MarkerAnimated,
  Polyline,
  Region,
} from "react-native-maps";
import AlertsButton from "../components/AlertsButton";
import LeafletMapView from "../components/LeafletMapView";
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";
import {
  getBeavBusVehiclePositions,
  getBusRoutes,
  getBusStops,
  getCTSVehiclePositions,
  useLocation,
} from "../hooks";
import { useAppSelector } from "../store/hooks";
import { selectUseLeafletMap } from "../store/slices/mapSlice";

//add func to GET mapPin LongLat from MapPinContext
import { useMapPin } from "../components/MapPinContext";

export default function HomeScreen() {
  const mapRef = useRef<any>(null);
  const useLeafletMap = useAppSelector(selectUseLeafletMap);

  //get the current state from selectLocation state variable (from context)
  const { selectedLocation } = useMapPin();

  //useEffect hook to trigger on change of selectLocation (from context!)
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      const [lng, lat] = selectedLocation.coordinates;
      mapRef.current.animateCamera(
        {
          center: {
            latitude: lat,
            longitude: lng,
          },
          zoom: 15,
        },
        { duration: 500 },
      );
    }
  }, [selectedLocation]);

  //Temp mocked stops until we utilize API data
  const mockStops = useMemo(
    () => [
      { id: "1", latitude: 44.5650, longitude: -123.2780 },
      { id: "2", latitude: 44.5635, longitude: -123.2755 },
      { id: "3", latitude: 44.5620, longitude: -123.2730 },
    ],
    [],
  );

  const BASE_SIZE = 12;
  const BASE_ZOOM = 15;

  const { location, loading, error } = useLocation();
  const { vehicles: beavBusVehicles, refresh: beavBusRefresh } =
    getBeavBusVehiclePositions();
  const { vehicles: ctsVehicles, refresh: ctsRefresh } =
    getCTSVehiclePositions();
  const { stops } = getBusStops();
  const { routes } = getBusRoutes();
  const [buses, setBuses] = useState<any[]>([]);
  const busCoordsRef = useRef<Record<string, any>>({});
  const [markerSize, setMarkerSize] = useState(BASE_SIZE);

  const ctsRouteIcon = require("../assets/images/ctsBusMarker.svg");
  const osuRouteIcon = require("../assets/images/osuBusMarker.svg");

  function markerSizeFor(region: Region) {
    const zoom = Math.log2(360 / region.longitudeDelta);
    const size = BASE_SIZE * Math.pow(1.5, zoom - BASE_ZOOM);
    // clamp, then snap to 4px steps so we don't re-render on every pinch frame
    return Math.round(Math.min(64, Math.max(12, size)) / 4) * 4;
  }

  //Update routes
  const drawableRoutes = useMemo(
    () =>
      (routes ?? [])
        .map((route, index) => ({
          key: `${route.Description}-${index}`,
          color: route.MapLineColor || "#000000",
          coordinates: route.linePoints || [],
        }))
        .filter((r) => r.coordinates.length > 1),
    [routes],
  );

  // Update bus coordinates
  useEffect(() => {
    if (!(beavBusVehicles && ctsVehicles)) return;

    let vehicles = beavBusVehicles.map((v) => {
      v.FromService = "OSU";
      return v;
    });
    vehicles = vehicles.concat(ctsVehicles.map((v) => {
      v.FromService = "CTS";
      return v;
    }));

    const updatedBuses = vehicles.map((vehicle) => {
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
        fromService: vehicle.FromService,
        FromService: vehicle.FromService,
        coordinate: {
          latitude: vehicle.Latitude,
          longitude: vehicle.Longitude,
        },
      };
    });
    setBuses(updatedBuses);
  }, [beavBusVehicles, ctsVehicles]);

  // Refresh bus positions every 500ms
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

  return (
    <>
      <AlertsButton />
      <View style={styles.container}>
        {(!location || error) && (
          <ThemedText style={styles.warn}>
            Warning: {error || "Unable to get location"}
          </ThemedText>
        )}
        {(buses === null) && (
          <ThemedText style={styles.warn}>No bus data available</ThemedText>
        )}

        {(() => {
          const MapComponent =
            (useLeafletMap ? LeafletMapView : MapView) as any;
          return (
            <MapComponent
              ref={mapRef}
              style={styles.map}
              initialRegion={location
                ? {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.025,
                  longitudeDelta: 0.025,
                }
                : {
                  latitude: 44.5638,
                  longitude: -123.2794,
                  latitudeDelta: 0.025,
                  longitudeDelta: 0.025,
                }}
              showsUserLocation={!!location}
              location={location}
              selectedLocation={selectedLocation}
              buses={buses}
              routes={drawableRoutes}
              stops={stops}
              showsMyLocationButton={false}
              showsTraffic={true}
              onRegionChange={(r: Region) => setMarkerSize(markerSizeFor(r))}
            >
              {selectedLocation && (
                <Marker
                  coordinate={{
                    latitude: selectedLocation.coordinates[1],
                    longitude: selectedLocation.coordinates[0],
                  }}
                  title={selectedLocation.place_name}
                />
              )}
              {/* eslint-disable-next-line react-hooks/refs */}
              {buses.map((bus) => (
                <MarkerAnimated
                  key={bus.id}
                  coordinate={busCoordsRef.current[bus.id] || bus.coordinate}
                  image={bus.FromService === "OSU"
                    ? osuRouteIcon
                    : ctsRouteIcon}
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
              {stops.map((stop) => (
                <Marker
                  key={stop.StopID}
                  coordinate={{
                    latitude: stop.Latitude,
                    longitude: stop.Longitude,
                  }}
                  anchor={{ x: 0.5, y: 0.5 }}
                >
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    collapsable={false}
                  >
                    <ThemedView
                      style={{
                        width: markerSize,
                        height: markerSize,
                        backgroundColor: "rgb(219, 104, 10)",
                        borderWidth: 1.5,
                        borderColor: "black",
                        borderRadius: 100,
                      }}
                    />
                  </View>
                </Marker>
              ))}
            </MapComponent>
          );
        })()}

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
                500,
              );
            } else {
              Alert.alert(
                "Location Warning",
                "Unable to determine your current location.",
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
