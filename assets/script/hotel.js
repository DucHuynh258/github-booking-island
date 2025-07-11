function updateDates() {
  const checkinDate = document.getElementById('checkin').value;
  const checkoutDate = document.getElementById('checkout').value;

  if (checkinDate && checkoutDate) {
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);

    // Cập nhật thứ trong tuần cho ngày Check-in
    const checkinDayOfWeek = getDayOfWeek(checkin.getDay());
    document.getElementById('checkin-day').textContent = checkinDayOfWeek;

    // Cập nhật thứ trong tuần cho ngày Check-out
    const checkoutDayOfWeek = getDayOfWeek(checkout.getDay());
    document.getElementById('checkout-day').textContent = checkoutDayOfWeek;

    // Tính số đêm
    const nightCount = Math.ceil((checkout - checkin) / (1000 * 3600 * 24));
    document.getElementById('night-count').textContent = ` ${nightCount}`;
  }
}

// Hàm trả về tên thứ trong tuần
function getDayOfWeek(dayIndex) {
  const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  return days[dayIndex];
}

// Chức năng tăng giảm số phòng, người lớn, trẻ em
// Chức năng tăng giảm số phòng, người lớn, trẻ em
function setupRoomFilter() {
  const modalContents = document.querySelectorAll('.filter-room__modal-content');
  
  modalContents.forEach((content, index) => {
    const decreaseBtn = content.querySelector('.filter-room__modal-btn:first-child');
    const increaseBtn = content.querySelector('.filter-room__modal-btn:last-child');
    const valueDisplay = content.querySelector('.filter-room__modal-value');
    
    let inputId;
    if (index === 0) inputId = 'roomCount';
    else if (index === 1) inputId = 'adults';
    else if (index === 2) inputId = 'children';
    
    const inputField = document.getElementById(inputId);
    
    // Set initial value
    valueDisplay.textContent = inputField.value;
    // Prevent default button behavior
    decreaseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let currentValue = parseInt(valueDisplay.textContent);
      if (currentValue > 1) {
        currentValue--;
        valueDisplay.textContent = currentValue;
        inputField.value = currentValue;
        updateRoomDisplay();
      }
    });
    
    increaseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let currentValue = parseInt(valueDisplay.textContent);
      currentValue++;
      valueDisplay.textContent = currentValue;
      inputField.value = currentValue;
      updateRoomDisplay();
    });
  });
}
// Cập nhật hiển thị số phòng và người
function updateRoomDisplay() {
  const roomCount = document.getElementById('roomCount').value;
  const adults = document.getElementById('adults').value;
  const children = document.getElementById('children').value;
  
  const roomDisplay = document.querySelector('.filter-room__room');
  const peopleDisplay = document.querySelector('.filter-room__people');
  
  roomDisplay.textContent = `${roomCount} Phòng`;
  peopleDisplay.textContent = `${adults} người lớn, ${children} trẻ em`;
}
// Khởi tạo khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
  setupRoomFilter();
  updateRoomDisplay();
});

// assets/script/hotel.js

async function bookNow() {
  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Bạn cần đăng nhập để đặt phòng',
      confirmButtonColor: 'var(--primary-color)'
    });
    return;
  }
  // Validate required fields
  const checkInDate = document.getElementById('checkin')?.value;
  const checkOutDate = document.getElementById('checkout')?.value;
  const roomCount = document.getElementById('roomCount')?.value || 1;
  const adults = document.getElementById('adults')?.value || 2;
  const children = document.getElementById('children')?.value || 0;
  if (!checkInDate || !checkOutDate) {
    Swal.fire({
      icon: 'warning',
      title: 'Thiếu thông tin',
      text: 'Vui lòng chọn ngày nhận phòng và trả phòng',
      confirmButtonColor: 'var(--primary-color)'
    });
    return;
  }
  // Validate dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  if (checkIn < today) {
    Swal.fire({
      icon: 'error',
      title: 'Ngày không hợp lệ',
      text: 'Ngày nhận phòng không thể ở quá khứ',
      confirmButtonColor: 'var(--primary-color)'
    });
    return;
  }
  if (checkOut <= checkIn) {
    Swal.fire({
      icon: 'error', 
      title: 'Ngày không hợp lệ',
      text: 'Ngày trả phòng phải sau ngày nhận phòng',
      confirmButtonColor: 'var(--primary-color)'
    });
    return;
  }
  try {
    const response = await fetch('http://localhost:5000/api/book-hotel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        hotelId: window.hotelId,
        checkInDate,
        checkOutDate,
        roomCount: parseInt(roomCount),
        adults: parseInt(adults),
        children: parseInt(children)
      })
    });
    const result = await response.json();
    
    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Đặt phòng thành công!',
        text: result.message,
        confirmButtonColor: 'var(--primary-color)'
      });

      // Gửi email xác nhận đặt phòng
      // Gửi email xác nhận đặt phòng
      const emailData = {
        to: result.userEmail, // Lấy email từ response của API
        subject: 'Xác nhận đặt phòng thành công',
        html: `
          <h2>Cảm ơn bạn đã đặt phòng tại ${result.hotelName}</h2>
          <p>Thông tin đặt phòng của bạn:</p>
          <ul>
            <li>Khách sạn: ${result.hotelName}</li>
            <li>Địa chỉ: ${result.hotelLocation || 'N/A'}</li>
            <li>Ngày nhận phòng: ${new Date(checkInDate).toLocaleDateString('vi-VN')}</li>
            <li>Ngày trả phòng: ${new Date(checkOutDate).toLocaleDateString('vi-VN')}</li>
            <li>Số phòng: ${roomCount}</li>
            <li>Số người lớn: ${adults}</li>
            <li>Số trẻ em: ${children}</li>

            <li>Điện thoại: ${result.hotelPhone || 'N/A'}</li
          </ul>
        `
      };
      
      const emailResponse = await fetch('http://localhost:5000/api/send-booking-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(emailData)
      });
      if (!emailResponse.ok) {
        throw new Error('Failed to send confirmation email');
      }
      const emailResult = await emailResponse.json();
    } else {
      throw new Error(result.message || 'Có lỗi xảy ra khi đặt phòng');
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: error.message || 'Không thể kết nối đến server. Vui lòng thử lại sau.',
      confirmButtonColor: 'var(--primary-color)'
    });
  }
}
// Helper function to get hotel ID from URL
function getHotelIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

function bookHotel(hotelId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Bạn cần đăng nhập để đặt phòng');
    return;
  }

  const checkIn = document.getElementById('checkin').value;
  const checkOut = document.getElementById('checkout').value;

fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      hotelId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      roomCount: 1,
      adults: 2,
      children: 0
    })
  })
    .then(res => res.json())
    .then(data => alert(data.message))
    .catch(err => {
      console.error('Đặt phòng thất bại', err);
      alert('Có lỗi khi đặt phòng.');
    });
}
