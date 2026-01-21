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

            // Load shared problem data
            // Note: In Azure Functions, we might need to adjust the path depending on deployment structure
            // Using try-catch to handle potential path issues or fallback
            let problemDataModule;
            try {
                // Try relative path from /api/leaderboard to /api/shared
                problemDataModule = require('../shared/problem-data.js');
            } catch (e) {
                context.log.warn('Could not load shared problem data, falling back to basic counting', e);
            }

            // Recalculate stats for every user
            leaderboard = allUserProgress.map(userProgress => {
                let totalSolved = 0;
                let easyCount = 0;
                let mediumCount = 0;
                let hardCount = 0;
                let solvedIds = new Set(); // Track unique problem IDs (some IDs might be in both sets if data is old)

                if (userProgress.data) {
                    const data = userProgress.data;

                    // 1. Process Roadmap Problems
                    if (data.completed && Array.isArray(data.completed)) {
                        data.completed.forEach(id => {
                           if (!solvedIds.has(String(id))) {
                               solvedIds.add(String(id));
                               totalSolved++;
                               
                               if (problemDataModule) {
                                   const diff = problemDataModule.getDifficulty(id);
                                   if (diff === 'Easy') easyCount++;
                                   else if (diff === 'Medium') mediumCount++;
                                   else if (diff === 'Hard') hardCount++;
                               } else {
                                   // Fallback if module load failed
                                   mediumCount++; 
                               }
                           }
                        });
                    }

                    // 2. Process MAANG Problems
                    if (data.maangCompleted && Array.isArray(data.maangCompleted)) {
                        data.maangCompleted.forEach(id => {
                           if (!solvedIds.has(String(id))) {
                               solvedIds.add(String(id));
                               totalSolved++;
                               
                               if (problemDataModule) {
                                   const diff = problemDataModule.getDifficulty(id);
                                   if (diff === 'Easy') easyCount++;
                                   else if (diff === 'Medium') mediumCount++;
                                   else if (diff === 'Hard') hardCount++;
                               } else {
                                   mediumCount++;
                               }
                           }
                        });
                    }
                    
                    // 3. Custom Problems Note:
                    // Custom problem IDs are already included in data.completed when marked as solved,
                    // so they're already counted in totalSolved above. We don't process customProblems
                    // separately to avoid double-counting. The difficulty breakdown for custom problems
                    // defaults to Medium via the fallback in steps 1-2 when getDifficulty returns null.
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
