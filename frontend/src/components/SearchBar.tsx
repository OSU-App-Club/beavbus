import { useState, useEffect } from "react";
import { Text, TextInput, StyleSheet, View, Button } from "react-native";
import { borderRadius, spacing, darkTheme } from "../constants";
import { useTheme } from "@react-navigation/native";
import { getLocations } from "../scripts/onSearch";
import SearchResults from "./SearchResults";
import SearchItem from "./searchItem";

export default function SearchBar() {
  const [text, onChangeText] = useState("");
  const [locations, onChangeLocations] = useState([]);
  const { colors } = useTheme();

  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (text.length > 2) {
        const result = await getLocations(text);
        onChangeLocations(result || []);
      } else {
        onChangeLocations([]);
      }
    }, 300); // debounce delay in ms
    return () => clearTimeout(debounce);
  }, [text]);

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          locations.length > 0 ? styles.inputHasText : styles.inputNoText,
          { color: colors.text, backgroundColor: colors.background },
        ]}
        onChangeText={onChangeText}
        value={text}
        placeholder={"Search for a location..."}
      />
      <SearchResults locations={locations}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "85%",
    gap: 20,
  },
  input: {
    padding: spacing.md,
    width: "auto",
    height: 50,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  inputHasText: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  inputNoText: {
    borderRadius: borderRadius.full,
  }
});
