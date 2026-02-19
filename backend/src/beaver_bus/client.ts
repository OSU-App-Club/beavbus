interface Stop {
    name: string,
    latitude: number,
    longitude: number,
    route_id: number,
    route_stop_id: number,
}

interface Route {
    name: string,
    latitude: number,
    longitude: number,
    route_id: number,
    link_to_stop_times: string,
    route_color: string
}

class BeaverBusAPI {
    base_url: string = "https://osushuttles.com";
    api_key: string;

    constructor() {
        this.__getClientSettings().then(() => {}).catch(() => {
            console.error("Failed to configure Beaver Bus API Client")
        });
    }

    async __getClientSettings() {
        // There is a bunch of configuration options here, we only really need the API Key.
        interface MapConfig {
            ApiKey: string
        }

        try {
            const res = await fetch(
                `${this.base_url}/Services/JSONPRelay.svc/GetMapConfig`
            );

            const map_config: MapConfig = await res.json();

            this.api_key = map_config.ApiKey;
            console.log("API Created");
        } catch (err) {
            console.error(err.message);
        }
    }

    async __getProtectedEndpoint(endpoint: string): Promise<any> {
        try {
            if (this.api_key.length <= 0) {
                throw "Beaver Bus API Key not present"
            }

            const res = await fetch(
                `${this.base_url}/Services/JSONPRelay.svc/${endpoint}?apiKey=${this.api_key}`
            );

            const data = await res.json();

            return data;
        } catch (err) {
            console.error(err.message);
        }
    }

    async __getProtectedEndpointWithParams(endpoint: string, params: string) {
        try {
            if (this.api_key.length <= 0) {
                throw "Beaver Bus API Key not present"
            }

            const res = await fetch(
                `${this.base_url}/Services/JSONPRelay.svc/${endpoint}?apiKey=${this.api_key}&${params}`
            );

            const data = await res.json();

            return data;
        } catch (err) {
            console.error(err.message);
        }
    }

    async getStops(routeID: number|null = null) {
        interface APIStop {
            Description: string,
            Latitude: number,
            Longitude: number,
            RouteID: number,
            RouteStopID: number
        };

        let returned_stops: APIStop[] = [];
        if (routeID) {
            returned_stops = await this.__getProtectedEndpointWithParams("GetStops", `routeID=${routeID}`);
        } else {
            returned_stops = await this.__getProtectedEndpoint("GetStops");
        }

        let stops = [];
        for (const api_stop of returned_stops) {
            let stop: Stop = {
                name: api_stop.Description,
                latitude: api_stop.Latitude,
                longitude: api_stop.Longitude,
                route_id: api_stop.RouteID,
                route_stop_id: api_stop.RouteStopID
            }
            stops.push(stop);
        }

        return stops;
    }

    async getRoutes() {
        interface APIRoute {
            Description: string,
            HideRouteLine: boolean,
            IsVisibleOnMap: boolean
            MapLineColor: string,
            MapLatitude: number,
            MapLongitude: number,
            RouteID: number,
            StopTimesPDFLink: string
        };

        let returned_routes: APIRoute[] = await this.__getProtectedEndpoint("GetRoutes");

        let routes = [];
        for (const api_route of returned_routes) {
            if (api_route.HideRouteLine || !api_route.IsVisibleOnMap) {
                continue;
            }

            let route: Route = {
                name: api_route.Description,
                latitude: api_route.MapLatitude,
                longitude: api_route.MapLongitude,
                route_id: api_route.RouteID,
                link_to_stop_times: api_route.StopTimesPDFLink,
                route_color: api_route.MapLineColor
            }
            routes.push(route);
        }

        return routes;
    }
}

export default BeaverBusAPI;