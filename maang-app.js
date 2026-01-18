// ===== MAANG App State =====
let completedProblems = new Set();
let expandedCategories = new Set();

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    renderCategories();
    updateGlobalProgress();
    initTheme();
});

// ===== State Management =====
function loadState() {
    try {
        const saved = localStorage.getItem('maang-tracker-completed');
        if (saved) {
            completedProblems = new Set(JSON.parse(saved));
        }
    } catch (e) {
        console.error('Failed to load state:', e);
    }
}

function saveState() {
    try {
        localStorage.setItem('maang-tracker-completed', JSON.stringify([...completedProblems]));
    } catch (e) {
        console.error('Failed to save state:', e);
    }
}

// ===== Theme Management =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ===== Progress Calculations =====
function getGlobalProgress() {
    const total = maangCategoriesData.reduce((sum, cat) => sum + cat.problems.length, 0);
    let completed = 0;
    maangCategoriesData.forEach(category => {
        category.problems.forEach(problem => {
            if (completedProblems.has(problem.id)) {
                completed++;
            }
        });
    });
    return {
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
}

function getCategoryProgress(categoryId) {
    const category = maangCategoriesData.find(c => c.id === categoryId);
    if (!category) return { total: 0, completed: 0, percentage: 0 };
    
    const total = category.problems.length;
    let completed = 0;
    
    category.problems.forEach(problem => {
        if (completedProblems.has(problem.id)) {
            completed++;
        }
    });
    
    return {
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
}

function updateGlobalProgress() {
    const progress = getGlobalProgress();
    document.getElementById('global-progress-text').textContent = 
        `${progress.completed} / ${progress.total}`;
    document.getElementById('progress-ring-fill').setAttribute(
        'stroke-dasharray', 
        `${progress.percentage}, 100`
    );
}

// ===== Render Categories =====
function renderCategories() {
    const grid = document.getElementById('categories-grid');
    grid.innerHTML = maangCategoriesData.map(category => renderCategoryCard(category)).join('');
}

function renderCategoryCard(category) {
    const progress = getCategoryProgress(category.id);
    const isExpanded = expandedCategories.has(category.id);
    
    return `
        <div id="category-${category.id}" class="category-card ${isExpanded ? 'expanded' : ''}">
            <div class="category-header" onclick="toggleCategory('${category.id}')">
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
                ${renderProblemsTable(category)}
            </div>
        </div>
    `;
}

function renderProblemsTable(category) {
    if (!category.problems || category.problems.length === 0) {
        return '<p class="no-problems">No problems in this category yet.</p>';
    }
    
    return `
        <table class="problems-table">
            <thead>
                <tr>
                    <th class="col-status">Status</th>
                    <th class="col-problem">Problem</th>
                    <th class="col-difficulty">Difficulty</th>
                    <th class="col-score">Score</th>
                </tr>
            </thead>
            <tbody>
                ${category.problems.map(problem => renderProblemRow(problem)).join('')}
            </tbody>
        </table>
    `;
}

function renderProblemRow(problem) {
    const isCompleted = completedProblems.has(problem.id);
    const difficultyClass = problem.difficulty.toLowerCase();
    
    return `
        <tr class="${isCompleted ? 'completed' : ''}">
            <td class="col-status">
                <label class="checkbox-container">
                    <input type="checkbox" 
                           ${isCompleted ? 'checked' : ''} 
                           onchange="toggleProblem(${problem.id})">
                    <span class="checkmark"></span>
                </label>
            </td>
            <td class="col-problem">
                <a href="${problem.leetcodeUrl}" target="_blank" rel="noopener noreferrer" class="problem-link">
                    ${problem.name}
                    <svg class="external-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </a>
            </td>
            <td class="col-difficulty">
                <span class="difficulty-badge ${difficultyClass}">${problem.difficulty}</span>
            </td>
            <td class="col-score">
                <span class="score-badge">${problem.score}</span>
            </td>
        </tr>
    `;
}

// ===== Category Toggle =====
function toggleCategory(categoryId) {
    if (expandedCategories.has(categoryId)) {
        expandedCategories.delete(categoryId);
    } else {
        expandedCategories.add(categoryId);
    }
    renderCategories();
}

// ===== Problem Toggle =====
function toggleProblem(problemId) {
    if (completedProblems.has(problemId)) {
        completedProblems.delete(problemId);
    } else {
        completedProblems.add(problemId);
        celebrateProblemComplete();
    }
    
    saveState();
    updateGlobalProgress();
    
    // Update the row styling without full re-render
    const category = maangCategoriesData.find(cat => 
        cat.problems.some(p => p.id === problemId)
    );
    if (category) {
        const progress = getCategoryProgress(category.id);
        const progressFill = document.querySelector(`#category-${category.id} .category-progress-fill`);
        const progressText = document.querySelector(`#category-${category.id} .category-progress-text`);
        
        if (progressFill) progressFill.style.width = `${progress.percentage}%`;
        if (progressText) progressText.textContent = `${progress.completed} / ${progress.total}`;
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

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Press 't' to toggle theme
    if (e.key === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
            toggleTheme();
        }
    }
    
    // Press Escape to collapse all categories
    if (e.key === 'Escape') {
        expandedCategories.clear();
        renderCategories();
    }
});

// ===== Export/Import Progress =====
function exportProgress() {
    const data = {
        completed: [...completedProblems],
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maang-progress.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importProgress(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.completed && Array.isArray(data.completed)) {
                completedProblems = new Set(data.completed);
                saveState();
                renderCategories();
                updateGlobalProgress();
                alert('Progress imported successfully!');
            }
        } catch (err) {
            console.error('Failed to import progress:', err);
            alert('Failed to import progress. Please check the file format.');
        }
    };
    reader.readAsText(file);
}
