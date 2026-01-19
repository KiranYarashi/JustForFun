// ===== Authentication Service =====
// Handles Microsoft Entra ID authentication using MSAL.js

class AuthService {
    constructor() {
        this.msalInstance = null;
        this.account = null;
        this.initialized = false;
        this.onAuthStateChange = null; // Callback for auth state changes
    }

    /**
     * Initialize MSAL instance and check for existing sessions
     */
    async initialize() {
        if (!isAzureConfigured()) {
            console.warn('Azure AD not configured. Running in offline mode.');
            this.initialized = true;
            return false;
        }

        try {
            this.msalInstance = new msal.PublicClientApplication(msalConfig);
            await this.msalInstance.initialize();
            
            // Handle redirect response if any
            const response = await this.msalInstance.handleRedirectPromise();
            if (response) {
                this.account = response.account;
                this.notifyAuthStateChange();
            } else {
                // Check for existing accounts
                const accounts = this.msalInstance.getAllAccounts();
                if (accounts.length > 0) {
                    this.account = accounts[0];
                    this.notifyAuthStateChange();
                }
            }
            
            this.initialized = true;
            console.log('Auth service initialized', this.account ? 'with account' : 'no account');
            return true;
        } catch (error) {
            console.error('Failed to initialize auth service:', error);
            this.initialized = true;
            return false;
        }
    }

    /**
     * Sign in user with Microsoft popup
     */
    async login() {
        if (!this.msalInstance) {
            throw new Error('Auth service not initialized or Azure AD not configured');
        }

        try {
            const response = await this.msalInstance.loginPopup(loginRequest);
            this.account = response.account;
            this.notifyAuthStateChange();
            console.log('Login successful:', this.account.username);
            return this.account;
        } catch (error) {
            console.error('Login failed:', error);
            // Handle user cancelled login
            if (error.errorCode === 'user_cancelled') {
                throw new Error('Login cancelled by user');
            }
            throw error;
        }
    }

    /**
     * Sign in user with redirect (alternative to popup)
     */
    async loginRedirect() {
        if (!this.msalInstance) {
            throw new Error('Auth service not initialized');
        }
        await this.msalInstance.loginRedirect(loginRequest);
    }

    /**
     * Sign out user
     */
    async logout() {
        if (!this.msalInstance) {
            this.account = null;
            this.notifyAuthStateChange();
            return;
        }

        try {
            await this.msalInstance.logoutPopup({
                postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
                mainWindowRedirectUri: msalConfig.auth.postLogoutRedirectUri
            });
            this.account = null;
            this.notifyAuthStateChange();
        } catch (error) {
            console.error('Logout failed:', error);
            // Force clear account anyway
            this.account = null;
            this.notifyAuthStateChange();
        }
    }

    /**
     * Get access token for API calls
     */
    async getAccessToken() {
        if (!this.msalInstance || !this.account) {
            return null;
        }

        try {
            const response = await this.msalInstance.acquireTokenSilent({
                ...tokenRequest,
                account: this.account
            });
            return response.accessToken;
        } catch (error) {
            console.warn('Silent token acquisition failed, trying popup:', error);
            try {
                const response = await this.msalInstance.acquireTokenPopup(tokenRequest);
                return response.accessToken;
            } catch (popupError) {
                console.error('Failed to acquire token:', popupError);
                return null;
            }
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.account !== null;
    }

    /**
     * Get current account info
     */
    getAccount() {
        return this.account;
    }

    /**
     * Get unique user ID for database storage
     */
    getUserId() {
        return this.account?.localAccountId || null;
    }

    /**
     * Get user display name
     */
    getDisplayName() {
        return this.account?.name || this.account?.username || 'User';
    }

    /**
     * Get user email
     */
    getEmail() {
        return this.account?.username || null;
    }

    /**
     * Get user initials for avatar
     */
    getInitials() {
        const name = this.getDisplayName();
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    /**
     * Set callback for auth state changes
     */
    setAuthStateChangeCallback(callback) {
        this.onAuthStateChange = callback;
    }

    /**
     * Notify listeners of auth state change
     */
    notifyAuthStateChange() {
        if (this.onAuthStateChange) {
            this.onAuthStateChange(this.isAuthenticated(), this.account);
        }
    }
}

// Create global auth service instance
const authService = new AuthService();
