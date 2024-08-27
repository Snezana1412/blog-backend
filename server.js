import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import { createError } from "./utils/helper.js";
import { connectToDB } from "./utils/database.js";
import userRouter from './routers/users.router.js';
import postRouter from './routers/posts.router.js';

dotenv.config();
const app = express();

// database connection
connectToDB();

// middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true}));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
app.use('/users', userRouter);
app.use('/posts', postRouter);

// error handler
app.use((req, res, next) => {
  next(createError("Route not found!", 404));
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({ msg: err.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`server is up on port: ${port} 🚀`));
