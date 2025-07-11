document.addEventListener('DOMContentLoaded', () => {
    initializeUserProfile();
});

function initializeUserProfile() {
    console.log('Initializing user profile...');
    
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

    // Check if required DOM elements exist
    if (!loginBtn || !userProfile || !userNameSpan || !userAvatar) {
        console.error('Missing required DOM elements for user profile initialization');
        return;
    }

    // Default avatars
    const defaultAvatars = [
        './assets/img/avatars/avatar1.jpg',
        './assets/img/avatars/avatar2.png',
        './assets/img/avatars/avatar3.png',
    ];

    // Logout functionality
    function handleLogout() {
        console.log('Logging out user and redirecting to home.html');
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.href = '../home.html'; // Adjusted for auth/ subdirectory
    }


    if (token && userName) {
        console.log('Token and userName found, setting initial UI...');
        loginBtn.style.display = 'none';
        userProfile.style.display = 'flex';
        userNameSpan.textContent = `Xin chào, ${userName}`;
        // Set a temporary avatar until server responds
        userAvatar.src = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

        // Verify token asynchronously
        fetch('http://localhost:5000/api/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Server response status:', response.status);
            return response.json();
        })
        .then(data => {
            if (data.userName) {
                console.log('User verified:', data.userName);
                // Update username and avatar if different
                if (data.userName !== userName) {
                    userNameSpan.textContent = `Xin chào, ${data.userName}`;
                    localStorage.setItem('userName', data.userName);
                }
                userAvatar.src = data.avatar || userAvatar.src;
            } else {
                console.warn('Invalid user data, clearing localStorage');
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                loginBtn.style.display = 'block';
                userProfile.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error verifying token:', error.message);
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            loginBtn.style.display = 'block';
            userProfile.style.display = 'none';
        });
    } else {
        console.log('No token or userName found in localStorage');
        loginBtn.style.display = 'block';
        userProfile.style.display = 'none';
    }

    // Toggle dropdown menu
    if (dropdownIcon && dropdownMenu) {
        dropdownIcon.addEventListener('click', () => {
            console.log('Toggling dropdown menu');
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
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

    // Expose userAvatar for synchronization
    window.userAvatar = userAvatar;
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