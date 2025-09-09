const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const adminModel = require("../admin-services/models/admin.model");
const { generateTokens } = require("./generateToken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/admin/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let admin = await adminModel.findOne({ email: profile.emails[0].value });

        if (!admin) {
          admin = await adminModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: null, // since Google auth
            refreshToken: null,
          });
        }

        const payload = { id: admin._id, email: admin.email, role: "admin" };
        const tokens = generateTokens(payload);

        admin.refreshToken = tokens.refreshToken;
        await admin.save();

        return done(null, { admin, tokens });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
