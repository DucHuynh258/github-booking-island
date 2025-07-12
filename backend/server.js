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
app.use(express.json({ limit: '10mb' }));

// Token authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Không có token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

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

const WebsiteReview = require('./models/WebsiteReview');
// Schemas cho Khách sạn
const Hotel = require('./models/Hotel');
const Booking = require('./models/Booking');


// ======================= CẤU HÌNH GỬI EMAIL =======================
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
        if (!userName || !email || !password) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }

        if (dateOfBirth) {
            const dob = new Date(dateOfBirth);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dob >= today) {
                return res.status(400).json({ message: 'Ngày sinh phải ở trong quá khứ' });
            }
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            userId: Math.ceil(Math.random() * 100000000).toString(),
            userName: userName.trim(),
            email,
            password: hashedPassword,
            phone,
            dateOfBirth,
            gender,
            address,
            registrationDate: new Date(),
        });

        await user.save();

        const formattedDate = new Date(user.registrationDate).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        res.status(201).json({ 
            message: 'Đăng ký thành công',
            registrationDate: formattedDate
        });
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API Đăng nhập
app.post('/api/login', async(req, res) => {
    const { email, password } = req.body;
    try {

        if (!email || !password) {
            return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
        }

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
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API Lấy thông tin người dùng (yêu cầu token)
app.get('/api/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.user.userId });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        console.log('Sending user data:', { userName: user.userName, userId: user.userId });
        res.json({ 
            userName: user.userName,
            email: user.email,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            address: user.address,
            avatar: user.avatar,
            registrationDate: new Date(user.registrationDate).toLocaleString('vi-VN')
        });
    } catch (error) {
        console.error('Lỗi lấy thông tin người dùng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API Cập nhật hồ sơ
app.put('/api/update-profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.user.userId });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        const { userName, phone, dateOfBirth, gender, address, avatar } = req.body;
        
        if (userName && userName.trim() === '') {
            return res.status(400).json({ message: 'Họ tên không được để trống' });
        }

        if (dateOfBirth) {
            const dob = new Date(dateOfBirth);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dob >= today) {
                return res.status(400).json({ message: 'Ngày sinh phải ở trong quá khứ' });
            }
        }

        // Validate avatar
        if (avatar) {
            if (!avatar.startsWith('data:image/')) {
                return res.status(400).json({ message: 'Định dạng ảnh không hợp lệ' });
            }
            const base64Size = (avatar.length * 3) / 4 / 1024 / 1024; // Size in MB
            if (base64Size > 5) {
                return res.status(400).json({ message: 'Ảnh đại diện vượt quá 5MB' });
            }
        }

        user.userName = userName ? userName.trim() : user.userName;
        user.phone = phone || user.phone;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;
        user.gender = gender || user.gender;
        user.address = address || user.address;
        user.avatar = avatar || user.avatar;
        await user.save();

        console.log('Updated user data:', { userName: user.userName, userId: user.userId, avatar: user.avatar ? 'present' : 'not present' });
        res.json({ 
            message: 'Cập nhật hồ sơ thành công',
            userName: user.userName,
            email: user.email,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            address: user.address,
            avatar: user.avatar
        });
    } catch (error) {
        console.error('Lỗi cập nhật hồ sơ:', error);
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
app.post('/api/book-ticket', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.user.userId });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
        }
        const bookingId = Math.ceil(Math.random() * 1000000000).toString();
        const bookingData = {
            ...req.body,
            bookingId,
            userId: user.userId,
            userName: user.userName,
            userEmail: user.email
        };
        const newBooking = new TicketBooking(bookingData);
        await newBooking.save();
        // Gửi email xác nhận
        await sendBookingConfirmationEmail(newBooking);
        res.status(201).json({
            message: 'Đặt vé thành công! Vui lòng kiểm tra email để xem chi tiết.',
            bookingId: bookingId
        });
    } catch (error) {
        console.error('Lỗi khi đặt vé:', error);
        res.status(500).json({ message: 'Lỗi server khi đặt vé' });
    }
});

// API Khách sạn 
app.get('/api/hotels', async(req, res) => {
    const { type, stars, name, island } = req.query;
    const query = {};
    
    if (type) {
        query.type = { $in: type.split(',') };
    }
    if (stars) {
        query.stars = { $in: stars.split(',').map(Number) };
    }
    if (name) {
        query.name = { $regex: name, $options: 'i' };
    }
    if (island) {
        query.island = island;
    }
    try {
        const hotels = await Hotel.find(query);
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm kiếm khách sạn' });
    }
});

// API Đặt phòng khách sạn
app.post('/api/book-hotel', async(req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Bạn cần đăng nhập để đặt phòng' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ userId: decoded.userId });
        const hotel = await Hotel.findById(req.body.hotelId);
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
        res.status(201).json({ 
            message: 'Đặt phòng thành công!',
            userEmail: user.email,
            hotelName: hotel.name,
            hotelLocation: hotel.location,
            hotelPhone: hotel.phoneNumber
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi đặt phòng' });
    }
});

// API gửi email xác nhận đặt phòng
app.post('/api/send-booking-email', authenticateToken, async (req, res) => {
    try {
        const { to, subject, html } = req.body;
        
        console.log('Received email request:', { to, subject, html }); // Add this debug line
        
        if (!to) {
            return res.status(400).json({ message: 'Thiếu địa chỉ email người nhận' });
        }
        
        const mailOptions = {
            from: process.env.CONTACT_EMAIL,
            to: to,
            subject: subject,
            html: html
        };
        
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email xác nhận đã được gửi thành công' });
    } catch (error) {
        console.error('Lỗi gửi email:', error);
        res.status(500).json({ message: 'Không thể gửi email xác nhận' });
    }
});

// API lấy chi tiết khách sạn 
app.get('/api/hotels/:id', async(req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Không tìm thấy khách sạn' });
        res.json(hotel);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy thông tin khách sạn' });
    }
});

// API đánh giá khách sạn
app.post('/api/hotels/:id/rate', authenticateToken, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Không tìm thấy khách sạn' });
    }
    // Get user details
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
    }
    const { rating, comment } = req.body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Đánh giá phải từ 1-5 sao' });
    }
    // Check if user already rated
    const existingRating = hotel.ratings.find(r => r.userId === req.user.userId);
    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment;
      existingRating.createdAt = new Date();
    } else {
      hotel.ratings.push({
        userId: req.user.userId,
        userName: user.userName || 'Khách',
        userAvatar: user.avatar || '/assets/img/avatars/avatar1.jpg',
        rating,
        comment,
        createdAt: new Date()
      });
    }
    // Calculate average rating
    const totalRating = hotel.ratings.reduce((sum, r) => sum + r.rating, 0);
    hotel.averageRating = totalRating / hotel.ratings.length;
    await hotel.save();
    res.json({ message: 'Đánh giá thành công', averageRating: hotel.averageRating });
  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({ message: 'Lỗi khi đánh giá khách sạn' });
  }});

  // API endpoint to submit website review
app.post('/api/website-review', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
    }
    const { rating, comment } = req.body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Đánh giá phải từ 1-5 sao' });
    }
    // Validate comment
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: 'Nội dung đánh giá không được để trống' });
    }
    const review = new WebsiteReview({
      userId: user.userId,
      userName: user.userName || 'Khách',
      userAvatar: user.avatar || '/assets/img/avatars/avatar1.jpg',
      rating,
      comment: comment.trim(),
    });
    await review.save();
    res.json({ message: 'Đánh giá thành công', review });
  } catch (error) {
    console.error('Website review error:', error);
    res.status(500).json({ message: 'Lỗi khi lưu đánh giá' });
  }
});
// API endpoint to get website reviews
app.get('/api/website-reviews', async (req, res) => {
  try {
    const reviews = await WebsiteReview.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(5) // Limit to 5 reviews
      .exec();
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching website reviews:', error);
    res.status(500).json({ message: 'Lỗi khi tải đánh giá' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));