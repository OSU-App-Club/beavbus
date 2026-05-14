import { useState } from "react";
import { Text, TextInput, StyleSheet, View, Button } from "react-native";

interface props {
  reference: string;
}

export default function SearchItem({ reference }: props) {
  //parsing of data
  return (
    <View style={test.container}>
      <Text style={test.textT}>{reference}</Text>
    </View>
  );
}

const test = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "red",
    alignItems: "center",
  },
  textT: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
    margin: 10,
    backgroundColor: "blue",
  },
});
