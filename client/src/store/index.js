import authReducer from '../admin/Auth/feature/authSlice'
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

const reducers = combineReducers({
   auth: authReducer,
});

const persistConfig = {
   key: "root",
   storage,
   blacklist: ['register', 'rehydrate']
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false
   }),
});
