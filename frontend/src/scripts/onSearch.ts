import Fuse from 'fuse.js'

export function onSearch(routes: string[], searchText: string) {
    const fuse = new Fuse(routes);
    const results = fuse.search(searchText)
    var items: string[] = []

    for (let i = 0; i < results.length; i++) {
        items.push(results[i].item)
    }

    return items;
}

export async function getLocations(searchText: string) {

    const METHOD = "geocoding"
    const QUERY = "fred"
    const PARAMS = "bbox=-123.407399,44.527523,-123.185772,44.606607&types=poi"
    const KEY = "fCIJiQ6Td63CAgVetC3q"

    const response = await fetch(`https://api.maptiler.com/${METHOD}/${QUERY}.json?${PARAMS}&key=${KEY}`)


    if (!response.ok) {
        console.error("MapTiler error:", response.status);
        return null;
    }

    const result = await response.json();

    console.log(result)

    return 0;
}
