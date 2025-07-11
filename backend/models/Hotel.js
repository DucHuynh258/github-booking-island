
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
});

module.exports = mongoose.model('Hotel', hotelSchema);
