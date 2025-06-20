const express = require("express");
const router = express.Router();
const paymentController = require("../controller/payment");

router.route('/:id')
    .get(paymentController.getPayment);

router.route('/confirm')
    .post(paymentController.postPayment);

module.exports = router;

