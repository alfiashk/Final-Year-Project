const Reservation = require('../models/reservation');

exports.editReservation = async (req, res) => {
    const { id } = req.params;
    const reservation = await Reservation.findById(id).populate('listing').populate('user');
    if (!reservation) {
        req.flash('error', 'Reservation not found.');
        return res.redirect('/listings/allReservations');
    }
    res.render('listings/editReserv.ejs', { reservation });
};

exports.putReservation = async (req, res) => {
    const { id } = req.params;
    const { checkin, checkout, email, paymentAmount } = req.body;
    await Reservation.findByIdAndUpdate(id, { checkin, checkout, email, paymentAmount });
    req.flash('success', 'Reservation updated successfully.');
    res.redirect('/listings/allReservations');
};

exports.deleteReservation = async (req, res) => {
    const { id } = req.params;
    await Reservation.findByIdAndDelete(id);
    req.flash('success', 'Reservation deleted successfully.');
    res.redirect('/listings/allReservations');
};





//Edit Reservation
// app.get('/reservations/:id/edit', wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const reservation = await Reservation.findById(id).populate('listing').populate('user');
//     if (!reservation) {
//         req.flash('error', 'Reservation not found.');
//         return res.redirect('/listings/allReservations');
//     }
//     res.render('listings/editReserv.ejs', { reservation });
// }));

// app.put('/reservations/:id', wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const { checkin, checkout, email, paymentAmount } = req.body;
//     await Reservation.findByIdAndUpdate(id, { checkin, checkout, email, paymentAmount });
//     req.flash('success', 'Reservation updated successfully.');
//     res.redirect('/listings/allReservations');
// }));

// //Delete Reservation
// app.delete('/reservations/:id', wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     await Reservation.findByIdAndDelete(id);
//     req.flash('success', 'Reservation deleted successfully.');
//     res.redirect('/listings/allReservations');
// }));
