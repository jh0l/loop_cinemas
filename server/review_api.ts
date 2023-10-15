import express from "express";
import { TryCatch } from "./shared.js";
import { review } from "./database/model.js";
import { ApiResponse, Review } from "../src/types/index.js";

export default function ReviewApi(app: express.Express) {
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
}
