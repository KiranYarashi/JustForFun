module.exports = async function (context, req) {
    context.log('Ping request received - Bootstrapping DB');

    // Include Partition Keys in the documents!
    context.bindings.usersBootstrap = {
        id: "db_init_check",
        username: "db_init_check", // PK for Users
        type: "bootstrap",
        timestamp: new Date().toISOString()
    };

    context.bindings.progressBootstrap = {
        id: "db_init_check",
        userId: "db_init_check", // PK for UserProgress
        type: "bootstrap",
        timestamp: new Date().toISOString()
    };

    context.res = {
        status: 200,
        body: {
            message: "Pong! Database containers initialized.",
            timestamp: new Date().toISOString(),
            details: "Attempted to create 'Users' (PK: /username) and 'UserProgress' (PK: /userId)."
        }
    };
};
