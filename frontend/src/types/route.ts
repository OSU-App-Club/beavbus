/**
 * Represents a coordinate point on a route
 */
interface RouteCoordinate {
  latitude: number;
  longitude: number;
}

/**
 * Represents a saved route that the user can quickly re-navigate
 * This is a basic structure - expand as needed for your routing API
 */
interface SavedRoute {
  id: string;
  name: string;
  createdAt: string;

  // Origin and destination
  origin: {
    name: string;
    coordinates: RouteCoordinate;
  };
  destination: {
    name: string;
    coordinates: RouteCoordinate;
  };

  // Route type: bus, walking, or mixed
  routeType: "bus" | "walking" | "mixed";

  // Optional: store estimated duration/distance for quick display
  estimatedDuration?: number; // in minutes
  estimatedDistance?: number; // in meters

  // Optional: any additional metadata you want to store
  // e.g., specific bus lines, transfer points, etc.
  metadata?: Record<string, unknown>;
}

export type { RouteCoordinate, SavedRoute };
