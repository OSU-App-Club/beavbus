# OSU BeavBus Backend API

## Documentation

Query Params act as filters on the output data

| API Endpoint | Query Params | Response Format |
| :----------: | :----------: | :-------------: |
| `/api/beaver_bus/routes` | | [`Route[]`](#route)|
| `/api/beaver_bus/stops` | `route_id` | [`Stop[]`](#stop)|
| `/api/beaver_bus/vehicles` | `route_id`, `vehicle_id` | [`Vehicle[]`](#vehicle)|

### API Types

#### `Route`

```json
{
    "name": "", // Route Name
    "latitude": 0, // Latitude to Centre Map on
    "longitude": 0, // Longitude to Centre Map on
    "route_id": 0, // Route ID
    "link_to_stop_times": "", // Link to canonical PDF of map and times
    "route_color": "" // RGB HEX Code defining the colour of the route for mapping purposes
}
```

#### `Stop`

```json
{
    "name": "", // Name of Stop,
    "latitude": 0, // Latitude of Stop
    "longtiude": 0, // Longitude of Stop
    "route_id": 0, // Route ID (use /route to get more route details)
    "route_stop_id": 0 // Stop ID
}
```

#### `Vehicle`

```json
{
    "name": "", // Name of Bus
    "latitude": 0, // Latitude of Bus
    "longitude": 0, // Longitude of Bus
    "route_id": 0, // Route ID (use /route to get more route details)
    "speed": 0, // Ground Speed of bus
    "heading": 0, // Angle Heading Direction of Bus
    "is_delayed": false, // Whether the bus is delayed
    "is_on_route": false, // Whether the bus is on route
    "vehicle_id": 0, // The ID of the Vehicle
    "seconds_at_stop": 14, // How many seconds the bus has spent at the stop
    "last_updated_timestamp": "" // Timestamp of when the data last updated
}
```