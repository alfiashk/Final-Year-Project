const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapasync');
const reservationController = require("../controller/reservations");

router.route("/:id")
    .put(wrapAsync(reservationController.putReservation))
    .delete(wrapAsync(reservationController.deleteReservation));

router.route("/:id/edit")
    .get(wrapAsync(reservationController.editReservation))


module.exports = router;
