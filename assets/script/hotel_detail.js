async function loadHotel() {
  const params = new URLSearchParams(window.location.search);
  const hotelId = params.get('id');
  if (!hotelId) return alert('Không tìm thấy khách sạn');

  try {
    const res = await fetch(`http://localhost:5000/api/hotels/${hotelId}`);
    const hotel = await res.json();

    document.getElementById('hotel-name').textContent = hotel.name;
    document.getElementById('hotel-location').textContent = hotel.location;
    document.getElementById('hotel-price').textContent = hotel.pricePerNight.toLocaleString() + ' VND';
    document.getElementById('hotel-stars').textContent = '★'.repeat(hotel.stars);
    document.getElementById('hotel-img').src = hotel.imageUrl;
    window.hotelId = hotel._id; // lưu global
  } catch (err) {
    alert('Lỗi khi tải thông tin khách sạn');
  }
}

async function bookNow() {
  const token = localStorage.getItem('token');
  if (!token) return alert('Bạn cần đăng nhập');
  const checkInDate = document.getElementById('checkin').value;
  const checkOutDate = document.getElementById('checkout').value;
  // Validate dates are provided
  if (!checkInDate || !checkOutDate) {
    alert('Vui lòng chọn ngày check-in và check-out');
    return;
  }
  // Validate check-in date is not in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkIn = new Date(checkInDate);
  if (checkIn < today) {
    alert('Ngày check-in không thể ở quá khứ');
    return;
  }
  // Validate check-out is after check-in
  const checkOut = new Date(checkOutDate);
  if (checkOut <= checkIn) {
    alert('Ngày check-out phải sau ngày check-in');
    return;
  }
  const data = {
    hotelId: window.hotelId,
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
    roomCount: +document.getElementById('roomCount').value,
    adults: +document.getElementById('adults').value,
    children: +document.getElementById('children').value,
  };
  try {
    const res = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.message);
  } catch (err) {
    alert('Lỗi khi đặt phòng: ' + err.message);
  }
}

loadHotel();
