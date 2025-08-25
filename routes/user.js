const express = require("express");
const router = express.Router();

const warpAsync = require("../utility/warpAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewere.js");

const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.rederSignupForm)
  .post(warpAsync(userController.userSignup));

router
  .route("/login")
  .get( userController.rederLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

module.exports = router;
