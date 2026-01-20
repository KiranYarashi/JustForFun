// Leaderboard API - Returns all users sorted by problems solved
module.exports = async function (context, req) {
    context.log('Leaderboard request received');

    try {
        const allStats = context.bindings.allProgress || [];
        
        // Data is already pre-calculated in the 'Leaderboard' container
        const leaderboard = allStats.map(stats => {
            return {
                userId: stats.userId,
                totalSolved: stats.totalSolved || 0,
                easyCount: stats.easyCount || 0,
                mediumCount: stats.mediumCount || 0,
                hardCount: stats.hardCount || 0,
                lastUpdated: stats.lastUpdated
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
