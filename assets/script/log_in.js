// Toggle for password field
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');
const eyeIcon = togglePassword.querySelector('i'); // Icon of the first password field

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
const toggleRePassword = document.getElementById('toggleRePassword');
const rePasswordField = document.getElementById('re-password');
const reEyeIcon = toggleRePassword.querySelector('i'); // Icon of the re-password field

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
