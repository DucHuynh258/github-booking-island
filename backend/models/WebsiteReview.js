const mongoose = require('mongoose');
const websiteReviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: String,
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('WebsiteReview', websiteReviewSchema);