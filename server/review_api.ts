import express from "express";
import { JwtManager, RequestAuthed, TryCatch } from "./shared.js";
import { review } from "./database/model.js";
import { ApiResponse, Review } from "../src/types/index.js";

export default function ReviewApi(app: express.Express) {
  /**
   * get all reviews, optionally filtered by user_id
   */
  app.get("/api/reviews", TryCatch, async (req, res) => {
    // optional user_id query parameter
    const user_id = req.query.user_id as string | undefined;
    if (user_id) {
      const reviews: Review[] = await review.findAll({
        where: { user_id },
      });
      res.json({ type: "reviews", reviews } as ApiResponse);
      return;
    }
    const reviews: Review[] = await review.findAll();
    res.json({ type: "reviews", reviews } as ApiResponse);
  });

  /**
   * add a review to the database, or update it if it already exists. Requires authentication
   */
  app.post(
    "/api/reviews",
    TryCatch,
    JwtManager.authenticateToken,
    async (req: RequestAuthed, res) => {
      const { movie_id, rating, content } = req.body;
      const user_id = req.user?.user_id;
      if (!user_id) {
        res
          .status(400)
          .json({ type: "error", msg: "user_id not found" } as ApiResponse);
        return;
      }
      await review.upsert({
        movie_id,
        user_id,
        rating,
        content,
      });
      res.json({ type: "success", msg: "review submitted" } as ApiResponse);
    }
  );

  /**
   * delete a review from the database. Requires authentication, and the user_id must match the user_id of the review
   */
  app.delete(
    "/api/reviews",
    TryCatch,
    JwtManager.authenticateToken,
    async (req: RequestAuthed, res) => {
      const { movie_id, user_id } = req.body;
      if (!movie_id || !user_id) {
        res
          .status(400)
          .json({ type: "error", msg: "movie_id not found" } as ApiResponse);
        return;
      }
      // check review exists
      const existing = await review.findOne({
        where: { movie_id, user_id },
      });
      if (!existing) {
        res
          .status(400)
          .json({ type: "error", msg: "Review does not exist" } as ApiResponse);
        return;
      }
      // check user owns review
      if (existing.user_id !== req.user?.user_id) {
        res
          .status(400)
          .json({ type: "error", msg: "Invalid user" } as ApiResponse);
        return;
      }
      await review.destroy({
        where: { movie_id, user_id },
      });
      res.json({ type: "success", msg: "review deleted" } as ApiResponse);
    }
  );
}
