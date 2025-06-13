const express = require("express");
const router = express.Router();
const listingController = require("../controller/listing")
const wrapAsync = require("../utils/wrapasync.js");
const upload = require("../multer.js");

router.route('/myreserv')
    .get(wrapAsync(listingController.getUserReservation));

router.route('/allReservations')
    .get(listingController.getAllReservations);


router.route('/new')
    .get(listingController.getNewListing)
    .post(upload.single("listing[image]"),listingController.postNewListing);

router.route('/allListing')
    .get(wrapAsync(listingController.getAllListings));

router.route('/allListing/:id')
    .get(wrapAsync(listingController.getListing))
    .delete(wrapAsync(listingController.deleteListing));

router.route('/allListing/:id/edit')
    .get(wrapAsync(listingController.editListing))
    .put(upload.single("listing[image]"),wrapAsync(listingController.putListing));

router.route('/allListing/:id/reserve')
    .get(listingController.getReservation)
    .post(listingController.postReservation);

module.exports = router;