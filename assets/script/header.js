document.addEventListener('DOMContentLoaded', () => {
    initializeUserProfile();
    initializeMobileMenu();
});

function initializeUserProfile() {
    console.log('Initializing user profile...');

      const header = document.querySelector('.header > div');
    const navbar = document.querySelector('.navbar');
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const loginBtn = document.getElementById('login-btn');
    const userProfile = document.getElementById('user-profile');
    const userNameSpan = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');
    const dropdownIcon = document.getElementById('user-dropdown-icon');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const logoutBtn = document.getElementById('logout-btn');
    const sidebarLogoutBtn = document.getElementById('sidebar-logout-btn');

    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    
    header.insertBefore(mobileMenuBtn, navbar);
    
    // Toggle menu on button click with animation
    mobileMenuBtn.addEventListener('click', () => {
        navbar.classList.toggle('active');
        document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
        mobileMenuBtn.innerHTML = navbar.classList.contains('active') ? 
            '<i class="fa-solid fa-xmark"></i>' : 
            '<i class="fa-solid fa-bars"></i>';
    });
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !mobileMenuBtn.contains(e.target) && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            document.body.style.overflow = '';
            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });
    // Check if required DOM elements exist
    if (!loginBtn || !userProfile || !userNameSpan || !userAvatar) {
        console.error('Missing required DOM elements for user profile initialization');
        return;
    }

    // Expose userNameSpan and userAvatar globally
    window.userNameSpan = userNameSpan;
    window.userAvatar = userAvatar;
    console.log('userNameSpan initialized:', window.userNameSpan);

    // Default avatars
    const defaultAvatars = [
        '../assets/img/avatars/avatar1.jpg',
        '../assets/img/avatars/avatar2.png',
        '../assets/img/avatars/avatar3.png'
    ];

    // Logout functionality
    function handleLogout() {
        console.log('Logging out user and redirecting to home.html');
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userAvatar');
        window.location.href = '../../home.html'; // Adjusted for auth/ subdirectory
    }

    if (token) {
        // Always fetch user data from server to ensure latest userName
        fetch('http://localhost:5000/api/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.userName) {
                console.log('User verified:', { userName: data.userName, avatar: data.avatar ? 'present' : 'not present' });
                localStorage.setItem('userName', data.userName);
                localStorage.setItem('userAvatar', data.avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)]);
                userNameSpan.textContent = `Xin chào, ${data.userName}`;
                userAvatar.src = data.avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
                loginBtn.style.display = 'none';
                userProfile.style.display = 'flex';
            } else {
                console.warn('Invalid token or no userName, clearing localStorage and updating UI');
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                localStorage.removeItem('userAvatar');
                loginBtn.style.display = 'block';
                userProfile.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error verifying token:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('userAvatar');
            loginBtn.style.display = 'block';
            userProfile.style.display = 'none';
        });
    } else {
        console.log('No token found in localStorage');
        localStorage.removeItem('userName');
        localStorage.removeItem('userAvatar');
        loginBtn.style.display = 'block';
        userProfile.style.display = 'none';
    }

    // Toggle dropdown menu
    if (dropdownIcon && dropdownMenu) {
        dropdownIcon.addEventListener('click', () => {
            console.log('Toggling dropdown menu');
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (e) => {
            if (!userProfile.contains(e.target)) {
                console.log('Closing dropdown menu');
                dropdownMenu.style.display = 'none';
            }
        });
    }

    // Attach logout handlers
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    if (sidebarLogoutBtn) {
        sidebarLogoutBtn.addEventListener('click', handleLogout);
    }
}

// When the page is scrolled, the header should become sticky
window.onscroll = function() {
    makeHeaderSticky();
};
// Get the header element
const header = document.getElementById("navbar");
// Get the offset position of the header
const sticky = header.offsetTop;
function makeHeaderSticky() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}