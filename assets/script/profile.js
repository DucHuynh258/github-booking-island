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
        '../img/avatars/avatar1.jpg',
        '../img/avatars/avatar2.png',
        '../img/avatars/avatar3.png'
    ];

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
                nameInput.value = data.userName || '';
                emailInput.value = data.email || '';
                phoneInput.value = data.phone || '';
                dobInput.value = data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '';
                genderInput.value = data.gender || '';
                addressInput.value = data.address || '';
                profileAvatar.src = data.avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                window.location.href = '../../log_in.html';
            }
        })
        .catch(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = '../../log_in.html';
        });
    } else {
        window.location.href = '../../log_in.html';
    }

    // Handle avatar upload
    avatarInput.addEventListener('change', () => {
        const file = avatarInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileAvatar.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Validate phone number
    function validatePhone(phone) {
        return /^[0-9]{10,11}$/.test(phone);
    }

    // Handle form submission
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset error messages
        nameError.style.display = 'none';
        emailError.style.display = 'none';
        phoneError.style.display = 'none';
        dobError.style.display = 'none';
        genderError.style.display = 'none';
        addressError.style.display = 'none';

        let isValid = true;

        if (!nameInput.value) {
            nameError.style.display = 'block';
            isValid = false;
        }

        if (phoneInput.value && !validatePhone(phoneInput.value)) {
            phoneError.style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            const formData = {
                userName: nameInput.value,
                phone: phoneInput.value,
                dateOfBirth: dobInput.value,
                gender: genderInput.value,
                address: addressInput.value,
            };

            if (avatarInput.files[0]) {
                const file = avatarInput.files[0];
                const reader = new FileReader();
                reader.onload = async (e) => {
                    formData.avatar = e.target.result;
                    await updateProfile(formData);
                };
                reader.readAsDataURL(file);
            } else {
                await updateProfile(formData);
            }
        }
    });

    async function updateProfile(formData) {
        try {
            const response = await fetch('http://localhost:5000/api/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                alert('Cập nhật hồ sơ thành công!');
                localStorage.setItem('userName', formData.userName);
                window.location.reload();
            } else {
                alert(data.message || 'Cập nhật hồ sơ thất bại');
            }
        } catch (error) {
            alert('Lỗi server, vui lòng thử lại');
        }
    }
});