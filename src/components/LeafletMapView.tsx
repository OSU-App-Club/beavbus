import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import ThemedView from "./ThemedView";

export interface LeafletMapRef {
  animateToRegion: (
    region: {
      latitude: number;
      longitude: number;
      latitudeDelta?: number;
      longitudeDelta?: number;
    },
    duration?: number
  ) => void;
  animateCamera: (
    camera: {
      center: { latitude: number; longitude: number };
      zoom?: number;
    },
    options?: { duration?: number }
  ) => void;
  setCameraPosition: (options: {
    coordinates: { latitude: number; longitude: number };
    zoom?: number;
    duration?: number;
  }) => void;
}

export interface LeafletMapViewProps {
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  };
  showsUserLocation?: boolean;
  location?: {
    coords: {
      latitude: number;
      longitude: number;
    };
  } | null;
  selectedLocation?: {
    coordinates: [number, number];
    place_name: string;
  } | null;
  buses?: {
    id: string;
    routeId?: number;
    FromService?: "OSU" | "CTS" | string;
    fromService?: "OSU" | "CTS" | string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
  }[];
  routes?: {
    key: string;
    color: string;
    coordinates: { latitude: number; longitude: number }[];
  }[];
  stops?: {
    id: string;
    latitude: number;
    longitude: number;
    color?: string;
  }[];
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const buildLeafletHtml = (
  initialLat: number,
  initialLng: number,
  initialZoom: number
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body {
      margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden;
      background-color: #f3f4f6;
    }
    #map {
      position: absolute; top: 0; bottom: 0; left: 0; right: 0;
      width: 100%; height: 100%;
      transform: translate3d(0, 0, 0);
      -webkit-transform: translate3d(0, 0, 0);
      will-change: transform;
    }
    .leaflet-tile-container {
      will-change: transform;
    }
    .user-marker {
      width: 18px; height: 18px;
      background: #2563EB;
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.28), 0 2px 4px rgba(0,0,0,0.3);
    }
    .bus-marker-container {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      transform: translate(-50%, -100%);
      pointer-events: auto;
    }
    .bus-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 3px 6px;
      border-radius: 12px;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 11px;
      font-weight: 700;
      box-shadow: 0 2px 5px rgba(0,0,0,0.35);
      border: 1.5px solid #ffffff;
      white-space: nowrap;
    }
    .bus-badge-osu {
      background-color: #D73F09;
    }
    .bus-badge-cts {
      background-color: #0284C7;
    }
    .bus-badge svg {
      width: 12px; height: 12px; fill: currentColor;
    }
    .bus-arrow {
      width: 0; height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      margin-top: -1px;
    }
    .bus-arrow-osu {
      border-top: 5px solid #D73F09;
    }
    .bus-arrow-cts {
      border-top: 5px solid #0284C7;
    }
    .stop-dot {
      width: 14px; height: 14px;
      border-radius: 50%;
      background-color: rgb(219, 104, 10);
      border: 2px solid #000000;
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
      transform: translate(-50%, -50%);
    }
    .custom-child-marker {
      width: 14px; height: 14px;
      border-radius: 50%;
      background-color: #D73F09;
      border: 2px solid #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      transform: translate(-50%, -50%);
    }
    .leaflet-popup-content-wrapper {
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
    }
    .leaflet-control-attribution {
      font-size: 9px !important;
      background: rgba(255,255,255,0.7) !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
      wheelDebounceTime: 40
    }).setView([${initialLat}, ${initialLng}], ${initialZoom});

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      updateWhenZooming: false,
      updateWhenIdle: true,
      keepBuffer: 2,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var busMarkers = {};
    var routeLines = {};
    var stopMarkers = [];
    var extraMarkers = [];
    var userMarker = null;
    var selectedMarker = null;
    var isZooming = false;
    var pendingBuses = null;

    map.on('zoomstart', function() { isZooming = true; });
    map.on('zoomend', function() {
      isZooming = false;
      if (pendingBuses) {
        window.updateBuses(pendingBuses);
        pendingBuses = null;
      }
    });

    var busSvg = '<svg viewBox="0 0 24 24"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/></svg>';

    function createBusIcon(service, routeId) {
      var isOsu = (service || '').toUpperCase() === 'OSU';
      var badgeClass = isOsu ? 'bus-badge-osu' : 'bus-badge-cts';
      var arrowClass = isOsu ? 'bus-arrow-osu' : 'bus-arrow-cts';
      var label = isOsu ? 'OSU ' + (routeId || '') : 'CTS ' + (routeId || '');
      var html = '<div class="bus-marker-container"><div class="bus-badge ' + badgeClass + '">' + busSvg + '<span>' + label + '</span></div><div class="bus-arrow ' + arrowClass + '"></div></div>';
      return L.divIcon({
        className: '',
        html: html,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });
    }

    window.updateBuses = function(buses) {
      if (!Array.isArray(buses)) return;
      if (isZooming) {
        pendingBuses = buses;
        return;
      }
      var seen = {};
      buses.forEach(function(bus) {
        if (!bus || !bus.coordinate) return;
        var id = String(bus.id);
        seen[id] = true;
        var lat = bus.coordinate.latitude;
        var lng = bus.coordinate.longitude;
        var service = bus.FromService || bus.fromService || (id.indexOf('osu') !== -1 ? 'OSU' : 'CTS');
        var popupText = (service === 'OSU' ? 'OSU Beaver Bus' : 'CTS Bus') + (bus.routeId ? ' - Route ' + bus.routeId : '');

        if (busMarkers[id]) {
          busMarkers[id].setLatLng([lat, lng]);
        } else {
          var icon = createBusIcon(service, bus.routeId);
          var marker = L.marker([lat, lng], { icon: icon }).addTo(map);
          marker.bindPopup(popupText);
          busMarkers[id] = marker;
        }
      });
      Object.keys(busMarkers).forEach(function(id) {
        if (!seen[id]) {
          map.removeLayer(busMarkers[id]);
          delete busMarkers[id];
        }
      });
    };

    window.updateRoutes = function(routes) {
      if (!Array.isArray(routes)) return;
      var newKeys = {};
      routes.forEach(function(r) {
        if (!r.coordinates || r.coordinates.length < 2) return;
        var key = String(r.key || Math.random());
        newKeys[key] = true;

        if (!routeLines[key]) {
          var latlngs = r.coordinates.map(function(c) { return [c.latitude, c.longitude]; });
          var line = L.polyline(latlngs, {
            color: r.color || '#D73F09',
            weight: 4,
            opacity: 0.85,
            smoothFactor: 2.0,
            interactive: false
          }).addTo(map);
          routeLines[key] = line;
        }
      });

      Object.keys(routeLines).forEach(function(key) {
        if (!newKeys[key]) {
          map.removeLayer(routeLines[key]);
          delete routeLines[key];
        }
      });
    };

    window.updateStops = function(stops) {
      if (!Array.isArray(stops)) return;
      stopMarkers.forEach(function(m) { map.removeLayer(m); });
      stopMarkers = [];
      stops.forEach(function(s) {
        var icon = L.divIcon({
          className: '',
          html: '<div class="stop-dot" style="' + (s.color ? 'background-color:' + s.color + ';' : '') + '"></div>',
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        var marker = L.marker([s.latitude, s.longitude], { icon: icon }).addTo(map);
        if (s.id) {
          marker.bindPopup('Bus Stop #' + s.id);
        }
        stopMarkers.push(marker);
      });
    };

    window.updateExtraMarkers = function(markers) {
      if (!Array.isArray(markers)) return;
      extraMarkers.forEach(function(m) { map.removeLayer(m); });
      extraMarkers = [];
      markers.forEach(function(item) {
        if (!item || !item.coordinate) return;
        var icon = L.divIcon({
          className: '',
          html: '<div class="custom-child-marker"></div>',
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        var m = L.marker([item.coordinate.latitude, item.coordinate.longitude], { icon: icon }).addTo(map);
        if (item.title) {
          m.bindPopup(item.title);
        }
        extraMarkers.push(m);
      });
    };

    window.updateUserLocation = function(coords) {
      if (!coords) {
        if (userMarker) { map.removeLayer(userMarker); userMarker = null; }
        return;
      }
      var lat = coords.latitude;
      var lng = coords.longitude;
      if (!userMarker) {
        var icon = L.divIcon({
          className: '',
          html: '<div class="user-marker"></div>',
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });
        userMarker = L.marker([lat, lng], { icon: icon, zIndexOffset: 1000 }).addTo(map);
        userMarker.bindPopup('Your Location');
      } else {
        userMarker.setLatLng([lat, lng]);
      }
    };

    window.updateSelectedLocation = function(loc) {
      if (!loc || !loc.coordinates) {
        if (selectedMarker) { map.removeLayer(selectedMarker); selectedMarker = null; }
        return;
      }
      var lat = loc.coordinates[1];
      var lng = loc.coordinates[0];
      if (!selectedMarker) {
        var pinSvg = '<svg viewBox="0 0 24 24" width="28" height="36"><path fill="#DC2626" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/><path fill="#ffffff" d="M12 6.5A2.5 2.5 0 1 0 14.5 9 2.5 2.5 0 0 0 12 6.5z"/></svg>';
        var icon = L.divIcon({
          className: '',
          html: '<div style="transform:translate(-50%,-100%);filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));">' + pinSvg + '</div>',
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        selectedMarker = L.marker([lat, lng], { icon: icon, zIndexOffset: 2000 }).addTo(map);
      } else {
        selectedMarker.setLatLng([lat, lng]);
      }
      if (loc.place_name) {
        selectedMarker.bindPopup(loc.place_name).openPopup();
      }
    };

    window.moveToLocation = function(lat, lng, zoom) {
      map.flyTo([lat, lng], zoom || 15, { duration: 0.5 });
    };

    function notifyReady() {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MAP_READY' }));
      } else {
        setTimeout(notifyReady, 100);
      }
    }

    map.whenReady(notifyReady);
  </script>
</body>
</html>
`;

const LeafletMapView = forwardRef<LeafletMapRef, LeafletMapViewProps>(
  (
    {
      initialRegion,
      showsUserLocation = true,
      location,
      selectedLocation,
      buses = [],
      routes = [],
      stops = [],
      children,
      style,
    },
    ref
  ) => {
    const webViewRef = useRef<WebView>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const hasInitialMoved = useRef(false);

    // Initial coordinates from initialRegion or location or Oregon State University
    const initialLat = initialRegion?.latitude ?? (location ? location.coords.latitude : 44.5638);
    const initialLng = initialRegion?.longitude ?? (location ? location.coords.longitude : -123.2794);
    const initialZoom = initialRegion?.latitudeDelta
      ? Math.max(10, Math.min(Math.round(Math.log2(360 / initialRegion.latitudeDelta)), 18))
      : 15;

    const htmlContent = useRef(buildLeafletHtml(initialLat, initialLng, initialZoom)).current;

    const parsedChildren = useMemo(() => {
      const extraMarkers: { id: string; coordinate: { latitude: number; longitude: number }; title?: string }[] = [];
      const extraRoutes: { key: string; color: string; coordinates: { latitude: number; longitude: number }[] }[] = [];

      const processNode = (node: any) => {
        if (!node) return;
        if (Array.isArray(node)) {
          node.forEach(processNode);
          return;
        }
        if (!React.isValidElement(node)) return;

        const props: any = node.props;
        if (!props) return;

        // Polyline
        if (props.coordinates && Array.isArray(props.coordinates) && props.coordinates.length > 1) {
          extraRoutes.push({
            key: String(node.key || Math.random()),
            color: props.strokeColor || props.fillColor || "#D73F09",
            coordinates: props.coordinates,
          });
          return;
        }

        if (props.coordinate) {
          const lat =
            typeof props.coordinate.latitude === "number"
              ? props.coordinate.latitude
              : props.coordinate.latitude?._value ?? 0;
          const lng =
            typeof props.coordinate.longitude === "number"
              ? props.coordinate.longitude
              : props.coordinate.longitude?._value ?? 0;

          if (lat !== 0 || lng !== 0) {
            extraMarkers.push({
              id: String(node.key || Math.random()),
              coordinate: { latitude: lat, longitude: lng },
              title: props.title,
            });
          }
        }

        if (props.children) {
          React.Children.forEach(props.children, processNode);
        }
      };

      React.Children.forEach(children, processNode);
      return { extraMarkers, extraRoutes };
    }, [children]);

    const allRoutes = useMemo(() => {
      if (routes.length > 0) return routes;
      return parsedChildren.extraRoutes;
    }, [routes, parsedChildren.extraRoutes]);

    const routesSig = useMemo(
      () => allRoutes.map((r) => `${r.key}:${r.color}:${r.coordinates.length}`).join("|"),
      [allRoutes]
    );
    const prevRoutesSig = useRef<string>("");

    const stopsSig = useMemo(
      () => stops.map((s) => `${s.id}:${s.latitude}:${s.longitude}`).join("|"),
      [stops]
    );
    const prevStopsSig = useRef<string>("");

    const extraMarkersSig = useMemo(
      () => parsedChildren.extraMarkers.map((m) => `${m.id}:${m.coordinate.latitude}:${m.coordinate.longitude}`).join("|"),
      [parsedChildren.extraMarkers]
    );
    const prevExtraMarkersSig = useRef<string>("");

    useImperativeHandle(ref, () => ({
      animateToRegion: (region, _duration = 500) => {
        const zoom = region.latitudeDelta
          ? Math.round(Math.log2(360 / region.latitudeDelta))
          : 15;
        const clampedZoom = Math.max(10, Math.min(zoom, 18));
        webViewRef.current?.injectJavaScript(
          `window.moveToLocation && window.moveToLocation(${region.latitude}, ${region.longitude}, ${clampedZoom}); true;`
        );
      },
      animateCamera: (camera, _options) => {
        const zoom = camera.zoom ?? 15;
        webViewRef.current?.injectJavaScript(
          `window.moveToLocation && window.moveToLocation(${camera.center.latitude}, ${camera.center.longitude}, ${zoom}); true;`
        );
      },
      setCameraPosition: (options) => {
        const zoom = options.zoom ?? 15;
        webViewRef.current?.injectJavaScript(
          `window.moveToLocation && window.moveToLocation(${options.coordinates.latitude}, ${options.coordinates.longitude}, ${zoom}); true;`
        );
      },
    }));

    // Function to push all current data to the webview
    const syncAll = () => {
      if (!webViewRef.current) return;
      const effectiveUserLocation = showsUserLocation ? (location?.coords ?? null) : null;
      prevRoutesSig.current = routesSig;
      prevStopsSig.current = stopsSig;
      prevExtraMarkersSig.current = extraMarkersSig;

      const script = `
        if (window.updateRoutes) window.updateRoutes(${JSON.stringify(allRoutes)});
        if (window.updateStops) window.updateStops(${JSON.stringify(stops)});
        if (window.updateBuses) window.updateBuses(${JSON.stringify(buses)});
        if (window.updateExtraMarkers) window.updateExtraMarkers(${JSON.stringify(parsedChildren.extraMarkers)});
        if (window.updateUserLocation) window.updateUserLocation(${JSON.stringify(effectiveUserLocation)});
        if (window.updateSelectedLocation) window.updateSelectedLocation(${JSON.stringify(selectedLocation ?? null)});
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    };

    // When location first arrives, if camera hasn't moved, center on it
    useEffect(() => {
      if (location && !hasInitialMoved.current && webViewRef.current) {
        hasInitialMoved.current = true;
        webViewRef.current.injectJavaScript(
          `window.moveToLocation && window.moveToLocation(${location.coords.latitude}, ${location.coords.longitude}, 15); true;`
        );
      }
    }, [location]);

    // Synchronize buses
    useEffect(() => {
      if (isMapReady && webViewRef.current) {
        webViewRef.current.injectJavaScript(
          `window.updateBuses && window.updateBuses(${JSON.stringify(buses)}); true;`
        );
      }
    }, [buses, isMapReady]);

    // Synchronize routes ONLY when route signatures change
    useEffect(() => {
      if (isMapReady && webViewRef.current && prevRoutesSig.current !== routesSig) {
        prevRoutesSig.current = routesSig;
        webViewRef.current.injectJavaScript(
          `window.updateRoutes && window.updateRoutes(${JSON.stringify(allRoutes)}); true;`
        );
      }
    }, [routesSig, allRoutes, isMapReady]);

    // Synchronize stops ONLY when stops signature changes
    useEffect(() => {
      if (isMapReady && webViewRef.current && prevStopsSig.current !== stopsSig) {
        prevStopsSig.current = stopsSig;
        webViewRef.current.injectJavaScript(
          `window.updateStops && window.updateStops(${JSON.stringify(stops)}); true;`
        );
      }
    }, [stopsSig, stops, isMapReady]);

    // Synchronize extra markers ONLY when children markers change
    useEffect(() => {
      if (isMapReady && webViewRef.current && prevExtraMarkersSig.current !== extraMarkersSig) {
        prevExtraMarkersSig.current = extraMarkersSig;
        webViewRef.current.injectJavaScript(
          `window.updateExtraMarkers && window.updateExtraMarkers(${JSON.stringify(parsedChildren.extraMarkers)}); true;`
        );
      }
    }, [extraMarkersSig, parsedChildren.extraMarkers, isMapReady]);

    // Synchronize user location
    useEffect(() => {
      if (isMapReady && webViewRef.current) {
        const effectiveUserLocation = showsUserLocation ? (location?.coords ?? null) : null;
        webViewRef.current.injectJavaScript(
          `window.updateUserLocation && window.updateUserLocation(${JSON.stringify(effectiveUserLocation)}); true;`
        );
      }
    }, [location, showsUserLocation, isMapReady]);

    // Synchronize selected location
    useEffect(() => {
      if (isMapReady && webViewRef.current) {
        webViewRef.current.injectJavaScript(
          `window.updateSelectedLocation && window.updateSelectedLocation(${JSON.stringify(selectedLocation ?? null)}); true;`
        );
      }
    }, [selectedLocation, isMapReady]);

    const handleLoadEnd = () => {
      setIsMapReady(true);
      syncAll();
    };

    const handleMessage = (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === "MAP_READY") {
          setIsMapReady(true);
          syncAll();
        }
      } catch (err) {
        console.error("Leaflet message error:", err);
      }
    };

    return (
      <View style={[styles.container, style]}>
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          style={styles.webView}
          onLoadEnd={handleLoadEnd}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={["*"]}
          scrollEnabled={false}
          scalesPageToFit={false}
          nestedScrollEnabled={false}
          startInLoadingState={true}
          renderLoading={() => (
            <ThemedView style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#D73F09" />
            </ThemedView>
          )}
        />
      </View>
    );
  }
);

LeafletMapView.displayName = "LeafletMapView";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LeafletMapView;