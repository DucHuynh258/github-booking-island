
const divRegister = document.getElementById("divRegister");

const nameElement = document.getElementById("name");
const emailElement = document.getElementById("email");

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


divRegister.addEventListener("click", function(e){

    e.preventDefault();
    // Validate input data
    if (!nameElement.value){
        userNameError.style.display = "block";
    }else{
        userNameError.style.display = "none";
    }

    if (!emailElement.value){
        emailError.style.display = "block";
    }else{
        emailError.style.display = "none";
        // Check Email
        if(!validateEmail(emailElement.value)) {
            emailError.style.display = "block";
            emailError.innerHTML = "Email không đúng định dạng"
        }
    }

    if (!passwordField.value){
        passwordError.style.display = "block";
    }else{
        passwordError.style.display = "none";
    }

    if (!rePasswordField.value){
        rePasswordError.style.display = "block";
    }else{
        rePasswordError.style.display = "none";
    }

    // Check Password
    if(passwordField.value !== rePasswordField.value){
        rePasswordError.style.display = "block";
        rePasswordError.innerHTML = "Mật khẩu không khớp";
    }

    // Send data from register to localStorage
    if(nameElement.value && emailElement.value && passwordField.value && rePasswordField.value && passwordField.value === rePasswordField.value && validateEmail(emailElement.value)) {
        // Get data from register and merge into user object
        const user = {
            userId: Math.ceil(Math.random() * 100000000),
            userName: nameElement.value,
            email: emailElement,
            password: passwordField.value,
        };
        
        // console.log(user);
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


