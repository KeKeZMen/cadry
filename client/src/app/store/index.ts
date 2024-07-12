import { combineReducers, configureStore } from "@reduxjs/toolkit/react";

const rootReducer = combineReducers({});

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
