import { useTheme } from "expo-router/react-navigation";
import { Dispatch, SetStateAction } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { LocationResult } from "../scripts/onSearch";
import SearchItem from "./searchItem";

interface props {
    locations: LocationResult[];
    onChangeText: Dispatch<SetStateAction<string>>;
    onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function SearchResults ({ locations, onChangeText, onClose }: props) {
    const { colors } = useTheme();
    return (
        <>
            <Pressable 
                style={styles.screenBackdrop}
                onPress={onClose}
                accessibilityLabel="Close search results"
            />
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
        </>
    );
}

const styles = StyleSheet.create({
    screenBackdrop: {
        position: "absolute",
        top: -300,
        left: -200,
        width: SCREEN_WIDTH + 400,
        height: SCREEN_HEIGHT + 400,
        zIndex: 1,
    },
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