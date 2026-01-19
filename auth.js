// ===== Authentication Service (Custom) =====
// Handles Custom Username/Password Authentication

class AuthService {
    constructor() {
        this.user = null;
        this.initialized = false;
        this.onAuthStateChange = null; // Callback
        this.baseUrl = '/api/auth';
    }

    /**
     * Initialize auth service (check local session)
     */
    async initialize() {
        const savedUser = localStorage.getItem('leetcode-tracker-user');
        if (savedUser) {
            try {
                this.user = JSON.parse(savedUser);
                console.log('Restored session for:', this.user.username);
            } catch (e) {
                console.error('Failed to parse saved user', e);
                localStorage.removeItem('leetcode-tracker-user');
            }
        }
        this.initialized = true;
        this.notifyAuthStateChange();
        return true;
    }

    /**
     * Login User
     */
    async login(username, password) {
        try {
            // Need to pass username in query for Azure Function binding
            const response = await fetch(`${this.baseUrl}/login?username=${encodeURIComponent(username)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                let errorMessage = 'Login failed';
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const err = await response.json();
                    errorMessage = err.error || errorMessage;
                } else {
                    const text = await response.text();
                    errorMessage = text || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            this.setSession(data);
            return this.user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Register User
     */
    async register(username, password) {
        try {
            const response = await fetch(`${this.baseUrl}/register?username=${encodeURIComponent(username)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                let errorMessage = 'Registration failed';
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const err = await response.json();
                    errorMessage = err.error || errorMessage;
                } else {
                    const text = await response.text();
                    errorMessage = text || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            this.setSession(data);
            return this.user;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    setSession(data) {
        this.user = {
            username: data.username,
            userId: data.userId, // In this case, same as username
            displayName: data.username
        };
        localStorage.setItem('leetcode-tracker-user', JSON.stringify(this.user));
        this.notifyAuthStateChange();
    }

    /**
     * Logout
     */
    async logout() {
        this.user = null;
        localStorage.removeItem('leetcode-tracker-user');
        this.notifyAuthStateChange();
    }

    /**
     * Get Access Token (Mock - removed MSAL)
     */
    async getAccessToken() {
        return null; // No bearer token needed for anonymous API functions
    }

    isAuthenticated() {
        return !!this.user;
    }

    getUserId() {
        return this.user?.userId || null;
    }

    getDisplayName() {
        return this.user?.displayName || 'User';
    }

    getInitials() {
        const name = this.getDisplayName();
        return name.substring(0, 2).toUpperCase();
    }

    setAuthStateChangeCallback(callback) {
        this.onAuthStateChange = callback;
    }

    notifyAuthStateChange() {
        if (this.onAuthStateChange) {
            this.onAuthStateChange(this.isAuthenticated(), this.user);
        }
    }
}

// Global instance
const authService = new AuthService();
