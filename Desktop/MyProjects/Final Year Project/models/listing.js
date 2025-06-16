const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reservation = require("./reservation"); 
const Review = require("./review");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  category: {
    type: String,
    enum: [
      "mountains",
      "arctic",
      "swimming pools",
      "farms",
      "castles",
      "camping",
      "iconic cities",
      "room",
      "beach",
      "country side",
      "view",
    ],
  },
  geometry: {
    type: {
      type: String, //Dont do {location: {type: String}}
      enum: ['Point'], //location.type must be point
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  reservations: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reservation" }],
    default: [],
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing && listing.reservations.length > 0) {
    await Reservation.deleteMany({ _id: { $in: listing.reservations } });
  }
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing && listing.reviews.length > 0) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
