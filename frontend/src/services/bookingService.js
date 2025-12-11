import api from './api';

const bookingService = {
    checkAvailability: async (bookingData) => {
        const response = await api.post('/bookings/check-availability', bookingData);
        return response.data;
    },

    calculatePrice: async (bookingData) => {
        const response = await api.post('/bookings/calculate-price', bookingData);
        return response.data;
    },

    createBooking: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    getUserBookings: async (status) => {
        const params = status ? { status } : {};
        const response = await api.get('/bookings/user/my-bookings', { params });
        return response.data;
    },

    getAllBookings: async (filters = {}) => {
        const response = await api.get('/bookings/admin/all', { params: filters });
        return response.data;
    },

    cancelBooking: async (bookingId) => {
        const response = await api.delete(`/bookings/${bookingId}`);
        return response.data;
    },

    joinWaitlist: async (bookingData) => {
        const response = await api.post(`/bookings/${bookingData.courtId}/waitlist`, bookingData);
        return response.data;
    },

    getAvailableSlots: async (courtId, date) => {
        const response = await api.get('/bookings/available-slots', {
            params: { courtId, date }
        });
        return response.data;
    },
};

export default bookingService;