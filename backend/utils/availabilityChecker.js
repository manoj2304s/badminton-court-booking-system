const { Op } = require('sequelize');
const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');
const sequelize = require('../config/database');

const checkAvailability = async (courtId, startTime, endTime, coachId = null, equipment = []) => {
    const result = {
        available: true,
        conflicts: [],
        message: 'All resources are available'
    };

    // Check court availability
    const courtConflict = await checkCourtAvailability(courtId, startTime, endTime);
    if (!courtConflict.available) {
        result.available = false;
        result.conflicts.push(courtConflict);
    }

    // Check coach availability if coach is requested
    if (coachId) {
        const coachConflict = await checkCoachAvailability(coachId, startTime, endTime);
        if (!coachConflict.available) {
            result.available = false;
            result.conflicts.push(coachConflict);
        }
    }

    // Check equipment availability
    if (equipment && equipment.length > 0) {
        for (const item of equipment) {
            const equipmentConflict = await checkEquipmentAvailability(
                item.equipmentId,
                item.quantity,
                startTime,
                endTime
            );
            if (!equipmentConflict.available) {
                result.available = false;
                result.conflicts.push(equipmentConflict);
            }
        }
    }

    if (!result.available) {
        result.message = 'Some resources are not available';
    }

    return result;
};

const checkCourtAvailability = async (courtId, startTime, endTime) => {
    const existingBooking = await Booking.findOne({
        where: {
            courtId,
            status: 'confirmed',
            [Op.or]: [
                {
                    startTime: {
                        [Op.lt]: endTime,
                        [Op.gte]: startTime
                    }
                },
                {
                    endTime: {
                        [Op.gt]: startTime,
                        [Op.lte]: endTime
                    }
                },
                {
                    [Op.and]: [
                        { startTime: { [Op.lte]: startTime } },
                        { endTime: { [Op.gte]: endTime } }
                    ]
                }
            ]
        }
    });

    if (existingBooking) {
        return {
            available: false,
            resource: 'court',
            resourceId: courtId,
            message: 'Court is already booked for this time slot'
        };
    }

    return { available: true, resource: 'court', resourceId: courtId };
};

const checkCoachAvailability = async (coachId, startTime, endTime) => {
    // First check if coach exists and is active
    const coach = await Coach.findByPk(coachId);
    if (!coach || !coach.isActive) {
        return {
            available: false,
            resource: 'coach',
            resourceId: coachId,
            message: 'Coach is not available or inactive'
        };
    }

    // Check coach's general availability schedule
    const bookingStart = new Date(startTime);
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][bookingStart.getDay()];

    if (coach.availability && coach.availability[dayOfWeek]) {
        const bookingHour = bookingStart.getHours();
        const bookingMinute = bookingStart.getMinutes();
        const bookingTimeInMinutes = bookingHour * 60 + bookingMinute;

        const daySchedule = coach.availability[dayOfWeek];
        let isWithinSchedule = false;

        for (const slot of daySchedule) {
            const [startHour, startMinute] = slot.start.split(':').map(Number);
            const [endHour, endMinute] = slot.end.split(':').map(Number);
            const slotStart = startHour * 60 + startMinute;
            const slotEnd = endHour * 60 + endMinute;

            if (bookingTimeInMinutes >= slotStart && bookingTimeInMinutes < slotEnd) {
                isWithinSchedule = true;
                break;
            }
        }

        if (!isWithinSchedule) {
            return {
                available: false,
                resource: 'coach',
                resourceId: coachId,
                message: 'Coach is not available at this time according to their schedule'
            };
        }
    }

    // Check for booking conflicts
    const existingBooking = await Booking.findOne({
        where: {
            coachId,
            status: 'confirmed',
            [Op.or]: [
                {
                    startTime: {
                        [Op.lt]: endTime,
                        [Op.gte]: startTime
                    }
                },
                {
                    endTime: {
                        [Op.gt]: startTime,
                        [Op.lte]: endTime
                    }
                },
                {
                    [Op.and]: [
                        { startTime: { [Op.lte]: startTime } },
                        { endTime: { [Op.gte]: endTime } }
                    ]
                }
            ]
        }
    });

    if (existingBooking) {
        return {
            available: false,
            resource: 'coach',
            resourceId: coachId,
            message: 'Coach is already booked for this time slot'
        };
    }

    return { available: true, resource: 'coach', resourceId: coachId };
};

const checkEquipmentAvailability = async (equipmentId, requestedQuantity, startTime, endTime) => {
    const equipment = await Equipment.findByPk(equipmentId);

    if (!equipment || !equipment.isActive) {
        return {
            available: false,
            resource: 'equipment',
            resourceId: equipmentId,
            message: 'Equipment not found or inactive'
        };
    }

    // Get all bookings that overlap with the requested time and include this equipment
    const overlappingBookings = await Booking.findAll({
        where: {
            status: 'confirmed',
            [Op.or]: [
                {
                    startTime: {
                        [Op.lt]: endTime,
                        [Op.gte]: startTime
                    }
                },
                {
                    endTime: {
                        [Op.gt]: startTime,
                        [Op.lte]: endTime
                    }
                },
                {
                    [Op.and]: [
                        { startTime: { [Op.lte]: startTime } },
                        { endTime: { [Op.gte]: endTime } }
                    ]
                }
            ]
        }
    });

    // Calculate total booked quantity for this equipment
    let bookedQuantity = 0;
    for (const booking of overlappingBookings) {
        if (booking.equipment && Array.isArray(booking.equipment)) {
            const equipmentItem = booking.equipment.find(e => e.equipmentId === equipmentId);
            if (equipmentItem) {
                bookedQuantity += equipmentItem.quantity;
            }
        }
    }

    const availableQuantity = equipment.totalQuantity - bookedQuantity;

    if (availableQuantity < requestedQuantity) {
        return {
            available: false,
            resource: 'equipment',
            resourceId: equipmentId,
            message: `Only ${availableQuantity} units available, but ${requestedQuantity} requested`,
            availableQuantity,
            requestedQuantity
        };
    }

    return {
        available: true,
        resource: 'equipment',
        resourceId: equipmentId,
        availableQuantity
    };
};

module.exports = { checkAvailability };