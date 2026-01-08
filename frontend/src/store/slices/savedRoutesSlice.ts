import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SavedRoute } from "@/src/types";

interface SavedRoutesState {
  routes: SavedRoute[];
}

const initialState: SavedRoutesState = {
  routes: [],
};

const savedRoutesSlice = createSlice({
  name: "savedRoutes",
  initialState,
  reducers: {
    addRoute: (state, action: PayloadAction<SavedRoute>) => {
      state.routes.push(action.payload);
    },
    removeRoute: (state, action: PayloadAction<string>) => {
      state.routes = state.routes.filter(
        (route) => route.id !== action.payload
      );
    },
    updateRoute: (state, action: PayloadAction<SavedRoute>) => {
      const index = state.routes.findIndex(
        (route) => route.id === action.payload.id
      );
      if (index !== -1) {
        state.routes[index] = action.payload;
      }
    },
    renameRoute: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const route = state.routes.find((r) => r.id === action.payload.id);
      if (route) {
        route.name = action.payload.name;
      }
    },
    clearAllRoutes: (state) => {
      state.routes = [];
    },
  },
});

export const selectAllSavedRoutes = (state: {
  savedRoutes: SavedRoutesState;
}) => state.savedRoutes.routes;

export const selectSavedRouteById =
  (id: string) => (state: { savedRoutes: SavedRoutesState }) =>
    state.savedRoutes.routes.find((route) => route.id === id);

export const selectSavedRoutesByType =
  (type: SavedRoute["routeType"]) =>
  (state: { savedRoutes: SavedRoutesState }) =>
    state.savedRoutes.routes.filter((route) => route.routeType === type);

export const {
  addRoute,
  removeRoute,
  updateRoute,
  renameRoute,
  clearAllRoutes,
} = savedRoutesSlice.actions;

export default savedRoutesSlice.reducer;
