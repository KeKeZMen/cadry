import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseAxios, ErrorResponseType } from "@shared";

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
      const result = await baseAxios.post<IAuthResponse>("/auth/login", {
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
    const result = await baseAxios.get<IAuthResponse>(`/auth/refresh`);
    localStorage.setItem("token", result.data.accessToken);
    return result.data.user;
  } catch (error) {
    localStorage.clear();
    return thunkApi.rejectWithValue((error as ErrorResponseType).message);
  }
});

export const registerOrganization = createAsyncThunk(
  "auth/registration",
  async ({ inn, password, email }: RegisterType, thunkApi) => {
    try {
      const result = await baseAxios.post<IAuthResponse>(
        "/auth/register-organization",
        {
          inn,
          password,
          email,
        }
      );
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
    await baseAxios.get("/auth/logout");
    return;
  } catch (error) {
    return thunkApi.rejectWithValue((error as ErrorResponseType).message);
  }
});
