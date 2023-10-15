import express from "express";
import { TryCatch } from "./shared.js";
import { movie } from "./database/model.js";
import { ApiResponse, Movie } from "../src/types/index.js";

/**
 * MovieApi for getting movies
 */
export default function MovieApi(app: express.Express) {
  app.get("/api/movies", TryCatch, async (_, res) => {
    const movies: Movie[] = (await movie.findAll()).map(
      (m) =>
        ({
          ...m.toJSON(),
          genres: m.genres.split(","),
          showTimes: [],
        } as Movie)
    );
    res.json({ type: "movies", movies } as ApiResponse);
  });
}
