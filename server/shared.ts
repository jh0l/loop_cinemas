import express from "express";
import { ApiResponse } from "../src/types/index.js";

export const TryCatch = (
  _: express.Request,
  res: express.Response,
  next: any
) => {
  try {
    next();
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ type: "error", msg: "Internal server error" } as ApiResponse);
  }
};
