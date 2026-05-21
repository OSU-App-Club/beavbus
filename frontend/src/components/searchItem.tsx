import { useState } from "react";
import { Text, TextInput, StyleSheet, View, Pressable } from "react-native";
import { LocationResult } from "../scripts/onSearch";
import { darkTheme } from "../constants/theme";

interface props {
  item: LocationResult;
  dropPin: void;
}

export default function SearchItem({ item }: props) {
  //parsing of data
  const location_name = item.place_name.slice(0, item.place_name.indexOf(","));
  let address = item.place_name.slice(0, item.place_name.indexOf(", Corvallis"));
  address = address.slice(item.place_name.indexOf(", ") + 2);

  const handlePress = () => {
    console.log(`pressed by coords: ${item.coordinates}`);
    // call drop pin
  }
  return (
    <Pressable onPress={handlePress} style={style.container} >
      <Text style={style.text}>{location_name}{"\n"}{address}</Text>
    </Pressable>
  );
}

const style = StyleSheet.create({
  container: {
    display: "flex",
    padding: 0,
    width: "100%",
    backgroundColor: darkTheme.colors.background,
    borderColor: darkTheme.colors.card,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
    color: "white",
    margin: 10,
    backgroundColor: "none",
    borderColor: darkTheme.colors.border,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
});
