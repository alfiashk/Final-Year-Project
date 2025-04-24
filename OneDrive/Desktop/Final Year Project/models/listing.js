const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
  //  type:Object,
  //   default:
  //     "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  //   set: (v) =>
  //     v === ""
  //       ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    //       : v,
    
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref:"Review",
  },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
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

//khudse krna hai
  category: {
    type: String,
    enum: ["mountains", "arctic", "swimming pools", "farms", "castles", "camping", "iconic cities", "room", "view", "beach"],
  },


});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing && listing.reviews && listing.length > 0) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


// const mongoose = require("mongoose");
// const review = require("./review");
// const { ref } = require("joi");
// const Schema = mongoose.Schema;
// const Review = require("./review");
// const listingSchema = new Schema({

//     title:{
//         type: String,
//         required : true,
//     } ,

//     description: String,


// image:{

// url: String,
// filename: String,

// },
// category:String,





//     price: Number,
//     location: String,
//     country: String ,


// //     reviews: [
// //         {
// //             // single listing m many reviews, reviews ki id store karayge like customer , order bale m kiye the

// //             type: Schema.Types.ObjectId,
// //             ref: "Review",
// //         },
// //     ],
// //     // associate with each listing,owner refers listing user or merely for registered use
    
// //     owner:{
// // type: Schema.Types.ObjectId,
// // ref: "User",
// //     },
// //     category: {
// //         type: String,
// //         enum: ["mountain", "arctic", "farms", "deserts", "boats", "domes", "camping", "amazing pools", "iconic cities", "rooms", "trending"],
//     //  },
// });

// // mongoose middleware

// // listingSchema.post("findOneAndDelete", async(listing)=>{

//     // un reviews ko delete krna h jo listing ke arr m h
// // review ki id listing ki id h to bo sare review ids listing se delete ho jaygi
// // if (listing) {
// //     await Review.deleteMany({_id: {$in: listing.reviews}});
// // }
  
// // });

// // create model or collection
// const  Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;




























// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   image: {
//     type: String,
//     default: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
//   },
//   price: Number,
//   location: String,
//   country: String,
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;
