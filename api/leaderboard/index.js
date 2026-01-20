// Leaderboard API - Returns all users sorted by problems solved
module.exports = async function (context, req) {
    context.log('Leaderboard request received');

    try {
        const allProgress = context.bindings.allProgress || [];
        
        // Calculate total solved for each user
        const leaderboard = allProgress.map(userProgress => {
            let totalSolved = 0;
            let easyCount = 0;
            let mediumCount = 0;
            let hardCount = 0;
            
            if (userProgress.data) {
                // Count completed problems from each category
                Object.values(userProgress.data).forEach(category => {
                    if (category && typeof category === 'object') {
                        Object.values(category).forEach(problem => {
                            if (problem && problem.completed) {
                                totalSolved++;
                                // Count by difficulty if available
                                if (problem.difficulty === 'Easy') easyCount++;
                                else if (problem.difficulty === 'Medium') mediumCount++;
                                else if (problem.difficulty === 'Hard') hardCount++;
                            }
                        });
                    }
                });
            }
            
            return {
                userId: userProgress.userId,
                totalSolved,
                easyCount,
                mediumCount,
                hardCount,
                lastUpdated: userProgress.lastUpdated
            };
        });
        
        // Sort by total solved (descending)
        leaderboard.sort((a, b) => b.totalSolved - a.totalSolved);
        
        // Add rank
        leaderboard.forEach((entry, index) => {
            entry.rank = index + 1;
        });
        
        context.res = {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: {
                leaderboard,
                totalUsers: leaderboard.length,
                lastFetched: new Date().toISOString()
            }
        };
    } catch (error) {
        context.log.error('Leaderboard error:', error);
        context.res = {
            status: 500,
            body: { error: 'Failed to fetch leaderboard' }
        };
    }
};
