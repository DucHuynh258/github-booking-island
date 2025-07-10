document.addEventListener('DOMContentLoaded', () => {
    // ---- PHẦN 1: HIỂN THỊ KẾT QUẢ TÌM KIẾM (Giữ nguyên) ----
    const allTrips = [
        { from: 'rachgia', to: 'phuquoc', time: '07:30', brand: 'Superdong', price: 340000 },
        { from: 'rachgia', to: 'phuquoc', time: '08:15', brand: 'Phú Quốc Express', price: 350000 },
        { from: 'rachgia', to: 'phuquoc', time: '12:30', brand: 'Superdong', price: 340000 },
        { from: 'hatien', to: 'phuquoc', time: '09:00', brand: 'Superdong', price: 250000 },
        { from: 'hatien', to: 'phuquoc', time: '13:00', brand: 'Phú Quốc Express', price: 250000 },
        { from: 'phanthiet', to: 'phuquy', time: '08:00', brand: 'Superdong', price: 400000 },
        { from: 'phanthiet', to: 'phuquy', time: '08:30', brand: 'Phú Quý Express', price: 390000 },
        { from: 'camranh', to: 'binhhung', time: '10:00', brand: 'Cano Bình Hưng', price: 50000 }
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
        'camranh': 'Cam Ranh',
        'phuquoc': 'Đảo Phú Quốc',
        'phuquy': 'Đảo Phú Quý',
        'binhhung': 'Đảo Bình Hưng'
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
                    <div>
                        <div class="result-item-time">${trip.time}</div>
                        <div class="result-item-brand">${trip.brand}</div>
                    </div>
                </div>
                <div class="result-item-price">${trip.price.toLocaleString('vi-VN')} đ</div>
                <button class="select-ticket-btn" data-brand="${trip.brand}" data-price="${trip.price}">Chọn vé</button>
            `;
            resultsList.appendChild(li);
        });
    } else {
        resultsList.innerHTML = '<p>Rất tiếc, không tìm thấy chuyến đi nào phù hợp với lựa chọn của bạn.</p>';
    }

    // ---- PHẦN 2: QUẢN LÝ POPUP ĐẶT VÉ (Đã được cập nhật) ----

    const bookingPopup = document.getElementById('booking-popup');
    const closePopupBtn = document.getElementById('close-popup');
    const ticketQuantityInput = document.getElementById('ticket-quantity');
    const phoneNumberInput = document.getElementById('phone-number'); // Lấy ô nhập SĐT
    const totalPriceSpan = document.getElementById('total-price');
    const seatMap = document.getElementById('seat-map');
    const confirmBookingBtn = document.getElementById('confirm-booking');
    let currentTripPrice = 0;

    resultsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('select-ticket-btn')) {
            const button = event.target;
            currentTripPrice = parseInt(button.dataset.price);
            ticketQuantityInput.value = passengers;
            totalPriceSpan.textContent = (currentTripPrice * passengers).toLocaleString('vi-VN');
            generateSeatMap();
            bookingPopup.style.display = 'flex';
        }
    });

    closePopupBtn.addEventListener('click', () => bookingPopup.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == bookingPopup) bookingPopup.style.display = 'none';
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
            if (Math.random() > 0.8) seat.classList.add('occupied');
            else seat.addEventListener('click', () => {
                if (!seat.classList.contains('occupied')) seat.classList.toggle('selected');
            });
            seatMap.appendChild(seat);
        }
    }

    confirmBookingBtn.addEventListener('click', () => {
        const quantity = parseInt(ticketQuantityInput.value);
        const selectedSeats = document.querySelectorAll('.seat.selected').length;
        const phoneNumber = phoneNumberInput.value.trim(); // Lấy giá trị SĐT

        // ---- KHỐI KIỂM TRA MỚI ----
        if (!phoneNumber) {
            Swal.fire({ icon: 'error', title: 'Thông tin còn thiếu', text: 'Vui lòng nhập số điện thoại của bạn!', confirmButtonColor: 'var(--primary-color)' });
            return; // Dừng lại nếu SĐT trống
        }
        // Kiểm tra SĐT có phải là số và đủ 10 chữ số không (kiểm tra đơn giản)
        if (!/^\d{10}$/.test(phoneNumber)) {
            Swal.fire({ icon: 'error', title: 'Số điện thoại không hợp lệ', text: 'Số điện thoại phải có 10 chữ số.', confirmButtonColor: 'var(--primary-color)' });
            return; // Dừng lại nếu SĐT không hợp lệ
        }
        // ---- HẾT KHỐI KIỂM TRA MỚI ----

        if (quantity <= 0) {
            Swal.fire({ icon: 'error', title: 'Lỗi...', text: 'Số lượng vé phải lớn hơn 0!', confirmButtonColor: 'var(--primary-color)' });
            return;
        }
        if (selectedSeats !== quantity) {
            Swal.fire({ icon: 'warning', title: 'Chưa chọn đủ ghế', text: `Bạn đã chọn ${quantity} vé, vui lòng chọn đủ ${quantity} ghế.`, confirmButtonColor: 'var(--primary-color)' });
            return;
        }

        bookingPopup.style.display = 'none';
        Swal.fire({ icon: 'success', title: 'Đặt vé thành công!', text: 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.', confirmButtonColor: 'var(--primary-color)' });
    });
});