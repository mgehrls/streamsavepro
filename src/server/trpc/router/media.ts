import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import axios, { AxiosResponse } from "axios";
import { SearchData, SearchResult } from "../../../types/interface";
import { env } from "../../../env/server.mjs";

export const mediaRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.listItem.findMany()
  }),
  getSearchResults: publicProcedure
    .input(z.string())
    .query(async (req) => {
    const apiKey = env.API_KEY_SECRET
    const response: AxiosResponse<SearchData> = await axios.get(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=${req.input}&page=1&include_adult=false`
    );
    return response.data;
  }),
  getTrendingData:publicProcedure
    .query(async ()=>{
      const apiKey = env.API_KEY_SECRET
      const series: AxiosResponse<{results: SearchResult[]}> = await axios(`https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}`)
      const movies: AxiosResponse<{results: SearchResult[]}> = await axios(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`)
      return {series: series.data.results, movies: movies.data.results}
    }),
  getSeriesData:publicProcedure
    .input(z.number())
    .query(async (req)=>{
      const apiKey = env.API_KEY_SECRET
      const response: AxiosResponse<SearchResult> = await axios(`https://api.themoviedb.org/3/tv/${req.input}?api_key=${apiKey}&language=en-US`)
      return response.data
    })
});
