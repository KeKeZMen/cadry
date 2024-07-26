import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@shared";
import { z } from "zod";
import { createSchema } from "./model";

export const organizationApi = createApi({
  reducerPath: "organization",
  baseQuery: axiosBaseQuery({ baseUrl: "/organization" }),
  tagTypes: ["Organization"],
  endpoints: (build) => ({
    createOrganization: build.query<
      IOrganization,
      z.infer<typeof createSchema>
    >({
      query: (createSchema) => ({
        method: "POST",
        url: "/",
        data: createSchema,
      }),
      invalidatesTags: ["Organization"],
    }),
    getOrganizations: build.query<IOrganization[], void>({
      query: () => ({
        method: "GET",
        url: "/",
      }),
      providesTags: ["Organization"],
    }),
  }),
});

export const { useGetOrganizationsQuery } = organizationApi;
