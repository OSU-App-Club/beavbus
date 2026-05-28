import { ScrollView, StyleSheet, SafeAreaView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { LocationResult } from "../scripts/onSearch";
import SearchItem from "./searchItem";
import { Dispatch, SetStateAction } from "react";

interface props {
    locations: LocationResult[];
    onChangeText: Dispatch<SetStateAction<string>>;
}

export default function SearchResults ({ locations, onChangeText }: props) {
    const { colors } = useTheme();
    return (
        <ScrollView 
            style={styles.container} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}>
                <View style={styles.resultsList}>
                    {locations.map((item) => (
                        <SearchItem 
                            key={`search-item-${item.id}`} 
                            item={item} 
                            onChangeText={onChangeText} />
                    ))}
                </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        top: 50,
        position: "absolute",
        width: "100%",
        maxHeight: 400,
        zIndex: 99,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    resultsList: {
        
    },
});