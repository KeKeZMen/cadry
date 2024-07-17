import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@shared";

export const jobRequestsApi = createApi({
  reducerPath: "jobRequests",
  baseQuery: axiosBaseQuery({ baseUrl: "/job-request" }),
  refetchOnMountOrArgChange: true,
  tagTypes: ["JobRequests"],
  endpoints: (build) => ({
    getRequests: build.query<IJobRequest[], void | string>({
      query: (organizationId) => ({
        method: "GET",
        url: organizationId ? `/${organizationId}` : "/",
      }),
      providesTags: ["JobRequests"],
    }),
  }),
});

export const { useGetRequestsQuery } = jobRequestsApi;
