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

// API Đăng ký
app.post('/api/register', async (req, res) => {
    const { userName, email, password, phone, dateOfBirth, gender, address} = req.body;

    try {
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
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

        // Lưu vào cơ sở dữ liệu
            await user.save();
        
        // Format ngày giờ đăng ký theo định dạng Việt Nam
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
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API Đăng nhập
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
      
        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
      
        // Tạo JWT token
        const token = jwt.sign({ userId: user.userId, userName: user.userName }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
        res.json({ token, userName: user.userName });
    }   catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});


// API Lấy thông tin người dùng (yêu cầu token)
app.get('/api/user', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
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
            registrationDate: new Date(user.registrationDate).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        });
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
});

// API Cập nhật hồ sơ
app.put('/api/update-profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
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

// contactform gửi mail về
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CONTACT_EMAIL,
    pass: process.env.CONTACT_PASS
  }
});

app.post('/api/contact', async (req, res) => {
      console.log(" Đã nhận request liên hệ!");
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'Thiếu thông tin' });
  }

  const mailOptions = {
    from: process.env.CONTACT_EMAIL, 
    to: process.env.CONTACT_EMAIL,   
    subject: 'Khách hàng liên hệ từ Island Travel',
    text: `
      Tên: ${name}
      Email: ${email}
      SĐT: ${phone}
      Nội dung: ${message}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Gửi thành công! Tụi mình sẽ liên hệ lại sớm nhất ' });
  } catch (err) {
    console.error('Lỗi gửi mail:', err);
    res.status(500).json({ message: 'Không gửi được, thử lại sau nhé.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));

const Hotel = require('./models/Hotel');
const Booking = require('./models/Booking');

app.get('/api/hotels', async (req, res) => {
  const { type, stars, name } = req.query;
  const query = {};
  if (type) query.type = type;
  if (stars) query.stars = Number(stars);
  if (name) query.name = { $regex: name, $options: 'i' };

  const hotels = await Hotel.find(query);
  res.json(hotels);
});


app.post('/api/bookings', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
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

app.get('/api/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Không tìm thấy khách sạn' });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin khách sạn' });
  }
});
