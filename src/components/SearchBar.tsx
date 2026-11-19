import { useTheme } from "expo-router/react-navigation";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { borderRadius, darkTheme, spacing } from "../constants";
import { getLocations, LocationResult } from "../scripts/onSearch";
import SearchResults from "./SearchResults";


export default function SearchBar() {
  const [text, onChangeText] = useState("");
  const [locations, setLocations] = useState<LocationResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    let cancelled = false;

    const debounce = setTimeout(async () => {
      if (text.length > 2) {
        const result = await getLocations(text);
        if (cancelled) return;
        setLocations(result || []); //set the locations state variable with result
        setIsOpen(true);
      } else {
        setLocations([]); 
        setIsOpen(false);
      }
    }, 300); // debounce delay in ms
    
    return () => {
      cancelled = true;
      clearTimeout(debounce);
    }
  }, [text]);

  const showResults = isOpen && locations.length > 0;

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          showResults ? styles.inputHasText : styles.inputNoText,
          { color: colors.text, backgroundColor: colors.background },
        ]}
        onChangeText={(value) => {
          onChangeText(value);
          if (value.length > 2) {
            setIsOpen(true);
          }
        }}
        onFocus={() => {
          if (locations.length > 0) {
            setIsOpen(true);
          }
        }}
        value={text}
        placeholder="Search for a location..."
      />

      {showResults && (
        <SearchResults
          locations={locations}
          onChangeText={onChangeText}
          onClose={() => setIsOpen(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "85%",
    zIndex: 20,
    elevation: 20,
    gap: 20,
  },
  input: {
    padding: spacing.md,
    width: "auto",
    height: 50,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
    zIndex: 2,
    elevation: 2,
  },
  inputHasText: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  inputNoText: {
    borderRadius: borderRadius.full,
  }
});
