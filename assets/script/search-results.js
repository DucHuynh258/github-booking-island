document.addEventListener('DOMContentLoaded', () => {
    // ---- PHẦN 1: HIỂN THỊ KẾT QUẢ TÌM KIẾM ----
    const allTrips = [
        { from: 'rachgia', to: 'phuquoc', time: '07:30', brand: 'Superdong', price: 340000 },
        { from: 'rachgia', to: 'phuquoc', time: '08:15', brand: 'Phú Quốc Express', price: 350000 },
        { from: 'hatien', to: 'phuquoc', time: '09:00', brand: 'Superdong', price: 250000 },
        { from: 'phanthiet', to: 'phuquy', time: '08:00', brand: 'Superdong', price: 400000 },
    ];

    const params = new URLSearchParams(window.location.search);
    const departure = params.get('departure');
    const destination = params.get('destination');
    const date = params.get('date');
    const passengers = parseInt(params.get('passengers')) || 1;

    const resultsTitle = document.getElementById('results-title');
    const resultsSubtitle = document.getElementById('results-subtitle');
    const resultsList = document.getElementById('results-list');

    const locationMap = {
        'rachgia': 'Rạch Giá',
        'hatien': 'Hà Tiên',
        'phanthiet': 'Phan Thiết',
        'phuquoc': 'Đảo Phú Quốc',
        'phuquy': 'Đảo Phú Quý'
    };

    const fromText = locationMap[departure] || departure;
    const toText = locationMap[destination] || destination;

    resultsTitle.textContent = `Kết quả: ${fromText} → ${toText}`;
    resultsSubtitle.textContent = `Ngày đi: ${date} | Số hành khách: ${passengers}`;
    resultsList.innerHTML = '';

    const foundTrips = allTrips.filter(trip => trip.from === departure && trip.to === destination);

    if (foundTrips.length > 0) {
        foundTrips.forEach(trip => {
            const li = document.createElement('li');
            li.className = 'result-item';
            li.innerHTML = `
                <div class="result-item-info">
                    <i class="fa-solid fa-ship"></i>
                    <div><div class="result-item-time">${trip.time}</div><div class="result-item-brand">${trip.brand}</div></div>
                </div>
                <div class="result-item-price">${trip.price.toLocaleString('vi-VN')} đ</div>
                <button class="select-ticket-btn" data-price="${trip.price}">Chọn vé</button>
            `;
            resultsList.appendChild(li);
        });
    } else {
        resultsList.innerHTML = '<p>Rất tiếc, không tìm thấy chuyến đi nào phù hợp.</p>';
    }

    // ---- PHẦN 2: QUẢN LÝ POPUP ĐẶT VÉ ----

    const bookingPopup = document.getElementById('booking-popup');
    const closePopupBtn = document.getElementById('close-popup');
    const ticketQuantityInput = document.getElementById('ticket-quantity');
    const phoneNumberInput = document.getElementById('phone-number');
    const totalPriceSpan = document.getElementById('total-price');
    const seatMap = document.getElementById('seat-map');
    const confirmBookingBtn = document.getElementById('confirm-booking');
    let currentTripPrice = 0;
    let currentTripTime = '';
    let currentTripBrand = '';

    resultsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('select-ticket-btn')) {
            const button = event.target;
            const resultItem = button.closest('.result-item');
            currentTripPrice = parseInt(button.dataset.price);
            currentTripTime = resultItem.querySelector('.result-item-time').textContent;
            currentTripBrand = resultItem.querySelector('.result-item-brand').textContent;

            ticketQuantityInput.value = passengers;
            totalPriceSpan.textContent = (currentTripPrice * passengers).toLocaleString('vi-VN');

            generateSeatMap();
            bookingPopup.classList.add('active');
        }
    });

    closePopupBtn.addEventListener('click', () => bookingPopup.classList.remove('active'));
    window.addEventListener('click', (event) => {
        if (event.target == bookingPopup) bookingPopup.classList.remove('active');
    });

    ticketQuantityInput.addEventListener('input', () => {
        const quantity = parseInt(ticketQuantityInput.value);
        totalPriceSpan.textContent = (quantity > 0) ? (currentTripPrice * quantity).toLocaleString('vi-VN') : "0";
    });

    function generateSeatMap() {
        seatMap.innerHTML = '';
        for (let i = 1; i <= 30; i++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.textContent = i;
            if (Math.random() > 0.8) {
                seat.classList.add('occupied');
            } else {
                seat.addEventListener('click', () => {
                    const selectedSeats = document.querySelectorAll('.seat.selected').length;
                    const maxSeats = parseInt(ticketQuantityInput.value);

                    if (!seat.classList.contains('selected') && selectedSeats >= maxSeats) {
                        Swal.fire({
                            toast: true,
                            position: 'top',
                            icon: 'warning',
                            title: `Chỉ được chọn tối đa ${maxSeats} ghế.`,
                            showConfirmButton: false,
                            timer: 2000
                        });
                        return;
                    }

                    seat.classList.toggle('selected');
                });
            }
            seatMap.appendChild(seat);
        }
    }

    confirmBookingBtn.addEventListener('click', async() => {
        const quantity = parseInt(ticketQuantityInput.value);
        const selectedSeatElements = document.querySelectorAll('.seat.selected');
        const selectedSeats = Array.from(selectedSeatElements).map(seat => seat.textContent);
        const phoneNumber = phoneNumberInput.value.trim();
        const token = localStorage.getItem('token');

        if (!token) {
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Bạn cần đăng nhập để thực hiện chức năng này.', confirmButtonColor: 'var(--primary-color)' });
            return;
        }
        if (!phoneNumber) {
            Swal.fire({ icon: 'error', title: 'Thông tin còn thiếu', text: 'Vui lòng nhập số điện thoại của bạn!', confirmButtonColor: 'var(--primary-color)' });
            return;
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            Swal.fire({ icon: 'error', title: 'Số điện thoại không hợp lệ', text: 'Số điện thoại phải có 10 chữ số.', confirmButtonColor: 'var(--primary-color)' });
            return;
        }
        if (quantity <= 0) {
            Swal.fire({ icon: 'error', title: 'Lỗi...', text: 'Số lượng vé phải lớn hơn 0!', confirmButtonColor: 'var(--primary-color)' });
            return;
        }
        if (selectedSeats.length !== quantity) {
            Swal.fire({ icon: 'warning', title: 'Chưa chọn đủ ghế', text: `Bạn đã đặt ${quantity} vé, vui lòng chọn đủ ${quantity} ghế.`, confirmButtonColor: 'var(--primary-color)' });
            return;
        }

        const bookingData = {
            departure: fromText,
            destination: toText,
            tripDate: date,
            tripTime: currentTripTime,
            brand: currentTripBrand,
            quantity: quantity,
            totalPrice: currentTripPrice * quantity,
            seats: selectedSeats,
            phone: phoneNumber
        };

        try {
            const response = await fetch('/api/book-ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();

            if (response.ok) {
                bookingPopup.classList.remove('active');
                Swal.fire({
                    icon: 'success',
                    title: 'Đặt vé thành công!',
                    text: result.message, // Hiển thị thông báo từ server
                    confirmButtonColor: 'var(--primary-color)'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Có lỗi xảy ra',
                    text: result.message,
                    confirmButtonColor: 'var(--primary-color)'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi kết nối',
                text: 'Không thể kết nối đến server. Vui lòng thử lại sau.',
                confirmButtonColor: 'var(--primary-color)'
            });
        }
    });
});