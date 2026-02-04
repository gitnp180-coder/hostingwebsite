// Storage keys for login attempts
const LOGIN_ATTEMPTS_KEY = 'bholan_login_attempts';
const LOGIN_BLOCKED_UNTIL_KEY = 'bholan_login_blocked_until';
const PROFILE_PIC_KEY = 'bholan_portal_profile_pic';
const LAST_USERNAME_KEY = 'bholan_last_username';
const SESSION_KEY = 'bholan_session';

// DOM Elements
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('passwordToggle');
const loginButton = document.getElementById('loginButton');
const profileEditIcon = document.getElementById('profileEditIcon');
const loginProfilePic = document.getElementById('loginProfilePic');
const dashboardProfilePic = document.getElementById('dashboardProfilePic');
const greeting = document.getElementById('greeting');
const logoutBtn = document.getElementById('logoutBtn');
const navTabs = document.querySelectorAll('.nav-tab');
const welcomeDashboard = document.getElementById('welcomeDashboard');
const settingsDashboard = document.getElementById('settingsDashboard');
const currentTimeSpan = document.getElementById('currentTime');

// Login attempt elements
const blockedOverlay = document.getElementById('blockedOverlay');
const blockedCountdown = document.getElementById('blockedCountdown');
const attemptsWarning = document.getElementById('attemptsWarning');
const warningMessage = document.getElementById('warningMessage');
const warningCountdown = document.getElementById('warningCountdown');

// Modal elements
const profileModal = document.getElementById('profileModal');
const modalProfileUpload = document.getElementById('modalProfileUpload');
const modalProfilePreview = document.getElementById('modalProfilePreview');
const cancelProfileChange = document.getElementById('cancelProfileChange');
const confirmProfileChange = document.getElementById('confirmProfileChange');
const modalMessage = document.getElementById('modalMessage');

// Password requirement elements
const reqLengthEl = document.getElementById('req-length');
const reqLowerEl = document.getElementById('req-lowercase');
const reqUpperEl = document.getElementById('req-uppercase');
const reqNumberEl = document.getElementById('req-number');
const reqSymbolEl = document.getElementById('req-symbol');
const strengthMeter = document.getElementById('strengthMeter');
const strengthText = document.getElementById('strengthText');
const passwordErrorEl = document.getElementById('passwordError');
const usernameErrorEl = document.getElementById('usernameError');
const formFeedback = document.getElementById('formFeedback');

// Login success overlay
const loginSuccessOverlay = document.getElementById('loginSuccess');
const loginSuccessTitle = document.getElementById('loginSuccessTitle');
const loginSuccessMessage = document.getElementById('loginSuccessMessage');

// Theme switching
let themeInterval;
let isLightMode = false;

// Login attempt tracking
let loginAttempts = 0;
let blockedUntil = 0;
let countdownInterval = null;

// Create geometric background
function createGeometricBackground() {
    const background = document.getElementById('geometricBackground');
    const shapes = ['circle', 'triangle', 'square'];
    
    for (let i = 0; i < 25; i++) {
        const shape = document.createElement('div');
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        const size = Math.random() * 80 + 40;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 15;
        
        shape.className = `shape ${shapeType}`;
        shape.style.width = `${size}px`;
        shape.style.height = shapeType === 'triangle' ? '0' : `${size}px`;
        shape.style.left = `${posX}%`;
        shape.style.top = `${posY}%`;
        shape.style.animationDelay = `${delay}s`;
        shape.style.animationDuration = `${duration}s`;
        
        if (shapeType === 'circle' || shapeType === 'square') {
            shape.style.background = `linear-gradient(45deg, rgba(74, 0, 224, 0.3), rgba(142, 45, 226, 0.3))`;
        }
        
        background.appendChild(shape);
    }
}

// Start theme switching
function startThemeSwitching() {
    themeInterval = setInterval(() => {
        isLightMode = !isLightMode;
        document.body.classList.toggle('light-mode', isLightMode);
    }, 5000);
}

// Stop theme switching
function stopThemeSwitching() {
    clearInterval(themeInterval);
}

// Load login attempts from localStorage
function loadLoginAttempts() {
    const attempts = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
    const blocked = localStorage.getItem(LOGIN_BLOCKED_UNTIL_KEY);
    
    loginAttempts = attempts ? parseInt(attempts) : 0;
    blockedUntil = blocked ? parseInt(blocked) : 0;
    
    // Check if user is currently blocked
    checkIfBlocked();
}

// Save login attempts to localStorage
function saveLoginAttempts() {
    localStorage.setItem(LOGIN_ATTEMPTS_KEY, loginAttempts.toString());
    localStorage.setItem(LOGIN_BLOCKED_UNTIL_KEY, blockedUntil.toString());
}

// Check if user is blocked
function checkIfBlocked() {
    const now = Date.now();
    
    if (blockedUntil > now) {
        // User is blocked, show blocked overlay
        showBlockedOverlay();
        return true;
    } else if (blockedUntil > 0) {
        // Block time has expired, reset attempts
        loginAttempts = 0;
        blockedUntil = 0;
        saveLoginAttempts();
        hideBlockedOverlay();
    }
    
    // Show warning if there are failed attempts
    if (loginAttempts > 0) {
        showAttemptsWarning();
    } else {
        hideAttemptsWarning();
    }
    
    return false;
}

// Show blocked overlay with countdown (full-page)
function showBlockedOverlay() {
    // Hide attempts warning behind overlay
    hideAttemptsWarning();

    blockedOverlay.classList.add('show');
    blockedOverlay.setAttribute('aria-hidden', 'false');
    disablePageInteraction(true);
    loginButton.disabled = true;
    startBlockedCountdown();
}

// Hide blocked overlay
function hideBlockedOverlay() {
    blockedOverlay.classList.remove('show');
    blockedOverlay.setAttribute('aria-hidden', 'true');
    disablePageInteraction(false);
    loginButton.disabled = false;
    
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

// Start countdown for blocked time
function startBlockedCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    countdownInterval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, blockedUntil - now);
        
        if (remaining <= 0) {
            // Block time is over
            hideBlockedOverlay();
            loginAttempts = 0;
            blockedUntil = 0;
            saveLoginAttempts();
            return;
        }
        
        // Update countdown display
        const seconds = Math.ceil(remaining / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        
        blockedCountdown.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
    
    // Initial update
    const remaining = Math.max(0, blockedUntil - Date.now());
    const seconds = Math.ceil(remaining / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    blockedCountdown.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Show attempts warning
function showAttemptsWarning() {
    const remainingAttempts = 5 - loginAttempts;
    
    if (remainingAttempts > 0) {
        warningMessage.textContent = `You have ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining before login is blocked.`;
        attemptsWarning.classList.add('show');
    }
}

// Hide attempts warning
function hideAttemptsWarning() {
    attemptsWarning.classList.remove('show');
}

// Handle failed login attempt
function handleFailedLogin() {
    loginAttempts++;
    
    if (loginAttempts >= 5) {
        // Block login for 30 seconds
        blockedUntil = Date.now() + 30000; // 30 seconds
        saveLoginAttempts();
        showBlockedOverlay();
    } else {
        saveLoginAttempts();
        showAttemptsWarning();
    }
}

// Handle successful login
function handleSuccessfulLogin() {
    // Reset login attempts
    loginAttempts = 0;
    blockedUntil = 0;
    saveLoginAttempts();
    hideAttemptsWarning();
}

// Show/hide inline form feedback
function showFormFeedback(message, type = 'error') {
    formFeedback.textContent = message;
    formFeedback.classList.remove('error', 'success');
    formFeedback.classList.add(type === 'success' ? 'success' : 'error');
    formFeedback.style.display = 'block';
}

function hideFormFeedback() {
    formFeedback.textContent = '';
    formFeedback.style.display = 'none';
    formFeedback.classList.remove('error', 'success');
}

// Show/hide modal messages
function showModalMessage(message, type = 'error') {
    modalMessage.textContent = message;
    modalMessage.classList.remove('error', 'success');
    modalMessage.classList.add(type === 'success' ? 'success' : 'error');
    modalMessage.style.display = 'block';
}

function hideModalMessage() {
    modalMessage.textContent = '';
    modalMessage.style.display = 'none';
    modalMessage.classList.remove('error', 'success');
}

// Globally disable/enable page interaction when overlays are visible
function disablePageInteraction(disable = true) {
    if (disable) {
        document.body.style.pointerEvents = 'none';
        // allow overlays to be interactive by enabling pointer-events on them
        const overlays = document.querySelectorAll('.blocked-overlay, .login-success-overlay, .modal');
        overlays.forEach(o => o.style.pointerEvents = 'auto');
    } else {
        document.body.style.pointerEvents = '';
        const overlays = document.querySelectorAll('.blocked-overlay, .login-success-overlay, .modal');
        overlays.forEach(o => o.style.pointerEvents = '');
    }
}

// Password toggle
passwordToggle.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.innerHTML = type === 'password' ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
});

// Password validation helpers
// Expanded symbol set: include most common punctuation and special characters
const symbolRegex = /[!@#$%^&*~`\-_=+\[\]{};:'",.<>\/?\\|]/;

function isPasswordValid(password) {
    const lengthOk = password.length >= 8;
    const lowerOk = /[a-z]/.test(password);
    const upperOk = /[A-Z]/.test(password);
    const numberOk = /\d/.test(password);
    const symbolOk = symbolRegex.test(password);
    return { lengthOk, lowerOk, upperOk, numberOk, symbolOk };
}

// Strength calculation:
// base on number of requirements met + bonuses for length and variety
function computeStrengthScore(password) {
    const checks = isPasswordValid(password);
    let score = 0;
    // each requirement contributes 1
    score += checks.lengthOk ? 1 : 0;
    score += checks.lowerOk ? 1 : 0;
    score += checks.upperOk ? 1 : 0;
    score += checks.numberOk ? 1 : 0;
    score += checks.symbolOk ? 1 : 0;

    // length bonus: +1 if >= 12, +2 if >= 16
    if (password.length >= 16) score += 2;
    else if (password.length >= 12) score += 1;

    // variety bonus: check for at least 3 different character classes
    const classes = [/[a-z]/, /[A-Z]/, /\d/, symbolRegex].reduce((acc, rx) => acc + (rx.test(password) ? 1 : 0), 0);
    if (classes >= 3) score += 1;

    // maximum theoretical score ~ 9, normalize to 0-100
    const maxScore = 9;
    const percent = Math.round((score / maxScore) * 100);
    return { score, percent, checks };
}

function updatePasswordRequirementsDisplay(password) {
    const { checks, percent } = computeStrengthScore(password);
    // length
    if (checks.lengthOk) {
        reqLengthEl.classList.add('valid');
        reqLengthEl.querySelector('i').className = 'fas fa-check-circle';
    } else {
        reqLengthEl.classList.remove('valid');
        reqLengthEl.querySelector('i').className = 'fas fa-circle';
    }
    // lowercase
    if (checks.lowerOk) {
        reqLowerEl.classList.add('valid');
        reqLowerEl.querySelector('i').className = 'fas fa-check-circle';
    } else {
        reqLowerEl.classList.remove('valid');
        reqLowerEl.querySelector('i').className = 'fas fa-circle';
    }
    // uppercase
    if (checks.upperOk) {
        reqUpperEl.classList.add('valid');
        reqUpperEl.querySelector('i').className = 'fas fa-check-circle';
    } else {
        reqUpperEl.classList.remove('valid');
        reqUpperEl.querySelector('i').className = 'fas fa-circle';
    }
    // number
    if (checks.numberOk) {
        reqNumberEl.classList.add('valid');
        reqNumberEl.querySelector('i').className = 'fas fa-check-circle';
    } else {
        reqNumberEl.classList.remove('valid');
        reqNumberEl.querySelector('i').className = 'fas fa-circle';
    }
    // symbol
    if (checks.symbolOk) {
        reqSymbolEl.classList.add('valid');
        reqSymbolEl.querySelector('i').className = 'fas fa-check-circle';
    } else {
        reqSymbolEl.classList.remove('valid');
        reqSymbolEl.querySelector('i').className = 'fas fa-circle';
    }

    // Strength meter
    strengthMeter.style.width = `${percent}%`;
    let label = 'Very Weak';
    let color = '#e74c3c';
    if (percent < 25) { label = 'Very Weak'; color = '#e74c3c'; }
    else if (percent < 45) { label = 'Weak'; color = '#e67e22'; }
    else if (percent < 65) { label = 'Fair'; color = '#f1c40f'; }
    else if (percent < 85) { label = 'Strong'; color = '#2ecc71'; }
    else { label = 'Very Strong'; color = '#27ae60'; }
    strengthText.textContent = label;
    strengthMeter.style.backgroundColor = color;

    // Toggle password error visibility: keep hidden until submission unless none satisfied
    passwordErrorEl.style.display = 'none';
}

// Profile picture modal
profileEditIcon.addEventListener('click', () => {
    profileModal.style.display = 'flex';
    hideModalMessage();
    // prevent background pointer events while modal open
    disablePageInteraction(true);
});

// Close profile modal: re-enable interactions
cancelProfileChange.addEventListener('click', () => {
    profileModal.style.display = 'none';
    hideModalMessage();
    disablePageInteraction(false);
});

// Profile picture upload validations use inline modal message
modalProfileUpload.addEventListener('change', function(e) {
    hideModalMessage();
    if (this.files && this.files[0]) {
        const file = this.files[0];
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            showModalMessage('Please select a valid image file (JPG, PNG, GIF, WebP).', 'error');
            this.value = '';
            return;
        }
        
        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            showModalMessage('Image size must be less than 2MB.', 'error');
            this.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            modalProfilePreview.style.backgroundImage = `url(${e.target.result})`;
            modalProfilePreview.style.backgroundSize = 'cover';
            modalProfilePreview.style.backgroundPosition = 'center';
            modalProfilePreview.textContent = '';
            showModalMessage('Preview ready. Click "Upload Picture" to save.', 'success');
        };
        reader.readAsDataURL(file);
    }
});

confirmProfileChange.addEventListener('click', () => {
    hideModalMessage();
    const file = modalProfileUpload.files[0];
    if (!file) {
        showModalMessage('Please select an image file first.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Save to localStorage
        localStorage.setItem(PROFILE_PIC_KEY, e.target.result);
        
        // Update login profile picture
        loginProfilePic.style.backgroundImage = `url(${e.target.result})`;
        loginProfilePic.style.backgroundSize = 'cover';
        loginProfilePic.style.backgroundPosition = 'center';
        loginProfilePic.textContent = '';
        
        // Update dashboard profile picture if logged in
        if (dashboardPage.style.display === 'block') {
            dashboardProfilePic.style.backgroundImage = `url(${e.target.result})`;
            dashboardProfilePic.style.backgroundSize = 'cover';
            dashboardProfilePic.style.backgroundPosition = 'center';
            dashboardProfilePic.textContent = '';
        }
        
        // Add animation
        loginProfilePic.classList.add('animated');
        setTimeout(() => {
            loginProfilePic.classList.remove('animated');
        }, 2000);
        
        // Show success message and close modal shortly after
        showModalMessage('Profile picture uploaded successfully!', 'success');
        setTimeout(() => {
            profileModal.style.display = 'none';
            hideModalMessage();
            modalProfileUpload.value = '';
            disablePageInteraction(false);
        }, 1000);
    };
    reader.readAsDataURL(file);
});

// Load saved profile picture
function loadProfilePicture() {
    const savedProfilePic = localStorage.getItem(PROFILE_PIC_KEY);
    if (savedProfilePic) {
        loginProfilePic.style.backgroundImage = `url(${savedProfilePic})`;
        loginProfilePic.style.backgroundSize = 'cover';
        loginProfilePic.style.backgroundPosition = 'center';
        loginProfilePic.textContent = '';
        
        modalProfilePreview.style.backgroundImage = `url(${savedProfilePic})`;
        modalProfilePreview.style.backgroundSize = 'cover';
        modalProfilePreview.style.backgroundPosition = 'center';
        modalProfilePreview.textContent = '';
    }
}

// Load saved username if remember me is checked
function loadSavedUsername() {
    const savedUsername = localStorage.getItem(LAST_USERNAME_KEY);
    if (savedUsername) {
        usernameInput.value = savedUsername;
        document.getElementById('rememberMe').checked = true;
    }
}

// Update current time
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    if (currentTimeSpan) {
        currentTimeSpan.textContent = timeString;
    }
}

// Show dashboard
function showDashboard(username) {
    // Stop theme switching
    stopThemeSwitching();
    
    // Fade out login page
    loginPage.style.opacity = '0';
    
    setTimeout(() => {
        loginPage.style.display = 'none';
        dashboardPage.style.display = 'block';
        
        // Update greeting
        greeting.textContent = `Welcome, ${username}!`;
        
        // Update dashboard profile picture
        const savedProfilePic = localStorage.getItem(PROFILE_PIC_KEY);
        if (savedProfilePic) {
            dashboardProfilePic.style.backgroundImage = `url(${savedProfilePic})`;
            dashboardProfilePic.style.backgroundSize = 'cover';
            dashboardProfilePic.style.backgroundPosition = 'center';
            dashboardProfilePic.textContent = '';
        }
        
        // Update current time
        updateCurrentTime();
        setInterval(updateCurrentTime, 60000);
        
        // Create session
        localStorage.setItem(SESSION_KEY, 'active');

        // ensure interactions restored
        disablePageInteraction(false);
    }, 500);
}

// Logout function
function logout() {
    // Clear session
    localStorage.removeItem(SESSION_KEY);
    
    // Fade out dashboard
    dashboardPage.style.opacity = '0';
    
    setTimeout(() => {
        dashboardPage.style.display = 'none';
        loginPage.style.display = 'flex';
        
        // Fade in login page
        setTimeout(() => {
            loginPage.style.opacity = '1';
        }, 50);
        
        // Reset login form
        passwordInput.value = '';
        hideFormFeedback();
        
        // Start theme switching again
        startThemeSwitching();
    }, 500);
}

// Check if user is already logged in
function checkExistingSession() {
    const session = localStorage.getItem(SESSION_KEY);
    if (session === 'active') {
        // User is already logged in, show dashboard
        const savedUsername = localStorage.getItem(LAST_USERNAME_KEY) || 'Admin';
        showDashboard(savedUsername);
        return true;
    }
    return false;
}

// Live password feedback
passwordInput.addEventListener('input', (e) => {
    updatePasswordRequirementsDisplay(e.target.value);
    hideFormFeedback();
});

// Live username input clears errors
usernameInput.addEventListener('input', () => {
    usernameErrorEl.style.display = 'none';
    hideFormFeedback();
});

// Login form submission
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    hideFormFeedback();
    hideModalMessage();
    // Remove previous username error
    usernameErrorEl.style.display = 'none';
    passwordErrorEl.style.display = 'none';
    
    // Check if user is blocked
    if (checkIfBlocked()) {
        showFormFeedback('You are temporarily blocked. Please wait for the countdown to finish.', 'error');
        return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Simple validation - inline
    if (username.length < 3) {
        usernameErrorEl.style.display = 'block';
        showFormFeedback('Please enter a valid username or email.', 'error');
        return;
    }
    
    // Check full password requirements
    const passChecks = isPasswordValid(password);
    const allPass = passChecks.lengthOk && passChecks.lowerOk && passChecks.upperOk && passChecks.numberOk && passChecks.symbolOk;
    if (!allPass) {
        // Inform user and highlight requirements
        passwordErrorEl.style.display = 'block';
        updatePasswordRequirementsDisplay(password);
        showFormFeedback('Password does not meet all required criteria. Please follow the requirements shown below.', 'error');
        return;
    }
    
    // Show loading state
    loginButton.disabled = true;
    loginButton.classList.add('loading');
    
    // Fake API call simulation
    setTimeout(() => {
        // Reset button state
        loginButton.disabled = false;
        loginButton.classList.remove('loading');
        
        let isValid = false;
        let validUsername = '';
        
        // Check for admin credentials
        if ((username === 'admin' || username === 'admin@bholanportal.com') && password === 'Bholan7449@123') {
            isValid = true;
            validUsername = 'Admin';
        }
                
        if (isValid) {
            // Handle successful login
            handleSuccessfulLogin();
            
            // Save remember me
            if (rememberMe) {
                localStorage.setItem(LAST_USERNAME_KEY, username);
            } else {
                localStorage.removeItem(LAST_USERNAME_KEY);
            }
            
            // Show full-page success overlay and then redirect to dashboard after 5 seconds
            loginSuccessOverlay.classList.add('show');
            loginSuccessOverlay.setAttribute('aria-hidden', 'false');
            loginSuccessTitle.textContent = `Welcome, ${validUsername}!`;
            loginSuccessMessage.textContent = 'Login successful — redirecting to your dashboard...';

            // Block interactions while success overlay visible
            disablePageInteraction(true);

            setTimeout(() => {
                loginSuccessOverlay.classList.remove('show');
                loginSuccessOverlay.setAttribute('aria-hidden', 'true');
                // Redirect to dashboard
                showDashboard(validUsername);
                hideFormFeedback();
            }, 5000); // 5 seconds on success screen
            
        } else {
            // Handle failed login
            handleFailedLogin();
            // Show generic inline error (no credentials leak)
            showFormFeedback('Invalid username or password. Please try again.', 'error');
        }
    }, 900);
});

// Logout button
logoutBtn.addEventListener('click', logout);

// Dashboard navigation
navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Update active tab
        navTabs.forEach(t => {
            if (t.getAttribute('data-tab') === tabId) {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });
        
        // Show corresponding content
        if (tabId === 'welcome') {
            welcomeDashboard.classList.add('active');
            settingsDashboard.classList.remove('active');
        } else if (tabId === 'settings') {
            welcomeDashboard.classList.remove('active');
            settingsDashboard.classList.add('active');
        }
    });
});

// Initialize
function init() {
    createGeometricBackground();
    loadLoginAttempts();
    loadProfilePicture();
    loadSavedUsername();
    
    // Check if user is already logged in
    if (!checkExistingSession()) {
        startThemeSwitching();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);