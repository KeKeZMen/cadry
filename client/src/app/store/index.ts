import { jobRequestsApi } from "@entities/job-request";
import { organizationApi } from "@entities/organization";
import { authSlice } from "@features/auth";
import { combineReducers, configureStore } from "@reduxjs/toolkit/react";

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [jobRequestsApi.reducerPath]: jobRequestsApi.reducer,
  [organizationApi.reducerPath]: organizationApi.reducer,
});

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (gDM) =>
      gDM().concat(jobRequestsApi.middleware, organizationApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
