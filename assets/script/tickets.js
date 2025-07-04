document.addEventListener('DOMContentLoaded', () => {
    // --- Phần 1: Code điều hướng Slider (đã có) ---
    const ticketSections = document.querySelectorAll('.ticket-section');

    ticketSections.forEach((section) => {
        const list = section.querySelector('.tickets-list');
        const btnPrev = section.querySelector('.ticket-nav-btn .fa-chevron-left').parentElement;
        const btnNext = section.querySelector('.ticket-nav-btn .fa-chevron-right').parentElement;
        const scrollAmount = 408; // Số pixel cuộn mỗi lần click

        // Hàm cập nhật trạng thái nút dựa trên vị trí cuộn
        function updateButtons() {
            if (list.scrollLeft <= 0) {
                btnPrev.classList.add('ticket-nav-btn--disabled');
            } else {
                btnPrev.classList.remove('ticket-nav-btn--disabled');
            }

            // Thêm 1 pixel để xử lý lỗi làm tròn của trình duyệt
            if (list.scrollLeft + list.clientWidth >= list.scrollWidth - 1) {
                btnNext.classList.add('ticket-nav-btn--disabled');
            } else {
                btnNext.classList.remove('ticket-nav-btn--disabled');
            }
        }

        // Cuộn danh sách sang trái
        btnPrev.addEventListener('click', () => {
            if (!btnPrev.classList.contains('ticket-nav-btn--disabled')) {
                list.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        });

        // Cuộn danh sách sang phải
        btnNext.addEventListener('click', () => {
            if (!btnNext.classList.contains('ticket-nav-btn--disabled')) {
                list.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        });

        // Cập nhật trạng thái nút khi cuộn
        list.addEventListener('scroll', updateButtons);

        // Khởi tạo trạng thái nút khi tải trang
        updateButtons();
    });

    // --- Phần 2: Code Pop-up đặt vé (mới) ---
    const bookingPopup = document.getElementById('booking-popup');
    const closePopup = document.getElementById('close-popup');
    const ticketQuantityInput = document.getElementById('ticket-quantity');
    const totalPriceSpan = document.getElementById('total-price');
    const seatMap = document.getElementById('seat-map');
    const confirmBookingBtn = document.getElementById('confirm-booking');

    let currentPrice = 0;

    // Mở pop-up đặt vé
    document.querySelectorAll('.book-ticket-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            currentPrice = parseInt(e.target.dataset.price, 10);
            ticketQuantityInput.value = 1; // Reset số lượng về 1
            updateTotalPrice();
            generateSeatMap();
            bookingPopup.style.display = 'flex';
        });
    });

    // Đóng pop-up đặt vé
    closePopup.addEventListener('click', () => {
        bookingPopup.style.display = 'none';
    });

    // Đóng pop-up khi click bên ngoài
    bookingPopup.addEventListener('click', (e) => {
        if (e.target === bookingPopup) {
            bookingPopup.style.display = 'none';
        }
    });

    // Cập nhật tổng tiền khi thay đổi số lượng
    ticketQuantityInput.addEventListener('input', () => {
        updateTotalPrice();
        // Xóa các ghế đã chọn nếu số lượng thay đổi
        document.querySelectorAll('.seat.selected').forEach(seat => seat.classList.remove('selected'));
    });

    // Xác nhận đặt vé
    confirmBookingBtn.addEventListener('click', () => {
        const quantity = parseInt(ticketQuantityInput.value, 10);
        const total = totalPriceSpan.textContent;
        const selectedSeats = document.querySelectorAll('.seat.selected');
        const seatNames = Array.from(selectedSeats).map(seat => seat.textContent).join(', ');

        if (selectedSeats.length !== quantity) {
            alert('Vui lòng chọn đủ số lượng ghế.');
            return;
        }

        alert(`BẠN ĐÃ ĐẶT VÉ THÀNH CÔNG!\n\nSố lượng: ${quantity} vé\nGhế đã chọn: ${seatNames}\nTổng tiền: ${total} đ`);
        bookingPopup.style.display = 'none';
    });

    // Hàm cập nhật tổng tiền
    function updateTotalPrice() {
        const quantity = parseInt(ticketQuantityInput.value, 10) || 0;
        totalPriceSpan.textContent = (currentPrice * quantity).toLocaleString('vi-VN');
    }

    // Hàm tạo bản đồ ghế
    function generateSeatMap() {
        seatMap.innerHTML = ''; // Xóa các ghế cũ
        for (let i = 1; i <= 20; i++) {
            const seat = document.createElement('div');
            seat.classList.add('seat');
            seat.textContent = `A${i}`;

            // Ngẫu nhiên tạo một số ghế không khả dụng
            if (Math.random() > 0.8) {
                seat.classList.add('unavailable');
            } else {
                seat.addEventListener('click', () => {
                    const selectedSeats = document.querySelectorAll('.seat.selected').length;
                    const quantity = parseInt(ticketQuantityInput.value, 10);

                    if (seat.classList.contains('selected')) {
                        // Bỏ chọn ghế
                        seat.classList.remove('selected');
                    } else {
                        // Chọn ghế mới nếu chưa đủ số lượng
                        if (selectedSeats < quantity) {
                            seat.classList.add('selected');
                        } else {
                            alert(`Bạn chỉ có thể chọn tối đa ${quantity} ghế.`);
                        }
                    }
                });
            }
            seatMap.appendChild(seat);
        }
    }
});