import Fuse from 'fuse.js'

export default function onSearch(routes: string[], searchText: string) {
    const fuse = new Fuse(routes);
    const results = fuse.search(searchText)
    var items: string[] = []

    for (let i = 0; i < results.length; i++) {
        items.push(results[i].item)
    }

    return items;
}