const Listing = require("../models/listing");
const Reservation = require("../models/reservation");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

exports.getNewListing = (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    res.render("listings/new.ejs");
};

exports.postNewListing =  async (req, res) => {
    try {
        let response = await geocodingClient
        .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send()
        let url = req.file.path;
        let filename = req.file.filename;
        const newlisting = new Listing(req.body.listing);
        newlisting.owner = req.user._id;
        newlisting.image = { url, filename };
        newlisting.geometry = response.body.features[0].geometry;

        let savedListing = await newlisting.save();
        console.log(savedListing);
        req.flash("success", "New Listing Created!");
        res.redirect("/");
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to create listing.');
        res.redirect('/listings/new');
    }
};

exports.getAllListings =async (req, res) => {
    const category = req.query.category;
    const filter = category ? { category } : {};
    const allListings = await Listing.find(filter);
    res.render("listings/AllListing.ejs", { allListings, category });

};

exports.getListing = async (req, res) => {
    let { id } = req.params;
    id = id.trim();
    const listing = await Listing.findById(id).populate("reservations")
      .populate({ path: "reviews", populate: { path: "author" }, });
    res.render("listings/show.ejs", { listing });
    
};


exports.editListing = async (req, res) => {
    let { id } = req.params;
    id = id.trim();
  
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exists!");
        res.redirect("/listings/allListing");
    }
    let originalImageUrl = listing.image.url;
      
    originalImageUrl = originalImageUrl.replace("/uploads", "/uploads/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
    
};

exports.putListing = async (req, res) => {
    let { id } = req.params;
    id = id.trim();
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
      
    }
  
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/allListing/${id}`);
};

exports.deleteListing =async(req, res) => {
    let { id } = req.params;
    id = id.trim();
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings/allListing");
};

exports.getUserReservation = async (req, res) => {
    try {
        if (!req.user) {
            req.flash('error', 'Please log in to view your reservations.');
            return res.redirect('/login');
        }

        const reservations = await Reservation.find({ user: req.user._id })
            .populate('listing');

        res.render('listings/myReserv', { reservations });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong while fetching your reservations.');
        res.redirect('/');
    }
};


exports.getReservation = async (req, res) => {
    try {
        if (!req.user) {
            req.flash('error', 'Please log in to make reservations.');
            return res.redirect('/login');
        }
        const listing = await Listing.findById(req.params.id).populate('reservations');
        if (!listing) {
            throw new Error('Listing not found');
        }
  
        const pricePerNight = listing.price;
  
        res.render('listings/reservation.ejs', {
            listing,
            pricePerNight,
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong');
        res.redirect(`/listings/allListing/${req.params.id}`);
    }
};


exports.postReservation = async (req, res) => {
    const { checkin, checkout, name, email,people } = req.body.reservation;
    const today = new Date().toISOString().split('T')[0];

  if (!(checkin && checkout)) {
        req.flash('error', 'Check-in/Check-out dates cannot be empty.');
        return res.redirect(`/listings/allListing/${req.params.id}`);
    }
    if (checkin < today) {
        req.flash('error', 'Check-in date cannot be in the past.');
        return res.redirect(`/listings/allListing/${req.params.id}`);
    }

    if (checkout <= checkin) {
        req.flash('error', 'Check-out date must be after the check-in date.');
        return res.redirect(`/listings/allListing/${req.params.id}`);
    }

    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect(`/listings/allListing/${req.params.id}`);
      }
     
        const pricePerNight = listing.price;  
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const numNights = (checkoutDate - checkinDate) / (1000 * 3600 * 24); // Calculate the number of nights
        const paymentAmount = pricePerNight * numNights; // Total cost based on nights and price per night

        const existingReservation = await Reservation.findOne({
            listing: req.params.id,
            $or: [
                { checkin: { $lte: checkout }, checkout: { $gte: checkin } },
            ],
        });

        if (existingReservation) {
            req.flash('error', 'This listing is already reserved for the selected dates.');
            return res.redirect(`/listings/allListing/${req.params.id}`);
        }

        req.session.reservationData = {
            checkin,
            checkout,
            name,
            email,
            listingId: req.params.id,
            paymentAmount,
            people,
        };

        res.redirect(`/payment/${req.params.id}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong while creating the reservation.');
        res.redirect(`/listings/allListing/${req.params.id}`);
    }
}


exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('listing')
            .populate('user');

        res.render('listings/AllReservations', { reservations });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong while fetching reservations.');
        res.redirect('/');
    }
}

// all reservations (admin view)
// app.get('/listings/allReservations', wrapAsync(async (req, res) => {
//     try {
//         const reservations = await Reservation.find()
//             .populate('listing')
//             .populate('user');

//         res.render('listings/AllReservations', { reservations });
//     } catch (err) {
//         console.error(err);
//         req.flash('error', 'Something went wrong while fetching reservations.');
//         res.redirect('/');
//     }
// }));

//reservation process
// app.get('/listings/allListing/:id/reserve', async (req, res) => {
//     try {
//         if (!req.user) {
//               req.flash('error', 'Please log in to make reservations.');
//               return res.redirect('/login');
//           }
//           const listing = await Listing.findById(req.params.id).populate('reservations');
//           if (!listing) {
//               throw new Error('Listing not found');
//           }
  
//           const pricePerNight = listing.price;
  
//           res.render('listings/reservation.ejs', { 
//               listing, 
//             pricePerNight,
//           });
//       } catch (err) {
//           console.error(err);
//           req.flash('error', 'Something went wrong');
//           res.redirect(`/listings/allListing/${req.params.id}`);
//       }
//   });
  
//   app.post('/listings/allListing/:id/reserve', async (req, res) => {
//       const { checkin, checkout, name, email,people } = req.body.reservation;
//       const today = new Date().toISOString().split('T')[0];
  
//     if (!(checkin && checkout)) {
//           req.flash('error', 'Check-in/Check-out dates cannot be empty.');
//           return res.redirect(`/listings/allListing/${req.params.id}`);
//       }
//       if (checkin < today) {
//           req.flash('error', 'Check-in date cannot be in the past.');
//           return res.redirect(`/listings/allListing/${req.params.id}`);
//       }
  
//       if (checkout <= checkin) {
//           req.flash('error', 'Check-out date must be after the check-in date.');
//           return res.redirect(`/listings/allListing/${req.params.id}`);
//       }
  
//       try {
//           const listing = await Listing.findById(req.params.id);
//           if (!listing) {
//               req.flash('error', 'Listing not found');
//               return res.redirect(`/listings/allListing/${req.params.id}`);
//         }
       
//           const pricePerNight = listing.price;  
//           const checkinDate = new Date(checkin);
//           const checkoutDate = new Date(checkout);
//           const numNights = (checkoutDate - checkinDate) / (1000 * 3600 * 24); // Calculate the number of nights
//           const paymentAmount = pricePerNight * numNights; // Total cost based on nights and price per night
  
//           const existingReservation = await Reservation.findOne({
//               listing: req.params.id,
//               $or: [
//                   { checkin: { $lte: checkout }, checkout: { $gte: checkin } },
//               ],
//           });
  
//           if (existingReservation) {
//               req.flash('error', 'This listing is already reserved for the selected dates.');
//               return res.redirect(`/listings/allListing/${req.params.id}`);
//           }
  
//           req.session.reservationData = {
//               checkin,
//               checkout,
//               name,
//               email,
//               listingId: req.params.id,
//               paymentAmount,
//               people,
//           };
  
//           res.redirect(`/payment/${req.params.id}`);
//       } catch (err) {
//           console.error(err);
//           req.flash('error', 'Something went wrong while creating the reservation.');
//           res.redirect(`/listings/allListing/${req.params.id}`);
//       }
//   }


// app.get('/listings/myreserv', wrapAsync(async (req, res) => {
//     try {
//         if (!req.user) {
//             req.flash('error', 'Please log in to view your reservations.');
//             return res.redirect('/login');
//         }

//         const reservations = await Reservation.find({ user: req.user._id })
//             .populate('listing');

//         res.render('listings/myReserv', { reservations });
//     } catch (err) {
//         console.error(err);
//         req.flash('error', 'Something went wrong while fetching your reservations.');
//         res.redirect('/');
//     }
// }));

// app.delete("/listings/allListing/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     id = id.trim();
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     req.flash("success", "Listing Deleted!");
//     res.redirect("/listings/allListing");
// }));

// app.get("/listings/allListing/:id", wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   id = id.trim();
//   const listing = await Listing.findById(id).populate("reservations")
//     .populate({ path: "reviews", populate: { path: "author" }, });
//   res.render("listings/show.ejs", { listing });
  
// }));

//edit Route
// app.get("/listings/allListing/:id/edit", wrapAsync(async (req,res) => {
//   let { id } = req.params;
//   id = id.trim();

//     const listing = await Listing.findById(id);
//     if (!listing) {
//         req.flash("error", "Listing does not exists!");
//         res.redirect("/listings/allListing");
//     }
//   let originalImageUrl = listing.image.filename;
    
//     originalImageUrl = originalImageUrl.replace("/uploads", "/uploads/w_250");
//   res.render("listings/edit.ejs", { listing, originalImageUrl });
  
// }));

// app.put('/listings/allListing/:id',upload.single("listing[image]") ,wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   id = id.trim();
//   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

//   if (typeof req.file !== "undefined") {
//     let url = req.file.path;  
//     let filename = req.file.filename; 
//     listing.image = { url, filename };  
//     await listing.save();  
    
//   }

//   req.flash("success", "Listing Updated!");
//   res.redirect(`/listings/allListing/${id}`);
// }));

// app.get("/listings/allListing",wrapAsync( async (req, res) => {
//     const category = req.query.category;
//     const filter = category ? { category } : {};
//     const allListings = await Listing.find(filter);
//     res.render("listings/AllListing.ejs", { allListings, category });

// }));

// app.get("/listings/new", (req, res) => {
//   if (!req.isAuthenticated()) {
//     req.flash("error", "You must be logged in");
//     return res.redirect("/login");
//   }
//   res.render("listings/new.ejs");
// });


// app.post('/listings/new',upload.single("listing[image]"), async (req, res) => {
//   try {
//     let url = req.file.path;
//     let filename = req.file.filename;
//     const newlisting = new Listing(req.body.listing);
//     newlisting.owner = req.user._id;
//     newlisting.image = { url, filename };
//     let savedListing = await newlisting.save();
//     console.log(savedListing);
//     req.flash("success", "New Listing Created!");
//     res.redirect("/");
//  } catch (error) {
//     console.error(error);
//     req.flash('error', 'Failed to create listing.');
//     res.redirect('/listings/new');
//   }});


