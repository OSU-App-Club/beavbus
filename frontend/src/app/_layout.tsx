import { ActivityIndicator, View, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";

import { store, persistor } from "../store/store";
import { darkTheme, lightTheme } from "../constants";
import { MapPinProvider } from "../components/MapPinContext";

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  return (
    <MapPinProvider>
      <Provider store={store}>
        <PersistGate
          loading={
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="black" />
            </View>
          }
          persistor={persistor}
        >
          <SafeAreaProvider>
            <ThemeProvider value={theme}>
              <StatusBar style="auto" />
              <NativeTabs tintColor={theme.colors.primary}>
                <NativeTabs.Trigger name="index">
                  <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                  <NativeTabs.Trigger.Icon
                    sf={{ default: "house", selected: "house.fill" }}
                    md={{ default: "home", selected: "home" }}
                  />
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="favorites">
                  <NativeTabs.Trigger.Label>Favorites</NativeTabs.Trigger.Label>
                  <NativeTabs.Trigger.Icon
                    sf={{ default: "star", selected: "star.fill" }}
                    md={{ default: "star", selected: "star" }}
                  />
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="settings">
                  <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
                  <NativeTabs.Trigger.Icon
                    sf={{ default: "gear", selected: "gear" }}
                    md={{ default: "settings", selected: "settings" }}
                  />
                </NativeTabs.Trigger>
              </NativeTabs>
            </ThemeProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </MapPinProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
