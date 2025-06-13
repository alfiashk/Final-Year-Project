const Listing = require("../models/listing");
const Review = require("../models/review");

exports.postReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/allListing/${listing._id}`);
};

exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    
    res.redirect(`/listings/allListing/${id}`);
};

// app.post('/listings/allListing/:id/reviews', async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     newReview.author = req.user._id;  

//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();

//     req.flash("success", "New Review Created!");
//     res.redirect(`/listings/allListing/${listing._id}`);
// });


// app.delete("/listings/allListing/:id/reviews/:reviewId",async (req, res) => {
//     let { id, reviewId } = req.params; 
//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     req.flash("success", "Review Deleted!");
    
//     res.redirect(`/listings/allListing/${id}`);
// });
