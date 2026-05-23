import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  useGoogleMaps: boolean;
}

const initialState: SettingsState = {
  useGoogleMaps: true, // Default to true (Google Maps)
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setUseGoogleMaps: (state, action: PayloadAction<boolean>) => {
      state.useGoogleMaps = action.payload;
    },
    toggleUseGoogleMaps: (state) => {
      state.useGoogleMaps = !state.useGoogleMaps;
    },
  },
});

export const selectUseGoogleMaps = (state: { settings: SettingsState }) =>
  state.settings.useGoogleMaps;

export const { setUseGoogleMaps, toggleUseGoogleMaps } = settingsSlice.actions;

export default settingsSlice.reducer;
