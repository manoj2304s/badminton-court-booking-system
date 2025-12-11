const Booking = require('../models/Booking');
const Waitlist = require('../models/Waitlist');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const { checkAvailability } = require('../utils/availabilityChecker');
const { calculatePrice } = require('../utils/priceCalculator');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

const checkBookingAvailability = async (req, res) => {
    try {
        const { courtId, startTime, endTime, coachId, equipment } = req.body;

        if (!courtId || !startTime || !endTime) {
            return res.status(400).json({ message: 'Court ID, start time, and end time are required' });
        }

        const availabilityResult = await checkAvailability(
            courtId,
            startTime,
            endTime,
            coachId,
            equipment
        );

        res.json(availabilityResult);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const calculateBookingPrice = async (req, res) => {
    try {
        const { courtId, startTime, endTime, coachId, equipment } = req.body;

        if (!courtId || !startTime || !endTime) {
            return res.status(400).json({ message: 'Court ID, start time, and end time are required' });
        }

        const pricing = await calculatePrice({
            courtId,
            startTime,
            endTime,
            coachId,
            equipment
        });

        res.json(pricing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createBooking = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { courtId, startTime, endTime, coachId, equipment, notes } = req.body;
        const userId = req.user.id;

        if (!courtId || !startTime || !endTime) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Court ID, start time, and end time are required' });
        }

        // Validate times
        const start = new Date(startTime);
        const end = new Date(endTime);
        if (start >= end) {
            await transaction.rollback();
            return res.status(400).json({ message: 'End time must be after start time' });
        }

        // Check availability with transaction lock
        const availabilityResult = await checkAvailability(
            courtId,
            startTime,
            endTime,
            coachId,
            equipment
        );

        if (!availabilityResult.available) {
            await transaction.rollback();
            return res.status(409).json({
                message: 'Resources not available',
                conflicts: availabilityResult.conflicts
            });
        }

        // Calculate price
        const pricing = await calculatePrice({
            courtId,
            startTime,
            endTime,
            coachId,
            equipment
        });

        // Create booking
        const booking = await Booking.create({
            userId,
            courtId,
            coachId: coachId || null,
            startTime,
            endTime,
            equipment: equipment || [],
            pricingBreakdown: pricing,
            totalPrice: pricing.totalPrice,
            status: 'confirmed',
            notes: notes || null
        }, { transaction });

        await transaction.commit();

        // Fetch complete booking details
        const completeBooking = await Booking.findByPk(booking.id, {
            include: [
                { model: Court, as: 'court' },
                { model: Coach, as: 'coach' },
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
            ]
        });

        res.status(201).json({
            message: 'Booking created successfully',
            booking: completeBooking
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: error.message });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;

        const whereClause = { userId };
        if (status) {
            whereClause.status = status;
        }

        const bookings = await Booking.findAll({
            where: whereClause,
            include: [
                { model: Court, as: 'court' },
                { model: Coach, as: 'coach' }
            ],
            order: [['startTime', 'DESC']]
        });

        res.json({ bookings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const { status, courtId, date } = req.query;

        const whereClause = {};
        if (status) {
            whereClause.status = status;
        }
        if (courtId) {
            whereClause.courtId = courtId;
        }
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            whereClause.startTime = {
                [Op.between]: [startOfDay, endOfDay]
            };
        }

        const bookings = await Booking.findAll({
            where: whereClause,
            include: [
                { model: Court, as: 'court' },
                { model: Coach, as: 'coach' },
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
            ],
            order: [['startTime', 'DESC']]
        });

        res.json({ bookings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelBooking = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        const booking = await Booking.findByPk(id);

        if (!booking) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check authorization
        if (!isAdmin && booking.userId !== userId) {
            await transaction.rollback();
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        if (booking.status === 'cancelled') {
            await transaction.rollback();
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save({ transaction });

        // Check waitlist and notify next person
        const waitlistEntry = await Waitlist.findOne({
            where: {
                courtId: booking.courtId,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: 'waiting'
            },
            order: [['createdAt', 'ASC']],
            transaction
        });

        if (waitlistEntry) {
            waitlistEntry.status = 'notified';
            waitlistEntry.notifiedAt = new Date();
            await waitlistEntry.save({ transaction });

            // In a real application, send notification to user
            console.log(`Notifying user ${waitlistEntry.userId} about available slot`);
        }

        await transaction.commit();

        res.json({
            message: 'Booking cancelled successfully',
            booking,
            waitlistNotified: !!waitlistEntry
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: error.message });
    }
};

const joinWaitlist = async (req, res) => {
    try {
        const { courtId, startTime, endTime, coachId, equipment } = req.body;
        const userId = req.user.id;

        if (!courtId || !startTime || !endTime) {
            return res.status(400).json({ message: 'Court ID, start time, and end time are required' });
        }

        // Check if user is already in waitlist for this slot
        const existingEntry = await Waitlist.findOne({
            where: {
                userId,
                courtId,
                startTime,
                endTime,
                status: 'waiting'
            }
        });

        if (existingEntry) {
            return res.status(400).json({ message: 'You are already in the waitlist for this slot' });
        }

        // Create waitlist entry
        const waitlistEntry = await Waitlist.create({
            userId,
            courtId,
            startTime,
            endTime,
            requestedResources: {
                coachId: coachId || null,
                equipment: equipment || []
            }
        });

        res.status(201).json({
            message: 'Added to waitlist successfully',
            waitlistEntry
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAvailableSlots = async (req, res) => {
    try {
        const { courtId, date } = req.query;

        if (!courtId || !date) {
            return res.status(400).json({ message: 'Court ID and date are required' });
        }

        const selectedDate = new Date(date);
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Get all bookings for this court on this date
        const bookings = await Booking.findAll({
            where: {
                courtId,
                status: 'confirmed',
                startTime: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        // Generate time slots (e.g., 9 AM to 9 PM, 1-hour slots)
        const slots = [];
        for (let hour = 9; hour < 21; hour++) {
            const slotStart = new Date(selectedDate);
            slotStart.setHours(hour, 0, 0, 0);
            const slotEnd = new Date(selectedDate);
            slotEnd.setHours(hour + 1, 0, 0, 0);

            // Check if slot is booked
            const isBooked = bookings.some(booking => {
                const bookingStart = new Date(booking.startTime);
                const bookingEnd = new Date(booking.endTime);
                return (slotStart < bookingEnd && slotEnd > bookingStart);
            });

            slots.push({
                startTime: slotStart,
                endTime: slotEnd,
                available: !isBooked
            });
        }

        res.json({ slots });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    checkBookingAvailability,
    calculateBookingPrice,
    createBooking,
    getUserBookings,
    getAllBookings,
    cancelBooking,
    joinWaitlist,
    getAvailableSlots
};