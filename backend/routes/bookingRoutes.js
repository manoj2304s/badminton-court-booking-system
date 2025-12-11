const express = require('express');
const {
    checkBookingAvailability,
    calculateBookingPrice,
    createBooking,
    getUserBookings,
    getAllBookings,
    cancelBooking,
    joinWaitlist,
    getAvailableSlots
} = require('../controllers/bookingController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/check-availability', checkBookingAvailability);
router.post('/calculate-price', calculateBookingPrice);
router.get('/available-slots', getAvailableSlots);
router.post('/', auth, createBooking);
router.get('/user/my-bookings', auth, getUserBookings);
router.get('/admin/all', adminAuth, getAllBookings);
router.delete('/:id', auth, cancelBooking);
router.post('/:id/waitlist', auth, joinWaitlist);

module.exports = router;