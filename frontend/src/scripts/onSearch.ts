import Fuse from 'fuse.js'
import Constants from 'expo-constants';

export interface LocationResult {
    id: string;
    place_name: string;
    coordinates: [number, number];
}

export function onSearch(routes: string[], searchText: string) {
    const fuse = new Fuse(routes);
    const results = fuse.search(searchText)
    var items: string[] = []

    for (let i = 0; i < results.length; i++) {
        items.push(results[i].item)
    }
    console.log(searchText, results);
    return items;
}

export async function getLocations(searchText: string) {
    let locations: LocationResult[] = [];

    const METHOD = "geocoding"
    const QUERY = encodeURIComponent(searchText);
    const PARAMS = "bbox=-123.407399,44.527523,-123.185772,44.606607&types=poi"
    const KEY = Constants.expoConfig?.extra?.maptilerApiKey;

    const response = await fetch(`https://api.maptiler.com/${METHOD}/${QUERY}.json?${PARAMS}&key=${KEY}`)

    if (!response.ok) {
        console.error("MapTiler error:", response.status);
        return null;
    } 

    const result = await response.json();

    for (let i: number = 0; i < result.features.length; i++) {
        locations.push({
            id: result.features[i].id,
            place_name: result.features[i].place_name,
            coordinates: result.features[i].geometry.coordinates // [lng, lat]
        });
    }

    return locations;
}
