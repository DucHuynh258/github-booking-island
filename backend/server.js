const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();


const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, '../'))); // phục vụ toàn bộ frontend

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../phuquoc_hotel.html'));
});
// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Đã kết nối với MongoDB'))
    .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// ======================= SCHEMAS =======================
// Schema Người dùng
const userSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    dateOfBirth: Date,
    gender: String,
    address: String,
    avatar: String,
    registrationDate: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

// Schema Đặt Vé Tàu 
const ticketBookingSchema = new mongoose.Schema({
    bookingId: { type: String, unique: true, required: true },
    userId: { type: String, required: true },
    userName: String,
    userEmail: String,
    departure: String,
    destination: String,
    tripDate: String,
    tripTime: String,
    brand: String,
    quantity: Number,
    totalPrice: Number,
    seats: [String],
    phone: String,
    bookingCreationDate: { type: Date, default: Date.now }
});
const TicketBooking = mongoose.model('TicketBooking', ticketBookingSchema);

const Hotel = require('./models/Hotel');
const Booking = require('./models/Booking');


// ======================= CẤU HÌNH GỬI EMAIL ======================//
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_PASS
    }
});

// Hàm gửi email xác nhận đặt vé 
async function sendBookingConfirmationEmail(bookingDetails) {
    const mailOptions = {
        from: process.env.CONTACT_EMAIL,
        to: bookingDetails.userEmail,
        subject: `[Booking Island Travel] Xác nhận đặt vé thành công #${bookingDetails.bookingId}`,
        html: `
            <h1>Cảm ơn bạn đã đặt vé tại Booking Island Travel!</h1>
            <p>Xin chào <b>${bookingDetails.userName}</b>,</p>
            <p>Chúng tôi xác nhận bạn đã đặt vé thành công. Dưới đây là thông tin chi tiết:</p>
            <ul>
                <li><b>Mã đặt vé:</b> ${bookingDetails.bookingId}</li>
                <li><b>Tuyến:</b> ${bookingDetails.departure} → ${bookingDetails.destination}</li>
                <li><b>Ngày đi:</b> ${bookingDetails.tripDate}</li>
                <li><b>Giờ khởi hành:</b> ${bookingDetails.tripTime}</li>
                <li><b>Hãng tàu:</b> ${bookingDetails.brand}</li>
                <li><b>Số lượng vé:</b> ${bookingDetails.quantity}</li>
                <li><b>Số ghế:</b> ${bookingDetails.seats.join(', ')}</li>
                <li><b>Tổng tiền:</b> ${bookingDetails.totalPrice.toLocaleString('vi-VN')} đ</li>
                <li><b>Số điện thoại liên hệ:</b> ${bookingDetails.phone}</li>
            </ul>
            <p>Vui lòng đến quầy vé trước giờ khởi hành 30 phút để nhận vé và thanh toán.</p>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email xác nhận đã gửi tới ${bookingDetails.userEmail}`);
    } catch (error) {
        console.error(`Lỗi khi gửi email xác nhận:`, error);
    }
}


// ======================= API ENDPOINTS =======================

// API Đăng ký 
app.post('/api/register', async(req, res) => {
    const { userName, email, password, phone, dateOfBirth, gender, address } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            userId: Math.ceil(Math.random() * 100000000).toString(),
            userName,
            email,
            password: hashedPassword,
            phone,
            dateOfBirth,
            gender,
            address,
            registrationDate: new Date(),
        });
        await user.save();
        const formattedDate = new Date(user.registrationDate).toLocaleString('vi-VN');
        res.status(201).json({
            message: 'Đăng ký thành công',
            registrationDate: formattedDate
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API Đăng nhập 
app.post('/api/login', async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
        const token = jwt.sign({ userId: user.userId, userName: user.userName }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userName: user.userName });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API Lấy thông tin người dùng 
app.get('/api/user', async(req, res) => {
    const token = req.headers.authorization ? .split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Không có token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ userId: decoded.userId });
        res.json({
            userName: decoded.userName,
            email: user.email,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            address: user.address,
            avatar: user.avatar,
            registrationDate: new Date(user.registrationDate).toLocaleString('vi-VN')
        });
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
});

// API Cập nhật hồ sơ 
app.put('/api/update-profile', async(req, res) => {
    const token = req.headers.authorization ? .split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Không có token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ userId: decoded.userId });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        const { userName, phone, dateOfBirth, gender, address, avatar } = req.body;
        user.userName = userName || user.userName;
        user.phone = phone || user.phone;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;
        user.gender = gender || user.gender;
        user.address = address || user.address;
        user.avatar = avatar || user.avatar;
        await user.save();
        res.json({ message: 'Cập nhật hồ sơ thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API Contact Form 
app.post('/api/contact', async(req, res) => {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
        return res.status(400).json({ message: 'Thiếu thông tin' });
    }
    const mailOptions = {
        from: process.env.CONTACT_EMAIL,
        to: process.env.CONTACT_EMAIL,
        subject: 'Khách hàng liên hệ từ Island Travel',
        text: `Tên: ${name}\nEmail: ${email}\nSĐT: ${phone}\nNội dung: ${message}`
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Gửi thành công! Tụi mình sẽ liên hệ lại sớm nhất ' });
    } catch (err) {
        console.error('Lỗi gửi mail:', err);
        res.status(500).json({ message: 'Không gửi được, thử lại sau nhé.' });
    }
});

// API Đặt vé tàu 
app.post('/api/book-ticket', async(req, res) => {
    const token = req.headers.authorization ? .split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Bạn cần đăng nhập để đặt vé' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ userId: decoded.userId });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        const { departure, destination, tripDate, tripTime, brand, quantity, totalPrice, seats, phone } = req.body;
        const newBooking = new TicketBooking({
            bookingId: Math.ceil(Math.random() * 1000000000).toString(),
            userId: user.userId,
            userName: user.userName,
            userEmail: user.email,
            departure,
            destination,
            tripDate,
            tripTime,
            brand,
            quantity,
            totalPrice,
            seats,
            phone
        });
        await newBooking.save();
        sendBookingConfirmationEmail(newBooking); // Gửi mail xác nhận
        res.status(201).json({
            message: 'Đặt vé thành công! Vui lòng kiểm tra email để xem chi tiết.',
            bookingId: newBooking.bookingId
        });
    } catch (error) {
        console.error('Lỗi khi đặt vé:', error);
        res.status(500).json({ message: 'Lỗi server khi đặt vé' });
    }
});

app.get('/api/hotels', async(req, res) => {
    const { type, stars, name } = req.query;
    const query = {};
    if (type) query.type = type;
    if (stars) query.stars = Number(stars);
    if (name) query.name = { $regex: name, $options: 'i' };
    const hotels = await Hotel.find(query);
    res.json(hotels);
});

app.post('/api/bookings', async(req, res) => {
    const token = req.headers.authorization ? .split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Bạn cần đăng nhập để đặt phòng' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { hotelId, checkInDate, checkOutDate, roomCount, adults, children } = req.body;
        const booking = new Booking({
            hotelId,
            userId: decoded.userId,
            checkInDate,
            checkOutDate,
            roomCount,
            adults,
            children
        });
        await booking.save();
        res.status(201).json({ message: 'Đặt phòng thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi đặt phòng' });
    }
});

app.get('/api/hotels/:id', async(req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Không tìm thấy khách sạn' });
        res.json(hotel);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy thông tin khách sạn' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));