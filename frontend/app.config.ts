import "dotenv/config";

export default {
  expo: {
    name: "BeavBus",
    slug: "beavbus",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "beavbus",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    icon: "./src/assets/images/logo.png",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.beavbus.app",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "BeavBus uses your location to show nearby places.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "BeavBus uses your location to support tracking while traveling.",
        NSLocationAlwaysUsageDescription:
          "BeavBus needs background location access to function correctly.",
        UIBackgroundModes: ["location"],
      },
    },
    android: {
      package: "com.beavbus.app",
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      config: {
        googleMapsApiKey: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow BeavBus to use your location.",
        },
      ],
    ],
    experiments: {
      reactCompiler: true,
    },
  },
};
