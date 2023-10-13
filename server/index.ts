import express from "express";

import model from "./database/model";

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  const d = await model.User.findAll();
  res.json({ message: d });
});

app.listen(5000, () => {
  console.log("API Server listening on http://localhost:5000");
});
