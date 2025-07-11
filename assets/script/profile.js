document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const profileForm = document.getElementById('profile-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const dobInput = document.getElementById('dob');
    const genderInput = document.getElementById('gender');
    const addressInput = document.getElementById('address');
    const avatarInput = document.getElementById('avatar-upload');
    const profileAvatar = document.getElementById('profile-avatar');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const phoneError = document.getElementById('phone-error');
    const dobError = document.getElementById('dob-error');
    const genderError = document.getElementById('gender-error');
    const addressError = document.getElementById('address-error');

    // Default avatars
    const defaultAvatars = [
        '../assets/img/avatars/avatar1.jpg',
        '../assets/img/avatars/avatar2.png',
        '../assets/img/avatars/avatar3.png'
    ];

    // Set max date for dob input to yesterday
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const maxDate = yesterday.toISOString().split('T')[0];
    dobInput.setAttribute('max', maxDate);

    // Fetch user data
    if (token) {
        fetch('http://localhost:5000/api/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.userName) {
                console.log('Fetched user data:', data);
                nameInput.value = data.userName || '';
                emailInput.value = data.email || '';
                phoneInput.value = data.phone || '';
                dobInput.value = data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '';
                genderInput.value = data.gender || '';
                addressInput.value = data.address || '';
                const avatarSrc = data.avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
                profileAvatar.src = avatarSrc;
                if (window.userAvatar) {
                    window.userAvatar.src = avatarSrc;
                }
                localStorage.setItem('userName', data.userName);
                localStorage.setItem('userAvatar', avatarSrc);
                if (window.userNameSpan) {
                    window.userNameSpan.textContent = `Xin chào, ${data.userName}`;
                } else {
                    console.warn('userNameSpan not found during initial load');
                }
            } else {
                console.warn('No userName in response, logging out');
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                window.location.href = '../../log_in.html';
            }
        })
        .catch(error => {
            console.error('Lỗi lấy thông tin người dùng:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = '../../log_in.html';
        });
    } else {
        console.warn('No token found, redirecting to login');
        window.location.href = '../../log_in.html';
    }

    // Compress and validate image
    async function compressImage(file) {
        return new Promise((resolve, reject) => {
            const maxSizeMB = 5;
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            if (file.size > maxSizeBytes) {
                reject(new Error('Ảnh vượt quá 5MB'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const maxWidth = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (maxWidth / width) * height;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toDataURL('image/jpeg', 0.7); // Compress to JPEG with 70% quality
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.onerror = () => reject(new Error('Lỗi tải ảnh'));
            };
            reader.onerror = () => reject(new Error('Lỗi đọc file ảnh'));
            reader.readAsDataURL(file);
        });
    }

    // Handle avatar upload
    avatarInput.addEventListener('change', async () => {
        const file = avatarInput.files[0];
        if (file) {
            try {
                const compressedAvatar = await compressImage(file);
                profileAvatar.src = compressedAvatar;
                if (window.userAvatar) {
                    window.userAvatar.src = compressedAvatar;
                }
            } catch (error) {
                console.error('Lỗi nén ảnh:', error);
                alert(error.message || 'Lỗi xử lý ảnh, vui lòng thử lại');
            }
        }
    });

    // Validate phone number
    function validatePhone(phone) {
        return /^[0-9]{10,11}$/.test(phone);
    }

    // Validate date of birth (must be in the past)
    function validateDateOfBirth(dateStr) {
        if (!dateStr) return true; // Allow empty date
        const selectedDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate < today;
    }

    // Handle form submission
    profileForm.addEventListener('submit', async(e) => {
        e.preventDefault();

        // Reset error messages
        nameError.style.display = 'none';
        emailError.style.display = 'none';
        phoneError.style.display = 'none';
        dobError.style.display = 'none';
        genderError.style.display = 'none';
        addressError.style.display = 'none';

        let isValid = true;

        if (!nameInput.value.trim()) {
            nameError.style.display = 'block';
            isValid = false;
        }

        if (phoneInput.value && !validatePhone(phoneInput.value)) {
            phoneError.style.display = 'block';
            isValid = false;
        }

        if (dobInput.value && !validateDateOfBirth(dobInput.value)) {
            dobError.style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            const formData = {
                userName: nameInput.value.trim(),
                phone: phoneInput.value,
                dateOfBirth: dobInput.value,
                gender: genderInput.value,
                address: addressInput.value,
            };

            if (avatarInput.files[0]) {
                try {
                    formData.avatar = await compressImage(avatarInput.files[0]);
                    await updateProfile(formData);
                } catch (error) {
                    console.error('Lỗi nén ảnh:', error);
                    alert(error.message || 'Lỗi xử lý ảnh, vui lòng thử lại');
                }
            } else {
                formData.avatar = profileAvatar.src;
                await updateProfile(formData);
            }
        }
    });

    async function updateProfile(formData) {
        try {
            console.log('Sending update request with:', formData);
            const response = await fetch('http://localhost:5000/api/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('Update profile response:', data);
            if (response.ok) {
                alert('Cập nhật hồ sơ thành công!');
                const updatedUserName = data.userName || formData.userName;
                const updatedAvatar = data.avatar || formData.avatar;
                if (updatedUserName) {
                    localStorage.setItem('userName', updatedUserName);
                    localStorage.setItem('userAvatar', updatedAvatar);
                    nameInput.value = updatedUserName;
                    profileAvatar.src = updatedAvatar;
                    if (window.userNameSpan) {
                        window.userNameSpan.textContent = `Xin chào, ${updatedUserName}`;
                    } else {
                        console.warn('userNameSpan not found during update, reloading page');
                        window.location.reload();
                    }
                    if (window.userAvatar && data.avatar) {
                        window.userAvatar.src = data.avatar;
                    }
                } else {
                    console.error('No userName in update response or formData');
                    alert('Lỗi đồng bộ tên người dùng, vui lòng thử lại');
                }
            } else {
                alert(data.message || 'Cập nhật hồ sơ thất bại');
            }
        } catch (error) {
            console.error('Lỗi cập nhật hồ sơ:', error);
            alert('Lỗi server, vui lòng thử lại');
        }
    }
});