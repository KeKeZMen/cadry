import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@shared";

export const organizationApi = createApi({
  reducerPath: "organization",
  baseQuery: axiosBaseQuery({ baseUrl: "/organization" }),
  tagTypes: ["Organization"],
  endpoints: (build) => ({
    getOrganizations: build.query<IOrganization[], void>({
      query: () => ({
        method: "GET",
        url: "/",
      }),
    }),
  }),
});

export const { useGetOrganizationsQuery } = organizationApi;
