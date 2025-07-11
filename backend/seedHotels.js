const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Hotel.deleteMany({});
  await Hotel.insertMany([
    {
      name: 'Tri Kỷ',
      location: 'Duong Dong, Phú Quốc',
      stars: 3,
      type: 'hotel',
      pricePerNight: 467500,
      imageUrl: '/assets/img/hotel_page/phuquoc_hotel_page/tri-ki.webp',
      description: 'Khách sạn trung tâm gần biển.'
    },
  ]);
  console.log('Đã thêm khách sạn mẫu');
  process.exit();
});
