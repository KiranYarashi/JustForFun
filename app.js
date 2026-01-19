// ===== App State =====
let completedProblems = new Set();
let maangCompletedProblems = new Set(); // Separate state for MAANG
let expandedCategories = new Set();
let maangExpandedCategories = new Set(); // Separate for MAANG
let customProblems = {}; // Store custom problems per category
let problemNotes = {}; // Store notes per problemId
let problemHistory = {}; // Store completion timestamps
let customSections = []; // Store custom sections/categories
let currentTab = 'roadmap'; // Current active tab
let categoryOrder = []; // Store order of category IDs
let isReorderMode = false; // Toggle for reordering UI

// ===== Initialize App =====
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
                        loadCustomProblems();
                        loadCustomSections();
                        loadNotes();
                        loadHistory();
                        loadCategoryOrder(); // Load order
                        renderCategories();
                        renderMaangCategories();
                        updateAllTrackers();
                        updateTabCounts();
                    });
                }
            }
        });

        loadState();
        loadMaangState();
        loadCustomProblems();
        loadCustomSections();
        loadNotes();
        loadHistory();
        loadCategoryOrder(); // Load order
        renderCategories();
        renderMaangCategories();
        updateAllTrackers();
        updateTabCounts();
        checkCookieConsent();
        checkFirstTimeUser();
        
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
    } catch (error) {
        console.error("Initialization Error:", error);
    } finally {
        // Show Splash Screen on load (if not in debug/fast mode)
        // Ensures it runs even if init fails
        showSplashScreen();
    }
});

// ===== Splash Screen Logic =====
function showSplashScreen() {
    const splash = document.getElementById('splash-screen');
    const quoteEl = document.getElementById('splash-quote');
    
    // Developer Quotes
    const quotes = [
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
        "Deleting production database in 3... 2... 1...",
        "Manager: 'Just a small change.' Narrator: 'It was not.'",
        "Converting caffeine into anxiety and code.",
        "CSS is awesome! *Table flip*",
        "My code is garbage, but it runs. DO NOT TOUCH IT.",
        "How do I exit Vim? Send help.",
        "Simulating productivity until 5 PM...",
        "Deploying on Friday? You brave soul.",
        "Walking into the daily standup like 🧟",
        "Zero days since last merge conflict.",
        "Real programmers count from 0.",
        "Sudo make me a sandwich."
    ];
    
    if (quoteEl) {
        quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    }
    
    // Hide after total time (approx 3-4s)
    setTimeout(() => {
        splash.classList.add('hidden');
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
    updateAuthModalUI();
}

function updateAuthModalUI() {
    const title = document.getElementById('auth-modal-title');
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleLogin = document.getElementById('auth-toggle-login');
    const toggleRegister = document.getElementById('auth-toggle-register');
    const errorMsg = document.getElementById('auth-error-msg');

    errorMsg.classList.add('hidden');

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
            
            location.reload(); 
        }

    } catch (error) {
        console.error('Auth error:', error);
        showAuthError(error.message || 'Authentication failed');
        submitBtn.disabled = false;
        updateAuthModalUI(); // Reset button text
    }
}

// Sarcastic error messages for auth failures
const authErrorRoasts = [
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
    "Error 401: User is sus."
];

function showAuthError(msg) {
    const el = document.getElementById('auth-error-msg');
    if (msg) {
        // Add a sarcastic twist to the error
        const roast = authErrorRoasts[Math.floor(Math.random() * authErrorRoasts.length)];
        el.innerHTML = `<strong>${msg}</strong><br><span style="font-size: 0.85em; opacity: 0.8;">${roast}</span>`;
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

async function handleLogout() {
    try {
        await authService.logout();
    } catch (error) {
        console.error('Logout error:', error);
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

// ===== Progress Tracker Updates =====
function updateAllTrackers() {
    updateRoadmapTracker();
    updateMaangTracker();
    updateTabCounts();
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
        categoryId: categoryId // Store category ID in problem for easier deletion
    };
    
    // Add to custom problems
    if (!customProblems[categoryId]) {
        customProblems[categoryId] = [];
    }
    customProblems[categoryId].push(newProblem);
    
    // Save and re-render
    saveCustomProblems();
    
    // Keep category expanded
    expandedCategories.add(categoryId);
    
    renderCategories();
    updateAllTrackers();
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
    
    // Create new section
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
    const currentTab = document.querySelector('.tab-btn.active').dataset.tab;
    if (tabId === currentTab) return;

    // Show Meme Overlay
    const meme = getNextMeme();
    const overlay = document.getElementById('meme-overlay');
    const img = document.getElementById('meme-image');
    const txt = document.getElementById('meme-text');
    
    // Set content
    img.src = meme.src;
    txt.textContent = meme.text;
    
    // Show
    overlay.classList.remove('hidden');
    
    // Wait 1.5 seconds (Reduced from 3s)
    setTimeout(() => {
        overlay.classList.add('hidden');
        
        // Actually switch tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`${tabId}-content`).classList.add('active');
        
        // If switching to Analytics, render charts
        if (tabId === 'analytics') {
            renderAnalytics();
        }
    }, 1500);
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
function renderAnalytics() {
    // 1. Calculate Stats
    let totalSolved = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    
    const allProblemsMap = new Map(); // id -> problem object
    
    // Helper to process problems
    const processProblem = (p) => {
        allProblemsMap.set(String(p.id), p);
    };
    
    getAllCategories().forEach(c => c.problems.forEach(processProblem));
    if (typeof maangCategoriesData !== 'undefined') {
        maangCategoriesData.forEach(c => c.problems.forEach(processProblem));
    }
    
    // Count distinct solved problems from both trackers
    const allSolvedIds = new Set([...completedProblems, ...maangCompletedProblems]);
    
    allSolvedIds.forEach(id => {
        const p = allProblemsMap.get(String(id));
        if (p) {
            totalSolved++;
            if (p.difficulty === 'Easy') easySolved++;
            else if (p.difficulty === 'Medium') mediumSolved++;
            else if (p.difficulty === 'Hard') hardSolved++;
        }
    });

    // Update Cards
    document.getElementById('stats-total').textContent = totalSolved;
    document.getElementById('stats-easy').textContent = easySolved;
    document.getElementById('stats-medium').textContent = mediumSolved;
    document.getElementById('stats-hard').textContent = hardSolved;

    // 2. Render SVG Donut Chart
    const total = totalSolved || 1; 
    
    // Update center text
    const totalTextEl = document.getElementById('chart-total-text');
    if (totalTextEl) totalTextEl.textContent = totalSolved;
    
    // Calculate segments
    // Circumference C = 100 (due to radius 15.9155)
    
    const pctEasy = (easySolved / total) * 100;
    const pctMedium = (mediumSolved / total) * 100;
    const pctHard = (hardSolved / total) * 100;
    
    const easySegment = document.querySelector('.easy-segment');
    const mediumSegment = document.querySelector('.medium-segment');
    const hardSegment = document.querySelector('.hard-segment');
    
    if (easySegment) {
        easySegment.setAttribute('stroke-dasharray', `${pctEasy}, 100`);
        easySegment.style.transform = `rotate(-90deg)`;
        easySegment.setAttribute('data-count', easySolved);
        easySegment.setAttribute('data-label', 'Easy');
    }
    
    if (mediumSegment) {
        mediumSegment.setAttribute('stroke-dasharray', `${pctMedium}, 100`);
        const rot = -90 + (pctEasy / 100 * 360);
        mediumSegment.style.transform = `rotate(${rot}deg)`;
        mediumSegment.setAttribute('data-count', mediumSolved);
        mediumSegment.setAttribute('data-label', 'Medium');
    }
    
    if (hardSegment) {
        hardSegment.setAttribute('stroke-dasharray', `${pctHard}, 100`);
        const rot = -90 + ((pctEasy + pctMedium) / 100 * 360);
        hardSegment.style.transform = `rotate(${rot}deg)`;
        hardSegment.setAttribute('data-count', hardSolved);
        hardSegment.setAttribute('data-label', 'Hard');
    }

    // Add Hover Interactivity (One-time setup check)
    if (!document.querySelector('.circular-chart').hasAttribute('data-interactive')) {
        const chart = document.querySelector('.circular-chart');
        chart.setAttribute('data-interactive', 'true');
        
        const resetChartText = () => {
            document.getElementById('chart-total-text').textContent = document.getElementById('stats-total').textContent;
            document.querySelector('.chart-subtext').textContent = 'Solved';
            document.getElementById('chart-total-text').style.fill = 'var(--text-primary)';
        };
        
        const updateChartText = (evt) => {
            const segment = evt.target;
            if (segment.classList.contains('circle-segment')) {
                const count = segment.getAttribute('data-count');
                const label = segment.getAttribute('data-label');
                document.getElementById('chart-total-text').textContent = count;
                document.querySelector('.chart-subtext').textContent = label;
                
                // Optional: Change color to match segment
                const color = getComputedStyle(segment).stroke;
                document.getElementById('chart-total-text').style.fill = color;
            }
        };

        chart.addEventListener('mouseover', updateChartText);
        chart.addEventListener('mouseout', resetChartText);
    }
    
    // Update Legend
    const legend = document.getElementById('difficulty-legend');
    legend.innerHTML = `
        <div class="legend-item"><span class="legend-color" style="background: var(--difficulty-easy)"></span>Easy (${easySolved})</div>
        <div class="legend-item"><span class="legend-color" style="background: var(--difficulty-medium)"></span>Medium (${mediumSolved})</div>
        <div class="legend-item"><span class="legend-color" style="background: var(--difficulty-hard)"></span>Hard (${hardSolved})</div>
    `;

    // 3. Render Heatmap (Monthly View)
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

// ===== Fun Mode: Questionnaire =====
const funQuestions = [
    { q: "Are you 18+? (We show naked code here)", a: true },
    { q: "Are you a Corporate Slave?", a: true },
    { q: "Do you dream in LeetCode Hard?", a: true },
    { q: "Is your social life 404 Not Found?", a: true },
    { q: "Ready to cry?", a: true }
];
let funQIndex = 0;

function checkFirstTimeUser() {
    if (!localStorage.getItem('leetcode-fun-intro-done')) {
        const modal = document.getElementById('fun-intro-modal');
        if (modal) {
            modal.classList.remove('hidden');
            showFunQuestion();
            
            document.getElementById('fun-yes-btn').onclick = () => nextFunQuestion(true);
            document.getElementById('fun-no-btn').onclick = () => nextFunQuestion(false);
        }
    }
}

function showFunQuestion() {
    const q = funQuestions[funQIndex];
    const textEl = document.getElementById('fun-question-text');
    if (textEl) textEl.textContent = q.q;
}

function nextFunQuestion(answer) {
    funQIndex++;
    if (funQIndex < funQuestions.length) {
        showFunQuestion();
    } else {
        localStorage.setItem('leetcode-fun-intro-done', 'true');
        document.getElementById('fun-intro-modal').classList.add('hidden');
    }
}
