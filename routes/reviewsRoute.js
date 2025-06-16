const express = require("express");
const router = express.Router();
const reviewController = require('../controller/review');

router.route('/reviews')
    .post(reviewController.postReview);

router.route('/reviews/:reviewId"')
    .delete(reviewController.deleteReview);

module.exports = router;
