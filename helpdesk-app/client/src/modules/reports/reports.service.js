import api from '../../services/api';

const getReportStats = async ({ startDate, endDate }) => {
    let query = '';
    if (startDate && endDate) {
        query = `?startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await api.get(`/reports/stats${query}`);
    return response.data.data;
};

const reportsService = {
    getReportStats
};

export default reportsService;
