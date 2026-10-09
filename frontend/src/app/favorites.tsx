import { StyleSheet, View } from "react-native";
import { TopBar } from "../components";
import FavoritesScreen from "../screens/FavoritesScreen";

export default function FavoritesRoute() {
  return (
    <View style={styles.container}>
      <TopBar />
      <FavoritesScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
