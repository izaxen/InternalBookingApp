import passport from "passport";

const authenticate = passport.authenticate("oauth-bearer", {
  session: false,
});

export = authenticate;