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
function setupRoomFilter() {
  // Lấy các phần tử modal value
  const modalValues = document.querySelectorAll('.filter-room__modal-value');
  // Lấy các nút + và -
  const modalBtns = document.querySelectorAll('.filter-room__modal-btn');

  // Lấy phần hiển thị tổng số phòng, người lớn, trẻ em
  const roomText = document.querySelector('.filter-room__room');
  const peopleText = document.querySelector('.filter-room__people');

  // Giá trị mặc định
  let room = parseInt(modalValues[0].textContent);
  let adult = parseInt(modalValues[1].textContent);
  let child = parseInt(modalValues[2].textContent);

  // Cập nhật hiển thị tổng
  function updateSummary() {
    roomText.textContent = `${room} Phòng`;
    peopleText.textContent = `${adult} người lớn, ${child} trẻ em`;
  }

  // Gán sự kiện cho các nút
  modalBtns.forEach((btn, idx) => {
    btn.addEventListener('click', function() {
      // idx: 0(- phòng), 1(+ phòng), 2(- người lớn), 3(+ người lớn), 4(- trẻ em), 5(+ trẻ em)
      if (idx === 0 && room > 1) room--;
      if (idx === 1) room++;
      if (idx === 2 && adult > 1) adult--;
      if (idx === 3) adult++;
      if (idx === 4 && child > 0) child--;
      if (idx === 5) child++;
      // Cập nhật giá trị modal
      modalValues[0].textContent = room;
      modalValues[1].textContent = adult;
      modalValues[2].textContent = child;
      updateSummary();
    });
  });
}

// Khởi tạo khi DOM đã sẵn sàng
window.addEventListener('DOMContentLoaded', function() {
  setupRoomFilter();
});

// assets/script/hotel.js

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
