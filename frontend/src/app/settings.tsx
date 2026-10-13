import { StyleSheet, View } from "react-native";
import { TopBar } from "../components";
import SettingsScreen from "../screens/SettingsScreen";

export default function SettingsRoute() {
  return (
    <View style={styles.container}>
      <TopBar />
      <SettingsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
