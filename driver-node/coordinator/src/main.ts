import dotenv from "dotenv";
import express, { Request, Response } from "express";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
