import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { borderRadius, spacing } from "../constants";
import { useTheme } from "@react-navigation/native";
import SearchItem from "./searchItem";

interface props {
    locations: string[];
}

export default function SearchResults ({ locations }: props) {
    const { colors } = useTheme();
    return (
        <ScrollView style={styles.container}>
                <View style={styles.resultsList}>
                    {locations.map((location, index) => (
                        <SearchItem 
                        key={`search-item-${index}`} 
                        reference={location} />
                    ))}
                </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        width: "85%",
        gap: 20,
        maxHeight: 200,
    },
    resultsList: {
        gap: 15,
        position: "absolute",
        top: 70,
    },
    scrollView: {
        backgroundColor: "green",
        flex: 1,
        height: 100,
    },
});