import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import GitHubStrategy from "passport-github2";
import passport from "passport";
import { envConfig } from "../config/env.config.js";
import User from "../models/user.model.js";

const { API_URL } = envConfig;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
console.log(API_URL);
// Google authenticate
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: envConfig.GOOGLE_CLIENT_ID,
      clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
      callbackURL: `${API_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, next) => {
      User.findOne({ email: profile._json.email }).then((user) => {
        if (user) {
          next(null, user);
        } else {
          User.create({
            name: profile.displayName,
            googleId: profile.id,
            email: profile._json.email,
            photo: profile._json?.picture,
            password: null,
          })
            .then((user) => {
              next(null, user);
            })
            .catch((err) => console.log(err));
        }
      });
    }
  )
);

// Facebook authenticate
passport.use(
  new FacebookStrategy(
    {
      clientID: envConfig.FACEBOOK_APP_ID,
      clientSecret: envConfig.FACEBOOK_APP_SECRET,
      callbackURL: `${API_URL}/auth/facebook/callback`,
    },
    function (accessToken, refreshToken, profile, next) {
      User.findOne({ facebookId: profile._json.id }).then((user) => {
        if (user) {
          next(null, user);
        } else {
          User.create({
            name: profile.displayName,
            facebookId: profile._json.id,
            email: profile._json?.email || null,
            photo: profile._json?.picture || null,
            password: null,
          })
            .then((user) => {
              next(null, user);
            })
            .catch((err) => console.log({ err }));
        }
      });
    }
  )
);

// Github authenticate
passport.use(
  new GitHubStrategy(
    {
      clientID: envConfig.GITHUB_CLIENT_ID,
      clientSecret: envConfig.GITHUB_CLIENT_SECRET,
      callbackURL: `${API_URL}/auth/github/callback`,
    },
    function (accessToken, refreshToken, profile, next) {
      User.findOne({ githubId: profile._json.id }).then((user) => {
        if (user) {
          next(null, user);
        } else {
          User.create({
            name: profile._json?.name,
            userName: profile._json.login,
            githubId: profile._json.id,
            email: profile._json?.email || null,
            photo: profile._json?.avatar_url || null,
            password: null,
            data: profile._json,
          })
            .then((user) => {
              next(null, user);
            })
            .catch((err) => console.log({ err }));
        }
      });
    }
  )
);
