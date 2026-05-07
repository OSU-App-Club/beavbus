import { useState, useEffect } from "react";
import { Text, TextInput, StyleSheet, View, Button } from "react-native";
import { borderRadius, spacing } from "../constants";
import { useTheme } from "@react-navigation/native";

import { getLocations } from "../scripts/onSearch";
import SearchItem from "./searchItem";

export default function SearchBar() {
  const [text, onChangeText] = useState("");
  const [locations, onChangeLocations] = useState([]);
  const { colors } = useTheme();

  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (text.length > 2) {
        const result = await getLocations(text);
        onChangeLocations(result);
      } else {
        onChangeLocations([]);
      }
    }, 300); // debounce delay in ms
  }, [text]);

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.background },
        ]}
        onChangeText={onChangeText}
        value={text}
        placeholder={"Search for a location..."}
      />
      <View style={styles.resultsList}>
        {locations.map((location, index) => (
          <SearchItem key={`search-item-${index}`}></SearchItem>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "85%",
    gap: 20,
  },
  resultsList: {
    gap: 15,
    position: "absolute",
    top: 70,
  },
  input: {
    padding: spacing.md,
    width: "auto",
    borderRadius: borderRadius.full,
    height: 50,
    borderWidth: 1,
    borderColor: "#283790",
  },
});
