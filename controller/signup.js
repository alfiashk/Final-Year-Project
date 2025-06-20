const User = require("../models/user");

//User Signup
exports.getSignup = (req, res) => {
    res.render("users/signup.ejs");
  }
exports.postSignup = async(req, res, next) => {
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
};

exports.getAdminSignup = (req, res) => {
    res.render("users/adminSignup.ejs");
};


exports.postAdminSignup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username, role: 'admin', });
        const registeredUser = await User.register(newUser, password);
  
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", `Welcome Admin ${username}`);
            res.redirect("/");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/adminSignup");
    }
};

// app.get("/signup", (req, res) => {
//   res.render("users/signup.ejs");
// });
// app.post("/signup", async (req, res, next) => {
//   try {
//     let { username, email, password } = req.body;
//     const newUser = new User({ email, username });
//     const registeredUser = await User.register(newUser, password);

//     req.login(registeredUser, (err) => {
//       if (err) return next(err);
//       req.flash("success", `Welcome ${username}`);
//       res.redirect("/");
//     });
//   } catch (e) {
//     req.flash("error", e.message);
//     res.redirect("/signup");
//   }
// });

//app.get("/adminSignup", (req, res) => {
    //   res.render("users/adminSignup.ejs");
    // });
    
    // app.post("/adminSignup", async (req, res, next) => {
    //   try {
    //     let { username, email, password } = req.body;
    //     const newUser = new User({ email, username, role:'admin', });
    //     const registeredUser = await User.register(newUser, password);
    
    //     req.login(registeredUser, (err) => {
    //       if (err) return next(err);
    //       req.flash("success", `Welcome Admin ${username}`);
    //       res.redirect("/");
    //     });
    //   } catch (e) {
    //     req.flash("error", e.message);
    //     res.redirect("/adminSignup");
    //   }
    // });