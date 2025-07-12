
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: String,
  location: String, 
  island: String,
  stars: Number,
  type: String,
  pricePerNight: Number,
  imageUrl: String,
  phoneNumber: String,
  description: String,
  ratings: [{
    userId: String,
    userName: String, // Add userName
    userAvatar: String, // Add userAvatar
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Hotel', hotelSchema);
