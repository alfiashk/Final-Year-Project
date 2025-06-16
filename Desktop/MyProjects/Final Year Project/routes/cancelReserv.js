const express = require("express");
const router = express.Router();
const CancelReservController = require("../controller/cancelReserv");

router.route('/')
    .get(CancelReservController.getCancelReserv)
    .post(CancelReservController.postCancelReserv);

module.exports = router;
