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
    document.getElementById('average-rating').textContent = hotel.averageRating || '0';
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

// Xử lý đánh giá sao
let currentRating = 0;
document.querySelectorAll('.star-rating i').forEach(star => {
  star.addEventListener('click', () => {
    const rating = parseInt(star.dataset.rating);
    currentRating = rating;
    updateStars(rating);
  });
});
function updateStars(rating) {
  document.querySelectorAll('.star-rating i').forEach(star => {
    const starRating = parseInt(star.dataset.rating);
    if (starRating <= rating) {
      star.classList.remove('far');
      star.classList.add('fas');
    } else {
      star.classList.remove('fas');
      star.classList.add('far');
    }
  });
}
async function submitRating() {
  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Bạn cần đăng nhập để đánh giá',
      confirmButtonColor: 'var(--primary-color)'
    });
    return;
  }
  if (!currentRating) {
    Swal.fire({
      icon: 'warning',
      title: 'Chưa chọn số sao',
      text: 'Vui lòng chọn số sao đánh giá',
      confirmButtonColor: 'var(--primary-color)'
    });
    return;
  }
  const comment = document.getElementById('rating-comment').value;
  const hotelId = new URLSearchParams(window.location.search).get('id');
  
  try {
    const response = await fetch(`http://localhost:5000/api/hotels/${hotelId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        rating: currentRating,
        comment
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      document.getElementById('average-rating').textContent = data.averageRating.toFixed(1);
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: data.message,
        confirmButtonColor: 'var(--primary-color)'
      });
      // Reset form
      currentRating = 0;
      updateStars(0);
      document.getElementById('rating-comment').value = '';
      loadRatings(); // Tải lại danh sách đánh giá
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: error.message || 'Không thể đánh giá lúc này',
      confirmButtonColor: 'var(--primary-color)'
    });
  }
}
// Thêm hàm để tải và hiển thị danh sách đánh giá
async function loadRatings() {
  const hotelId = new URLSearchParams(window.location.search).get('id');
  try {
    const response = await fetch(`http://localhost:5000/api/hotels/${hotelId}`);
    const hotel = await response.json();
    
    const ratingsListElement = document.getElementById('ratings-list');
    ratingsListElement.innerHTML = hotel.ratings.map(rating => `
      <div class="rating-item">
        <div class="rating-item__header">
          <div class="rating-item__user">
            <img src="${rating.userAvatar}" alt="${rating.userName}" class="rating-user-avatar">
            <span class="rating-user-name">${rating.userName}</span>
          </div>
          <div class="rating-item__stars">${'★'.repeat(rating.rating)}</div>
        </div>
        <div class="rating-item__date">${new Date(rating.createdAt).toLocaleDateString()}</div>
        <div class="rating-item__comment">${rating.comment}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading ratings:', error);
  }
}
// Call loadRatings when page loads
// Gọi loadRatings khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
  loadHotel();
  loadRatings();
});

loadHotel();
