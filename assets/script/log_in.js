// Toggle for password field
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');
const eyeIcon = togglePassword.querySelector('i'); // Icon of the first password field
const loginButton = document.querySelector('content__submit');
const emailField = document.getElementById('email');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const button = document.getElementById('content__submit');
const loginForm = document.getElementById('login-form');

togglePassword.addEventListener('click', function () {
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;
    
    // Toggle the eye icon for the first password field
    if (passwordField.type === 'password') {
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    } else {
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    }
});

function validateEmail (email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function validatePassword(pw) {
    return /[A-Z]/       .test(pw) &&
           /[a-z]/       .test(pw) &&
           /[0-9]/       .test(pw) &&
           /[^A-Za-z0-9]/.test(pw) &&
           pw.length > 7;
}

button.addEventListener('click' , async function(e){
    e.preventDefault();

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

    if (isValid){
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailField.value,
                    password: passwordField.value,
                }),
            });
          
            const data = await response.json();
    
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.userName);
                window.location.href = '../../home.html';
            } else {
                emailError.style.display = 'block';
                emailError.textContent = 'Email hoặc mật khẩu không đúng';
                passwordError.style.display = 'block';
                passwordError.textContent = 'Email hoặc mật khẩu không đúng';
            }
    
        } catch (error) {
            alert('Lỗi server, vui lòng thử lại');
        }
    }
});

