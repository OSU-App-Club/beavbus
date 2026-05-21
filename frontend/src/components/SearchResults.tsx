import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { LocationResult } from "../scripts/onSearch";
import SearchItem from "./searchItem";

interface props {
    locations: LocationResult[];
}

export default function SearchResults ({ locations }: props) {
    const { colors } = useTheme();
    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.resultsList}>
                    {locations.map((item) => (
                        <SearchItem 
                            key={`search-item-${item.id}`} 
                            item={item} />
                    ))}
                </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: "85%",
        gap: 20,
        maxHeight: 400,
        zIndex: 99,
    },
    resultsList: {
        padding: 5,
        top: 45,
    },
});