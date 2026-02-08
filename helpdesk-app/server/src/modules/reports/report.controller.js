import * as reportService from './report.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    // Optional: Validate date format or set defaults?
    // Service handles basic matching.

    const stats = await reportService.getDashboardStats(startDate, endDate);

    res.status(200).json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});
