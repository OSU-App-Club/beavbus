import React, {useState} from "react";
import { View, StyleSheet } from "react-native";
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";
import ThemedSwitch from "../components/ThemedSwitch";
import { useTheme } from "@react-navigation/native";



export default function SettingsScreen() {

    const [isToggle1enabled, setToggle1] = useState(false);
    const [isToggle2enabled, setToggle2] = useState(false);
    const [isToggle3enabled, setToggle3] = useState(false);

    const busNearNotification = () => setToggle1(previousState => !previousState);
    const delaysNotification = () => setToggle2(previousState => !previousState);
    const reportAnalytics = () => setToggle3(previousState => !previousState);

    return (
        <ThemedView style={styles.container}>

            <ThemedText style={styles.settings} variant="title">Notifications:</ThemedText>

            <ThemedText>Notify me when bus is near saved stop</ThemedText>
            <View style = {styles.toggles}>
              <ThemedSwitch
                  onValueChange={busNearNotification}
                  value={isToggle1enabled}
              />
            </View>


            <ThemedText>Notify me when there are delays</ThemedText>
            <View style = {styles.toggles}>            
              <ThemedSwitch
                  onValueChange={delaysNotification}
                  value={isToggle2enabled}
              />
            </View>


            <ThemedText style={styles.settings} variant="title">Analytics:</ThemedText>

            <ThemedText>Report my usage to Google Analytics</ThemedText>
            <View style = {styles.toggles}>
              <ThemedSwitch
                  onValueChange={reportAnalytics}
                  value={isToggle3enabled}
              />
            </View>

        </ThemedView>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "left",
    padding: 20,
  },

  toggles: {
    paddingTop: 15,
    paddingBottom: 50,
  },

  settings: {
    paddingBottom: 10,
  }
});