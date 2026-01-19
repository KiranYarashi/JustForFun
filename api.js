// ===== Cloud Data Sync API =====
// Handles synchronization between localStorage and Azure Cosmos DB

class DataSyncAPI {
    constructor() {
        this.baseUrl = apiConfig.baseUrl;
        this.syncInProgress = false;
        this.lastSyncTime = null;
        this.onSyncStatusChange = null;
    }

    /**
     * Set callback for sync status changes
     */
    setSyncStatusCallback(callback) {
        this.onSyncStatusChange = callback;
    }

    /**
     * Notify sync status change
     */
    notifySyncStatus(status, message) {
        if (this.onSyncStatusChange) {
            this.onSyncStatusChange(status, message);
        }
    }

    /**
     * Get authorization header with access token
     */
    async getAuthHeaders() {
        const token = await authService.getAccessToken();
        if (!token) {
            return { 'Content-Type': 'application/json' };
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    /**
     * Fetch user progress from cloud
     */
    async getUserProgress(userId) {
        if (!userId || !isAzureConfigured()) {
            return null;
        }

        try {
            this.notifySyncStatus('syncing', 'Fetching data from cloud...');
            
            const headers = await this.getAuthHeaders();
            const response = await fetch(`${this.baseUrl}/progress/${userId}`, {
                method: 'GET',
                headers: headers
            });

            if (response.status === 404) {
                // No data in cloud yet
                this.notifySyncStatus('synced', 'No cloud data found');
                return null;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            this.lastSyncTime = new Date();
            this.notifySyncStatus('synced', 'Data synced from cloud');
            return data;
        } catch (error) {
            console.error('Failed to fetch user progress:', error);
            this.notifySyncStatus('error', 'Failed to sync from cloud');
            return null;
        }
    }

    /**
     * Save user progress to cloud
     */
    async saveUserProgress(userId, progressData) {
        if (!userId || !isAzureConfigured()) {
            return false;
        }

        if (this.syncInProgress) {
            console.log('Sync already in progress, skipping...');
            return false;
        }

        try {
            this.syncInProgress = true;
            this.notifySyncStatus('syncing', 'Saving to cloud...');

            const headers = await this.getAuthHeaders();
            const payload = {
                id: `${userId}_progress`,
                userId: userId,
                data: progressData,
                lastUpdated: new Date().toISOString()
            };

            const response = await fetch(`${this.baseUrl}/progress`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            this.lastSyncTime = new Date();
            this.notifySyncStatus('synced', 'Saved to cloud');
            return true;
        } catch (error) {
            console.error('Failed to save user progress:', error);
            this.notifySyncStatus('error', 'Failed to save to cloud');
            return false;
        } finally {
            this.syncInProgress = false;
        }
    }

    /**
     * Collect all current progress data from localStorage
     */
    collectLocalProgress() {
        return {
            completed: JSON.parse(localStorage.getItem('leetcode-tracker-completed') || '[]'),
            maangCompleted: JSON.parse(localStorage.getItem('maang-tracker-completed') || '[]'),
            customProblems: JSON.parse(localStorage.getItem('leetcode-tracker-custom-problems') || '{}'),
            customSections: JSON.parse(localStorage.getItem('leetcode-tracker-custom-sections') || '[]'),
            notes: JSON.parse(localStorage.getItem('leetcode-tracker-notes') || '{}'),
            history: JSON.parse(localStorage.getItem('leetcode-tracker-history') || '{}'),
            theme: localStorage.getItem('theme') || 'dark'
        };
    }

    /**
     * Apply cloud data to localStorage
     */
    applyCloudProgress(cloudData) {
        if (!cloudData || !cloudData.data) return false;

        const data = cloudData.data;
        
        if (data.completed) {
            localStorage.setItem('leetcode-tracker-completed', JSON.stringify(data.completed));
        }
        if (data.maangCompleted) {
            localStorage.setItem('maang-tracker-completed', JSON.stringify(data.maangCompleted));
        }
        if (data.customProblems) {
            localStorage.setItem('leetcode-tracker-custom-problems', JSON.stringify(data.customProblems));
        }
        if (data.customSections) {
            localStorage.setItem('leetcode-tracker-custom-sections', JSON.stringify(data.customSections));
        }
        if (data.notes) {
            localStorage.setItem('leetcode-tracker-notes', JSON.stringify(data.notes));
        }
        if (data.history) {
            localStorage.setItem('leetcode-tracker-history', JSON.stringify(data.history));
        }
        if (data.theme) {
            localStorage.setItem('theme', data.theme);
        }

        return true;
    }

    /**
     * Sync local data with cloud (bidirectional merge)
     */
    async syncWithCloud(userId) {
        if (!userId || !isAzureConfigured()) {
            return false;
        }

        try {
            // Get cloud data
            const cloudData = await this.getUserProgress(userId);
            const localData = this.collectLocalProgress();

            if (!cloudData) {
                // No cloud data, upload local data
                console.log('No cloud data found, uploading local progress...');
                return await this.saveUserProgress(userId, localData);
            }

            // Merge strategy: Use cloud data as base, local data takes precedence for newer items
            // For now, we'll use a simple strategy: cloud data wins if it's newer
            const cloudTime = new Date(cloudData.lastUpdated || 0);
            const localLastSync = this.getLocalLastSyncTime();

            if (cloudTime > localLastSync) {
                // Cloud is newer, apply cloud data
                console.log('Cloud data is newer, applying...');
                this.applyCloudProgress(cloudData);
                return true;
            } else {
                // Local is newer, upload local data
                console.log('Local data is newer, uploading...');
                return await this.saveUserProgress(userId, localData);
            }
        } catch (error) {
            console.error('Sync failed:', error);
            return false;
        }
    }

    /**
     * Get last sync time from localStorage
     */
    getLocalLastSyncTime() {
        const time = localStorage.getItem('leetcode-tracker-last-sync');
        return time ? new Date(time) : new Date(0);
    }

    /**
     * Set last sync time in localStorage
     */
    setLocalLastSyncTime() {
        localStorage.setItem('leetcode-tracker-last-sync', new Date().toISOString());
    }

    /**
     * Debounced save - waits before saving to avoid too frequent API calls
     */
    debouncedSave(userId, progressData, delay = 2000) {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        this.notifySyncStatus('pending', 'Changes pending...');

        this.saveTimeout = setTimeout(async () => {
            await this.saveUserProgress(userId, progressData);
            this.setLocalLastSyncTime();
        }, delay);
    }
}

// Create global data sync instance
const dataSync = new DataSyncAPI();
