const passport = require("passport");

exports.getHome = (req, res) => {
    res.render("listings/index.ejs");
};

exports.getUserLogin = (req, res) => {
    res.render("users/login.ejs");
};

exports.postUserLogin = async (req, res) => {
  
    if (req.user.role !== 'user') {
        req.logout((err) => {
            if (err) {
                console.error("Error logging out non-user:", err);
            }
            req.flash("error", "Access denied. You are not a user.");
            return res.redirect("/login");
        });
    } else {
        const username = req.user.username;
        req.flash("success", `Welcome Back ${username}!!`);
        console.log("User logged in");
        res.redirect("/");
    }
   
    };

exports.getAdminLogin = (req, res) => {
    res.render("users/AdminLogin.ejs");
};

exports.postAdminLogin =async (req, res) => {
    
    if (req.user.role !== 'admin') {
        req.logout((err) => {
            if (err) {
                console.error("Error logging out non-admin:", err);
            }
            req.flash("error", "Access denied. You are not an admin.");
            return res.redirect("/AdminLogin");
        });
    } else {
        const username = req.user.username;
        req.flash("success", `Welcome Back Admin ${username}!!`);
        console.log("Admin logged in");
        res.redirect("/");
    }
};


exports.userLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged Out!");
        console.log("logged out");
        res.redirect("/");
    })
};
    
//logout
// app.get("/logout", (req, res, next) => {
//     req.logout((err) => {
//     if (err) {
//         return next(err);
//     }
//     req.flash("success", "You are Logged Out!");
//     console.log("logged out");
//     res.redirect("/");
//     })
// });

//userLogin
// app.get("/login", (req, res) => {
//   res.render("users/login.ejs");
// });

// app.post("/login", passport.authenticate("local", {
//   failureRedirect: '/login',
//   failureFlash: true
// }), async (req, res) => {

//    if (req.user.role !== 'user') {
//     req.logout((err) => {
//       if (err) {
//         console.error("Error logging out non-user:", err);
//       }
//       req.flash("error", "Access denied. You are not a user.");
//       return res.redirect("/login");
//     });
//   } else {
   
//     const username = req.user.username;
//     req.flash("success", `Welcome Back ${username}!!`);
//     console.log("User logged in");
//     res.redirect("/");
//   }
 
// });

//Admin Login
// app.get("/AdminLogin", (req, res) => {
//   res.render("users/AdminLogin.ejs");
// });

// app.post("/AdminLogin", passport.authenticate("local", {
//   failureRedirect: '/AdminLogin', 
//   failureFlash: true 
// }), async (req, res) => {
  
//   if (req.user.role !== 'admin') {
//     req.logout((err) => {
//       if (err) {
//         console.error("Error logging out non-admin:", err);
//       }
//       req.flash("error", "Access denied. You are not an admin.");
//       return res.redirect("/AdminLogin");
//     });
//   } else {
//     const username = req.user.username;
//     req.flash("success", `Welcome Back Admin ${username}!!`);
//     console.log("Admin logged in");
//     res.redirect("/");
//   }
// });