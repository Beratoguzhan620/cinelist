import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";

import { filmsApi } from "./filmsApi";
import preferences from "./preferencesSlice";

const rootReducer = combineReducers({
  preferences,
  [filmsApi.reducerPath]: filmsApi.reducer,
});

// Only user preferences survive a restart; film data always comes fresh from the API.
const persistedReducer = persistReducer(
  { key: "cinelist", version: 1, storage: AsyncStorage, whitelist: ["preferences"] },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }).concat(filmsApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
