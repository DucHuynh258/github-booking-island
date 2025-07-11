const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  userId: String,
  checkInDate: Date,
  checkOutDate: Date,
  roomCount: Number,
  adults: Number,
  children: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
