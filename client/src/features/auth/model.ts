import { createSlice } from "@reduxjs/toolkit";
import { login, logout, reauth, registerOrganization } from "./api";

type InitialStateType = {
  user: IAccount;
  isAuth: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
};

const initialState: InitialStateType = {
  user: {} as IAccount,
  isLoading: false,
  isError: false,
  errorMessage: null,
  isAuth: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError(state) {
      state.isError = false;
      state.errorMessage = null;
    },
  },
  extraReducers(builder) {
    //login()
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload as IAccount;
      }),
      builder.addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      }),
      //reauth()
      builder.addCase(reauth.pending, (state) => {
        state.isLoading = true;
      }),
      builder.addCase(reauth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload as IAccount;
      }),
      builder.addCase(reauth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      }),
      //logout()
      builder.addCase(logout.pending, (state) => {
        state.isLoading = true;
      }),
      builder.addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.user = {} as IAccount;
      }),
      builder.addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuth = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      });

    //registration()
    builder.addCase(registerOrganization.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(registerOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload as IAccount;
      }),
      builder.addCase(registerOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      });
  },
});

export const { resetError } = authSlice.actions;
