import api from './api';

const adminService = {
    // Courts
    createCourt: async (courtData) => {
        const response = await api.post('/courts', courtData);
        return response.data;
    },

    updateCourt: async (id, courtData) => {
        const response = await api.put(`/courts/${id}`, courtData);
        return response.data;
    },

    deleteCourt: async (id) => {
        const response = await api.delete(`/courts/${id}`);
        return response.data;
    },

    // Equipment
    createEquipment: async (equipmentData) => {
        const response = await api.post('/equipment', equipmentData);
        return response.data;
    },

    updateEquipment: async (id, equipmentData) => {
        const response = await api.put(`/equipment/${id}`, equipmentData);
        return response.data;
    },

    deleteEquipment: async (id) => {
        const response = await api.delete(`/equipment/${id}`);
        return response.data;
    },

    // Coaches
    createCoach: async (coachData) => {
        const response = await api.post('/coaches', coachData);
        return response.data;
    },

    updateCoach: async (id, coachData) => {
        const response = await api.put(`/coaches/${id}`, coachData);
        return response.data;
    },

    deleteCoach: async (id) => {
        const response = await api.delete(`/coaches/${id}`);
        return response.data;
    },

    // Pricing Rules
    getAllPricingRules: async () => {
        const response = await api.get('/pricing-rules');
        return response.data;
    },

    createPricingRule: async (ruleData) => {
        const response = await api.post('/pricing-rules', ruleData);
        return response.data;
    },

    updatePricingRule: async (id, ruleData) => {
        const response = await api.put(`/pricing-rules/${id}`, ruleData);
        return response.data;
    },

    deletePricingRule: async (id) => {
        const response = await api.delete(`/pricing-rules/${id}`);
        return response.data;
    },
};

export default adminService;