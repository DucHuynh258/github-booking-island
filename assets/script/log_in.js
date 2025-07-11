document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');
    const eyeIcon = togglePassword ? togglePassword.querySelector('i') : null;
    const loginButton = document.getElementById('content__submit');
    const emailField = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const loginForm = document.getElementById('login-form');

    if (!loginForm || !emailField || !passwordField || !loginButton || !emailError || !passwordError) {
        console.error('Missing required DOM elements for login form');
        return;
    }

    if (togglePassword && eyeIcon) {
        togglePassword.addEventListener('click', () => {
            const type = passwordField.type === 'password' ? 'text' : 'password';
            passwordField.type = type;
            eyeIcon.classList.toggle('fa-eye', type === 'password');
            eyeIcon.classList.toggle('fa-eye-slash', type !== 'password');
        });
    }

    function validateEmail(email) {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }

    function validatePassword(pw) {
        return /[A-Z]/.test(pw) &&
               /[a-z]/.test(pw) &&
               /[0-9]/.test(pw) &&
               /[^A-Za-z0-9]/.test(pw) &&
               pw.length > 7;
    }

    loginButton.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Login button clicked');

        emailError.style.display = 'none';
        passwordError.style.display = 'none';

        let isValid = true;

        if (!emailField.value) {
            emailError.textContent = 'Email không được để trống';
            emailError.style.display = 'block';
            isValid = false;
        } else if (!validateEmail(emailField.value)) {
            emailError.textContent = 'Email không đúng định dạng';
            emailError.style.display = 'block';
            isValid = false;
        }

        if (!passwordField.value) {
            passwordError.textContent = 'Mật khẩu không được để trống';
            passwordError.style.display = 'block';
            isValid = false;
        } else if (!validatePassword(passwordField.value)) {
            passwordError.textContent = 'Mật khẩu không đúng định dạng';
            passwordError.style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            try {
                console.log('Sending login request...');
                const response = await fetch('http://localhost:5000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: emailField.value,
                        password: passwordField.value,
                    }),
                });

                const data = await response.json();
                console.log('Login response:', data);

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userName', data.userName);
                    console.log('Redirecting to home.html');
                    window.location.href = './home.html'; // Adjusted path
                } else {
                    emailError.textContent = 'Email hoặc mật khẩu không đúng';
                    emailError.style.display = 'block';
                    passwordError.textContent = 'Email hoặc mật khẩu không đúng';
                    passwordError.style.display = 'block';
                }
            } catch (error) {
                console.error('Login error:', error.message);
                alert('Lỗi server, vui lòng thử lại');
            }
        }
    });
});