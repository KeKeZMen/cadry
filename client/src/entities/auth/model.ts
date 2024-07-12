import { createSlice } from "@reduxjs/toolkit";
import { login, logout, reauth, register } from "./api";

type InitialStateType = {
  user: IUser;
  isLoading: boolean;
  isError: boolean;
  errorData: any;
  isAuth: boolean;
};

const initialState: InitialStateType = {
  user: {} as IUser,
  isLoading: false,
  isError: false,
  errorData: null,
  isAuth: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    //login()
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload;
      }),
      builder.addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorData = action.payload;
      }),
      //reauth()
      builder.addCase(reauth.pending, (state) => {
        state.isLoading = true;
      }),
      builder.addCase(reauth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload;
      }),
      builder.addCase(reauth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorData = action.payload;
      }),
      //logout()
      builder.addCase(logout.pending, (state) => {
        state.isLoading = true;
      }),
      builder.addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.user = {} as IUser;
      }),
      builder.addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuth = false;
        state.isError = true;
        state.errorData = action.payload;
      });

    //registration()
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = false;
        state.user = action.payload;
      }),
      builder.addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorData = action.payload;
      });
  },
});
