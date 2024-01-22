const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config();

const app = express();

// Passport session setup
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Use the GoogleStrategy within Passport
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3005/v1/auth/google/callback"
},
(accessToken, refreshToken, profile, done) => {
    // Here, you would typically find or create the user in your database
    const user = { profile, accessToken };
    return done(null, user);
}));

app.use(passport.initialize());

// Define routes
app.get('/',
    (req, res) => res.send('Welcome to the Google OAuth with Passport.js!'));

app.get('/v1/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/v1/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect to your desired page
        res.redirect('parikshado.com');
    });

app.get('/success', (req, res) => res.send('Login successful!'));

app.get('/login', (req, res) => res.send('Login failed!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
