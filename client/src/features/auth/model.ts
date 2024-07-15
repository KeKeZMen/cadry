import { createSlice } from "@reduxjs/toolkit";
import { login, logout, reauth, register } from "./api";

type InitialStateType = {
  user: IUser;
  isAuth: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
};

const initialState: InitialStateType = {
  user: {} as IUser,
  isLoading: false,
  isError: false,
  errorMessage: null,
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
      state.user = action.payload as IUser;
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
      state.user = action.payload as IUser;
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
      state.user = {} as IUser;
    }),
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuth = false;
      state.isError = true;
      state.errorMessage = action.payload as string;
    });

    //registration()
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
    }),
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuth = false;
      state.user = action.payload as IUser;
    }),
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload as string;
    });
  },
});
