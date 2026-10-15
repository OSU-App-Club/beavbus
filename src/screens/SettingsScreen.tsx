import { useState } from "react";
import { StyleSheet, View } from "react-native";
import ThemedSwitch from "../components/ThemedSwitch";
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectUseLeafletMap, toggleUseLeafletMap } from "../store/slices/mapSlice";

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const useLeafletMap = useAppSelector(selectUseLeafletMap);

  const [isToggle1enabled, setToggle1] = useState(false);
  const [isToggle2enabled, setToggle2] = useState(false);
  const [isToggle3enabled, setToggle3] = useState(false);

  const busNearNotification = () => setToggle1(previousState => !previousState);
  const delaysNotification = () => setToggle2(previousState => !previousState);
  const reportAnalytics = () => setToggle3(previousState => !previousState);
  const leafletMapToggle = () => {
    dispatch(toggleUseLeafletMap());
  };

  return (
    <ThemedView style={styles.container}>

      <ThemedText style={styles.settings} variant="title">Map:</ThemedText>

      <View style={styles.row}>
        <ThemedText>Use OpenStreetMap</ThemedText>
        <ThemedSwitch
          onValueChange={leafletMapToggle}
          value={useLeafletMap}
        />
      </View>

      <ThemedText style={styles.settings} variant="title">Notifications:</ThemedText>

      <View style={styles.row}>
        <ThemedText>Notify me when bus is near saved stop</ThemedText>
        <ThemedSwitch
          onValueChange={busNearNotification}
          value={isToggle1enabled}
        />
      </View>

      <View style={styles.row}>
        <ThemedText>Notify me when there are delays</ThemedText>
        <ThemedSwitch
          onValueChange={delaysNotification}
          value={isToggle2enabled}
        />
      </View>


      <ThemedText style={styles.settings} variant="title">Analytics:</ThemedText>
      <View style={styles.row}>
        <ThemedText>Report my usage to Google Analytics</ThemedText>
        <ThemedSwitch
          onValueChange={reportAnalytics}
          value={isToggle3enabled}
        />
      </View>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomColor: 'rgba(128, 128, 128, 0.25)',
    borderBottomWidth: StyleSheet.hairlineWidth,

  },

  settings: {
    paddingTop: 24,
    paddingBottom: 10,
  }
});