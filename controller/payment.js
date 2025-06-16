const Listing = require("../models/listing");
const Reservation = require("../models/reservation");

exports.getPayment = (req, res) => {
    if (!req.session.reservationData) {
        req.flash('error', 'Reservation data not found. Please try again.');
        return res.redirect(`/listings/allListing/${req.params.id}`);
    }

    const { checkin, checkout, name, email, listingId, paymentAmount, people } = req.session.reservationData;

    res.render('listings/payment', {
        reservationId: listingId,
        checkin,
        checkout,
        name,
        email,
        paymentAmount,
        people,
    });
};

exports.postPayment = async (req, res) => {
    if (!req.session.reservationData) {
        req.flash('error', 'No reservation data found. Please try again.');
        return res.redirect('/listings/allListing');
    }
    
    const { checkin, checkout, name, email, listingId, paymentAmount, people } = req.session.reservationData;
    const listing = await Listing.findById(listingId);
    try {
        if (!req.user) {
            req.flash('error', 'You must be logged in to make a reservation.');
            return res.redirect('/login');
        }

        const reservation = new Reservation({
            checkin,
            checkout,
            name,
            email,
            paymentAmount,
            people,
            listing: listingId,
            user: req.user._id,
            status: 'confirmed',
        });

        await reservation.save();

        await sendReservationEmail(email, name, listing.title, checkin, checkout, paymentAmount, people);

        // Clearing session data after successful reservation
        delete req.session.reservationData;

        req.flash('success', 'Reservation confirmation Email sent and Payment successful!');
        res.redirect(`/listings/allListing/${listingId}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong while confirming your payment.');
        res.redirect(`/payment/${listingId}`);
    }
};


//email Sending Process function
const sendReservationEmail = async (userEmail, userName, resortName, checkinDate, checkoutDate, totalPayment,people) => {
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
            to: userEmail,
            subject: "Resort Reservation & Payment Confirmation",
            html: `<h2>Hello ${userName},</h2>
                   <p>Your reservation for <strong>${resortName}</strong> has been confirmed.</p>
                   <p><b>Check-in:</b> ${checkinDate}</p>
                   <p><b>Check-out:</b> ${checkoutDate}</p>
                   <p><b>Number of People:</p>${people}</p>
                   <h3>Payment Details:</h3>
                   <p><b>Total Amount Paid:</b> ₹${totalPayment}</p>
                   <p>Thank you for booking with us!</p>
                   <p>Best Regards, <br> ResortEase Team</p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Reservation and payment email sent successfully.");
    } catch (error) {
      console.error("Error sending email:", error);
    }
};


// Route to show payment page
// app.get('/payment/:id', (req, res) => {
//     if (!req.session.reservationData) {
//         req.flash('error', 'Reservation data not found. Please try again.');
//         return res.redirect(`/listings/allListing/${req.params.id}`);
//     }

//     const { checkin, checkout, name, email, listingId,paymentAmount,people } = req.session.reservationData;

//     res.render('listings/payment', {
//         reservationId: listingId, 
//         checkin,
//         checkout,
//         name,
//         email,
//         paymentAmount,
//         people,
//     });
// });

//Confirmation Route
// app.post('/payment/confirm', async (req, res) => {
//     if (!req.session.reservationData) {
//         req.flash('error', 'No reservation data found. Please try again.');
//         return res.redirect('/listings/allListing');
//     }
    
//     const { checkin, checkout, name, email, listingId, paymentAmount,people } = req.session.reservationData;
//     const listing = await Listing.findById(listingId);
//     try {
//         if (!req.user) {
//             req.flash('error', 'You must be logged in to make a reservation.');
//             return res.redirect('/login');
//         }

//         const reservation = new Reservation({
//             checkin,
//             checkout,
//             name,
//             email,
//             paymentAmount,
//             people,
//             listing: listingId,
//             user: req.user._id,
//             status: 'confirmed',
//         });

//         await reservation.save();

//         await sendReservationEmail(email, name, listing.title, checkin, checkout, paymentAmount,people);

//         // Clearing session data after successful reservation
//         delete req.session.reservationData;

//         req.flash('success', 'Reservation confirmation Email sent and Payment successful!');
//         res.redirect(`/listings/allListing/${listingId}`);
//     } catch (err) {
//         console.error(err);
//         req.flash('error', 'Something went wrong while confirming your payment.');
//         res.redirect(`/payment/${listingId}`);
//     }
// });



