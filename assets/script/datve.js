document.addEventListener('DOMContentLoaded', function() {
    // Lấy thông tin vé từ localStorage
    const savedTicketData = localStorage.getItem('selectedTicket');

    if (savedTicketData) {
        const ticketInfo = JSON.parse(savedTicketData);

        // Hiển thị thông tin vé lên trang
        const detailsPanel = document.getElementById('ticket-details-panel');
        detailsPanel.innerHTML = `
            <p><strong>Hãng tàu:</strong> ${ticketInfo.brand}</p>
            <p><strong>Tuyến:</strong> ${ticketInfo.departure} <i class="fa-solid fa-arrow-right"></i> ${ticketInfo.destination}</p>
            <p><strong>Thời gian di chuyển:</strong> ${ticketInfo.duration}</p>
            <p class="price"><strong>Giá vé:</strong> ${ticketInfo.price}</p>
        `;

        // Xử lý khi người dùng nhấn nút "Xác nhận Đặt Vé"
        const bookingForm = document.getElementById('booking-form');
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Lấy thông tin khách hàng
            const customerInfo = {
                name: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
            };

            // **Đây là nơi bạn sẽ gửi dữ liệu đến Back-end trong tương lai**
            console.log('--- DỮ LIỆU ĐẶT VÉ ---');
            console.log('Thông tin vé:', ticketInfo);
            console.log('Thông tin khách hàng:', customerInfo);

            alert('Đặt vé thành công! (Đây là bản demo). Chúng tôi sẽ liên hệ với bạn sớm nhất.');

            // Xóa dữ liệu trong localStorage và chuyển về trang chủ
            localStorage.removeItem('selectedTicket');
            window.location.href = './home.html';
        });

    } else {
        // Nếu không có thông tin vé, chuyển về trang tickets
        alert('Vui lòng chọn một vé trước khi đặt!');
        window.location.href = './tickets.html';
    }
});