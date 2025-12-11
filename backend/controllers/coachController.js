const Coach = require('../models/Coach');
const Booking = require('../models/Booking');
const { Op } = require('sequelize');

const getAllCoaches = async (req, res) => {
    try {
        const { isActive } = req.query;

        const whereClause = {};
        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }

        const coaches = await Coach.findAll({ where: whereClause });
        res.json({ coaches });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCoachById = async (req, res) => {
    try {
        const { id } = req.params;
        const coach = await Coach.findByPk(id);

        if (!coach) {
            return res.status(404).json({ message: 'Coach not found' });
        }

        res.json({ coach });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAvailableCoaches = async (req, res) => {
    try {
        const { startTime, endTime } = req.query;

        if (!startTime || !endTime) {
            return res.status(400).json({ message: 'Start time and end time are required' });
        }

        // Get all active coaches
        const allCoaches = await Coach.findAll({ where: { isActive: true } });

        // Get bookings that overlap with requested time
        const bookedCoaches = await Booking.findAll({
            where: {
                status: 'confirmed',
                coachId: { [Op.ne]: null },
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
            },
            attributes: ['coachId']
        });

        const bookedCoachIds = bookedCoaches.map(b => b.coachId);
        const availableCoaches = allCoaches.filter(c => !bookedCoachIds.includes(c.id));

        res.json({ coaches: availableCoaches });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCoach = async (req, res) => {
    try {
        const { name, email, phone, specialization, pricePerHour, availability, bio } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const coach = await Coach.create({
            name,
            email,
            phone,
            specialization,
            pricePerHour: pricePerHour || 20.00,
            availability,
            bio
        });

        res.status(201).json({
            message: 'Coach created successfully',
            coach
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCoach = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, specialization, pricePerHour, availability, isActive, bio } = req.body;

        const coach = await Coach.findByPk(id);

        if (!coach) {
            return res.status(404).json({ message: 'Coach not found' });
        }

        await coach.update({
            name: name !== undefined ? name : coach.name,
            email: email !== undefined ? email : coach.email,
            phone: phone !== undefined ? phone : coach.phone,
            specialization: specialization !== undefined ? specialization : coach.specialization,
            pricePerHour: pricePerHour !== undefined ? pricePerHour : coach.pricePerHour,
            availability: availability !== undefined ? availability : coach.availability,
            isActive: isActive !== undefined ? isActive : coach.isActive,
            bio: bio !== undefined ? bio : coach.bio
        });

        res.json({
            message: 'Coach updated successfully',
            coach
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCoach = async (req, res) => {
    try {
        const { id } = req.params;
        const coach = await Coach.findByPk(id);

        if (!coach) {
            return res.status(404).json({ message: 'Coach not found' });
        }

        // Soft delete
        await coach.update({ isActive: false });

        res.json({
            message: 'Coach deactivated successfully',
            coach
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllCoaches,
    getCoachById,
    getAvailableCoaches,
    createCoach,
    updateCoach,
    deleteCoach
};