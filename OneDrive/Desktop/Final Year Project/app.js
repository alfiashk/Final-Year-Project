const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/ResortManagement";
const ejsMate = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
//const userRouter = require("./routes/user.js");
const flash = require("connect-flash");
const User = require("./models/user");
const wrapAsync = require("./utils/wrapasync.js");
//const userController = require("../controllers/user.js");
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });



async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname, "public")));


const sessionOptions = {
  secret: "dsvsdvadv",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 3 * 24 * 60 * 60 * 1000 ,//3 days expiry
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
 
  next();
});

//home
app.get("/", (req, res) => {
    res.render("listings/index.ejs");
});


//signup page
app.get("/signup", (req, res) => {
    res.render("users/signup.ejs");

});

app.post("/signup", async (req, res, next) => { 
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", `Welcome ${username}`);
            res.redirect("/");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

//login page

app.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

app.post("/login", passport.authenticate("local", {failureRedirect: '/login', failureFlash: true
}), async (req, res) => {
    const username = req.user.username;
    req.flash("success", `Welcome Back ${username}!!`);
    //let redirectUrl = res.locals.redirectUrl;
    console.log("logged in");
    res.redirect("/");
});

//logout
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged Out!");
        console.log("logged out");
        res.redirect("/");
    })
});

app.get("/listings/myreserv",  (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  res.send("sdbh");
})

app.get("/listings/new", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  res.render("listings/new.ejs");
});




app.use((err, req, res, next) => {
    console.error(err.stack);
    req.flash("error", "Something went wrong!");
    res.redirect("/");
});

app.listen(8000 , () => {
    console.log("server is listening to port 8000");
});