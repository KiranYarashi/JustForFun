// ===== Cloud Data Sync API =====
// Handles synchronization between localStorage and Azure Cosmos DB

class DataSyncAPI {
    constructor() {
        this.baseUrl = '/api'; // Use relative path for Azure Functions
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
     * Note: For custom auth, we might pass user ID or session token if we had one.
     * Currently relying on userId in URL/body for this simple implementation.
     */
    async getAuthHeaders() {
        return { 'Content-Type': 'application/json' };
    }

    /**
     * Fetch user progress from cloud
     */
    async getUserProgress(userId) {
        if (!userId) return null;

        try {
            this.notifySyncStatus('syncing', 'Fetching data from cloud...');
            
            const response = await fetch(`${this.baseUrl}/progress/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
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
        if (!userId) return false;

        if (this.syncInProgress) {
            console.log('Sync already in progress, skipping...');
            return false;
        }

        try {
            this.syncInProgress = true;
            this.notifySyncStatus('syncing', 'Saving to cloud...');

            const payload = {
                id: `${userId}_progress`,
                userId: userId,
                data: progressData,
                lastUpdated: new Date().toISOString()
            };

            const response = await fetch(`${this.baseUrl}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            completed: JSON.parse(localStorage.getItem('leetcode-tracker-completed') || '[]').map(id => String(id)),
            maangCompleted: JSON.parse(localStorage.getItem('maang-tracker-completed') || '[]').map(id => String(id)),
            patternsCompleted: JSON.parse(localStorage.getItem('leetcode-tracker-patterns-completed') || '[]').map(id => String(id)),
            customProblems: JSON.parse(localStorage.getItem('leetcode-tracker-custom-problems') || '{}'),
            customSections: JSON.parse(localStorage.getItem('leetcode-tracker-custom-sections') || '[]'),
            // CRITICAL FIX: Use the correct key for custom patterns data structure
            customPatternsData: JSON.parse(localStorage.getItem('leetcode-tracker-custom-patterns') || '{"weeks":[], "customDays":{}}'),
            notes: JSON.parse(localStorage.getItem('leetcode-tracker-notes') || '{}'),
            history: JSON.parse(localStorage.getItem('leetcode-tracker-history') || '{}'),
            order: JSON.parse(localStorage.getItem('leetcode-tracker-order') || '[]'),
            theme: localStorage.getItem('theme') || 'dark',
            srs: JSON.parse(localStorage.getItem('leetcode-tracker-srs') || '{}')
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
        if (data.patternsCompleted) {
            localStorage.setItem('leetcode-tracker-patterns-completed', JSON.stringify(data.patternsCompleted));
        }
        if (data.customProblems) {
            localStorage.setItem('leetcode-tracker-custom-problems', JSON.stringify(data.customProblems));
        }
        if (data.customSections) {
            localStorage.setItem('leetcode-tracker-custom-sections', JSON.stringify(data.customSections));
        }
        // CRITICAL FIX: Apply customPatternsData from cloud
        if (data.customPatternsData) {
            localStorage.setItem('leetcode-tracker-custom-patterns', JSON.stringify(data.customPatternsData));
        }
        if (data.notes) {
            localStorage.setItem('leetcode-tracker-notes', JSON.stringify(data.notes));
        }
        if (data.history) {
            localStorage.setItem('leetcode-tracker-history', JSON.stringify(data.history));
        }
        if (data.order) {
            localStorage.setItem('leetcode-tracker-order', JSON.stringify(data.order));
        }
        if (data.theme) {
            localStorage.setItem('theme', data.theme);
        }
        if (data.srs) {
            localStorage.setItem('leetcode-tracker-srs', JSON.stringify(data.srs));
        }

        return true;
    }

    /**
     * Sync local data with cloud (bidirectional merge)
     */
    async syncWithCloud(userId) {
        if (!userId) return false;

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

// ===== Shared Patterns API =====
const sharedPatternsAPI = {
    baseUrl: '/api/shared-patterns',
    
    // Get all shared content
    async getAll() {
        try {
            const response = await fetch(this.baseUrl);
            if (response.status === 500) {
                 console.warn('Shared Patterns API Server Error (500). Feature unavailable.');
                 return [];
            }
            if (!response.ok) {
                throw new Error(`Failed to fetch shared patterns: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching shared patterns:', error);
            // Return empty array to avoid breaking the UI
            return [];
        }
    },
    
    // Add new shared content
    async add(type, data, parentId = null) {
        const userId = authService.isAuthenticated() ? authService.getUserId() : null;
        if (!userId) {
            throw new Error('Must be logged in to add shared content');
        }
        
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId
                },
                body: JSON.stringify({
                    type: type,
                    parentId: parentId,
                    createdBy: userId,
                    data: data,
                    title: data.title || data.name
                })
            });
            
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to add shared content');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error adding shared content:', error);
            throw error;
        }
    },
    
    // Delete shared content (only by creator)
    async delete(id) {
        const userId = authService.isAuthenticated() ? authService.getUserId() : null;
        if (!userId) {
            throw new Error('Must be logged in to delete shared content');
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/${id}?userId=${userId}`, {
                method: 'DELETE',
                headers: {
                    'x-user-id': userId
                }
            });
            
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to delete shared content');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error deleting shared content:', error);
            throw error;
        }
    }
};
