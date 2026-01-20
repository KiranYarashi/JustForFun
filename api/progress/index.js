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

        // --- NEW: Update Leaderboard Summary ---
        let totalSolved = 0;
        let easyCount = 0;
        let mediumCount = 0;
        let hardCount = 0;

        if (progressData.data) {
            Object.values(progressData.data).forEach(category => {
                if (category && typeof category === 'object') {
                    Object.values(category).forEach(problem => {
                        if (problem && problem.completed) {
                            totalSolved++;
                            if (problem.difficulty === 'Easy') easyCount++;
                            else if (problem.difficulty === 'Medium') mediumCount++;
                            else if (problem.difficulty === 'Hard') hardCount++;
                        }
                    });
                }
            });
        }

        // Save summary to Leaderboard container
        context.bindings.leaderboardDocument = {
            id: userId, // PK and ID are the same for summary
            userId: userId,
            totalSolved,
            easyCount,
            mediumCount,
            hardCount,
            lastUpdated: progressData.lastUpdated,
            type: 'stats'
        };

        context.res = {
            status: 200,
            body: {
                message: "Progress saved successfully",
                id: progressData.id,
                lastUpdated: progressData.lastUpdated,
                stats: { totalSolved, easyCount, mediumCount, hardCount }
            }
        };
    }
};
