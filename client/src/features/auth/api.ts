import { createAsyncThunk } from "@reduxjs/toolkit";
import { $api, ErrorResponseType } from "@shared";
import axios from "axios";

export type RegisterType = {
  inn: string;
  email: string;
  password: string;
};

export type LoginType = {
  email: string;
  password: string;
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: LoginType, thunkApi) => {
    try {
      const result = await $api.post<IAuthResponse>("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", result.data.accessToken);
      return result.data.user;
    } catch (error) {
      return thunkApi.rejectWithValue((error as ErrorResponseType).message);
    }
  }
);

export const reauth = createAsyncThunk("auth/refresh", async (_, thunkApi) => {
  try {
    const result = await axios.get<IAuthResponse>(
      `${import.meta.env.VITE_SERVER_URL}/auth/refresh`,
      { withCredentials: true }
    );
    localStorage.setItem("token", result.data.accessToken);
    return result.data.user;
  } catch (error) {
    return thunkApi.rejectWithValue((error as ErrorResponseType).message);
  }
});

export const register = createAsyncThunk(
  "auth/registration",
  async ({ inn, password, email }: RegisterType, thunkApi) => {
    try {
      const result = await $api.post<IAuthResponse>("/auth/registration", {
        inn,
        password,
        email,
      });
      localStorage.setItem("token", result.data.accessToken);
      return result.data.user;
    } catch (error) {
      return thunkApi.rejectWithValue((error as ErrorResponseType).message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
  try {
    localStorage.clear();
    return await $api.post("/auth/logout");
  } catch (error) {
    return thunkApi.rejectWithValue((error as ErrorResponseType).message);
  }
});
