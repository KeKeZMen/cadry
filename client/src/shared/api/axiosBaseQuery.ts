import { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { AxiosRequestConfig } from "axios";

import { axiosWithAuth, ErrorResponseType } from "./axiosApi";

type AxiosQueryType = {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
};

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<AxiosQueryType, unknown, unknown> =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosWithAuth({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (error) {
      return error as ErrorResponseType;
    }
  };
