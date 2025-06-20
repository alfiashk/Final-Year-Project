require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
//const MONGO_URL = "mongodb://127.0.0.1:27017/ResortManagement"; 
const dbUrl = process.env.ATLASDB_URL;
const MongoStore = require("connect-mongo");

const ejsMate = require("ejs-mate");
const session = require("express-session");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const User = require("./models/user");
const wrapAsync = require("./utils/wrapasync.js");
// const upload = require("./multer.js");
const Review = require("./models/review");
const Reservation = require("./models/reservation.js");
// const review = require("./models/review");
const adminPassRoute = require("./routes/adminPassRoute.js")
const userRoute = require("./routes/userRoute.js");
const listingsRoute = require("./routes/listingRoute.js");
const reservationRoute = require('./routes/reservationRoute.js');
const paymentRoute = require('./routes/paymentRoute.js');
const cancelRoute = require('./routes/cancelReserv.js');
const reviewRoute = require('./routes/reviewsRoute.js');


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'views', 'public')));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 360,
   
});

store.on("error", () => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days expiry
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

app.use('/adminPass', adminPassRoute);
app.use('/reservations', reservationRoute);
app.use('/payment', paymentRoute);
app.use('/cancel-reservation', cancelRoute);
app.use('/listings/allListing/:id/review', reviewRoute);
app.use('/listings', listingsRoute);
app.use('/', userRoute);


//contact us about us
app.get("/contact_us",(req, res) => {
    res.render("users/contact_us.ejs");
  });
  
app.get("/about_us",(req, res) => {
    res.render("users/about_us.ejs");
  });

//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    req.flash("error", "Something went wrong!");
    res.redirect("/");
});

//server port
app.listen(8000, () => {
  console.log("server is listening to port 8000");
});
