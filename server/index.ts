import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { movie, review, user } from "./database/model.js";

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

interface JWT {
  user_id: string;
}

type RequestAuthed = express.Request & { user?: JWT };

const JWT_NAME = "loop_cinemas_jwt";
const JwtManager = {
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
          .json({ type: "error", msg: "Error verifying JWT" });
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
      return res
        .status(403)
        .json({ type: "error", msg: "JWT could not be verified" });
    }
  },
  async set(res: express.Response, data: JWT) {
    const token = await JwtManager.generateAccessToken(data);
    res.cookie(JWT_NAME, token, {
      maxAge: 99999999999999,
    });
  },
};

const PasswordManager = {
  hashPassword: async (password: string) => {
    return bcrypt.hash(password, 10);
  },
  comparePassword: async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
  },
};

const TryCatch = (_: express.Request, res: express.Response, next: any) => {
  try {
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({ type: "error", msg: "Internal server error" });
  }
};

app.post("/api/user/signup", TryCatch, async (req, res) => {
  const { name, email, password } = req.body;
  // check if user exists
  const existing = await user.findOne({ where: { email } });
  if (existing) {
    res.status(400).json({ type: "error", msg: "User already exists" });
    return;
  }

  const passwordHashed = await PasswordManager.hashPassword(password);
  const created = await user.create({
    name,
    email,
    password: passwordHashed,
  });

  await JwtManager.set(res, { user_id: created.user_id });

  res.json({ type: "user", user: created });
});

app.post("/api/user/signin", TryCatch, async (req, res) => {
  const { email, password } = req.body;
  const existing = await user.findOne({ where: { email } });
  if (!existing) {
    res.status(400).json({ type: "error", msg: "User does not exist" });
    return;
  }
  const passwordMatch = await PasswordManager.comparePassword(
    password,
    existing.getPassword()
  );
  if (!passwordMatch) {
    res.status(400).json({ type: "error", msg: "Password is incorrect" });
    return;
  }
  await JwtManager.set(res, { user_id: existing.user_id });

  res.json({ type: "user", user: existing });
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

app.listen(5000, () => {
  console.log("API Server listening on http://localhost:5000");
});
