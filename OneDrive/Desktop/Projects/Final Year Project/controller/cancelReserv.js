
exports.getCancelReserv =  async (req, res) => {
    res.render("listings/cancelReservation");
};

exports.postCancelReserv = async (req, res) => {
    const { email, name, reason } = req.body;
    if (!email || !name || !reason) {
        req.flash("error", "All fields are required.");
        return res.redirect("/cancel-reservation");
    }
    
    try {
        await sendCancellationEmail(email, name, reason, req);
        req.flash("success", "Cancellation request sent successfully.");
        res.redirect("/cancel-reservation");
    } catch (error) {
        console.error("Error sending email:", error);
        req.flash("error", "Failed to send cancellation email. Please try again later.");
        res.redirect("/cancel-reservation");
    }
};


const sendCancellationEmail = async (userEmail, userName, reason) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "resortease101@gmail.com",
            subject: "Reservation Cancellation Request",
            html: `<h2>Hello Support,</h2>
                   <p>A user has requested to cancel their reservation.</p>
                   <p><b>Name:</b> ${userName}</p>
                   <p><b>Email:</b> ${userEmail}</p>
                   <p><b>Reason for Cancellation:</b> ${reason}</p>
                   <p>Best Regards, <br> ResortEase System</p>`,
        };

      const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Cancellation Request Received",
            html: `<h2>Hello ${userName},</h2>
                   <p>We have received your cancellation request.</p>
                   <p>Your refund is being processed and will be issued soon. If you have any questions, feel free to reach out to us at resortease@gmail.com or call us at +91 8805961651.</p>
                   <p>Best Regards, <br> ResortEase Team</p>`,
        };

       
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(mailOptions);
        console.log("Cancellation request email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error);
        req.flash("error", "Failed to send cancellation email. Please try again later.");
    
    }
};

// app.post("/cancel-reservation", async (req, res) => {
//   const { email, name, reason } = req.body;
//     if (!email || !name || !reason) {
//         req.flash("error", "All fields are required.");
//         return res.redirect("/cancel-reservation");
//     }
  
//     try {
//         await sendCancellationEmail(email, name, reason, req);
//         req.flash("success", "Cancellation request sent successfully.");
//         res.redirect("/cancel-reservation");
//     } catch (error) {
//         console.error("Error sending email:", error);
//         req.flash("error", "Failed to send cancellation email. Please try again later.");
//         res.redirect("/cancel-reservation");
//     }
// });

//cancel payment
// app.get("/cancel-reservation", async (req, res) => {
//   res.render("listings/cancelReservation");
// });