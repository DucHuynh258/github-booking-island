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