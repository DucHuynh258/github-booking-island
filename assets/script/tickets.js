document.addEventListener('DOMContentLoaded', () => {
    // ---- PHẦN MỚI: XỬ LÝ CHECKBOX KHỨ HỒI ----
    const roundTripCheckbox = document.getElementById('round-trip-checkbox');
    const returnDateGroup = document.getElementById('return-date-group');
    const returnDateInput = document.getElementById('return-date');

    // Mặc định vô hiệu hóa ô ngày về khi tải trang
    function setReturnDateDisabled(isDisabled) {
        if (isDisabled) {
            returnDateGroup.style.opacity = '0.5';
            returnDateGroup.style.pointerEvents = 'none';
            returnDateInput.disabled = true;
            returnDateInput.value = ''; // Xóa ngày đã chọn nếu bỏ tick
        } else {
            returnDateGroup.style.opacity = '1';
            returnDateGroup.style.pointerEvents = 'auto';
            returnDateInput.disabled = false;
        }
    }

    // Chạy lần đầu để chắc chắn ô ngày về bị vô hiệu hóa
    setReturnDateDisabled(true);

    // Lắng nghe sự kiện thay đổi của checkbox
    if (roundTripCheckbox) {
        roundTripCheckbox.addEventListener('change', function() {
            setReturnDateDisabled(!this.checked);
        });
    }

    // ---- PHẦN KIỂM TRA FORM TÌM KIẾM ----
    const searchForm = document.getElementById('ticket-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            const departureDateInput = document.getElementById('departure-date');

            if (!departureDateInput.value) {
                event.preventDefault();
                Swal.fire({
                    icon: 'warning',
                    title: 'Chưa chọn ngày đi',
                    text: 'Vui lòng chọn ngày đi để tìm vé nhé!',
                    confirmButtonColor: 'var(--primary-color, #007bff)'
                });
            }
        });
    }

    // ---- PHẦN Xử lý nút "Xem" ----
    const bookTicketButtons = document.querySelectorAll('.book-ticket-btn');
    const locationValueMap = {
        'Phan Thiết': 'phanthiet',
        'Phú Quý': 'phuquy',
        'Rạch Giá': 'rachgia',
        'Phú Quốc': 'phuquoc',
        'Hà Tiên': 'hatien',
        'Cam Ranh': 'camranh',
        'Bình Hưng': 'binhhung'
    };

    bookTicketButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const ticketItem = button.closest('.tickets-item');
            const fromText = ticketItem.querySelectorAll('.tickets-item__place-name')[0].textContent.trim();
            const toText = ticketItem.querySelectorAll('.tickets-item__place-name')[1].textContent.trim();
            const departureValue = locationValueMap[fromText];
            const destinationValue = locationValueMap[toText];

            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const todayDateString = `${year}-${month}-${day}`;

            // Hàm xử lý đặt vé
async function bookTicket(tripDetails) {
  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Bạn cần đăng nhập để đặt vé',
      confirmButtonColor: 'var(--primary-color)'
    });
    return;
  }
  try {
    const response = await fetch('http://localhost:5000/api/book-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(tripDetails)
    });
    const result = await response.json();
    
    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Đặt vé thành công!',
        text: 'Vui lòng kiểm tra email để xem chi tiết vé.',
        confirmButtonColor: 'var(--primary-color)'
      });
    } else {
      throw new Error(result.message || 'Có lỗi xảy ra khi đặt vé');
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: error.message || 'Không thể kết nối đến server',
      confirmButtonColor: 'var(--primary-color)'
    });
  }
}

            if (departureValue && destinationValue) {
                window.location.href = `search-results.html?departure=${departureValue}&destination=${destinationValue}&date=${todayDateString}&passengers=1`;
            } else {
                alert('Lỗi: Không tìm thấy giá trị cho điểm đi hoặc điểm đến.');
            }
        });
    });

    // --- PHẦN Mã cuộn slider ---
    const ticketSections = document.querySelectorAll('.ticket-section');
    ticketSections.forEach((section) => {
        const list = section.querySelector('.tickets-list');
        const btnPrev = section.querySelector('.ticket-nav-btn .fa-chevron-left').parentElement;
        const btnNext = section.querySelector('.ticket-nav-btn .fa-chevron-right').parentElement;
        const scrollAmount = 408;

        function updateButtons() {
            btnPrev.classList.toggle('ticket-nav-btn--disabled', list.scrollLeft <= 0);
            btnNext.classList.toggle('ticket-nav-btn--disabled', list.scrollLeft + list.clientWidth >= list.scrollWidth - 1);
        }

        btnPrev.addEventListener('click', () => {
            if (!btnPrev.classList.contains('ticket-nav-btn--disabled')) {
                list.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        });
        btnNext.addEventListener('click', () => {
            if (!btnNext.classList.contains('ticket-nav-btn--disabled')) {
                list.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        });
        list.addEventListener('scroll', updateButtons);
        updateButtons();
    });
});