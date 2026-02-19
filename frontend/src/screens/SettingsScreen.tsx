import React, {useState} from "react";
import { View, StyleSheet, Text, Alert,Switch } from "react-native";
import Toggle from "../components/Toggle";



export default function SettingsScreen() {

    const [isToggle1enabled, setToggle1] = useState(false);
    const [isToggle2enabled, setToggle2] = useState(false);
    const [isToggle3enabled, setToggle3] = useState(false);

    const busNearNotification = () => setToggle1(previousState => !previousState);
    const delaysNotification = () => setToggle2(previousState => !previousState);
    const reportAnalytics = () => setToggle3(previousState => !previousState);

    return (
        <View style={styles.container}>

            <Text style={styles.settings}>Notifications:</Text>

            <Text>Notify me when bus is near saved stop</Text>
            <View style = {styles.toggles}>
              <Switch
                  trackColor={{ false: '#767577', true: '#cf7500ff' }}
                  thumbColor={isToggle1enabled ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={busNearNotification}
                  value={isToggle1enabled}
                  style={{transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }]}}
              />
            </View>


            <Text>Notify me when there are delays</Text>
            <View style = {styles.toggles}>            
              <Switch
                  trackColor={{ false: '#767577', true: '#cf7500ff' }}
                  thumbColor={isToggle2enabled ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={delaysNotification}
                  value={isToggle2enabled}
                  style={{transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }]}}
              />
            </View>


            <Text style={styles.settings}>Analytics:</Text>

            <Text>Report my usage to Google Analytics</Text>
            <View style = {styles.toggles}>
              <Switch
                  trackColor={{ false: '#767577', true: '#cf7500ff' }}
                  thumbColor={isToggle3enabled ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={reportAnalytics}
                  value={isToggle3enabled}
                  style={{transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }]}}
              />
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    textAlign: "left",
    padding: 20,
    fontWeight: "bold",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  toggles: {
    paddingTop: 15,
    paddingBottom: 50,
  },

  settings: {
    fontWeight: "bold",
    fontSize: 24,
    fontFamily: 'ui-rounded',
    paddingBottom: 10,
  }
});