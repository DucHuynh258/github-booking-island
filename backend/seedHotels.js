const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Hotel.deleteMany({});
await Hotel.insertMany([
    {
      name: 'Tri Kỷ',
      location: 'Duong Dong, Phú Quốc',
      island: 'PhuQuoc',
      stars: 3,
      type: 'hotel', 
      pricePerNight: 467500,
      imageUrl: '/assets/img/hotel_page/phuquoc_hotel_page/tri-ki.webp',
      phoneNumber: '02973999999',
      description: 'Khách sạn trung tâm gần biển.'
    },
    {
      name: 'Vinpearl Resort & Spa',
      location: 'Bãi Dài, Phú Quốc',
      stars: 5,
      type: 'resort',
      pricePerNight: 2500000,
      imageUrl: '/assets/img/hotel_page/phuquoc_hotel_page/vinpearl.jpg',
      phoneNumber: '02973888888',
      description: 'Khu nghỉ dưỡng 5 sao với bãi biển riêng.'
    },
    {
      name: 'Mường Thanh Luxury',
      location: 'Dương Đông, Phú Quốc',
      island: 'PhuQuoc',
      stars: 4,
      type: 'hotel',
      pricePerNight: 890000,
      imageUrl: '/assets/img/hotel_page/phuquoc_hotel_page/muong-thanh.jpg', 
      phoneNumber: '02973777777',
      description: 'Khách sạn sang trọng với view biển đẹp.'
    },
    {
      name: 'Sunset Beach Resort',
      location: 'Bãi Trường, Phú Quốc',
      island: 'PhuQuoc',
      stars: 4,
      type: 'resort',
      pricePerNight: 1200000,
      imageUrl: '/assets/img/hotel_page/phuquoc_hotel_page/sunset.jpg',
      phoneNumber: '02973666666',
      description: 'Resort bên bờ biển với hoàng hôn tuyệt đẹp.'
    },
    {
      name: 'Seashells Phú Quốc',
      location: 'Dương Đông, Phú Quốc',
      island: 'PhuQuoc',
      stars: 5,
      type: 'hotel',
      pricePerNight: 1800000,
      imageUrl: '/assets/img/hotel_page/phuquoc_hotel_page/seashells.jpeg',
      phoneNumber: '02973555555',
      description: 'Khách sạn 5 sao với tiện nghi hiện đại.'
    },
    {
      name: 'La Mer Resort',
      location: 'Bãi Khem, Phú Quốc',
      island: 'PhuQuoc',
      stars: 4,
      type: 'resort',
      pricePerNight: 1500000,
      imageUrl: '/assets/img/hotel_page/phuquoc_hotel_page/lamer.jpg',
      phoneNumber: '090736444444',
      description: 'Resort sang trọng với bãi biển riêng.'
    },
    {
      name: 'Hoàng Phú Hotel',
      location: 'Cu Lao Thu',
      island: 'PhuQuy',
      stars: 4,
      type: 'hotel',
      pricePerNight: 438000,
      imageUrl: '/assets/img/hotel_page/phuquy_hotel_page/hoangphu.webp',
      phoneNumber: '090736444444',
      description: 'Khách sạn view biển.'
    },
    {
      name: 'Memory Beach Hotel',
      location: 'Cu Lao Thu',
      island: 'PhuQuy',
      stars: 4,
      type: 'hotel',
      pricePerNight: 1575000,
      imageUrl: '/assets/img/hotel_page/phuquy_hotel_page/memory.webp',
      phoneNumber: '090736444444',
      description: 'Khách sạn view biển.'
    },
    {
      name: 'Chiu Chiu Hotel',
      location: 'Cu Lao Thu',
      island: 'PhuQuy',
      stars: 4,
      type: 'hotel',
      pricePerNight: 1085000,
      imageUrl: '/assets/img/hotel_page/phuquy_hotel_page/chiuchiu.webp',
      phoneNumber: '090736444444',
      description: 'Khách sạn view biển.'
    },
    {
      name: 'Homestay Vitamin Sea',
      location: 'Cu Lao Thu',
      island: 'PhuQuy',
      stars: 4,
      type: 'homestay',
      pricePerNight: 658350,
      imageUrl: '/assets/img/hotel_page/phuquy_hotel_page/vitamin.webp',
      phoneNumber: '090736444444',
      description: 'Khách sạn view biển.'
    },
    {
      name: 'The Sea Rock',
      location: 'Dao Binh Hung',
      island: 'BinhHung',
      stars: 4,
      type: 'hotel',
      pricePerNight: 602000,
      imageUrl: '/assets/img/hotel_page/phuquy_hotel_page/searock.jpg',
      phoneNumber: '090736444444',
      description: 'Khách sạn view biển.'
    },
    {
      name: 'Friends Homestay',
      location: 'Dao Binh Hung',
      island: 'BinhHung',
      stars: 4,
      type: 'homestay',
      pricePerNight: 630000,
      imageUrl: '/assets/img/hotel_page/phuquy_hotel_page/friend.jpg',
      phoneNumber: '090736444444',
      description: 'Khách sạn view biển.'
    },
    {
      name: 'Aloha Hotel',
      location: 'Dao Binh Hung',
      island: 'BinhHung',
      stars: 4,
      type: 'hotel',
      pricePerNight: 630000,
      imageUrl: '/assets/img/hotel_page/phuquy_hotel_page/aloha.jpg',
      phoneNumber: '090736444444',
      description: 'Khách sạn view biển.'
    }
  ]);
  console.log('Đã thêm khách sạn mẫu');
  process.exit();
});


