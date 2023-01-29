import cookieSession from "cookie-session";
import express from "express";
import cors from "cors";
import "./passport/passport.js";
import passport from "passport";

import auth from "./routes/auth.route.js";
import { envConfig } from "./config/env.config.js";
const app = express();

let version = "v1";

app.use(
  cookieSession({
    maxAge: 3 * 24 * 60 * 60 * 1000,
    name: "session",
    keys: ["thisislcotokenkey"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: envConfig.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// User router
app.use(`/api/${version}`, auth);

export default app;
