
const contentSubmit = document.getElementById("content__submit-id");
const successDiv = document.getElementById('successMessage');
const nameElement = document.getElementById("name");
const emailElement = document.getElementById("email");
const contentInputWrapper = document.getElementById("content__input-wrapper")

const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');
const eyeIcon = togglePassword.querySelector('i'); // Icon of the first password field

const toggleRePassword = document.getElementById('toggleRePassword');
const rePasswordField = document.getElementById('re-password');
const reEyeIcon = toggleRePassword.querySelector('i'); // Icon of the re-password field

const userNameError = document.getElementById("userNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const rePasswordError = document.getElementById("rePasswordError");

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


contentSubmit.addEventListener("click", async function(e){

    e.preventDefault();
    userNameError.style.display = "none";
    emailError.style.display = "none";
    passwordError.style.display = "none";
    rePasswordError.style.display = "none";

    let isValid = true;

    // Kiểm tra tên
    if (!nameElement.value) {
        userNameError.style.display = "block";
        userNameError.innerHTML = "Tên không được để trống";
        isValid = false;
    }

    // Kiểm tra email
    if (!emailElement.value) {
        emailError.style.display = "block";
        emailError.innerHTML = "Email không được để trống";
        isValid = false;
    } else if (!validateEmail(emailElement.value)) {
        emailError.style.display = "block";
        emailError.innerHTML = "Email không đúng định dạng";
        isValid = false;
    }

    // Kiểm tra mật khẩu
    if (!passwordField.value) {
        passwordError.style.display = "block";
        passwordError.innerHTML = "Mật khẩu không được để trống";
        isValid = false;
    } else if (!validatePassword(passwordField.value)) {
        passwordError.style.display = "block";
        contentInputWrapper.style.marginBottom = "30px";
        passwordError.innerHTML = "Mật khẩu có ít nhất 8 ký tự gồm số, chữ hoa, chữ thường và 1 ký tự đặc biệt!";
        isValid = false;
    }

    // Kiểm tra mật khẩu trùng
    if (!rePasswordField.value) {
        rePasswordError.style.display = "block";
        rePasswordError.innerHTML = "Mật khẩu không được để trống";
        isValid = false;
    } else if (passwordField.value !== rePasswordField.value) {
        rePasswordError.style.display = "block";
        rePasswordError.innerHTML = "Mật khẩu không khớp";
        isValid = false;
    } 

    if (isValid) {
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: nameElement.value,
                    email: emailElement.value,
                    password: passwordField.value,
                }),
            });
          
            const data = await response.json();
            if (response.ok) {
                successDiv.style.display = 'block';

                setTimeout(() => {
                    window.location.href = '../../log_in.html';
                }, 1000);
            } else {
                emailError.style.display = "block";
                emailError.innerHTML = data.message || "Đăng ký thất bại";
            }
        } catch (error) {
            emailError.style.display = "block";
            emailError.innerHTML = "Lỗi server, vui lòng thử lại";
        }
    }
});




// Toggle for password field
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

// Toggle for re-password field
toggleRePassword.addEventListener('click', function () {
    const type = rePasswordField.type === 'password' ? 'text' : 'password';
    rePasswordField.type = type;
    
    // Toggle the eye icon for the re-password field
    if (rePasswordField.type === 'password') {
        reEyeIcon.classList.remove('fa-eye-slash');
        reEyeIcon.classList.add('fa-eye');
    } else {
        reEyeIcon.classList.remove('fa-eye');
        reEyeIcon.classList.add('fa-eye-slash');
    }
});

