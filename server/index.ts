import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { movie, review, user } from "./database/model.js";
import { ApiResponse } from "../src/types/index.js";
import { JwtManager, RequestAuthed, TryCatch } from "./shared.js";
import { MOVIES } from "./fakeData.js";
import MovieApi from "./movie_api.js";
import ReviewApi from "./review_api.js";

//For env File
dotenv.config();
/**
 * TODO
 * [] user authentication
 *  [] signup
 *    [] hash password
 *    [] check unique
 *
 *  */

const app = express();
app.use(cookieParser());
app.use(express.json());

const PasswordManager = {
  hashPassword: async (password: string) => {
    return bcrypt.hash(password, 10);
  },
  comparePassword: async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
  },
};

app.post("/api/user/signup", TryCatch, async (req, res) => {
  const { name, email, password } = req.body;
  // check if user exists
  const existing = await user.findOne({ where: { email } });
  if (existing) {
    res
      .status(400)
      .json({ type: "error", msg: "User already exists" } as ApiResponse);
    return;
  }

  const passwordHashed = await PasswordManager.hashPassword(password);
  const created = await user.create({
    name,
    email,
    password: passwordHashed,
  });

  await JwtManager.set(res, { user_id: created.user_id });

  res.json({ type: "user", user: created } as ApiResponse);
});

app.post("/api/user/signin", TryCatch, async (req, res) => {
  const { email, password } = req.body;
  const existing = await user.findOne({ where: { email } });
  if (!existing) {
    res
      .status(400)
      .json({ type: "error", msg: "User does not exist" } as ApiResponse);
    return;
  }
  const passwordMatch = await PasswordManager.comparePassword(
    password,
    existing.getPassword()
  );
  if (!passwordMatch) {
    res
      .status(400)
      .json({ type: "error", msg: "Password is incorrect" } as ApiResponse);
    return;
  }
  await JwtManager.set(res, { user_id: existing.user_id });

  res.json({ type: "user", user: existing } as ApiResponse);
});

/**
 * sign out user
 */
app.get("/api/user/signout", TryCatch, async (req, res) => {
  JwtManager.clear(res);
  res.json({ type: "success", msg: "User signed out" } as ApiResponse);
});

app.get(
  "/api/user",
  TryCatch,
  JwtManager.authenticateToken,
  async (req: RequestAuthed, res) => {
    const userRes = await user.findOne({
      where: { user_id: req.user?.user_id },
    });
    res.json({ type: "user", user: userRes });
  }
);

app.patch(
  "/api/user",
  TryCatch,
  JwtManager.authenticateToken,
  async (req: RequestAuthed, res) => {
    const { name, email, password } = req.body;
    const userRes = await user.findOne({
      where: { user_id: req.user?.user_id },
    });
    if (!userRes) {
      res
        .status(400)
        .json({ type: "error", msg: "User does not exist" } as ApiResponse);
      return;
    }
    if (name) {
      userRes.name = name;
    }
    if (email) {
      // check email is not used by another user
      const existing = await user.findOne({ where: { email } });
      if (existing && existing.user_id !== userRes.user_id) {
        res
          .status(400)
          .json({ type: "error", msg: "Email already in use" } as ApiResponse);
        return;
      }
      userRes.email = email;
    }
    if (password) {
      userRes.password = await PasswordManager.hashPassword(password);
    }
    await userRes.save();
    res.json({ type: "user", user: userRes });
  }
);

app.delete(
  "/api/user",
  TryCatch,
  JwtManager.authenticateToken,
  async (req: RequestAuthed, res) => {
    const userRes = await user.findOne({
      where: { user_id: req.user?.user_id },
    });
    if (!userRes) {
      res
        .status(400)
        .json({ type: "error", msg: "User does not exist" } as ApiResponse);
      return;
    }
    // delete all reviews
    await review.destroy({ where: { user_id: userRes.user_id } });
    await userRes.destroy();
    res.json({ type: "user", user: userRes });
  }
);

app.get("/api/populate_fake_data", TryCatch, async (_, res) => {
  MOVIES.forEach(async (m) => {
    const mMod = { ...m, genres: m.genres.join(",") };
    await movie.create(mMod);
  });
  res.json({ type: "success", msg: "Fake data populated" } as ApiResponse);
});

MovieApi(app);
ReviewApi(app);

app.listen(5000, () => {
  console.log("API Server listening on http://localhost:5000");
});
