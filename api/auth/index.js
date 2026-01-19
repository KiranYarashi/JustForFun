const crypto = require('crypto');

module.exports = async function (context, req) {
    try {
        const action = context.bindingData.action; // 'login' or 'register'
        const queryUsername = req.query.username;
        const body = req.body || {};
        const { username, password } = body;
    
        // Validate Input
        if (!username || !password || username.length < 3 || password.length < 4) {
            context.res = {
                status: 400,
                body: { error: "Invalid username or password format." }
            };
            return;
        }
    
        // Ensure query username matches body username (security check for binding)
        if (queryUsername && queryUsername !== username) {
            context.res = {
                status: 400,
                body: { error: "Username mismatch between query and body." }
            };
            return;
        }
    
        // Retrieve User from Input Binding
        const existingUser = context.bindings.userDocument;
    
        // ===== HANDLE REGISTER =====
        if (action === 'register') {
            if (existingUser) {
                context.res = {
                    status: 409,
                    body: { error: "Username already exists." }
                };
                return;
            }
    
            // Hash Password (Simple Salt + Hash)
            const salt = crypto.randomBytes(16).toString('hex');
            const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    
            // Verify IDs are safe for Cosmos DB (no slashes, etc if used in URL, but usually fine in JSON)
            // We use username as ID and Partition Key
            const newUser = {
                id: username,
                username: username,
                salt: salt,
                hash: hash,
                createdAt: new Date().toISOString()
            };
    
            // Save to DB
            context.bindings.outputDocument = newUser;
    
            context.res = {
                status: 201,
                body: { 
                    message: "User created successfully",
                    userId: username,
                    username: username
                }
            };
        } 
        // ===== HANDLE LOGIN =====
        else if (action === 'login') {
            if (!existingUser) {
                context.res = {
                    status: 401,
                    body: { error: "Invalid username or password." }
                };
                return;
            }
    
            // Verify Password
            const salt = existingUser.salt;
            const storedHash = existingUser.hash;
            const attemptHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    
            if (attemptHash !== storedHash) {
                context.res = {
                    status: 401,
                    body: { error: "Invalid username or password." }
                };
                return;
            }
    
            // Success
            context.res = {
                status: 200,
                body: {
                    message: "Login successful",
                    userId: existingUser.username,
                    username: existingUser.username
                }
            };
        } 
        else {
            context.res = {
                status: 404,
                body: { error: "Unknown action. Use /auth/login or /auth/register" }
            };
        }
    } catch (err) {
        context.log.error("Auth Error:", err);
        context.res = {
            status: 500,
            body: { 
                error: "Internal Server Error", 
                details: err.message, // Expose error to debug
                stack: err.stack 
            }
        };
    }
};
