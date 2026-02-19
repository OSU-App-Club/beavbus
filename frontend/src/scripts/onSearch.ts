export default function onSearch(routes: string[], searchText: string) {
    return routes.filter((word) =>  word.includes(searchText))
}