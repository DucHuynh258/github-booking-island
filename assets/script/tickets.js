document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIC FOR TICKET FILTER WITH EFFECTS ---
    const searchForm = document.getElementById('main-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            // Ngăn trang không tải lại
            event.preventDefault();

            // MỚI: Thêm hiệu ứng cuộn mượt mà xuống kết quả
            const resultsContainer = document.getElementById('tickets-result-container');
            if (resultsContainer) {
                resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            const selectedDeparture = document.getElementById('departure').value;
            const selectedDestination = document.getElementById('destination').value;

            const allTicketCols = document.querySelectorAll('.tickets-list .col.l-4');
            const noResultsMessage = document.getElementById('no-results-message');
            const allTicketSections = document.querySelectorAll('.ticket-section');

            // --- Bước 1: Làm mờ tất cả các vé đang hiển thị ---
            allTicketCols.forEach(col => {
                if (col.style.display !== 'none') {
                    col.classList.add('ticket-col-fade-out');
                }
            });

            // --- Bước 2: Chờ hiệu ứng mờ đi hoàn tất rồi mới lọc và hiện ra ---
            setTimeout(() => {
                let visibleTicketsCount = 0;

                allTicketCols.forEach(col => {
                    col.classList.remove('ticket-col-fade-out');

                    const ticket = col.querySelector('.tickets-item');
                    if (!ticket) return;

                    const places = ticket.querySelectorAll('.tickets-item__place-name');
                    const ticketDeparture = places[0] ? places[0].textContent.trim() : '';
                    const ticketDestination = places[1] ? places[1].textContent.trim() : '';

                    const departureMatch = (selectedDeparture === 'any') || (ticketDeparture === selectedDeparture);
                    const destinationMatch = (selectedDestination === 'any') || (ticketDestination.includes(selectedDestination));

                    const isVisible = departureMatch && destinationMatch;

                    if (isVisible) {
                        col.style.display = 'block';
                        col.classList.add('ticket-col-fade-in');
                        visibleTicketsCount++;
                    } else {
                        col.style.display = 'none';
                        col.classList.remove('ticket-col-fade-in');
                    }
                });

                allTicketSections.forEach(section => {
                    const visibleItemsInSection = section.querySelectorAll('.col.l-4[style*="display: block"]').length;
                    section.style.display = visibleItemsInSection > 0 ? 'block' : 'none';
                });

                if (noResultsMessage) {
                    noResultsMessage.style.display = visibleTicketsCount === 0 ? 'block' : 'none';
                }

                setTimeout(() => {
                    allTicketCols.forEach(col => col.classList.remove('ticket-col-fade-in'));
                }, 500);

            }, 300);
        });
    }

    // --- LOGIC FOR BOOKING POP-UP ---
    const bookingPopup = document.getElementById('booking-popup');
    const closePopupBtn = document.getElementById('close-popup');
    const ticketQuantityInput = document.getElementById('ticket-quantity');
    const totalPriceSpan = document.getElementById('total-price');
    const seatMap = document.getElementById('seat-map');
    const confirmBookingBtn = document.getElementById('confirm-booking');
    let currentPrice = 0;

    document.querySelectorAll('.book-ticket-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            currentPrice = parseInt(e.target.dataset.price, 10);
            ticketQuantityInput.value = 1;
            updateTotalPrice();
            generateSeatMap();
            if (bookingPopup) bookingPopup.style.display = 'flex';
        });
    });

    const closePopup = () => {
        if (bookingPopup) bookingPopup.style.display = 'none';
    };

    if (closePopupBtn) closePopupBtn.addEventListener('click', closePopup);
    if (bookingPopup) {
        bookingPopup.addEventListener('click', (e) => {
            if (e.target === bookingPopup) {
                closePopup();
            }
        });
    }

    if (ticketQuantityInput) {
        ticketQuantityInput.addEventListener('input', () => {
            updateTotalPrice();
            document.querySelectorAll('.seat.selected').forEach(seat => seat.classList.remove('selected'));
        });
    }

    if (confirmBookingBtn) {
        confirmBookingBtn.addEventListener('click', () => {
            const quantity = parseInt(ticketQuantityInput.value, 10);
            const total = totalPriceSpan.textContent;
            const selectedSeats = document.querySelectorAll('.seat.selected');
            const seatNames = Array.from(selectedSeats).map(seat => seat.textContent).join(', ');

            if (selectedSeats.length !== quantity) {
                alert(`Vui lòng chọn đủ ${quantity} ghế.`);
                return;
            }

            alert(`🎉 ĐẶT VÉ THÀNH CÔNG! 🎉\n\nSố lượng: ${quantity} vé\nGhế đã chọn: ${seatNames}\nTổng tiền: ${total} đ`);
            closePopup();
        });
    }

    function updateTotalPrice() {
        const quantity = parseInt(ticketQuantityInput.value, 10) || 0;
        if (totalPriceSpan) totalPriceSpan.textContent = (currentPrice * quantity).toLocaleString('vi-VN');
    }

    function generateSeatMap() {
        if (!seatMap) return;
        seatMap.innerHTML = '';
        const totalSeats = 20;

        for (let i = 1; i <= totalSeats; i++) {
            const seat = document.createElement('div');
            seat.classList.add('seat');
            seat.textContent = `G${i}`;

            if (Math.random() > 0.85) {
                seat.classList.add('unavailable');
            } else {
                seat.addEventListener('click', () => {
                    const selectedCount = document.querySelectorAll('.seat.selected').length;
                    const maxQuantity = parseInt(ticketQuantityInput.value, 10);

                    if (seat.classList.contains('selected')) {
                        seat.classList.remove('selected');
                    } else {
                        if (selectedCount < maxQuantity) {
                            seat.classList.add('selected');
                        } else {
                            alert(`Bạn chỉ có thể chọn tối đa ${maxQuantity} ghế.`);
                        }
                    }
                });
            }
            seatMap.appendChild(seat);
        }
    }
});