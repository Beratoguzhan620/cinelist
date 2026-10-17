import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ViewMode = "grid" | "list";
export type SortOrder = "newest" | "rating" | "year" | "title";

export type PreferencesState = {
  viewMode: ViewMode;
  sortOrder: SortOrder;
};

const initialState: PreferencesState = {
  viewMode: "grid",
  sortOrder: "newest",
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },
    setSortOrder(state, action: PayloadAction<SortOrder>) {
      state.sortOrder = action.payload;
    },
  },
});

export const { setViewMode, setSortOrder } = preferencesSlice.actions;
export default preferencesSlice.reducer;
