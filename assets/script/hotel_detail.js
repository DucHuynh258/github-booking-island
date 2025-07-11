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

  const data = {
    hotelId: window.hotelId,
    checkInDate: document.getElementById('checkin').value,
    checkOutDate: document.getElementById('checkout').value,
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
    alert('Lỗi khi đặt phòng');
  }
}

loadHotel();
