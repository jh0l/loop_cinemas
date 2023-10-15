import express from "express";
import { TryCatch } from "./shared.js";
import { genSessions } from "./fakeData.js";
import { movie, session } from "./database/model.js";
import { ApiResponse } from "../src/types/index.js";

/**
 * SessionApi for getting sessions for a movie
 */

export default function SessionApi(app: express.Express) {
  /**
   * get all sessions for a movie
   * @param movie_id the id of the movie
   */
  app.get("/api/sessions", TryCatch, async (req, res) => {
    const { movie_id } = req.query;
    if (!movie_id || typeof movie_id !== "string") {
      res.status(400).json({ type: "error", msg: "movie_id not found" });
      return;
    }
    const movieRes = await movie.findByPk(movie_id);
    if (!movieRes) {
      res
        .status(400)
        .json({ type: "error", msg: "movie not found" } as ApiResponse);
      return;
    }
    const sessions = await movieRes.getSessions();
    res.json({ type: "sessions", sessions } as ApiResponse);
  });

  /**
   * generate fake session times for all movies
   */
  app.get("/api/sessions/generate", TryCatch, async (_, res) => {
    const movies = await movie.findAll();
    // generate sessions for each movie
    const proms: Promise<session>[] = [];
    movies.forEach((m) => {
      genSessions(m.movie_id).forEach((s) => {
        proms.push(session.create(s));
      });
    });
    await Promise.all(proms);
    res.json({ type: "success", msg: "sessions generated" });
  });
}
