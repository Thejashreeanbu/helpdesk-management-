import Ticket from '../tickets/ticket.model.js';
import User from '../users/user.model.js';

export const getDashboardStats = async (startDate, endDate) => {
    // Basic date filter
    const dateFilter = {};
    if (startDate && endDate) {
        dateFilter.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    // 1. Status Distribution
    const statusDistribution = await Ticket.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 2. Priority Distribution
    const priorityDistribution = await Ticket.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // 3. Ticket Volume Over Time (Daily) - Last 30 days if no date filter, or based on filter
    const volumeOverTime = await Ticket.aggregate([
        { $match: dateFilter },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } } // Sort by date ascending
    ]);

    // 4. SLA Compliance Stats
    // Count total, breached, and met
    const slaStats = await Ticket.aggregate([
        { $match: dateFilter },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                breached: { $sum: { $cond: ["$isSlaBreached", 1, 0] } },
                met: { $sum: { $cond: ["$isSlaBreached", 0, 1] } }
            }
        }
    ]);

    // 5. Agent Performance (Tickets Assigned vs Resolved)
    // This is more complex. Let's just count assigned tickets per agent for now.
    const agentPerformance = await Ticket.aggregate([
        { $match: { ...dateFilter, assignedTo: { $ne: null } } },
        {
            $group: {
                _id: "$assignedTo",
                totalAssigned: { $sum: 1 },
                resolved: { $sum: { $cond: [{ $in: ["$status", ["Resolved", "Closed"]] }, 1, 0] } }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "agentDetails"
            }
        },
        { $unwind: "$agentDetails" },
        {
            $project: {
                name: "$agentDetails.name",
                totalAssigned: 1,
                resolved: 1
            }
        }
    ]);

    return {
        statusDistribution,
        priorityDistribution,
        volumeOverTime,
        slaStats: slaStats[0] || { total: 0, breached: 0, met: 0 },
        agentPerformance
    };
};
