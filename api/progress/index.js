// Main function to handle GET and POST requests
module.exports = async function (context, req) {
    const userId = req.params.userId || (req.body && req.body.userId);
    
    // Safety check - we expect userId in route or body
    if (!userId) {
        context.res = {
            status: 400,
            body: "Please pass a userId on the query string or in the request body"
        };
        return;
    }

    // TODO: Verify Auth Token (req.headers.authorization)
    // For now, relying on SWA or function level auth if configured
    
    if (req.method === "GET") {
        if (!context.bindings.inputDocument) {
             context.res = {
                status: 404,
                body: "No progress found for this user"
            };
        } else {
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: context.bindings.inputDocument
            };
        }
    } 
    else if (req.method === "POST") {
        const progressData = req.body;
        
        if (!progressData || !progressData.data) {
             context.res = {
                status: 400,
                body: "Invalid data format"
            };
            return;
        }

        // Ensure IDs match
        progressData.id = `${userId}_progress`;
        progressData.userId = userId;
        progressData.lastUpdated = new Date().toISOString();

        // Write to Cosmos DB using output binding
        context.bindings.outputDocument = progressData;

        context.res = {
            status: 200,
            body: {
                message: "Progress saved successfully",
                id: progressData.id,
                lastUpdated: progressData.lastUpdated
            }
        };
    }
};
