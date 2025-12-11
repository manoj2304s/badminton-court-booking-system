const Court = require('../models/Court');

const getAllCourts = async (req, res) => {
    try {
        const { type, isActive } = req.query;

        const whereClause = {};
        if (type) {
            whereClause.type = type;
        }
        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }

        const courts = await Court.findAll({ where: whereClause });
        res.json({ courts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCourtById = async (req, res) => {
    try {
        const { id } = req.params;
        const court = await Court.findByPk(id);

        if (!court) {
            return res.status(404).json({ message: 'Court not found' });
        }

        res.json({ court });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCourt = async (req, res) => {
    try {
        const { name, type, basePrice, description } = req.body;

        if (!name || !type) {
            return res.status(400).json({ message: 'Name and type are required' });
        }

        const court = await Court.create({
            name,
            type,
            basePrice: basePrice || 10.00,
            description
        });

        res.status(201).json({
            message: 'Court created successfully',
            court
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCourt = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, basePrice, isActive, description } = req.body;

        const court = await Court.findByPk(id);

        if (!court) {
            return res.status(404).json({ message: 'Court not found' });
        }

        await court.update({
            name: name !== undefined ? name : court.name,
            type: type !== undefined ? type : court.type,
            basePrice: basePrice !== undefined ? basePrice : court.basePrice,
            isActive: isActive !== undefined ? isActive : court.isActive,
            description: description !== undefined ? description : court.description
        });

        res.json({
            message: 'Court updated successfully',
            court
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCourt = async (req, res) => {
    try {
        const { id } = req.params;
        const court = await Court.findByPk(id);

        if (!court) {
            return res.status(404).json({ message: 'Court not found' });
        }

        // Soft delete by setting isActive to false
        await court.update({ isActive: false });

        res.json({
            message: 'Court deactivated successfully',
            court
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllCourts,
    getCourtById,
    createCourt,
    updateCourt,
    deleteCourt
};