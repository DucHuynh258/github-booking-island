const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  userId: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  roomCount: { type: Number, required: true, min: 1 },
  adults: { type: Number, required: true, min: 1 },
  children: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Booking', bookingSchema);
