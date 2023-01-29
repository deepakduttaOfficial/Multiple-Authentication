import express from "express";
import passport from "passport";
import { envConfig } from "../config/env.config";
const router = express.Router();

const { CLIENT_URL } = envConfig;

// Google auth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
  })
);

// Facebook auth
router.get("/auth/facebook", passport.authenticate("facebook"));
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: CLIENT_URL,
  })
);

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: CLIENT_URL,
  })
);

// Common routers
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

router.get("/auth/check", (req, res) => {
  if (req.user) {
    res.status(200).send({ authenticated: true, user: req.user });
  } else {
    res.status(401).send({ authenticated: false });
  }
});

export default router;
