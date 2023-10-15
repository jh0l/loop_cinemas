import express from "express";
import jwt from "jsonwebtoken";

import { ApiResponse } from "../src/types/index.js";

/**
 * TryCatch is a middleware that wraps the request in a try catch block and sends a 500 error if an error is thrown
 */
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

interface JWT {
  user_id: string;
}

export type RequestAuthed = express.Request & { user?: JWT };

const JWT_NAME = "loop_cinemas_jwt";

/**
 * JwtManager manages JWT tokens, including generating, verifying, and setting/clearing cookies
 */
export const JwtManager = {
  generateAccessToken: async ({ user_id }: JWT) => {
    return jwt.sign({ user_id }, process.env.JWT_SECRET as string, {
      expiresIn: "999999s",
    });
  },
  authenticateToken(req: RequestAuthed, res: express.Response, next: any) {
    const token = req.cookies[JWT_NAME];
    if (!token) {
      return res.sendStatus(401);
    }
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET as string);
      if (!user || typeof user === "string") {
        return res
          .status(403)
          .json({ type: "error", msg: "Error verifying JWT" } as ApiResponse);
      }
      if ("user_id" in user === false) {
        return res
          .status(403)
          .json({ type: "error", msg: "user_id not found" });
      } else {
        req.user = { user_id: user.user_id };
      }
      next();
    } catch (e) {
      console.log(e);
      return res.status(403).json({
        type: "error",
        msg: "JWT could not be verified",
      } as ApiResponse);
    }
  },
  async set(res: express.Response, data: JWT) {
    const token = await JwtManager.generateAccessToken(data);
    res.cookie(JWT_NAME, token, {
      maxAge: 99999999999999,
    });
  },

  async clear(res: express.Response) {
    res.clearCookie(JWT_NAME);
  },
};
