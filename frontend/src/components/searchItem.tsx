import { useState } from "react";
import { Text, TextInput, StyleSheet, View, Button } from "react-native";
import { LocationResult } from "../scripts/onSearch";

interface props {
  item: LocationResult;
}

export default function SearchItem({ item }: props) {
  //parsing of data
  const address = item.place_name.slice(0, item.place_name.indexOf(", Corvallis")).slice(item.place_name.indexOf(", ") + 2);
  const location_name = item.place_name.slice(0, item.place_name.indexOf(","))
  return (
    <View style={style.container}>
      <Text style={style.address}>{location_name}{"\n"}{address}{/*item.coordinates*/}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "red",
    alignItems: "center",
  },
  address: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    color: "white",
    margin: 10,
    backgroundColor: "blue",
  },
});
