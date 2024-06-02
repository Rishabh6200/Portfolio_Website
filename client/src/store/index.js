import authReducer from '../admin/Auth/feature/authSlice'
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import allReducer from '../admin/slices/mainSlice';

const reducers = combineReducers({
   auth: authReducer,
   all: allReducer
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
