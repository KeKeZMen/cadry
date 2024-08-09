import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@shared";
import { z } from "zod";
import { createSchema, updateSchema } from "./model";

export const organizationApi = createApi({
  reducerPath: "organization",
  baseQuery: axiosBaseQuery({ baseUrl: "/organization" }),
  tagTypes: ["Organization"],
  endpoints: (build) => ({
    createOrganization: build.mutation<
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

    updateOrganization: build.mutation<
      IOrganization,
      { updateSchema: z.infer<typeof updateSchema>; id: string }
    >({
      query: ({ updateSchema, id }) => ({
        method: "PATCH",
        url: `/${id}`,
        data: updateSchema,
      }),
      invalidatesTags: ["Organization"],
    }),

    deleteOrganization: build.mutation<void, string>({
      query: (id) => ({
        method: "DELETE",
        url: `/${id}`,
      }),
      invalidatesTags: ["Organization"],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useCreateOrganizationMutation,
  useDeleteOrganizationMutation,
  useUpdateOrganizationMutation,
} = organizationApi;
