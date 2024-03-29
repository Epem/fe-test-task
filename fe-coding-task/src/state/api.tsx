import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiRawData, ApiRequestData, ChartRequestBody } from "../interfaces";
import { buildChartRequestBody } from "../utils";

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "https://data.ssb.no/",
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    reducerPath: "api",
    endpoints: (build) => ({
        getChartData: build.mutation<ApiRawData, ApiRequestData>({
            query: (body) => {
            const requestBody: ChartRequestBody = buildChartRequestBody(body.boligType, body.contentsCode, body.tid, body.responseFormat)        
            return {
                url: `/api/v0/no/table/07241`,
                method: 'POST',
                body: requestBody,
            }},
        }),
    }),
});

export const {
    useGetChartDataMutation
} = api;