import { Text, TextInput, StyleSheet, View, Button } from "react-native";

export default function SearchItem() {
  //parsing of data

  return (
    <View style={test.container}>
      <Text style={test.textT}>meow</Text>
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
