import { StyleSheet, View } from "react-native";
import { TopBar } from "../components";
import HomeScreen from "../screens/HomeScreen";

export default function HomeRoute() {
  return (
    <View style={styles.container}>
      <TopBar />
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
