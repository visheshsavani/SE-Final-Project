// passportConfig.js

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// passportConfig.js
import {userModel} from '../models/userModel.js';

import dotenv from 'dotenv';
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails } = profile;

      try {
        // Check if user already exists
        let existingUser = await userModel.findOne({ googleId: id });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Create a new user
        const newUser = new userModel({
          name: displayName,
          email: emails[0].value,
          googleId: id,
        });

        const savedUser = await newUser.save();
        done(null, savedUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});