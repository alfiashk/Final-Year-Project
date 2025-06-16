const User = require("../models/user");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const adminPassword = process.env.ADMIN_SECRET_PASS; 

//Admin Pass
exports.getAdminPass = (req, res) => {
  res.render('users/adminPass.ejs');
};

exports.postAdminPass = (req, res) => {
  const { password } = req.body;

  if (password === adminPassword) {
    res.redirect('/adminSignup');
  } else {
    req.flash('error', 'Incorrect password. Please try again.');
    res.redirect('/adminPass');
  }
};


// app.get('/adminPass', (req, res) => {
//     res.render('users/adminPass.ejs');  
// });

// app.post('/adminPass', (req, res) => {
//     const { password } = req.body; 

//     if (password === adminPassword) {
//         res.redirect('/adminSignup');
//     } else {
//         req.flash('error', 'Incorrect password. Please try again.');
//         res.redirect('/adminPass');  
//     }
// });

