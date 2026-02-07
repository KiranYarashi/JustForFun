// ===== App State =====
let completedProblems = new Set();
let maangCompletedProblems = new Set(); // Separate state for MAANG
let patternsCompletedProblems = new Set(); // Separate state for Patterns
let expandedCategories = new Set();
let maangExpandedCategories = new Set(); // Separate for MAANG
let patternsExpandedCategories = new Set(); // Separate for Patterns
let patternsExpandedSubCategories = new Set(); // Separate for Sub-categories
let customProblems = {}; // Store custom problems per category
let problemNotes = {}; // Store notes per problemId
let problemHistory = {}; // Store completion timestamps
let customSections = []; // Store custom sections/categories
let currentTab = 'roadmap'; // Current active tab
let categoryOrder = []; // Store order of category IDs
let isReorderMode = false; // Toggle for reordering UI
let spacedRepetition = {}; // SRS Data: { problemId: { stage: 1, nextReview: ISOString, lastSolved: ISOString } }
let customPatternsData = { weeks: [], customDays: {} }; // Store custom patterns data
let sharedPatternsContent = []; // Store globally shared content from API

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    try {
        initTheme();

        
        // Initialize Auth
        authService.initialize().then(isInitialized => {
            if (isInitialized) {
                updateAuthUI();
                
                // If already logged in, sync with cloud
                if (authService.isAuthenticated()) {
                    const userId = authService.getUserId();
                    dataSync.syncWithCloud(userId).then(() => {
                        // Reload state after sync
                        loadState();
                        loadMaangState();
                        loadPatternsState(); // Load Patterns
                        loadCustomProblems();
                        loadCustomSections();
                        loadNotes();
                        loadHistory();
                        loadCategoryOrder(); // Load order
                        renderCategories();
                        renderMaangCategories();
                        renderPatternsTab(); // Render Patterns
                        updateAllTrackers();
                        updateTabCounts();
                    });
                }
            }
        });

        loadState();
        loadMaangState();
        loadMaangState();
        loadPatternsState(); // Load Patterns Init
        loadPatternsTopicOrder(); // Load Patterns order
        loadCustomPatternsData(); // Return custom data
        loadCustomProblems();
        loadCustomSections();
        loadNotes();
        loadHistory();
        loadHistory();
        loadSRS(); // Load SRS
        loadCategoryOrder(); // Load order
        loadSharedPatternsContent(); // Load globally shared patterns from API
        renderCategories();
        renderMaangCategories();
        renderPatternsTab(); // Render Patterns Init
        updateAllTrackers();
        updateTabCounts();
        checkCookieConsent();
        // First-time questionnaire removed - website opens directly
        
        // Register sync status callback
        dataSync.setSyncStatusCallback((status, message) => {
            const statusEl = document.getElementById('sync-status');
            if (statusEl) {
                statusEl.textContent = message;
                if (status === 'error') statusEl.style.color = '#ef4444';
                else if (status === 'syncing') statusEl.style.color = '#f59e0b';
                else statusEl.style.color = 'rgba(255, 255, 255, 0.7)';
            }
        });
        
        // Attach logout listener explicitly
        document.addEventListener('click', (e) => {
            if (e.target.closest('.logout-btn')) {
                e.preventDefault();
                handleLogout();
            }
        });
    } catch (error) {
        console.error("Initialization Error:", error);
    } finally {
        // Show Splash Screen on load (if not in debug/fast mode)
        // Ensures it runs even if init fails
        showSplashScreen();
    }
});

// ===== Splash Screen Logic with Shame Streak =====
function showSplashScreen() {
    const splash = document.getElementById('splash-screen');
    const quoteEl = document.getElementById('splash-quote');
    
    // Calculate days since last visit
    const lastVisit = localStorage.getItem('leetcode-tracker-last-visit');
    const today = new Date().toDateString();
    let daysMissed = 0;
    
    if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const now = new Date();
        const diffTime = now - lastDate;
        daysMissed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }
    
    // Update last visit to today
    localStorage.setItem('leetcode-tracker-last-visit', today);
    
    // Shame Streak roasts based on days missed
    const shameRoasts = {
        // Came back same day or next day - normal quotes
        consistent: [
            "Compiling... just kidding, it's JavaScript.",
            "It works on my machine.",
            "Debugging: Being the detective in a crime where you are the murderer.",
            "6 hours of debugging can save you 5 minutes of reading documentation.",
            "To understand recursion, you must first understand recursion.",
            "Ctrl+C, Ctrl+V... Stack Overflow is my backend.",
            "Git commit -m 'fixed stuff'",
            "One more semi-colon...",
            "Why do Java developers wear glasses? Because they don't C#.",
            "Code is like humor. When you have to explain it, it's bad.",
            "I don't always test my code, but when I do, I do it in production.",
            "Per my last email... (Corporate speak for 'Can you read?')",
            "It's not a bug, it's an undocumented feature.",
            "Git push --force... because sometimes violence is the answer.",
            "Converting caffeine into anxiety and code.",
            "CSS is awesome! *Table flip*",
            "My code is garbage, but it runs. DO NOT TOUCH IT.",
            "How do I exit Vim? Send help.",
            "Simulating productivity until 5 PM...",
            "Real programmers count from 0.",
            "Sudo make me a sandwich."
        ],
        // Missed 2-3 days
        slacking: [
            "Welcome back, tourist. 🏝️",
            "Oh, you remembered this exists? Cool.",
            "Consistency is key, but so is sleep, I guess.",
            "Your streak died. Just like your motivation.",
            "Back from vacation? The grind doesn't pause.",
            "Plot twist: LeetCode problems didn't solve themselves.",
            "The prodigal coder returns... empty-handed.",
            "Did you think the algorithms would wait for you?",
            "Your future interviewer isn't taking days off.",
            "Break's over. Time to pretend you're productive."
        ],
        // Missed 4-7 days
        disappointing: [
            "A WEEK? Really? The audacity.",
            "Your GitHub contribution graph is crying.",
            "Welcome back, stranger. We barely recognized you.",
            "That's not a break, that's abandonment.",
            "Did you forget your password or your ambition?",
            "Your competitors just solved 50 problems. You solved zero.",
            "The only thing consistent about you is inconsistency.",
            "Back from 'I'll do it tomorrow' land?",
            "Your array of excuses is out of bounds.",
            "Even your IDE missed you. Just kidding, it crashed anyway."
        ],
        // Missed 8+ days
        shameful: [
            "🚨 MISSING PERSON ALERT: Found wandering back after " + daysMissed + " days.",
            "At this point, just put 'gave up' on your resume.",
            "Your streak didn't just break, it filed for bankruptcy.",
            "Welcome back! Your skills have deprecated during your absence.",
            "Two weeks? Did you switch careers and switch back?",
            "The only thing you've been consistent at is disappointing yourself.",
            "Your GitHub is greener on the 'Take a Break' side.",
            "Did you get lost on the way to Stack Overflow?",
            "Your DSA skills have expired. Please renew.",
            "Plot twist: You're the unsolved problem now."
        ]
    };
    
    // Select appropriate roast category
    let selectedQuotes;
    if (daysMissed <= 1) {
        selectedQuotes = shameRoasts.consistent;
    } else if (daysMissed <= 3) {
        selectedQuotes = shameRoasts.slacking;
    } else if (daysMissed <= 7) {
        selectedQuotes = shameRoasts.disappointing;
    } else {
        selectedQuotes = shameRoasts.shameful;
    }
    
    if (quoteEl) {
        quoteEl.textContent = selectedQuotes[Math.floor(Math.random() * selectedQuotes.length)];
    }
    
    // Hide after total time (approx 3-4s)
    setTimeout(() => {
        splash.classList.add('hidden');
        
        // Reveal initially hidden content
        document.querySelectorAll('.initial-hide').forEach(el => {
            el.classList.remove('initial-hide');
        });

        setTimeout(() => {
            if (splash.parentNode) splash.parentNode.removeChild(splash);
        }, 600); // Wait for transition
    }, 3500);
}

// ===== Auth Functions =====
// ===== Auth Functions =====
// ===== Auth Functions =====
async function handleLogin() {
    // Show sarcastic roast modal first
    if (typeof showRoastModal === 'function') {
        showRoastModal();
    } else {
        performLogin(); // Fallback
    }
}

// Actual login called after user accepts the roast
// Actual login called after user accepts the roast
async function performLogin() {
    closeRoastModal();
    showAuthModal();
}

// ===== Custom Auth UI Handlers =====
let authMode = 'login'; // 'login' or 'register'

function showAuthModal() {
    authMode = 'login';
    updateAuthModalUI();
    document.getElementById('auth-modal').classList.remove('hidden');
    document.getElementById('auth-username').focus();
    document.getElementById('auth-error-msg').classList.add('hidden');
    document.getElementById('auth-form').reset();
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

function toggleAuthMode(mode) {
    authMode = mode;
    // Clear error when switching between login/register
    showAuthError('');
    updateAuthModalUI();
}

function updateAuthModalUI() {
    const title = document.getElementById('auth-modal-title');
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleLogin = document.getElementById('auth-toggle-login');
    const toggleRegister = document.getElementById('auth-toggle-register');
    // NOTE: Do NOT hide errorMsg here - it breaks error display after failed auth attempts

    if (authMode === 'login') {
        title.textContent = 'Sign In';
        submitBtn.textContent = 'Sign In';
        toggleLogin.classList.remove('hidden');
        toggleRegister.classList.add('hidden');
    } else {
        title.textContent = 'Create Account';
        submitBtn.textContent = 'Create Account';
        toggleLogin.classList.add('hidden');
        toggleRegister.classList.remove('hidden');
    }
}

async function handleAuthSubmit(event) {
    event.preventDefault();
    
    const username = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value.trim();
    const errorMsg = document.getElementById('auth-error-msg');
    const submitBtn = document.getElementById('auth-submit-btn');
    
    if (!username || !password) {
        showAuthError('Please fill in all fields');
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        showAuthError(''); // Clear error

        if (authMode === 'login') {
            await authService.login(username, password);
        } else {
            await authService.register(username, password);
        }

        // Success
        closeAuthModal();
        updateAuthUI();
        
        // Sync after login
        const userId = authService.getUserId();
        if (userId) {
            const statusEl = document.getElementById('sync-status');
            if (statusEl) statusEl.textContent = 'Syncing...';
            
            await dataSync.syncWithCloud(userId);
            
            // Re-load all states and re-render UI instead of reloading page
            loadState();
            loadMaangState();
            loadCustomProblems();
            loadCustomSections();
            loadNotes();
            loadHistory();
            loadCategoryOrder();
            renderCategories();
            renderMaangCategories();
            updateAllTrackers();
            updateTabCounts();
        }

    } catch (error) {
        console.error('Auth error:', error);
        showAuthError(error.message || 'Authentication failed');
        submitBtn.disabled = false;
        updateAuthModalUI(); // Reset button text
    }
}

// Sarcastic error messages for auth failures
const loginRoasts = [
    "Wrong credentials? Shocker. Try remembering your password like you remember Stack Overflow syntax.",
    "Authentication failed. Maybe try 'password123' like everyone else?",
    "Invalid credentials. Your typing skills are as good as your debugging skills.",
    "Denied. Even SQL injection wouldn't help you here.",
    "Wrong password. Have you tried turning your brain off and on again?",
    "Access denied. The database doesn't lie, but clearly you do.",
    "Login failed. Ctrl+Z won't fix your memory problems.",
    "Nope. That's not it. Maybe check your sticky note under the keyboard?",
    "Authentication error. Git blame: you.",
    "Wrong credentials. This isn't a recoverable exception.",
    "Invalid login. Your password is in another castle.",
    "Error 401: User is sus.",
    "Per my last login attempt... did you even read the password hint?",
    "Let's circle back on this after you remember your credentials.",
    "This is a high-priority blocker: your memory.",
    "Synergy between your fingers and brain: not found.",
    "Please do the needful and type correctly.",
    "404: Brain cells not found during password entry.",
    "Your login attempt has been added to the sprint backlog... of failures.",
    "Exception thrown: UserIsNotThatSmartException",
    "Looks like someone's been copy-pasting from the wrong password manager.",
    "sudo make me login? Denied. You're not root here.",
    // 10 MORE NEW ROASTS
    "Your password and your code have something in common: both don't work.",
    "This login failed harder than your last production deploy.",
    "Have you considered a career that doesn't require passwords?",
    "Your credentials are as valid as your LinkedIn endorsements.",
    "Login denied. Your manager has been CC'd on this failure.",
    "Error: Password rejected by all 12 microservices.",
    "This attempt has been forwarded to the appropriate trash folder.",
    "Authentication failed. Please update your resume.",
    "Your login was rejected during code review.",
    "Congratulations! You've unlocked the 'Still Can't Login' achievement."
];

const registerRoasts = [
    "Username taken. Someone beat you to mediocrity.",
    "Registration failed. Even NPM has standards.",
    "That username's gone. Like your motivation to solve LeetCode problems.",
    "Account creation denied. The universe has rejected your application.",
    "Invalid format. Did HR write your password requirements?",
    "Username exists. Great minds think alike... and so do average ones.",
    "Registration error. Have you tried 'xX_L33tC0d3r_Xx'?",
    "Sign-up failed. Your creativity is as null as your pointer.",
    "Error: Username already exists in the multiverse of mid developers.",
    "Denied. Your resume lied about your ability to follow instructions.",
    "Account creation failed. Even MongoDB wouldn't store your data.",
    "Invalid input. This is why we can't have nice things.",
    "Registration rejected. HR will reach out if there's a fit.",
    "Your application has been moved to the 'maybe never' folder.",
    "Please resubmit after acquiring basic reading comprehension.",
    "Error: Username complexity exceeds system capabilities (just kidding, it's too dumb).",
    "Account creation is on hold pending approval from someone who cares.",
    "The system has decided you're not enterprise-ready.",
    "Your sign-up was flagged by our advanced 'no thanks' algorithm.",
    "Registration error: Please leverage a different username going forward.",
    "This username has been optimized out of existence.",
    "Your account request is currently in stakeholder review... forever.",
    // 10 MORE NEW ROASTS
    "Your account was denied during the sprint planning.",
    "Registration blocked by our 'No Juniors' firewall.",
    "Error 403: Username requires more years of experience.",
    "Your sign-up has been escalated to nobody.",
    "Account creation failed: Insufficient coffee in your system.",
    "The DevOps team has declined your infrastructure request.",
    "Your username failed the automated personality test.",
    "Registration error: Please align with best practices and try again.",
    "Account denied. Your GitHub has too many forked repos.",
    "Sign-up rejected. The algorithm knows what you did last summer."
];

function showAuthError(msg) {
    const el = document.getElementById('auth-error-msg');
    if (msg) {
        // Pick roasts based on current auth mode
        const roastList = authMode === 'register' ? registerRoasts : loginRoasts;
        const roast = roastList[Math.floor(Math.random() * roastList.length)];
        el.innerHTML = `
            <div style="color: #ff4444; font-weight: 600; font-size: 0.95em; margin-bottom: 6px;">❌ ${msg}</div>
            <div style="color: rgba(255, 255, 255, 0.7); font-size: 0.85em; font-style: italic;">💬 ${roast}</div>
        `;
        el.style.background = 'transparent';
        el.style.border = 'none';
        el.style.borderRadius = '0';
        el.style.padding = '8px 0';
        el.style.marginTop = '8px';
        el.classList.remove('hidden');
    } else {
        el.classList.add('hidden');
    }
}

// ===== Roast Logic =====
const roasts = [
    "Looks like someone finally decided to commit code instead of suicide.",
    "Bravest thing you've done since pushing to main on a Friday.",
    "Authentication required because we can't trust you with local storage.",
    "Warning: This action will expose your lack of progress to the cloud.",
    "Initializing 'Pretend I'm Working' protocol...",
    "Connecting to database... hope your schema is better than your social life."
];

function showRoastModal() {
    const modal = document.getElementById('roast-login-modal');
    const messageEl = document.getElementById('roast-message');
    const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
    
    messageEl.textContent = randomRoast;
    modal.classList.remove('hidden');
    
    // Attach event listener to confirm button
    const confirmBtn = document.getElementById('confirm-login-btn');
    confirmBtn.onclick = performLogin;
}

function closeRoastModal() {
    document.getElementById('roast-login-modal').classList.add('hidden');
}

const logoutRoasts = [
    "Leaving already? Did your coffee run out or did you finally solve a Two Sum?",
    "Logging out won't delete your technical debt. It'll still be here tomorrow.",
    "Are you sure? The junior dev might try to refactor your code while you're away.",
    "Quitting? Is it because the LeetCode Hard was actually hard?",
    "Confirming logout... Hope your 'meeting' isn't just you crying in the bathroom.",
    "Leaving the grind? Don't worry, the cloud will remember your shame.",
    "Wait! If you log out now, who will feed the O(n^2) monsters in your repo?",
    "Corporate expects you to be a 10x developer. Logging out is a 0.1x move.",
    "Are you sure? Your standup is in 10 minutes and you have zero commits.",
    "Logging out? Be honest, you're just going to ChatGPT the solution anyway.",
    "The system has detected a sudden drop in productivity... Oh, you're just logging out.",
    "Fine, leave. But your recursion is still infinite.",
    "Logging out is effectively a 'force quit' on your career goals today.",
    "Are you really leaving? Your unresolved merge conflicts are getting lonely.",
    "Abandoning the sprint? I'll let the stakeholders know you're 'pivoting' to sleep."
];

function handleLogout() {
    const randomRoast = logoutRoasts[Math.floor(Math.random() * logoutRoasts.length)];
    const modal = document.getElementById('roast-logout-modal');
    const messageEl = document.getElementById('logout-roast-message');
    
    if (modal && messageEl) {
        messageEl.textContent = randomRoast;
        modal.classList.remove('hidden');
        
        // Attach event listener to confirm button
        const confirmBtn = document.getElementById('confirm-logout-btn');
        confirmBtn.onclick = performLogout;
    } else {
        // Fallback to confirm if modal missing for some reason
        if (confirm(`${randomRoast}\n\n(Logout will stop cloud sync but keep local progress)`)) {
            performLogout();
        }
    }
}

function closeLogoutRoastModal() {
    const modal = document.getElementById('roast-logout-modal');
    if (modal) modal.classList.add('hidden');
}

// Actual logout called after user accepts the roast
async function performLogout() {
    closeLogoutRoastModal();
    try {
        console.log('Logging out...');
        await authService.logout();
        updateAuthUI();
        
        // Clear sync status
        const statusEl = document.getElementById('sync-status');
        if (statusEl) statusEl.textContent = '';
        
        // Reload to reset all states and show local-only view
        console.log('Logout successful, reloading...');
        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to logout cleanly. Please refresh the page.');
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    const userProfile = document.getElementById('user-profile');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');
    
    if (authService.isAuthenticated()) {
        loginBtn.classList.add('hidden');
        userProfile.classList.remove('hidden');
        
        userName.textContent = authService.getDisplayName();
        userAvatar.textContent = authService.getInitials();

        // Show Admin Badge
        const adminBadge = document.getElementById('admin-badge');
        if (adminBadge) {
            if (authService.isAdmin()) {
                adminBadge.classList.remove('hidden');
            } else {
                adminBadge.classList.add('hidden');
            }
        }
    } else {
        loginBtn.classList.remove('hidden');
        userProfile.classList.add('hidden');
    }
}

// ===== State Management =====
function loadState() {
    try {
        const saved = localStorage.getItem('leetcode-tracker-completed');
        if (saved) {
            completedProblems = new Set(JSON.parse(saved));
        }
    } catch (e) {
        console.error('Failed to load state:', e);
    }
}

function saveState() {
    try {
        // Save locally
        localStorage.setItem('leetcode-tracker-completed', JSON.stringify([...completedProblems]));
        
        // Save to cloud if authenticated
        if (authService.isAuthenticated()) {
            const data = dataSync.collectLocalProgress();
            // TODO: Ensure collectLocalProgress() picks up patternsCompletedProblems
            // Since we can't edit API easily, we will inject it into the data object if needed differently, 
            // but assuming collectLocalProgress just dumps localStorage, we need to ensure we save TO localStorage first.
            // savePatternsState() does that.
            
            dataSync.debouncedSave(authService.getUserId(), data);
        }
    } catch (e) {
        console.error('Failed to save state:', e);
    }
}

// ===== Custom Problems Management =====
function loadCustomProblems() {
    try {
        const saved = localStorage.getItem('leetcode-tracker-custom-problems');
        if (saved) {
            customProblems = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load custom problems:', e);
    }
}

function saveCustomProblems() {
    try {
        localStorage.setItem('leetcode-tracker-custom-problems', JSON.stringify(customProblems));
        
        // Save to cloud
        if (authService.isAuthenticated()) {
            const data = dataSync.collectLocalProgress();
            dataSync.debouncedSave(authService.getUserId(), data);
        }
    } catch (e) {
        console.error('Failed to save custom problems:', e);
    }
}

// ===== SRS Management =====
function loadSRS() {
    try {
        const saved = localStorage.getItem('leetcode-tracker-srs');
        if (saved) {
            spacedRepetition = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load SRS:', e);
    }
}

function saveSRS() {
    try {
        localStorage.setItem('leetcode-tracker-srs', JSON.stringify(spacedRepetition));
        if (authService.isAuthenticated()) {
            const data = dataSync.collectLocalProgress();
            dataSync.debouncedSave(authService.getUserId(), data);
        }
    } catch (e) {
        console.error('Failed to save SRS:', e);
    }
}

function scheduleReview(problemId) {
    const now = new Date();
    // Default to stage 1 (1 day interval) if new
    if (!spacedRepetition[problemId]) {
        const nextReview = new Date(now);
        nextReview.setDate(now.getDate() + 1);
        
        spacedRepetition[problemId] = {
            stage: 1,
            lastSolved: now.toISOString(),
            nextReview: nextReview.toISOString()
        };
    } else {
        // If already exists, just update lastSolved, keep schedule unless explicit reset
        // Usually we don't reset stage on re-solve unless user asks, but let's update lastSolved
        spacedRepetition[problemId].lastSolved = now.toISOString();
    }
    saveSRS();
    updateTabCounts();
}

function handleReview(problemId, quality = 'good') {
    if (!spacedRepetition[problemId]) return;

    const item = spacedRepetition[problemId];
    const now = new Date();
    
    // Fibonacci-ish intervals: 1, 3, 7, 14, 30, 60
    const intervals = [1, 3, 7, 14, 30, 60];
    let nextStage = item.stage + 1;
    if (nextStage > intervals.length) nextStage = intervals.length; // Max out
    
    const daysToAdd = intervals[nextStage - 1] || 1;
    
    const nextReviewDate = new Date();
    nextReviewDate.setDate(now.getDate() + daysToAdd);
    
    spacedRepetition[problemId] = {
        stage: nextStage,
        lastSolved: now.toISOString(),
        nextReview: nextReviewDate.toISOString()
    };
    
    saveSRS();
    renderReviewTab(); // Refresh UI
    updateTabCounts();
}

// ===== Custom Sections Management =====
function loadNotes() {
    try {
        const saved = localStorage.getItem('leetcode-tracker-notes');
        if (saved) {
            problemNotes = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load notes:', e);
    }
}

function saveNotesState() {
    try {
        localStorage.setItem('leetcode-tracker-notes', JSON.stringify(problemNotes));
        
        // Save to cloud
        if (authService.isAuthenticated()) {
            const data = dataSync.collectLocalProgress();
            dataSync.debouncedSave(authService.getUserId(), data);
        }
    } catch (e) {
        console.error('Failed to save notes:', e);
    }
}

function loadHistory() {
    try {
        const saved = localStorage.getItem('leetcode-tracker-history');
        if (saved) {
            problemHistory = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load history:', e);
    }
}

function saveHistory() {
    try {
        localStorage.setItem('leetcode-tracker-history', JSON.stringify(problemHistory));
        
        // Save to cloud
        if (authService.isAuthenticated()) {
            const data = dataSync.collectLocalProgress();
            dataSync.debouncedSave(authService.getUserId(), data);
        }
    } catch (e) {
        console.error('Failed to save history:', e);
    }
}

function loadCustomSections() {
    try {
        const saved = localStorage.getItem('leetcode-tracker-custom-sections');
        if (saved) {
            customSections = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load custom sections:', e);
    }
}

function saveCustomSections() {
    try {
        localStorage.setItem('leetcode-tracker-custom-sections', JSON.stringify(customSections));
        
        // Save to cloud
        if (authService.isAuthenticated()) {
            const data = dataSync.collectLocalProgress();
            dataSync.debouncedSave(authService.getUserId(), data);
        }
    } catch (e) {
        console.error('Failed to save custom sections:', e);
    }
}

// ===== Category Order Management =====
function loadCategoryOrder() {
    try {
        const saved = localStorage.getItem('leetcode-tracker-order');
        if (saved) {
            categoryOrder = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load category order:', e);
    }
}

function saveCategoryOrder() {
    try {
        localStorage.setItem('leetcode-tracker-order', JSON.stringify(categoryOrder));
        
        // Save to cloud
        if (authService.isAuthenticated()) {
            const data = dataSync.collectLocalProgress();
            dataSync.debouncedSave(authService.getUserId(), data);
        }
    } catch (e) {
        console.error('Failed to save category order:', e);
    }
}

function getNextSectionId() {
    let maxId = 0;
    customSections.forEach(s => {
        const numId = parseInt(s.id.replace('custom-section-', ''));
        if (numId > maxId) maxId = numId;
    });
    return `custom-section-${maxId + 1}`;
}

function getAllCategories() {
    let all = [...categoriesData, ...customSections];
    
    // If no custom order exists, create default one
    if (categoryOrder.length === 0) {
        return all;
    }
    
    // Sort based on categoryOrder
    return all.sort((a, b) => {
        let indexA = categoryOrder.indexOf(a.id);
        let indexB = categoryOrder.indexOf(b.id);
        
        // Handle new items not yet in order list (append to end)
        if (indexA === -1) indexA = 9999;
        if (indexB === -1) indexB = 9999;
        
        return indexA - indexB;
    });
}

function getNextProblemId() {
    let maxId = 0;
    
    // Check default categories
    if (typeof categoriesData !== 'undefined') {
        categoriesData.forEach(c => {
            c.problems.forEach(p => {
                const id = parseInt(p.id);
                if (!isNaN(id) && id > maxId) maxId = id;
            });
        });
    }
    
    // Check custom problems
    Object.values(customProblems).forEach(problems => {
        problems.forEach(p => {
            const id = parseInt(p.id);
            if (!isNaN(id) && id > maxId) maxId = id;
        });
    });
    
    return maxId + 1;
}

function getAllProblemsForCategory(categoryId) {
    const category = getAllCategories().find(c => c.id === categoryId);
    const defaultProblems = category && category.problems ? [...category.problems] : [];
    const custom = customProblems[categoryId] || [];
    return [...defaultProblems, ...custom];
}

function getTotalProblemsCount() {
    let total = categoriesData.reduce((sum, cat) => sum + cat.problems.length, 0);
    // Add custom sections problems
    customSections.forEach(sec => {
        if (sec.problems) total += sec.problems.length;
    });
    // Add custom problems added to any category
    Object.values(customProblems).forEach(problems => {
        total += problems.length;
    });
    return total;
}

// ===== Theme Management =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ===== Cookie Consent =====
function checkCookieConsent() {
    const consent = localStorage.getItem('cookie-consent');
    if (consent) {
        document.getElementById('cookie-consent').classList.add('hidden');
    }
}

function acceptCookies() {
    localStorage.setItem('cookie-consent', 'accepted');
    document.getElementById('cookie-consent').classList.add('hidden');
}

function rejectCookies() {
    localStorage.setItem('cookie-consent', 'rejected');
    document.getElementById('cookie-consent').classList.add('hidden');
}

function customizeCookies() {
    alert('Cookie customization would open here in production.');
}

// ===== FAANG Banner =====
function checkFaangBanner() {
    const dismissed = localStorage.getItem('faang-banner-dismissed');
    if (dismissed) {
        document.getElementById('faang-banner').classList.add('hidden');
    }
}

function closeFaangBanner() {
    localStorage.setItem('faang-banner-dismissed', 'true');
    document.getElementById('faang-banner').classList.add('hidden');
}

// ===== Progress Calculations =====
function getCategoryProgress(categoryId) {
    const allProblems = getAllProblemsForCategory(categoryId);
    const completed = allProblems.filter(p => completedProblems.has(p.id)).length;
    return {
        completed,
        total: allProblems.length,
        percentage: allProblems.length > 0 ? Math.round((completed / allProblems.length) * 100) : 0
    };
}

function getGlobalProgress() {
    const total = getTotalProblemsCount();
    return {
        completed: completedProblems.size,
        total: total,
        percentage: total > 0 ? Math.round((completedProblems.size / total) * 100) : 0
    };
}

// ===== Patterns CRUD =====
function openAddPatternWeekModal() {
    // Reuse Add Section Modal but set a flag or handle differently
    // For now, let's just use the existing openAddSectionModal but modify its submit handler context
    // Actually, simpler to just have a distinct flow or check active tab
    // We'll trust openAddSectionModal to handle it based on currentTab?
    // Let's modify handleAddSection to check currentTab.
    openAddSectionModal();
}

function openAddSubSectionModal(weekId) {
    document.getElementById('add-sub-section-modal').classList.remove('hidden');
    document.getElementById('parent-section-id').value = weekId;
    document.getElementById('sub-section-title').value = '';
}

function closeAddSubSectionModal() {
    document.getElementById('add-sub-section-modal').classList.add('hidden');
}

function handleAddSubSection(event) {
    event.preventDefault();
    const parentId = document.getElementById('parent-section-id').value;
    const title = document.getElementById('sub-section-title').value.trim();
    
    if (!title) return;
    
    const newDay = {
        id: `custom-day-${Date.now()}`,
        title: title,
        problems: [],
        isCustom: true
    };
    
    if (!customPatternsData.customDays) customPatternsData.customDays = {};
    if (!customPatternsData.customDays[parentId]) customPatternsData.customDays[parentId] = [];
    
    customPatternsData.customDays[parentId].push(newDay);
    saveCustomPatternsData();
    renderPatternsTab();
    closeAddSubSectionModal();
}

function saveCustomPatternsData() {
    localStorage.setItem('leetcode-tracker-custom-patterns', JSON.stringify(customPatternsData));
     if (authService.isAuthenticated()) {
        const data = dataSync.collectLocalProgress();
        dataSync.debouncedSave(authService.getUserId(), data);
    }
}

function loadCustomPatternsData() {
    const saved = localStorage.getItem('leetcode-tracker-custom-patterns');
    if (saved) {
        customPatternsData = JSON.parse(saved);
    } else {
        customPatternsData = { weeks: [], customDays: {} };
    }
}

// Modify renderPatternsTab to include custom data and buttons
function renderPatternsTab() {
    const grid = document.getElementById('patterns-categories-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Add "New Week" button at the top/controls
    // We can inject it into the patterns-content similar to roadmap
    // For now check if button exists in HTML, if not rely on the creation in index.html (I haven't added it yet in HTML specifically unique to patterns?)
    // The main "Create New Section" button is shared. We need to handle it.
    
    // Combine data
    const allPatterns = [...patternsData, ...(customPatternsData.weeks || [])];

    allPatterns.forEach(week => {
        const isExpanded = patternsExpandedCategories.has(week.id);
        
        // Merge custom days
        const customDays = (customPatternsData.customDays && customPatternsData.customDays[week.id]) || [];
        const allSubSections = [...week.subSections, ...customDays];
        
        const completedCount = getWeekCompletedCount({ ...week, subSections: allSubSections });
        const totalCount = getWeekTotalCount({ ...week, subSections: allSubSections });
        const progressPercent = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
        
        const card = document.createElement('div');
        card.className = `category-card ${isExpanded ? 'expanded' : ''}`;
        
        // Header
        const header = document.createElement('div');
        header.className = 'category-header';
        header.onclick = (e) => {
            if (!e.target.closest('button')) {
                togglePatternWeek(week.id);
            }
        };

        header.innerHTML = `
            <div class="category-icon-wrapper">
                <span class="category-icon">📅</span>
            </div>
            <div class="category-info">
                <h3 class="category-title">${week.title}</h3>
                <div class="category-progress">
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <span class="progress-text">${completedCount} / ${totalCount}</span>
                </div>
            </div>
            <div class="category-actions">
                 <button class="add-btn btn-xs" onclick="openAddSubSectionModal('${week.id}')" title="Add Day" style="padding: 4px 8px; margin-right: 5px;">+ Day</button>
                <button class="toggle-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
            </div>
        `;
        
        card.appendChild(header);

        // Body (Days/Sub-sections)
        if (isExpanded) {
            const body = document.createElement('div');
            body.className = 'category-body';
            
            // Render Sub-Sections (Days)
            allSubSections.forEach(day => {
                const dayIsExpanded = patternsExpandedSubCategories.has(day.id);
                
                // Get problems (including custom ones added to this day)
                // We use customProblems[categoryID] logic where categoryID = day.id
                const customDayProblems = customProblems[day.id] || [];
                const allDayProblems = [...(day.problems || []), ...customDayProblems];
                
                const dayCompleted = allDayProblems.filter(p => patternsCompletedProblems.has(p.id.toString())).length;
                const dayTotal = allDayProblems.length;
                
                const dayContainer = document.createElement('div');
                dayContainer.className = 'sub-section-container'; 
                dayContainer.style.marginBottom = '10px';
                dayContainer.style.border = '1px solid rgba(255,255,255,0.1)';
                dayContainer.style.borderRadius = '8px';
                dayContainer.style.background = 'rgba(255,255,255,0.02)';

                const dayHeader = document.createElement('div');
                dayHeader.className = 'sub-section-header';
                dayHeader.style.padding = '10px 15px';
                dayHeader.style.cursor = 'pointer';
                dayHeader.style.display = 'flex';
                dayHeader.style.justifyContent = 'space-between';
                dayHeader.style.alignItems = 'center';
                
                dayHeader.onclick = (e) => {
                     if (!e.target.closest('button')) togglePatternDay(day.id);
                };
                
                dayHeader.innerHTML = `
                   <div style="display:flex; align-items:center; gap: 10px;">
                        <span style="font-weight:600; color:var(--text-primary); font-size:0.95em;">${day.title}</span>
                        <span style="font-size:0.8em; color:var(--text-secondary);">(${dayCompleted}/${dayTotal})</span>
                   </div>
                   <div style="display:flex; align-items:center; gap:10px;">
                        <button class="add-btn btn-xs" onclick="openAddProblemModal('${day.id}')" title="Add Problem" style="font-size:0.8em;">+ Prob</button>
                        <div style="transform: rotate(${dayIsExpanded ? '180deg' : '0deg'}); transition: transform 0.3s;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                   </div>
                `;
                
                dayContainer.appendChild(dayHeader);

                if (dayIsExpanded) {
                    const problemsList = document.createElement('div');
                    problemsList.className = 'problems-list';
                    problemsList.style.display = 'block'; // Override default hidden
                    
                    if (allDayProblems.length === 0) {
                        problemsList.innerHTML = `<div class="empty-problems">No problems yet. Add one!</div>`;
                    } else {
                        allDayProblems.forEach(problem => {
                            problemsList.appendChild(createPatternProblemElement(problem, day.id));
                        });
                    }
                    dayContainer.appendChild(problemsList);
                }
                
                body.appendChild(dayContainer);
            });

            card.appendChild(body);
        }
        
        grid.appendChild(card);
    });
}


function getGlobalProgress() {
    const total = getTotalProblemsCount();
    return {
        completed: completedProblems.size,
        total: total,
        percentage: total > 0 ? Math.round((completedProblems.size / total) * 100) : 0
    };
}

// ===== Progress Tracker Updates =====
function updateAllTrackers() {
    updateRoadmapTracker();
    updateMaangTracker();
    updatePatternsProgress(); // Patterns
    updateTabCounts();
    if (currentTab === 'analytics') {
        renderAnalytics();
    }
}

function updateRoadmapTracker() {
    const progress = getGlobalProgress();
    const textEl = document.getElementById('roadmap-progress-text');
    const fillEl = document.getElementById('roadmap-progress-fill');
    
    if (textEl) textEl.textContent = `${progress.completed} / ${progress.total}`;
    if (fillEl) fillEl.style.width = `${progress.percentage}%`;
}

function updateMaangTracker() {
    const total = getMaangTotalProblemsCount();
    const completed = getMaangCompletedProblemsCount();
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const textEl = document.getElementById('maang-progress-text');
    const fillEl = document.getElementById('maang-progress-fill');
    
    if (textEl) textEl.textContent = `${completed} / ${total}`;
    if (fillEl) fillEl.style.width = `${percentage}%`;
}

function updateCategoryProgress(categoryId) {
    const progress = getCategoryProgress(categoryId);
    
    const progressFill = document.querySelector(`#category-${categoryId} .category-progress-fill`);
    const progressText = document.querySelector(`#category-${categoryId} .category-progress-text`);
    
    if (progressFill) progressFill.style.width = `${progress.percentage}%`;
    if (progressText) progressText.textContent = `${progress.completed} / ${progress.total}`;
}

// ===== Render Categories =====
function renderCategories() {
    const grid = document.getElementById('categories-grid');
    const allCategories = getAllCategories();
    
    // Add Reorder Toggle Button if not present
    let reorderBtn = document.getElementById('reorder-toggle-btn');
    if (!reorderBtn) {
        const header = document.querySelector('.main-content .header-section'); // Assuming standard header structure or insert before grid
        // Actually, let's prepend it to the containers parent or grid wrapper
        // Better: Inject a controls bar before the grid
        const controls = document.createElement('div');
        controls.className = 'controls-bar';
        controls.style.marginBottom = '16px';
        controls.style.display = 'flex';
        controls.style.justifyContent = 'flex-end';
        
        controls.innerHTML = `
            <button id="reorder-toggle-btn" class="btn-secondary" onclick="toggleReorderMode()">
                <span>⇅ Reorder Sections</span>
            </button>
        `;
        
        grid.parentNode.insertBefore(controls, grid);
        reorderBtn = document.getElementById('reorder-toggle-btn');
    }
    
    // Update button state
    reorderBtn.innerHTML = isReorderMode 
        ? '<span>✓ Done Reordering</span>' 
        : '<span>⇅ Reorder Sections</span>';
    reorderBtn.className = isReorderMode ? 'btn-primary' : 'btn-secondary';

    grid.innerHTML = allCategories.map((category, index) => renderCategoryCard(category, index)).join('');
}

function toggleReorderMode() {
    isReorderMode = !isReorderMode;
    renderCategories(); // Re-render to show/hide drag handles
}

function renderCategoryCard(category, index) {
    const progress = getCategoryProgress(category.id);
    const isExpanded = expandedCategories.has(category.id);
    const isCustomSection = category.isCustom === true;
    
    // Drag & Drop Attributes
    const dragAttrs = isReorderMode ? `
        draggable="true" 
        ondragstart="handleDragStart(event, '${category.id}')"
        ondragover="handleDragOver(event)" 
        ondrop="handleDrop(event, '${category.id}')"
        style="cursor: move; border: 2px dashed var(--accent-primary);"
    ` : '';

    const opacityStyle = isReorderMode ? 'opacity: 0.9;' : '';
    
    return `
        <div id="category-${category.id}" 
             class="category-card ${isExpanded ? 'expanded' : ''}" 
             ${dragAttrs}>
            
            <div class="category-header" onclick="${isReorderMode ? '' : `toggleCategory('${category.id}')`}">
                <div class="category-info">
                     ${isReorderMode ? '<div style="font-size: 1.5rem; margin-right:8px; cursor:move;">☰</div>' : `<div class="category-icon">${category.icon}</div>`}
                    <div class="category-details">
                        <h3 class="category-title">
                            ${category.title}
                            ${isCustomSection ? '<span class="section-custom-badge">Custom</span>' : ''}
                        </h3>
                        ${!isReorderMode ? `
                        <div class="category-progress-container">
                            <div class="category-progress-bar">
                                <div class="category-progress-fill" style="width: ${progress.percentage}%"></div>
                            </div>
                            <span class="category-progress-text">${progress.completed} / ${progress.total}</span>
                        </div>
                        ` : '<div style="font-size:0.8rem; color:var(--text-muted)">Drag to reorder</div>'}
                    </div>
                </div>
                
                ${!isReorderMode ? `
                    <button class="add-problem-btn" onclick="event.stopPropagation(); openAddProblemModal('${category.id}')" title="Add Problem">+</button>
                    ${isCustomSection ? `<button class="delete-section-btn" onclick="event.stopPropagation(); deleteSection('${category.id}')" title="Delete Section">🗑️</button>` : ''}
                    <svg class="category-expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                ` : ''}
            </div>
            
            ${!isReorderMode ? `
            <div class="problems-container">
                ${renderProblemsTable(category)}
            </div>
            ` : ''}
        </div>
    `;
}

// ===== Drag & Drop Handlers =====
let draggedItemId = null;

function handleDragStart(e, id) {
    draggedItemId = id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    e.target.style.opacity = '0.4';
}

function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e, targetId) {
    if (e.stopPropagation) e.stopPropagation();
    
    const draggedId = draggedItemId;
    if (draggedId === targetId) return; // Dropped on self
    
    // Get current lists
    let allCats = getAllCategories();
    let currentOrder = allCats.map(c => c.id);
    
    const fromIndex = currentOrder.indexOf(draggedId);
    const toIndex = currentOrder.indexOf(targetId);
    
    if (fromIndex < 0 || toIndex < 0) return;
    
    // Move item
    currentOrder.splice(fromIndex, 1);
    currentOrder.splice(toIndex, 0, draggedId);
    
    // Update state
    categoryOrder = currentOrder;
    saveCategoryOrder();
    
    // Re-render
    renderCategories();
    
    return false;
}

function renderProblemsTable(category) {
    const allProblems = getAllProblemsForCategory(category.id);
    
    return `
        <table class="problems-table">
            <thead>
                <tr>
                    <th>Problem</th>
                    <th>Difficulty</th>
                    <th>Leetcode</th>
                    <th>Difficulty Score</th>
                    <th>Notes</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${allProblems.map(problem => renderProblemRow(problem, category.id)).join('')}
            </tbody>
        </table>
    `;
}

function renderProblemRow(problem, categoryId) {
    const isCompleted = completedProblems.has(problem.id);
    const difficultyClass = `difficulty-${problem.difficulty.toLowerCase()}`;
    const isCustom = problem.isCustom === true;
    const hasNote = problemNotes[problem.id] && problemNotes[problem.id].trim().length > 0;
    
    return `
        <tr>
            <td>
                <a href="${problem.leetcodeUrl}" target="_blank" class="problem-link problem-name">
                    ${problem.name}
                    ${isCustom ? '<span class="custom-badge">Custom</span>' : ''}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </a>
            </td>
            <td>
                <span class="difficulty-badge ${difficultyClass}">${problem.difficulty}</span>
            </td>
            <td>
                <a href="${problem.leetcodeUrl}" target="_blank" class="leetcode-link" title="Open on LeetCode">
                    <svg viewBox="0 0 24 24">
                        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                    </svg>
                </a>
            </td>
            <td>
                <span class="score-badge">${problem.score}</span>
            </td>
            <td class="note-cell">
                <button class="note-btn ${hasNote ? 'has-note' : ''}" onclick="openNoteModal('${problem.id}')" title="${hasNote ? 'Edit Note' : 'Add Note'}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
            </td>
            <td>
                <div class="status-cell">
                    <input 
                        type="checkbox" 
                        class="status-checkbox" 
                        ${isCompleted ? 'checked' : ''} 
                        onchange="toggleProblem(${problem.id}, '${categoryId}')"
                        aria-label="Mark ${problem.name} as ${isCompleted ? 'incomplete' : 'complete'}"
                    >
                    ${isCustom ? `<button class="delete-btn" onclick="event.stopPropagation(); deleteProblem(${problem.id}, '${categoryId}')" title="Delete Problem">🗑️</button>` : ''}
                </div>
            </td>
        </tr>
    `;
}

// ===== Event Handlers =====
function toggleCategory(categoryId) {
    const card = document.getElementById(`category-${categoryId}`);
    
    if (expandedCategories.has(categoryId)) {
        expandedCategories.delete(categoryId);
        card.classList.remove('expanded');
    } else {
        expandedCategories.add(categoryId);
        card.classList.add('expanded');
    }
}

function toggleProblem(problemId, categoryId) {
    if (completedProblems.has(problemId)) {
        completedProblems.delete(problemId);
        delete problemHistory[problemId];
    } else {
        completedProblems.add(problemId);
        if (!problemHistory[problemId]) {
            problemHistory[problemId] = new Date().toISOString();
        }
    }
    
    saveState();
    saveHistory();
    updateCategoryProgress(categoryId);
    updateAllTrackers();
    
    if (completedProblems.has(problemId)) {
        celebrateProblemComplete();
        scheduleReview(problemId); // Trigger SRS
    }
}

function celebrateProblemComplete() {
    const progressRing = document.querySelector('.progress-ring');
    if (progressRing) {
        progressRing.style.transform = 'scale(1.2)';
        setTimeout(() => {
            progressRing.style.transform = 'scale(1)';
        }, 200);
    }
}

// ===== Add Problem Modal =====
function openAddProblemModal(categoryId) {
    // IMPORTANT: Reset form BEFORE setting values
    document.getElementById('add-problem-form').reset();
    
    document.getElementById('add-problem-modal').classList.remove('hidden');
    document.getElementById('problem-category-id').value = categoryId;
    document.getElementById('edit-problem-id').value = '';
    document.getElementById('modal-title').textContent = 'Add New Problem';
    document.getElementById('problem-score').value = '5/10';
}

function closeAddProblemModal() {
    document.getElementById('add-problem-modal').classList.add('hidden');
    document.getElementById('add-problem-form').reset();
}

function handleAddProblem(event) {
    event.preventDefault();
    
    const categoryId = document.getElementById('problem-category-id').value;
    const name = document.getElementById('problem-name').value.trim();
    const difficulty = document.getElementById('problem-difficulty').value;
    const leetcodeUrl = document.getElementById('problem-url').value.trim();
    const score = document.getElementById('problem-score').value.trim() || '5/10';
    
    // Validate all required fields including category
    if (!categoryId) {
        alert('Error: Category not selected. Please close and try again.');
        return;
    }
    
    if (!name || !leetcodeUrl) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Create new problem
    const newProblem = {
        id: getNextProblemId(),
        name: name,
        difficulty: difficulty,
        leetcodeUrl: leetcodeUrl,
        score: score,
        isCustom: true,
        categoryId: categoryId,
        createdBy: authService.isAuthenticated() ? authService.getUserId() : null
    };
    
    // Add to custom problems
    if (!customProblems[categoryId]) {
        customProblems[categoryId] = [];
    }
    customProblems[categoryId].push(newProblem);
    
    // Save and re-render
    saveCustomProblems();
    
    // Check if this is a patterns category (pattern ID starts with 'pattern-' or 'custom-pattern-')
    const isPatternCategory = categoryId.startsWith('pattern-') || categoryId.startsWith('custom-pattern-');
    
    if (isPatternCategory) {
        // For patterns tab
        patternsExpandedCategories.add(categoryId);
        patternsExpandedSubCategories.add(categoryId);
        renderPatternsTab();
        updatePatternsProgress();
    } else {
        // For roadmap tab
        expandedCategories.add(categoryId);
        renderCategories();
        updateAllTrackers();
    }
    
    closeAddProblemModal();
    
    // Show success message
    showToast(`Problem "${name}" added successfully!`);
}

function deleteProblem(problemId, categoryId) {
    if (!confirm(`Are you sure you want to delete this problem? (ID: ${problemId})`)) {
        return;
    }
    
    let deleted = false;
    const probIdStr = String(problemId);
    
    console.log('--- Delete Debug Info ---');
    console.log('Target ID:', probIdStr);
    console.log('Provided Category:', categoryId);
    
    // 1. Try deleting from the specific category provided
    if (categoryId && customProblems[categoryId]) {
        const originalLen = customProblems[categoryId].length;
        customProblems[categoryId] = customProblems[categoryId].filter(p => String(p.id) !== probIdStr);
        
        if (customProblems[categoryId].length < originalLen) {
            deleted = true;
            console.log('Success: Deleted from provided category');
        } else {
            console.log('Failed: Not found in provided category');
        }
    }
    
    // 2. Fallback: Search ALL categories
    if (!deleted) {
        console.log('Searching fallback categories...');
        const allCats = Object.keys(customProblems);
        console.log('Available custom categories:', allCats);
        
        for (const catId of allCats) {
            const originalLen = customProblems[catId].length;
            customProblems[catId] = customProblems[catId].filter(p => String(p.id) !== probIdStr);
            
            if (customProblems[catId].length < originalLen) {
                deleted = true;
                categoryId = catId; 
                console.log('Success: Found in fallback category:', catId);
                break;
            }
        }
    }
    
    if (deleted) {
        // Cleanup state
        if (completedProblems.has(problemId)) completedProblems.delete(problemId);
        if (completedProblems.has(Number(problemId))) completedProblems.delete(Number(problemId));
        if (completedProblems.has(String(problemId))) completedProblems.delete(String(problemId));
        
        if (problemHistory[probIdStr]) delete problemHistory[probIdStr];
        
        // Save
        saveCustomProblems();
        saveState();
        saveHistory();
        
        alert('Problem Deleted Successfully! Page will now reload to verify.');
        location.reload(); 
        
    } else {
        console.error('Delete Failed');
        const debugInfo = Object.keys(customProblems).map(k => `${k}: ${customProblems[k].length} problems`).join('\n');
        alert(`Failed to delete problem (ID: ${problemId}).\n\nDebug Info:\nTarget Category: ${categoryId}\nOther Categories:\n${debugInfo}\n\nCheck console (F12) for details.`);
    }
}

// ===== Add Section Modal =====
function openAddSectionModal() {
    document.getElementById('add-section-form').reset();
    document.getElementById('add-section-modal').classList.remove('hidden');
    document.getElementById('section-icon').value = '📚';
}

function closeAddSectionModal() {
    document.getElementById('add-section-modal').classList.add('hidden');
    document.getElementById('add-section-form').reset();
}

function handleAddSection(event) {
    event.preventDefault();
    
    const title = document.getElementById('section-title').value.trim();
    const icon = document.getElementById('section-icon').value.trim() || '📚';
    
    if (!title) {
        alert('Please enter a section title.');
        return;
    }

    if (currentTab === 'patterns') {
        const newTopic = {
            id: `custom-topic-${Date.now()}`,
            title: title,
            icon: icon,
            subSections: [],
            isCustom: true,
            createdBy: authService.isAuthenticated() ? authService.getUserId() : null
        };
        
        customPatternsSections.push(newTopic);
        
        savePatternsCRUD();
        patternsExpandedCategories.add(newTopic.id);
        renderPatternsTab();
        updatePatternsProgress();
        closeAddSectionModal();
        
        // Save to shared API for global visibility
        if (authService.isAuthenticated() && typeof sharedPatternsAPI !== 'undefined') {
            sharedPatternsAPI.add('topic', { id: newTopic.id, title: title, icon: icon, subSections: [] })
                .then(() => console.log('Shared topic saved'))
                .catch(err => console.error('Failed to save to shared API:', err));
        }
        
        showToast(`Topic "${title}" created successfully!`);
        return;
    }
    
    // Create new section (Roadmap)
    const newSection = {
        id: getNextSectionId(),
        title: title,
        icon: icon,
        problems: [],
        resources: [],
        isCustom: true
    };
    
    // Add to custom sections
    customSections.push(newSection);
    
    // Save and re-render
    saveCustomSections();
    renderCategories();
    updateAllTrackers();
    closeAddSectionModal();
    
    // Expand the new section
    expandedCategories.add(newSection.id);
    renderCategories();
    
    showToast(`Section "${title}" created successfully!`);
}

function deleteSection(sectionId) {
    console.log('deleteSection called with:', sectionId);
    
    // Convert to string for comparison to handle both number/string IDs
    const idStr = String(sectionId);
    
    const section = customSections.find(s => String(s.id) === idStr);
    if (!section) {
        console.error('Section not found:', sectionId);
        // Try to find it with loose comparison just in case
        const looseSection = customSections.find(s => s.id == sectionId);
        if (looseSection) {
            console.log('Found section with loose comparison');
            deleteSection(looseSection.id);
            return;
        }
        alert('Error: Section not found. Please refresh the page.');
        return;
    }
    
    const problemCount = getAllProblemsForCategory(section.id).length;
    const message = problemCount > 0 
        ? `Are you sure you want to delete "${section.title}" and its ${problemCount} problem(s)?`
        : `Are you sure you want to delete "${section.title}"?`;
    
    if (!confirm(message)) {
        return;
    }
    
    try {
        // Remove the section
        customSections = customSections.filter(s => String(s.id) !== idStr);
        
        // Also remove any custom problems in this section
        // Note: Object keys are always strings
        if (customProblems[section.id]) {
            delete customProblems[section.id];
        }
        
        // Remove completed problems that were in this section
        const sectionProblems = section.problems || [];
        sectionProblems.forEach(p => completedProblems.delete(p.id));
        
        // Save to localStorage
        saveCustomSections();
        saveCustomProblems();
        saveState();
        
        // Re-render
        renderCategories();
        updateAllTrackers();
        
        showToast(`Section "${section.title}" deleted successfully!`);
    } catch (error) {
        console.error('Error deleting section:', error);
        alert('Error deleting section: ' + error.message);
    }
}

// ===== Toast Notification =====
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent-primary);
        color: white;
        padding: 12px 24px;
        border-radius: var(--radius-md);
        font-weight: 600;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: toastSlideUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}


function importProgress(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.completed && Array.isArray(data.completed)) {
                completedProblems = new Set(data.completed);
                saveState();
            }
            if (data.customProblems) {
                customProblems = data.customProblems;
                saveCustomProblems();
            }
            renderCategories();
            updateAllTrackers();
            showToast('Progress imported successfully!');
        } catch (err) {
            console.error('Failed to import progress:', err);
            alert('Failed to import progress. Please check the file format.');
        }
    };
    reader.readAsText(file);
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Press 't' to toggle theme
    if (e.key === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA' && activeElement.tagName !== 'SELECT') {
            toggleTheme();
        }
    }
    
    // Press Escape to close modal or collapse categories
    if (e.key === 'Escape') {
        const modal = document.getElementById('add-problem-modal');
        if (!modal.classList.contains('hidden')) {
            closeAddProblemModal();
        } else {
            expandedCategories.clear();
            renderCategories();
        }
    }
});

// Add toast animation to document
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes toastSlideUp {
        from { transform: translateX(-50%) translateY(100px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes toastSlideDown {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(100px); opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);

// ===== MAANG State Management =====
function loadMaangState() {
    try {
        const saved = localStorage.getItem('maang-tracker-completed');
        if (saved) {
            maangCompletedProblems = new Set(JSON.parse(saved));
        }
    } catch (e) {
        console.error('Failed to load MAANG state:', e);
    }
}

function saveMaangState() {
    try {
        localStorage.setItem('maang-tracker-completed', JSON.stringify([...maangCompletedProblems]));
    } catch (e) {
        console.error('Failed to save MAANG state:', e);
    }
}

// ===== Tab Switching =====
const memes = [
    { src: 'assets/images/meme_skeleton.png', text: 'Compiling excuses...' },
    { src: 'assets/images/meme_bug_juice.png', text: 'Debugging life choices...' },
    { src: 'assets/images/meme_cat.png', text: 'Pushing code to production...' },
    { src: 'assets/images/meme_fire.png', text: 'This is fine...' },
    { src: 'assets/images/meme_semicolon.png', text: 'It was just one semicolon...' },
    { src: 'assets/images/meme_git.png', text: 'Resolving merge conflicts...' },
    { src: 'assets/images/meme_friday.png', text: 'Deploying on Friday at 5 PM...' },
    { src: 'assets/images/meme_prod.png', text: 'Testing in Production...' },
    // Batch 17 New Additions
    { src: 'assets/images/meme_works.png', text: 'It works on my machine...' },
    { src: 'assets/images/meme_duck.png', text: 'Explaining it to the duck...' },
    { src: 'assets/images/meme_css.png', text: 'CSS is awesome...' },
    { src: 'assets/images/meme_copy_paste.png', text: 'Professional Copy-Paster...' },
    { src: 'assets/images/meme_ie.png', text: 'Still loading...' },
    { src: 'assets/images/meme_meetings.png', text: 'Surviving another meeting...' },
    { src: 'assets/images/meme_fullstack.png', text: 'Balancing the whole stack...' },
    { src: 'assets/images/meme_legacy.png', text: 'Reading legacy code...' },
    { src: 'assets/images/meme_techdebt.png', text: 'Climbing technical debt...' },
    { src: 'assets/images/meme_deploy_skull.png', text: 'YOLO Deploy...' },
    { src: 'assets/images/meme_merge_trains.png', text: 'Resolving merge conflicts...' },
    { src: 'assets/images/meme_ml.png', text: 'Stirring the data pile...' },
    { src: 'assets/images/meme_jun_sen.png', text: 'It\'s a feature, not a bug...' }
];
let memeBag = [];

function getNextMeme() {
    if (memeBag.length === 0) {
        memeBag = [...memes];
        // Fisher-Yates Shuffle
        for (let i = memeBag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [memeBag[i], memeBag[j]] = [memeBag[j], memeBag[i]];
        }
        
        // Ensure the new bag's first item isn't the same as the last delivered item
        // to strictly prevent repetition across bag refills.
        // (Implementation detail: Keep track of last meme? Or just trust probability with 8 items?)
        // With 8 items, probability is low. Let's keep it simple.
    }
    return memeBag.pop();
}

function switchTab(tabId) {
    if (currentTab === tabId) return;
    currentTab = tabId;

    // Show Meme Overlay
    const meme = getNextMeme();
    const overlay = document.getElementById('meme-overlay');
    const img = document.getElementById('meme-image');
    const txt = document.getElementById('meme-text');
    
    if (overlay && img && txt) {
        // Set content
        img.src = meme.src;
        txt.textContent = meme.text;
        
        // Show
        overlay.classList.remove('hidden');
        
        // Wait 1.5 seconds
        setTimeout(() => {
            overlay.classList.add('hidden');
            performTabSwitch(tabId);
        }, 1500);
    } else {
        performTabSwitch(tabId);
    }
}

function performTabSwitch(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) btn.classList.add('active');
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetContent = document.getElementById(`${tabId}-content`);
    if (targetContent) targetContent.classList.add('active');
    
    // Trigger tab-specific updates
    if (tabId === 'analytics') {
        renderAnalytics();
    } else if (tabId === 'leaderboard') {
        fetchLeaderboard();
    } else if (tabId === 'review') {
        renderReviewTab();
    }
}

function updateTabCounts() {
    // Roadmap count
    const roadmapTotal = getTotalProblemsCount();
    const roadmapCompleted = getCompletedProblemsCount();
    document.getElementById('roadmap-count').textContent = `${roadmapCompleted}/${roadmapTotal}`;
    
    // MAANG count
    const maangTotal = getMaangTotalProblemsCount();
    const maangCompleted = getMaangCompletedProblemsCount();
    document.getElementById('maang-count').textContent = `${maangCompleted}/${maangTotal}`;

    // Review count (Due)
    const dueCount = getDueReviewsCount();
    const reviewBadge = document.getElementById('review-count');
    if (reviewBadge) {
        reviewBadge.textContent = dueCount;
        if (dueCount > 0) {
            reviewBadge.style.display = 'inline-flex';
            reviewBadge.style.background = '#ef4444'; // Red for urgency
        } else {
            reviewBadge.style.display = 'none';
        }
    }
}

function getCompletedProblemsCount() {
    let completed = 0;
    getAllCategories().forEach(category => {
        getAllProblemsForCategory(category.id).forEach(problem => {
            if (completedProblems.has(problem.id)) completed++;
        });
    });
    return completed;
}

// ===== MAANG Progress Functions =====
function getMaangTotalProblemsCount() {
    if (typeof maangCategoriesData === 'undefined') return 0;
    return maangCategoriesData.reduce((sum, cat) => sum + cat.problems.length, 0);
}

function getMaangCompletedProblemsCount() {
    let completed = 0;
    if (typeof maangCategoriesData === 'undefined') return 0;
    maangCategoriesData.forEach(category => {
        category.problems.forEach(problem => {
            if (maangCompletedProblems.has(problem.id)) completed++;
        });
    });
    return completed;
}

function getMaangCategoryProgress(categoryId) {
    if (typeof maangCategoriesData === 'undefined') return { total: 0, completed: 0, percentage: 0 };
    const category = maangCategoriesData.find(c => c.id === categoryId);
    if (!category) return { total: 0, completed: 0, percentage: 0 };
    
    const total = category.problems.length;
    let completed = 0;
    
    category.problems.forEach(problem => {
        if (maangCompletedProblems.has(problem.id)) completed++;
    });
    
    return {
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
}

// ===== Render MAANG Categories =====
function renderMaangCategories() {
    const grid = document.getElementById('maang-categories-grid');
    if (!grid || typeof maangCategoriesData === 'undefined') return;
    
    grid.innerHTML = maangCategoriesData.map(category => renderMaangCategoryCard(category)).join('');
}

function renderMaangCategoryCard(category) {
    const progress = getMaangCategoryProgress(category.id);
    const isExpanded = maangExpandedCategories.has(category.id);
    
    return `
        <div id="maang-category-${category.id}" class="category-card ${isExpanded ? 'expanded' : ''}">
            <div class="category-header" onclick="toggleMaangCategory('${category.id}')">
                <div class="category-info">
                    <div class="category-icon">${category.icon}</div>
                    <div class="category-details">
                        <h3 class="category-title">${category.title}</h3>
                        <div class="category-progress-container">
                            <div class="category-progress-bar">
                                <div class="category-progress-fill" style="width: ${progress.percentage}%"></div>
                            </div>
                            <span class="category-progress-text">${progress.completed} / ${progress.total}</span>
                        </div>
                    </div>
                </div>
                <svg class="category-expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
            <div class="problems-container">
                ${renderMaangProblemsTable(category)}
            </div>
        </div>
    `;
}

function renderMaangProblemsTable(category) {
    if (!category.problems || category.problems.length === 0) {
        return '<p class="no-problems">No problems in this category.</p>';
    }
    
    return `
        <table class="problems-table">
            <thead>
                <tr>
                    <th>Problem</th>
                    <th>Difficulty</th>
                    <th>Leetcode</th>
                    <th>Difficulty Score</th>
                    <th>Notes</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${category.problems.map(problem => renderMaangProblemRow(problem, category.id)).join('')}
            </tbody>
        </table>
    `;
}

function renderMaangProblemRow(problem, categoryId) {
    const isCompleted = maangCompletedProblems.has(problem.id);
    const difficultyClass = `difficulty-${problem.difficulty.toLowerCase()}`;
    const hasNote = problemNotes[problem.id] && problemNotes[problem.id].trim().length > 0;
    
    return `
        <tr>
            <td>
                <a href="${problem.leetcodeUrl}" target="_blank" class="problem-link problem-name">
                    ${problem.name}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </a>
            </td>
            <td>
                <span class="difficulty-badge ${difficultyClass}">${problem.difficulty}</span>
            </td>
            <td>
                <a href="${problem.leetcodeUrl}" target="_blank" class="leetcode-link" title="Open on LeetCode">
                    <svg viewBox="0 0 24 24">
                        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                    </svg>
                </a>
            </td>
            <td>
                <span class="score-badge">${problem.score}</span>
            </td>
            <td class="note-cell">
                <button class="note-btn ${hasNote ? 'has-note' : ''}" onclick="openNoteModal('${problem.id}')" title="${hasNote ? 'Edit Note' : 'Add Note'}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
            </td>
            <td>
                <div class="status-cell">
                    <input 
                        type="checkbox" 
                        class="status-checkbox" 
                        ${isCompleted ? 'checked' : ''} 
                        onchange="toggleMaangProblem(${problem.id})"
                        aria-label="Mark ${problem.name} as ${isCompleted ? 'incomplete' : 'complete'}"
                    >
                </div>
            </td>
        </tr>
    `;
}

// ===== MAANG Category Toggle =====
function toggleMaangCategory(categoryId) {
    if (maangExpandedCategories.has(categoryId)) {
        maangExpandedCategories.delete(categoryId);
    } else {
        maangExpandedCategories.add(categoryId);
    }
    renderMaangCategories();
}

// ===== MAANG Problem Toggle =====
function toggleMaangProblem(problemId) {
    if (maangCompletedProblems.has(problemId)) {
        maangCompletedProblems.delete(problemId);
        if (problemHistory[problemId]) delete problemHistory[problemId];
    } else {
        maangCompletedProblems.add(problemId);
        if (!problemHistory[problemId]) {
            problemHistory[problemId] = new Date().toISOString();
        }
        celebrateProblemComplete();
        scheduleReview(problemId); // Trigger SRS
    }
    
    saveMaangState();
    saveHistory();
    updateAllTrackers();
    updateTabCounts();
    
    // Update the category progress
    const category = maangCategoriesData.find(cat => 
        cat.problems.some(p => p.id === problemId)
    );
    if (category) {
        const progress = getMaangCategoryProgress(category.id);
        const progressFill = document.querySelector(`#maang-category-${category.id} .category-progress-fill`);
        const progressText = document.querySelector(`#maang-category-${category.id} .category-progress-text`);
        
        if (progressFill) progressFill.style.width = `${progress.percentage}%`;
        if (progressText) progressText.textContent = `${progress.completed} / ${progress.total}`;
    }
}

// ===== Updated Global Progress (supports both tabs) =====
function updateGlobalProgressDisplay() {
    let total, completed, percentage;
    
    if (currentTab === 'maang') {
        total = getMaangTotalProblemsCount();
        completed = getMaangCompletedProblemsCount();
    } else {
        total = getTotalProblemsCount();
        completed = getCompletedProblemsCount();
    }
    
    percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    document.getElementById('global-progress-text').textContent = `${completed} / ${total}`;
    document.getElementById('progress-ring-fill').setAttribute('stroke-dasharray', `${percentage}, 100`);
}

// ===== Analytics Rendering =====
// ===== Analytics Rendering =====
let solvedTrendChartInstance = null; // Store chart instance

function renderAnalytics() {
    // 1. Calculate Stats
    let totalSolved = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    
    // Create map of all problems to their difficulty
    const allProblemsMap = new Map(); // id -> problem object
    
    // Process Roadmap Problems
    getAllCategories().forEach(cat => {
        getAllProblemsForCategory(cat.id).forEach(p => {
            allProblemsMap.set(String(p.id), p);
        });
    });
    
    // Process MAANG Problems
    if (typeof maangCategoriesData !== 'undefined') {
        maangCategoriesData.forEach(cat => {
            cat.problems.forEach(p => {
                allProblemsMap.set(String(p.id), p);
            });
        });
    }
    
    // Count difficulties
    const allSolvedIds = new Set([...completedProblems, ...maangCompletedProblems]);
    allSolvedIds.forEach(id => {
        const p = allProblemsMap.get(String(id));
        if (p) {
            totalSolved++;
            const diff = p.difficulty.toLowerCase();
            if (diff === 'easy') easySolved++;
            else if (diff === 'medium') mediumSolved++;
            else if (diff === 'hard') hardSolved++;
        }
    });

    // Update Basic Stats Cards
    document.getElementById('stats-total').textContent = totalSolved;
    document.getElementById('stats-easy').textContent = easySolved;
    document.getElementById('stats-medium').textContent = mediumSolved;
    document.getElementById('stats-hard').textContent = hardSolved;

    // 2. Calculate Streaks (Current & Longest)
    const datesWithSolves = new Set();
    
    // Helper to normalize date to YYYY-MM-DD
    const normalizeDate = (dateStr) => {
        if (!dateStr) return null;
        try {
            return new Date(dateStr).toISOString().split('T')[0];
        } catch (e) { return null; }
    };
    
    // Add dates from history
    Object.values(problemHistory).forEach(iso => {
        const date = normalizeDate(iso);
        if (date) datesWithSolves.add(date);
    });
    
    const sortedDates = [...datesWithSolves].sort();
    
    let currentStreak = 0;
    let maxStreak = 0;
    
    if (sortedDates.length > 0) {
        let tempStreak = 1;
        
        // Iterate dates to find max streak
        for (let i = 1; i < sortedDates.length; i++) {
            const prev = new Date(sortedDates[i-1]);
            const curr = new Date(sortedDates[i]);
            const diffTime = Math.abs(curr - prev);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                tempStreak++;
            } else {
                if (tempStreak > maxStreak) maxStreak = tempStreak;
                tempStreak = 1;
            }
        }
        if (tempStreak > maxStreak) maxStreak = tempStreak;
        
        // Calculate Current Streak
        // Check if last solved date is today or yesterday
        const today = new Date().toISOString().split('T')[0];
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = yesterdayDate.toISOString().split('T')[0];
        
        const lastSolvedDate = sortedDates[sortedDates.length - 1];
        
        if (lastSolvedDate === today) {
            // Count backwards from today
            currentStreak = 1;
            for (let i = sortedDates.length - 2; i >= 0; i--) {
                const prev = new Date(sortedDates[i]);
                const curr = new Date(sortedDates[i+1]);
                const diff = (curr - prev) / (1000 * 60 * 60 * 24); // Should be 1
                // Approximate check due to DST etc, but dates are normalized strings
                if (Math.round(diff) === 1) currentStreak++;
                else break;
            }
        } else if (lastSolvedDate === yesterday) {
            // Count backwards from yesterday
            currentStreak = 1;
             for (let i = sortedDates.length - 2; i >= 0; i--) {
                const prev = new Date(sortedDates[i]);
                const curr = new Date(sortedDates[i+1]);
                const diff = (curr - prev) / (1000 * 60 * 60 * 24);
                if (Math.round(diff) === 1) currentStreak++;
                else break;
            }
        } else {
            currentStreak = 0;
        }
    }
    
    document.getElementById('stats-current-streak').textContent = currentStreak;
    document.getElementById('stats-longest-streak').textContent = maxStreak;

    // 3. Render Trend Chart (Time vs Total Solved) using Chart.js
    const ctx = document.getElementById('solvedTrendChart');
    if (ctx) {
        // Prepare Data Points
        // We need cumulative count over time.
        // Get all completion timestamps, sort them.
        const timestamps = [];
        Object.values(problemHistory).forEach(iso => {
            if (iso) timestamps.push(new Date(iso).getTime());
        });
        timestamps.sort((a, b) => a - b);
        
        // Aggregate by day to avoid too many points? 
        // Or just map every solve. If many solves on same day, Y increases.
        // Better: Daily aggregated Cumulative Series
        const dailyCounts = {};
        timestamps.forEach(ts => {
            const dateKey = new Date(ts).toISOString().split('T')[0];
            dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
        });
        
        const chartData = [];
        let cumulative = 0;
        const sortedDayKeys = Object.keys(dailyCounts).sort();
        
        // If no data, start with 0 at today
        if (sortedDayKeys.length === 0) {
            const todayKey = new Date().toISOString().split('T')[0];
            chartData.push({ x: todayKey, y: 0 });
        } else {
             // Add an initial point before the first solve? Maybe 0 the day before?
             // Optional, but looks nicer.
             const firstDate = new Date(sortedDayKeys[0]);
             firstDate.setDate(firstDate.getDate() - 1);
             chartData.push({ x: firstDate.toISOString().split('T')[0], y: 0 });
             
             sortedDayKeys.forEach(date => {
                 cumulative += dailyCounts[date];
                 chartData.push({ x: date, y: cumulative });
             });
             
             // Extend to today if last solve was in past
             const lastDateKey = sortedDayKeys[sortedDayKeys.length - 1];
             const todayKey = new Date().toISOString().split('T')[0];
             if (lastDateKey < todayKey) {
                  chartData.push({ x: todayKey, y: cumulative });
             }
        }

        // Destroy previous instance
        if (solvedTrendChartInstance) {
            solvedTrendChartInstance.destroy();
        }
        
        // Create new Chart
        solvedTrendChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Total Problems Solved',
                    data: chartData,
                    borderColor: '#8b5cf6', // accent-primary
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#8b5cf6',
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.3 // Smooth curves
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'MMM d, yyyy'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#94a3b8',
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#1e293b',
                        titleColor: '#f1f5f9',
                        bodyColor: '#cbd5e1',
                        borderColor: '#334155',
                        borderWidth: 1
                    }
                }
            }
        });
    }

    // 4. Render Heatmap (Monthly View)
    renderHeatmap();
}

function renderHeatmap() {
    const container = document.getElementById('streak-heatmap');
    container.innerHTML = '';
    
    // Generate data map for quick lookup: "YYYY-MM-DD" -> count
    const activityMap = {}; 
    Object.values(problemHistory).forEach(iso => {
        if (!iso) return;
        const dateKey = iso.split('T')[0];
        activityMap[dateKey] = (activityMap[dateKey] || 0) + 1;
    });

    // Render Last 6 Months
    const today = new Date();
    
    // Iterate from 5 months ago to current month
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = d.getFullYear();
        const month = d.getMonth(); // 0-11
        const monthName = d.toLocaleString('default', { month: 'long' });
        
        const monthCard = document.createElement('div');
        monthCard.className = 'month-card';
        
        // Header
        const header = document.createElement('div');
        header.className = 'month-title';
        header.textContent = `${monthName} ${year}`;
        monthCard.appendChild(header);
        
        // Day Initials
        const daysRow = document.createElement('div');
        daysRow.className = 'week-days-row';
        ['S','M','T','W','T','F','S'].forEach(day => {
            const el = document.createElement('div');
            el.className = 'week-day-label';
            el.textContent = day;
            daysRow.appendChild(el);
        });
        monthCard.appendChild(daysRow);
        
        // Grid
        const grid = document.createElement('div');
        grid.className = 'month-grid';
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = new Date(year, month, 1).getDay(); // 0=Sun
        
        // Empty slots for padding
        for (let j = 0; j < startDay; j++) {
            const empty = document.createElement('div');
            empty.className = 'heatmap-day';
            empty.style.visibility = 'hidden'; // Invisible but takes space
            grid.appendChild(empty);
        }
        
        // Actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const count = activityMap[dateStr] || 0;
            
            // Level
            let level = 0;
            if (count > 0) level = 1;
            if (count >= 2) level = 2;
            if (count >= 4) level = 3;
            if (count >= 6) level = 4;
            
            const cell = document.createElement('div');
            cell.className = `heatmap-day level-${level}`;
            cell.setAttribute('data-tooltip', `${count} solved on ${monthName} ${day}`);
            
            grid.appendChild(cell);
        }
        
        monthCard.appendChild(grid);
        container.appendChild(monthCard);
    }
}

// ===== Export/Import Progress =====
function exportProgress() {
    try {
        const data = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            data: {
                'leetcode-tracker-completed': localStorage.getItem('leetcode-tracker-completed'),
                'maang-tracker-completed': localStorage.getItem('maang-tracker-completed'),
                'leetcode-tracker-custom-problems': localStorage.getItem('leetcode-tracker-custom-problems'),
                'leetcode-tracker-custom-sections': localStorage.getItem('leetcode-tracker-custom-sections'),
                'leetcode-tracker-theme': localStorage.getItem('leetcode-tracker-theme'),
                'leetcode-tracker-history': localStorage.getItem('leetcode-tracker-history')
            },
            notes: problemNotes
        };
        
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `leetcode-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('✅ Progress exported successfully!');
    } catch (e) {
        console.error('Export failed:', e);
        showToast('❌ Export failed. Check console for details.');
    }
}

function importProgress() {
    document.getElementById('import-file-input').click();
}

function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (!data.data) {
                throw new Error('Invalid backup file format');
            }
            
            const confirmed = confirm(
                '⚠️ Import Progress\n\n' +
                'This will REPLACE your current progress with the backup data.\n' +
                `Backup date: ${new Date(data.exportDate).toLocaleString()}\n\n` +
                'Are you sure you want to continue?'
            );
            
            if (!confirmed) {
                event.target.value = '';
                return;
            }
            
            // Restore all data
            if (data.data) {
                Object.entries(data.data).forEach(([key, value]) => {
                    if (value !== null) {
                        localStorage.setItem(key, value);
                    }
                });
            }
            
            // Restore notes if new format, or separate import
            if (data.notes) {
                problemNotes = data.notes;
                saveNotesState();
            }
            
            // Restore history
            if (data.data && data.data['leetcode-tracker-history']) {
                // If parsing string fails, regular restore below handles it? No, history is object.
                // The loop above restored it to localStorage string. We need to load it to memory.
                loadHistory(); 
            } else if (data.history) {
                 // Future proof if we move history out of data blob
                 problemHistory = data.history;
                 saveHistory();
            }

            if (data.theme) {
                localStorage.setItem('leetcode-tracker-theme', data.theme);
            }
            
            // Reload the page to apply changes
            showToast('✅ Progress imported! Reloading...');
            setTimeout(() => {
                location.reload();
            }, 1000);
            
        } catch (err) {
            console.error('Import failed:', err);
            showToast('❌ Import failed. Invalid file format.');
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
}

// ===== Note Modal Functions =====
function openNoteModal(problemId) {
    const modal = document.getElementById('note-modal');
    const textarea = document.getElementById('note-textarea');
    const problemIdInput = document.getElementById('note-problem-id');
    const title = document.getElementById('note-modal-title');
    
    // Find problem name for title
    let problemName = 'Problem Note';
    
    // Search in roadmap categories
    const allCategories = getAllCategories();
    for (const cat of allCategories) {
        const p = cat.problems.find(p => String(p.id) === String(problemId));
        if (p) {
            problemName = p.name;
            break;
        }
    }
    
    // Search in MAANG categories if not found
    if (problemName === 'Problem Note' && typeof maangCategoriesData !== 'undefined') {
        for (const cat of maangCategoriesData) {
            const p = cat.problems.find(p => String(p.id) === String(problemId));
            if (p) {
                problemName = p.name;
                break;
            }
        }
    }
    
    title.textContent = `Note: ${problemName}`;
    problemIdInput.value = problemId;
    textarea.value = problemNotes[problemId] || '';
    
    modal.classList.remove('hidden');
    textarea.focus();
}

function closeNoteModal() {
    document.getElementById('note-modal').classList.add('hidden');
}

function saveNote() {
    const problemId = document.getElementById('note-problem-id').value;
    const noteContent = document.getElementById('note-textarea').value;
    
    if (noteContent.trim()) {
        problemNotes[problemId] = noteContent;
    } else {
        delete problemNotes[problemId];
    }
    
    saveNotesState();
    
    // Re-render to update the note icon
    if (currentTab === 'maang') {
        renderMaangCategories();
    } else {
        renderCategories();
    }
    
    closeNoteModal();
    showToast('Note saved successfully!');
}

// ===== Fun Mode: Questionnaire (REMOVED) =====
// First-time questionnaire has been removed - website now opens directly

// ===== Tab Switching =====
// Duplicate switchTab removed

// ===== Leaderboard =====
let leaderboardData = [];

async function fetchLeaderboard() {
    const loadingEl = document.getElementById('leaderboard-loading');
    const tableEl = document.getElementById('leaderboard-table');
    const emptyEl = document.getElementById('leaderboard-empty');
    
    // Show loading
    loadingEl.classList.remove('hidden');
    tableEl.classList.add('hidden');
    emptyEl.classList.add('hidden');
    
    try {
        const response = await fetch('/api/leaderboard?forceRefresh=true');
        
        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard');
        }
        
        const data = await response.json();
        leaderboardData = data.leaderboard || [];
        
        renderLeaderboard();
    } catch (error) {
        console.error('Leaderboard error:', error);
        loadingEl.classList.add('hidden');
        emptyEl.classList.remove('hidden');
        emptyEl.querySelector('p').textContent = '❌ Failed to load leaderboard. Please try again.';
    }
}

function renderLeaderboard() {
    const loadingEl = document.getElementById('leaderboard-loading');
    const tableEl = document.getElementById('leaderboard-table');
    const emptyEl = document.getElementById('leaderboard-empty');
    const rowsContainer = document.getElementById('leaderboard-rows');
    
    loadingEl.classList.add('hidden');
    
    if (leaderboardData.length === 0) {
        emptyEl.classList.remove('hidden');
        return;
    }
    
    tableEl.classList.remove('hidden');
    
    // Get current user ID
    const currentUserId = authService.getUserId();
    
    // Find max total for progress bar
    const maxTotal = Math.max(...leaderboardData.map(u => u.totalSolved), 1);
    
    // Generate rows
    rowsContainer.innerHTML = leaderboardData.map(user => {
        const isCurrentUser = currentUserId && user.userId === currentUserId;
        const rankDisplay = getRankDisplay(user.rank);
        const initial = user.userId.charAt(0).toUpperCase();
        const progressPercent = (user.totalSolved / maxTotal) * 100;
        
        return `
            <div class="leaderboard-row ${isCurrentUser ? 'current-user' : ''}">
                <span class="rank-col">${rankDisplay}</span>
                <span class="user-col">
                    <div class="user-avatar-leaderboard">${initial}</div>
                    <span class="user-name-leaderboard">
                        ${user.userId}
                        ${isCurrentUser ? '<span class="you-badge">YOU</span>' : ''}
                    </span>
                </span>
                <span class="easy-col">${user.easyCount}</span>
                <span class="medium-col">${user.mediumCount}</span>
                <span class="hard-col">${user.hardCount}</span>
                <span class="total-col">
                    ${user.totalSolved}
                    <div class="total-bar">
                        <div class="total-bar-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </span>
            </div>
        `;
    }).join('');
}

function getRankDisplay(rank) {
    if (rank === 1) return '<span class="rank-badge rank-1">🥇</span>';
    if (rank === 2) return '<span class="rank-badge rank-2">🥈</span>';
    if (rank === 3) return '<span class="rank-badge rank-3">🥉</span>';
    return `#${rank}`;
}

// ===== SRS Render Logic =====

function getDueReviewsCount() {
    const now = new Date();
    let count = 0;
    Object.keys(spacedRepetition).forEach(id => {
        // Check if problem is still marked as completed (same logic as renderReviewTab)
        const isCompleted = completedProblems.has(String(id)) || 
                           completedProblems.has(Number(id)) || 
                           maangCompletedProblems.has(String(id)) || 
                           maangCompletedProblems.has(Number(id));
        
        if (!isCompleted) return;
        
        const item = spacedRepetition[id];
        if (new Date(item.nextReview) <= now) count++;
    });
    return count;
}

function getProblemDetails(problemId) {
    // Check Roadmap
    const allCategories = getAllCategories();
    for (const cat of allCategories) {
        const p = cat.problems.find(p => String(p.id) === String(problemId));
        if (p) return { ...p, category: cat.title, type: 'roadmap' };
    }
    // Check MAANG
    if (typeof maangCategoriesData !== 'undefined') {
        for (const cat of maangCategoriesData) {
            const p = cat.problems.find(p => String(p.id) === String(problemId));
            if (p) return { ...p, category: cat.title, type: 'maang' };
        }
    }
    // Check Custom
    // (Helper: Iterate values of customProblems)
    for (const catId in customProblems) {
        const p = customProblems[catId].find(p => String(p.id) === String(problemId));
        if (p) return { ...p, category: 'Custom', type: 'roadmap' }; // Treat as roadmap for now
    }
    return null;
}

function renderReviewTab() {
    const container = document.getElementById('review-list');
    const emptyState = document.getElementById('review-empty');
    const allDoneState = document.getElementById('review-all-done');
    const dueCountEl = document.getElementById('due-count');
    const overdueCountEl = document.getElementById('overdue-count');
    
    if (!container) return;
    
    const now = new Date();
    const reviews = [];
    let overdueCount = 0;
    
    // Collect due reviews
    Object.keys(spacedRepetition).forEach(id => {
        // Strict consistency check
        const isCompleted = completedProblems.has(String(id)) || 
                           completedProblems.has(Number(id)) || 
                           maangCompletedProblems.has(String(id)) || 
                           maangCompletedProblems.has(Number(id));
                           
        if (!isCompleted) return; 

        const item = spacedRepetition[id];
        const nextReview = new Date(item.nextReview);
        
        if (nextReview <= now) {
            const details = getProblemDetails(id);
            if (details) {
                reviews.push({ ...item, ...details, id });
                if (nextReview < new Date(now.getTime() - 86400000)) overdueCount++;
            }
        }
    });

    // Update stats
    if (dueCountEl) dueCountEl.textContent = reviews.length;
    if (overdueCountEl) overdueCountEl.textContent = overdueCount;
    
    // Sort: Overdue (oldest nextReview) first
    reviews.sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview));
    
    container.innerHTML = '';
    
    if (reviews.length === 0) {
        container.classList.add('hidden');
        const hasAnySRS = Object.keys(spacedRepetition).length > 0;
        if (hasAnySRS) {
            allDoneState.classList.remove('hidden');
            emptyState.classList.add('hidden');
        } else {
            emptyState.classList.remove('hidden');
            allDoneState.classList.add('hidden');
        }
    } else {
        container.classList.remove('hidden');
        emptyState.classList.add('hidden');
        allDoneState.classList.add('hidden');
        
        container.innerHTML = reviews.map(p => {
            const isOverdue = new Date(p.nextReview) < new Date(now.getTime() - 86400000);
            const difficultyClass = `difficulty-${p.difficulty.toLowerCase()}`;
            
            return `
                <div class="review-card ${isOverdue ? 'overdue' : ''}">
                    <div class="review-card-header">
                        <span class="review-title">${p.name}</span>
                        <span class="difficulty-badge ${difficultyClass}">${p.difficulty}</span>
                    </div>
                    <div class="review-meta">
                        <span class="review-interval">Stage ${p.stage}</span>
                        <span>•</span>
                        <span>Due: ${new Date(p.nextReview).toLocaleDateString()}</span>
                    </div>
                    <div class="review-actions">
                        <a href="${p.leetcodeUrl}" target="_blank" class="button btn-review-link">Solve</a>
                        <button class="btn-review-done" onclick="handleReview('${p.id}')">Mark Reviewed</button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// ===== Patterns Tab Logic (3-Level: Topics → Patterns → Problems) =====

let patternsReorderMode = false;
let customPatternsSections = []; // User-created main sections
let customPatternsSubSections = {}; // User-created sub-sections per main section
let patternsTopicOrder = []; // Array of topic IDs to control display order

function renderPatternsTab() {
    const grid = document.getElementById('patterns-categories-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Add Reorder Toggle Button
    let reorderBtn = document.getElementById('patterns-reorder-toggle-btn');
    if (!reorderBtn) {
        const controls = document.createElement('div');
        controls.className = 'controls-bar';
        controls.style.marginBottom = '16px';
        controls.style.display = 'flex';
        controls.style.justifyContent = 'flex-end';
        
        controls.innerHTML = `
            <button id="patterns-reorder-toggle-btn" class="btn-secondary" onclick="togglePatternsReorderMode()">
                <span>⇅ Reorder Sections</span>
            </button>
        `;
        
        grid.parentNode.insertBefore(controls, grid);
        reorderBtn = document.getElementById('patterns-reorder-toggle-btn');
    }
    
    // Update button state
    reorderBtn.innerHTML = patternsReorderMode 
        ? '<span>✓ Done Reordering</span>' 
        : '<span>⇅ Reorder Sections</span>';
    reorderBtn.className = patternsReorderMode ? 'btn-primary' : 'btn-secondary';
    
    // Combine static and custom main sections
    let allTopics = [...patternsData, ...customPatternsSections];
    
    // Apply custom order if exists
    if (patternsTopicOrder.length > 0) {
        allTopics = allTopics.sort((a, b) => {
            const indexA = patternsTopicOrder.indexOf(a.id);
            const indexB = patternsTopicOrder.indexOf(b.id);
            // Items not in order array go to end
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    }
    
    allTopics.forEach((topic, index) => {
        const isExpanded = patternsExpandedCategories.has(topic.id);
        const progress = getTopicProgress(topic);
        
        // Drag attributes for reorder mode
        const dragAttrs = patternsReorderMode ? `
            draggable="true" 
            ondragstart="handlePatternsDragStart(event, '${topic.id}')"
            ondragover="handlePatternsDragOver(event)" 
            ondrop="handlePatternsDrop(event, '${topic.id}')"
            style="cursor: move; border: 2px dashed var(--accent-primary);"
        ` : '';
        
        const card = document.createElement('div');
        card.className = `category-card ${isExpanded ? 'expanded' : ''}`;
        card.id = `pattern-topic-${topic.id}`;
        if (patternsReorderMode) {
            card.setAttribute('draggable', 'true');
            card.ondragstart = (e) => handlePatternsDragStart(e, topic.id);
            card.ondragover = handlePatternsDragOver;
            card.ondrop = (e) => handlePatternsDrop(e, topic.id);
            card.style.cursor = 'move';
            card.style.border = '2px dashed var(--accent-primary)';
        }
        
        // Header
        const header = document.createElement('div');
        header.className = 'category-header';
        header.onclick = (e) => {
            if (!e.target.closest('button') && !patternsReorderMode) {
                togglePatternTopic(topic.id);
            }
        };
        
        header.innerHTML = `
            <div class="category-info">
                ${patternsReorderMode ? '<div style="font-size: 1.5rem; margin-right:8px; cursor:move;">☰</div>' : `<div class="category-icon">${topic.icon || '🎯'}</div>`}
                <div class="category-details">
                    <h3 class="category-title">
                        ${topic.title}
                        ${topic.isCustom ? '<span class="section-custom-badge">Custom</span>' : ''}
                    </h3>
                    ${!patternsReorderMode ? `
                    <div class="category-progress-container">
                        <div class="category-progress-bar">
                            <div class="category-progress-fill" style="width: ${progress.percentage}%"></div>
                        </div>
                        <span class="category-progress-text">${progress.completed} / ${progress.total}</span>
                    </div>
                    ` : '<div style="font-size:0.8rem; color:var(--text-muted)">Drag to reorder</div>'}
                </div>
            </div>
            ${!patternsReorderMode ? `
                ${authService.isAuthenticated() ? `<button class="add-problem-btn" onclick="event.stopPropagation(); openAddPatternSubSectionModal('${topic.id}')" title="Add Pattern">+</button>` : ''}
                ${topic.isCustom && authService.isAuthenticated() && topic.createdBy === authService.getUserId() ? `<button class="delete-section-btn" onclick="event.stopPropagation(); deletePatternSection('${topic.id}')" title="Delete Section">🗑️</button>` : ''}
                <svg class="category-expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            ` : ''}
        `;
        
        card.appendChild(header);
        
        // Expanded content (Sub-Sections)
        if (isExpanded && !patternsReorderMode) {
            const body = document.createElement('div');
            body.className = 'problems-container';
            body.style.display = 'block';
            body.style.padding = '15px';
            
            // Get all sub-sections (static + custom)
            const customSubs = customPatternsSubSections[topic.id] || [];
            const allSubSections = [...(topic.subSections || []), ...customSubs];
            
            allSubSections.forEach(pattern => {
                const patternDiv = renderPatternSubSection(topic.id, pattern);
                body.appendChild(patternDiv);
            });
            
            card.appendChild(body);
        }
        
        grid.appendChild(card);
    });
}

function renderPatternSubSection(topicId, pattern) {
    const isExpanded = patternsExpandedSubCategories.has(pattern.id);
    const customProbs = customProblems[pattern.id] || [];
    const allProblems = [...(pattern.problems || []), ...customProbs];
    const completed = allProblems.filter(p => patternsCompletedProblems.has(p.id.toString())).length;
    const total = allProblems.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const container = document.createElement('div');
    container.className = `pattern-card ${isExpanded ? 'expanded' : ''}`;
    container.id = `pattern-card-${pattern.id}`;
    
    // Pattern Card Header - matching category-header style
    container.innerHTML = `
        <div class="pattern-card-header" onclick="togglePatternSubSection('${pattern.id}')">
            <div class="pattern-info">
                <div class="pattern-icon">📝</div>
                <div class="pattern-details">
                    <h4 class="pattern-title">
                        ${pattern.title}
                        ${pattern.isCustom ? '<span class="custom-badge">Custom</span>' : ''}
                    </h4>
                    <div class="pattern-progress-container">
                        <div class="pattern-progress-bar">
                            <div class="pattern-progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        <span class="pattern-progress-text">${completed} / ${total}</span>
                    </div>
                </div>
            </div>
            <div class="pattern-actions">
                ${authService.isAuthenticated() ? `<button class="add-problem-btn" onclick="event.stopPropagation(); openAddProblemModal('${pattern.id}')" title="Add Problem">+</button>` : ''}
                ${pattern.isCustom && authService.isAuthenticated() && pattern.createdBy === authService.getUserId() ? `<button class="delete-section-btn" onclick="event.stopPropagation(); deletePatternSubSection('${topicId}', '${pattern.id}')" title="Delete Pattern">🗑️</button>` : ''}
                <svg class="pattern-expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
        </div>
        <div class="pattern-problems-container">
            ${isExpanded ? renderPatternProblemsContent(pattern, allProblems) : ''}
        </div>
    `;
    
    return container;
}

function renderPatternProblemsContent(pattern, allProblems) {
    if (allProblems.length === 0) {
        return '<div class="empty-problems-message">No problems yet. Click "+" to add one.</div>';
    }
    
    return `
        <table class="problems-table">
            <thead>
                <tr>
                    <th>Problem</th>
                    <th>Difficulty</th>
                    <th>LeetCode</th>
                    <th>Score</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${allProblems.map(p => renderPatternProblemRow(p, pattern.id)).join('')}
            </tbody>
        </table>
    `;
}

function renderPatternProblemRow(problem, patternId) {
    const isCompleted = patternsCompletedProblems.has(problem.id.toString());
    const difficultyClass = `difficulty-${problem.difficulty.toLowerCase()}`;
    const isCustom = problem.isCustom === true;
    
    return `
        <tr>
            <td>
                <a href="${problem.leetcodeUrl}" target="_blank" class="problem-link problem-name">
                    ${problem.name}
                    ${isCustom ? '<span class="custom-badge">Custom</span>' : ''}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </a>
            </td>
            <td>
                <span class="difficulty-badge ${difficultyClass}">${problem.difficulty}</span>
            </td>
            <td>
                <a href="${problem.leetcodeUrl}" target="_blank" class="leetcode-link" title="Open on LeetCode">
                    <svg viewBox="0 0 24 24">
                        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                    </svg>
                </a>
            </td>
            <td>
                <span class="score-badge">${problem.score || '5/10'}</span>
            </td>
            <td>
                <div class="status-cell">
                    <input 
                        type="checkbox" 
                        class="status-checkbox" 
                        ${isCompleted ? 'checked' : ''} 
                        onchange="togglePatternProblem('${problem.id}', '${patternId}', this)"
                        aria-label="Mark ${problem.name} as ${isCompleted ? 'incomplete' : 'complete'}"
                    >
                    ${isCustom && authService.isAuthenticated() && problem.createdBy === authService.getUserId() ? `<button class="delete-btn" onclick="event.stopPropagation(); deletePatternProblem('${problem.id}', '${patternId}')" title="Delete Problem">🗑️</button>` : ''}
                </div>
            </td>
        </tr>
    `;
}

// ===== Toggle Functions =====
function togglePatternTopic(topicId) {
    if (patternsExpandedCategories.has(topicId)) {
        patternsExpandedCategories.delete(topicId);
    } else {
        patternsExpandedCategories.add(topicId);
    }
    renderPatternsTab();
}

function togglePatternSubSection(patternId) {
    if (patternsExpandedSubCategories.has(patternId)) {
        patternsExpandedSubCategories.delete(patternId);
    } else {
        patternsExpandedSubCategories.add(patternId);
    }
    renderPatternsTab();
}

// Helper to find pattern and its parent topic
function findPatternAndTopic(patternId) {
    if (typeof patternsData === 'undefined') return { pattern: null, topic: null };
    
    const allTopics = [...patternsData, ...customPatternsSections];
    for (const topic of allTopics) {
        const customSubs = customPatternsSubSections[topic.id] || [];
        const allSubs = [...(topic.subSections || []), ...customSubs];
        const pattern = allSubs.find(p => p.id === patternId);
        if (pattern) return { pattern, topic };
    }
    return { pattern: null, topic: null };
}

function updatePatternSubSectionProgress(patternId) {
    const { pattern } = findPatternAndTopic(patternId);
    if (!pattern) {
        console.error('[DEBUG] Pattern not found for ID', patternId);
        return;
    }

    const customProbs = customProblems[pattern.id] || [];
    const allProbs = [...(pattern.problems || []), ...customProbs];
    const total = allProbs.length;
    const completed = allProbs.filter(p => patternsCompletedProblems.has(p.id.toString())).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update Pattern Card Progress using direct DOM ID lookup
    const card = document.getElementById(`pattern-card-${pattern.id}`);
    if (card) {
        const fill = card.querySelector('.pattern-progress-fill');
        const text = card.querySelector('.pattern-progress-text');
        
        if (fill) fill.style.width = `${percentage}%`;
        if (text) text.textContent = `${completed} / ${total}`;
    }
}

function updatePatternTopicProgress(topicId) {
    const allTopics = [...patternsData, ...customPatternsSections];
    const topic = allTopics.find(t => t.id === topicId);
    if (!topic) return;

    const progress = getTopicProgress(topic);
    
    // Update Topic Card Progress using direct DOM ID lookup
    const card = document.getElementById(`pattern-topic-${topic.id}`);
    if (card) {
        const fill = card.querySelector('.category-progress-fill');
        const text = card.querySelector('.category-progress-text');
        if (fill) fill.style.width = `${progress.percentage}%`;
        if (text) text.textContent = `${progress.completed} / ${progress.total}`;
    }
}

function togglePatternProblem(problemId, patternId, checkboxEl) {
    const pid = problemId.toString();
    const isCompleting = !patternsCompletedProblems.has(pid);
    
    if (isCompleting) {
        patternsCompletedProblems.add(pid);
    } else {
        patternsCompletedProblems.delete(pid);
    }
    savePatternsState();
    
    // Find parent topic for the pattern
    const { topic } = findPatternAndTopic(patternId);
    
    // Update Pattern Level (subsection)
    updatePatternSubSectionProgress(patternId);
    
    // Update Topic Level (main section)
    if (topic) {
        updatePatternTopicProgress(topic.id);
    }
    
    // Update Global Level (Header)
    updatePatternsProgress();
    
    // Show confetti AFTER all progress updates (so animation doesn't block updates)
    if (isCompleting) {
        setTimeout(() => showConfetti(), 0);
    }
}

function togglePatternsReorderMode() {
    patternsReorderMode = !patternsReorderMode;
    renderPatternsTab();
}

// ===== Progress Calculation =====
function getTopicProgress(topic) {
    const customSubs = customPatternsSubSections[topic.id] || [];
    const allSubSections = [...(topic.subSections || []), ...customSubs];
    
    let total = 0;
    let completed = 0;
    
    allSubSections.forEach(pattern => {
        const customProbs = customProblems[pattern.id] || [];
        const allProbs = [...(pattern.problems || []), ...customProbs];
        total += allProbs.length;
        completed += allProbs.filter(p => patternsCompletedProblems.has(p.id.toString())).length;
    });
    
    return {
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
}

function updatePatternsProgress() {
    let total = 0;
    let completed = 0;
    
    const allTopics = [...patternsData, ...customPatternsSections];
    allTopics.forEach(topic => {
        const progress = getTopicProgress(topic);
        total += progress.total;
        completed += progress.completed;
    });
    
    const text = document.getElementById('patterns-progress-text');
    const fill = document.getElementById('patterns-progress-fill');
    
    if (text) text.textContent = `${completed} / ${total}`;
    if (fill) fill.style.width = `${total === 0 ? 0 : (completed / total) * 100}%`;
    
    // Update main tab count
    const tabCount = document.getElementById('patterns-count');
    if (tabCount) tabCount.textContent = `${completed}/${total}`;
}

// ===== CRUD: Add Main Section =====
function openAddPatternSectionModal() {
    openAddSectionModal(); // Reuse existing modal
}

// ===== CRUD: Add Sub-Section (Pattern) =====
function openAddPatternSubSectionModal(topicId) {
    document.getElementById('add-sub-section-modal').classList.remove('hidden');
    document.getElementById('parent-section-id').value = topicId;
    document.getElementById('sub-section-title').value = '';
}

function handleAddSubSection(event) {
    event.preventDefault();
    const parentId = document.getElementById('parent-section-id').value;
    const title = document.getElementById('sub-section-title').value.trim();
    
    if (!title) return;
    
    const newPattern = {
        id: `custom-pattern-${Date.now()}`,
        title: title,
        problems: [],
        isCustom: true,
        createdBy: authService.isAuthenticated() ? authService.getUserId() : null
    };
    
    if (!customPatternsSubSections[parentId]) {
        customPatternsSubSections[parentId] = [];
    }
    customPatternsSubSections[parentId].push(newPattern);
    
    savePatternsCRUD();
    patternsExpandedCategories.add(parentId);
    renderPatternsTab();
    updatePatternsProgress();
    closeAddSubSectionModal();
    showToast(`Pattern "${title}" added successfully!`);
}

function closeAddSubSectionModal() {
    document.getElementById('add-sub-section-modal').classList.add('hidden');
}

// ===== Custom Confirm Modal =====
let confirmCallback = null;

function showConfirmModal(title, message, buttonText, callback) {
    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-message').textContent = message;
    document.getElementById('confirm-modal-btn').textContent = buttonText || 'Delete';
    confirmCallback = callback;
    document.getElementById('confirm-modal').classList.remove('hidden');
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.add('hidden');
    confirmCallback = null;
}

function executeConfirmAction() {
    if (confirmCallback) {
        confirmCallback();
    }
    closeConfirmModal();
}

// ===== CRUD: Create Main Section =====
function openAddPatternSectionModal() {
    document.getElementById('add-section-modal').classList.remove('hidden');
    document.getElementById('section-title').value = '';
    document.getElementById('section-icon').value = '🎯';
    // Set a flag to indicate we're adding a pattern section
    document.getElementById('add-section-form').dataset.isPattern = 'true';
}

// ===== CRUD: Delete =====
function deletePatternSection(topicId) {
    showConfirmModal(
        '⚠️ Delete Topic',
        'Delete this entire topic and all its patterns? This action cannot be undone.',
        'Delete Topic',
        () => {
            customPatternsSections = customPatternsSections.filter(s => s.id !== topicId);
            delete customPatternsSubSections[topicId];
            
            // Delete from shared API
            if (authService.isAuthenticated() && typeof sharedPatternsAPI !== 'undefined') {
                sharedPatternsAPI.delete(topicId).catch(err => console.error('Failed to delete from shared API:', err));
            }
            
            savePatternsCRUD();
            renderPatternsTab();
            updatePatternsProgress();
            showToast('Topic deleted successfully');
        }
    );
}

function deletePatternSubSection(topicId, patternId) {
    showConfirmModal(
        '⚠️ Delete Pattern',
        'Delete this pattern and all its problems? This action cannot be undone.',
        'Delete Pattern',
        () => {
            if (customPatternsSubSections[topicId]) {
                customPatternsSubSections[topicId] = customPatternsSubSections[topicId].filter(p => p.id !== patternId);
            }
            
            // Also delete any custom problems for this pattern
            delete customProblems[patternId];
            
            savePatternsCRUD();
            saveCustomProblems();
            renderPatternsTab();
            updatePatternsProgress();
            showToast('Pattern deleted successfully');
        }
    );
}

function deletePatternProblem(problemId, patternId) {
    showConfirmModal(
        '⚠️ Delete Problem',
        'Are you sure you want to delete this problem?',
        'Delete',
        () => {
            if (customProblems[patternId]) {
                customProblems[patternId] = customProblems[patternId].filter(p => p.id.toString() !== problemId.toString());
                saveCustomProblems();
                renderPatternsTab();
                updatePatternsProgress();
                showToast('Problem deleted successfully');
            }
        }
    );
}

// ===== Drag & Drop for Reorder =====
let patternsDraggedItemId = null;

function handlePatternsDragStart(e, id) {
    patternsDraggedItemId = id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    e.target.style.opacity = '0.4';
}

function handlePatternsDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handlePatternsDrop(e, targetId) {
    if (e.stopPropagation) e.stopPropagation();
    
    if (!patternsDraggedItemId || patternsDraggedItemId === targetId) {
        patternsDraggedItemId = null;
        return false;
    }
    
    // Get all topics and build order array if not exists
    const allTopics = [...patternsData, ...customPatternsSections];
    if (patternsTopicOrder.length === 0) {
        patternsTopicOrder = allTopics.map(t => t.id);
    }
    
    // Find positions
    const draggedIndex = patternsTopicOrder.indexOf(patternsDraggedItemId);
    const targetIndex = patternsTopicOrder.indexOf(targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
        patternsDraggedItemId = null;
        return false;
    }
    
    // Remove dragged item and insert at target position
    patternsTopicOrder.splice(draggedIndex, 1);
    patternsTopicOrder.splice(targetIndex, 0, patternsDraggedItemId);
    
    // Save order to localStorage
    savePatternsTopicOrder();
    
    // Re-render
    renderPatternsTab();
    
    patternsDraggedItemId = null;
    showToast('Sections reordered!');
    return false;
}

function savePatternsTopicOrder() {
    try {
        localStorage.setItem('leetcode-tracker-patterns-order', JSON.stringify(patternsTopicOrder));
        
        // Cloud sync
        if (typeof authService !== 'undefined' && authService.isAuthenticated()) {
            const data = dataSync.collectLocalProgress();
            dataSync.debouncedSave(authService.getUserId(), data);
        }
    } catch (e) {
        console.error('Failed to save patterns order:', e);
    }
}

function loadPatternsTopicOrder() {
    try {
        const saved = localStorage.getItem('leetcode-tracker-patterns-order');
        if (saved) {
            patternsTopicOrder = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load patterns order:', e);
    }
}

// Load globally shared patterns from API
async function loadSharedPatternsContent() {
    try {
        if (typeof sharedPatternsAPI === 'undefined') {
            console.warn('sharedPatternsAPI not available');
            return;
        }
        
        sharedPatternsContent = await sharedPatternsAPI.getAll();
        
        // Merge shared content into local custom arrays
        if (sharedPatternsContent && sharedPatternsContent.length > 0) {
            sharedPatternsContent.forEach(item => {
                if (item.type === 'topic') {
                    // Add to customPatternsSections if not already there
                    const exists = customPatternsSections.some(s => s.id === item.id);
                    if (!exists) {
                        customPatternsSections.push({
                            id: item.id,
                            title: item.title,
                            icon: item.data.icon || '🎯',
                            subSections: item.data.subSections || [],
                            isCustom: true,
                            isShared: true,
                            createdBy: item.createdBy
                        });
                    }
                } else if (item.type === 'pattern') {
                    // Add to customPatternsSubSections
                    const parentId = item.parentId;
                    if (parentId) {
                        if (!customPatternsSubSections[parentId]) {
                            customPatternsSubSections[parentId] = [];
                        }
                        const exists = customPatternsSubSections[parentId].some(s => s.id === item.id);
                        if (!exists) {
                            customPatternsSubSections[parentId].push({
                                id: item.id,
                                title: item.title,
                                problems: item.data.problems || [],
                                isCustom: true,
                                isShared: true,
                                createdBy: item.createdBy
                            });
                        }
                    }
                } else if (item.type === 'problem') {
                    // Add to customProblems
                    const patternId = item.parentId;
                    if (patternId) {
                        if (!customProblems[patternId]) {
                            customProblems[patternId] = [];
                        }
                        const exists = customProblems[patternId].some(p => p.id === item.id);
                        if (!exists) {
                            customProblems[patternId].push({
                                id: item.id,
                                name: item.title,
                                difficulty: item.data.difficulty || 'Medium',
                                leetcodeUrl: item.data.leetcodeUrl || '#',
                                score: item.data.score || '5/10',
                                isCustom: true,
                                isShared: true,
                                createdBy: item.createdBy
                            });
                        }
                    }
                }
            });
            
            // Re-render if patterns tab is active
            if (currentTab === 'patterns') {
                renderPatternsTab();
            }
        }
    } catch (error) {
        console.error('Failed to load shared patterns:', error);
    }
}

// ===== State Management =====
function loadPatternsState() {
    try {
        const saved = localStorage.getItem('leetcode-tracker-patterns-completed');
        if (saved) {
            patternsCompletedProblems = new Set(JSON.parse(saved));
        }
        
        const savedExpanded = localStorage.getItem('leetcode-tracker-patterns-expanded');
        if (savedExpanded) {
            patternsExpandedCategories = new Set(JSON.parse(savedExpanded));
        }
        
        const savedSubExpanded = localStorage.getItem('leetcode-tracker-patterns-sub-expanded');
        if (savedSubExpanded) {
            patternsExpandedSubCategories = new Set(JSON.parse(savedSubExpanded));
        }
        
        // Load custom sections and sub-sections
        const savedCustomSections = localStorage.getItem('leetcode-tracker-patterns-custom-sections');
        if (savedCustomSections) {
            customPatternsSections = JSON.parse(savedCustomSections);
        }
        
        const savedCustomSubSections = localStorage.getItem('leetcode-tracker-patterns-custom-subsections');
        if (savedCustomSubSections) {
            customPatternsSubSections = JSON.parse(savedCustomSubSections);
        }
    } catch (e) {
        console.error('Failed to load patterns state:', e);
    }
}

function savePatternsState() {
    try {
        localStorage.setItem('leetcode-tracker-patterns-completed', JSON.stringify([...patternsCompletedProblems]));
        localStorage.setItem('leetcode-tracker-patterns-expanded', JSON.stringify([...patternsExpandedCategories]));
        localStorage.setItem('leetcode-tracker-patterns-sub-expanded', JSON.stringify([...patternsExpandedSubCategories]));
        
        // Cloud sync
        if (typeof authService !== 'undefined' && authService.isAuthenticated()) {
            const data = dataSync.collectLocalProgress();
            dataSync.debouncedSave(authService.getUserId(), data);
        }
    } catch (e) {
        console.error('Failed to save patterns state:', e);
    }
}

function savePatternsCRUD() {
    localStorage.setItem('leetcode-tracker-patterns-custom-sections', JSON.stringify(customPatternsSections));
    localStorage.setItem('leetcode-tracker-patterns-custom-subsections', JSON.stringify(customPatternsSubSections));
    
    if (typeof authService !== 'undefined' && authService.isAuthenticated()) {
        const data = dataSync.collectLocalProgress();
        dataSync.debouncedSave(authService.getUserId(), data);
    }
}

