import { Text, TextInput, StyleSheet, View, Pressable } from "react-native";
import { LocationResult } from "../scripts/onSearch";
import { darkTheme } from "../constants/theme";
import { useMapPin } from "../components/MapPinContext"; //import context file

interface props {
  item: LocationResult;
}

export default function SearchItem({ item }: props) {
  const { setSelectedLocation } = useMapPin(); //get ref to the selectedLocation SETTER from context, so we can use it.

  //parsing of data
  const location_name = item.place_name.slice(0, item.place_name.indexOf(","));
  const isCorvallis = item.place_name.indexOf(", Corvallis") !== -1;  // if not Corvallis, then Philomath
  let address = item.place_name.slice(0, item.place_name.indexOf(`, ${isCorvallis ? "Corvallis" : "Philomath"}`));  // remove city/state/zip code
  address = address.slice(item.place_name.indexOf(", ") + 2);

  const handlePress = () => {
    console.log(`pressed by coords: ${item.coordinates}`);
    setSelectedLocation(item); //set state of selectLocation
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
    backgroundColor: "#272727d6",
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
