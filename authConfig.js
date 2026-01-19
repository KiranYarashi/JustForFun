// ===== Azure AD Authentication Configuration =====
// IMPORTANT: Replace these values with your actual Azure AD app registration details
// 
// To get these values:
// 1. Go to Azure Portal -> Microsoft Entra ID -> App registrations
// 2. Create a new registration or select existing
// 3. Copy Application (client) ID and Directory (tenant) ID
// 4. Add redirect URIs for your app (SPA type)

const msalConfig = {
    auth: {
        // Your Azure AD Application (client) ID
        clientId: "YOUR_CLIENT_ID_HERE",
        
        // Your Azure AD Directory (tenant) ID
        // Use 'common' for multi-tenant, or your specific tenant ID
        authority: "https://login.microsoftonline.com/YOUR_TENANT_ID_HERE",
        
        // Redirect URI - must match what's registered in Azure AD
        redirectUri: window.location.origin,
        
        // Where to redirect after logout
        postLogoutRedirectUri: window.location.origin
    },
    cache: {
        // Store auth state in localStorage for persistence
        cacheLocation: "localStorage",
        
        // Set to true if you have issues with IE11 or Edge
        storeAuthStateInCookie: false
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) return;
                switch (level) {
                    case msal.LogLevel.Error:
                        console.error(message);
                        break;
                    case msal.LogLevel.Warning:
                        console.warn(message);
                        break;
                    case msal.LogLevel.Info:
                        console.info(message);
                        break;
                    case msal.LogLevel.Verbose:
                        console.debug(message);
                        break;
                }
            },
            logLevel: msal.LogLevel.Warning
        }
    }
};

// Scopes for login - User.Read allows getting basic profile info
const loginRequest = {
    scopes: ["User.Read"]
};

// Scopes for API access (if you add custom API later)
const tokenRequest = {
    scopes: ["User.Read"],
    forceRefresh: false
};

// API Configuration
// Update this when you deploy Azure Functions or Static Web Apps
const apiConfig = {
    // Base URL for your API
    // For Azure Static Web Apps: '/data-api/rest'
    // For Azure Functions: 'https://your-function-app.azurewebsites.net/api'
    baseUrl: '/api',
    
    // Cosmos DB settings (for reference in Azure setup)
    cosmosDb: {
        databaseName: 'LeetCodeTracker',
        containerName: 'UserProgress',
        partitionKey: '/userId'
    }
};

// Check if Azure AD is configured
function isAzureConfigured() {
    return msalConfig.auth.clientId !== "YOUR_CLIENT_ID_HERE" && 
           msalConfig.auth.authority !== "https://login.microsoftonline.com/YOUR_TENANT_ID_HERE";
}
