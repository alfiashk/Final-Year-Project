const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require('../controller/review');

router.post('/', reviewController.postReview);
    

router.delete('/:reviewId', reviewController.deleteReview);
   

module.exports = router;
