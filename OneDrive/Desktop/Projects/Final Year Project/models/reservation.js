const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    checkin: {
        type: Date,
        required: true,
    },
    checkout: {
        type: Date,
        required: true,
    },
    people: Number,
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
     paymentAmount: Number, 
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    listing: {  
        type: Schema.Types.ObjectId,
        ref: 'Listing', 
        required: true,  
    },
     
     
});

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;