// Leaderboard API - Returns all users sorted by problems solved
module.exports = async function (context, req) {
    context.log('Leaderboard request received');

    try {
        const forceRefresh = req.query.forceRefresh === 'true';
        let leaderboard = [];

        if (forceRefresh) {
            context.log('Force refreshing leaderboard...');
            const allUserProgress = context.bindings.allUserProgress || [];
            const leaderboardUpdates = [];

            // Recalculate stats for every user
            leaderboard = allUserProgress.map(userProgress => {
                let totalSolved = 0;
                let easyCount = 0;
                let mediumCount = 0;
                let hardCount = 0;

                if (userProgress.data) {
                    Object.values(userProgress.data).forEach(category => {
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

                const stats = {
                    id: userProgress.userId,
                    userId: userProgress.userId,
                    totalSolved,
                    easyCount,
                    mediumCount,
                    hardCount,
                    lastUpdated: userProgress.lastUpdated || new Date().toISOString(),
                    type: 'stats'
                };
                
                leaderboardUpdates.push(stats);
                
                return {
                    userId: stats.userId,
                    totalSolved: stats.totalSolved,
                    easyCount: stats.easyCount,
                    mediumCount: stats.mediumCount,
                    hardCount: stats.hardCount,
                    lastUpdated: stats.lastUpdated
                };
            });

            // Batch save updates to Leaderboard container
            context.bindings.leaderboardOutput = leaderboardUpdates;
            context.log(`Updated ${leaderboardUpdates.length} leaderboard entries.`);
            
        } else {
            // Default: Use cached stats
            const allStats = context.bindings.allProgress || [];
            leaderboard = allStats.map(stats => {
                return {
                    userId: stats.userId,
                    totalSolved: stats.totalSolved || 0,
                    easyCount: stats.easyCount || 0,
                    mediumCount: stats.mediumCount || 0,
                    hardCount: stats.hardCount || 0,
                    lastUpdated: stats.lastUpdated
                };
            });
        }
        
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
                lastFetched: new Date().toISOString(),
                refreshed: forceRefresh
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
