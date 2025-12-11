import api from './api';

const courtService = {
    getAllCourts: async (filters = {}) => {
        const response = await api.get('/courts', { params: filters });
        return response.data;
    },

    getCourtById: async (id) => {
        const response = await api.get(`/courts/${id}`);
        return response.data;
    },

    getAllEquipment: async () => {
        const response = await api.get('/equipment');
        return response.data;
    },

    getAllCoaches: async () => {
        const response = await api.get('/coaches');
        return response.data;
    },

    getAvailableCoaches: async (startTime, endTime) => {
        const response = await api.get('/coaches/available', {
            params: { startTime, endTime }
        });
        return response.data;
    },
};

export default courtService;