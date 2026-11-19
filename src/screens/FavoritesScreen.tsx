import { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import BusStop from "../components/BusStop";
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";

const stops = [
  {
    name: "SEC",
    favorited: true,
    id: "1",
  },
  {
    name: "MU",
    favorited: false,
    id: "2",
  },
  {
    name: "Austin",
    favorited: false,
    id: "3",
  },
];

export default function FavoritesScreen() {
  const [favoritedStops, setFavorited] = useState(stops);
  
  function favoriteStop(id: string) {
    setFavorited(
      favoritedStops.map((stop) =>
        stop.id === id ? { ...stop, favorited: !stop.favorited } : stop,
      ).sort((a,b) => Number(b.favorited) - Number(a.favorited)),
    );
  }

  return (
    <ThemedView>
      <ThemedText variant="title" style={styles.title}>
        Favorites
      </ThemedText>
      <FlatList
        data={favoritedStops}
        keyExtractor={(stop) => stop.id}
        renderItem={({ item }) => (
          <BusStop stop={item} onFavorite={() => favoriteStop(item.id)} />
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 20,
  },
});
