import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MapState {
  useLeafletMap: boolean;
}

const initialState: MapState = {
  useLeafletMap: false,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setUseLeafletMap: (state, action: PayloadAction<boolean>) => {
      state.useLeafletMap = action.payload;
    },
    toggleUseLeafletMap: (state) => {
      state.useLeafletMap = !state.useLeafletMap;
    },
  },
});

export const { setUseLeafletMap, toggleUseLeafletMap } = mapSlice.actions;

export const selectUseLeafletMap = (state: { map: MapState }) =>
  state.map.useLeafletMap;

export default mapSlice.reducer;
