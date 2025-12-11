const Equipment = require('../models/Equipment');

const getAllEquipment = async (req, res) => {
    try {
        const { type, isActive } = req.query;

        const whereClause = {};
        if (type) {
            whereClause.type = type;
        }
        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }

        const equipment = await Equipment.findAll({ where: whereClause });
        res.json({ equipment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEquipmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const equipment = await Equipment.findByPk(id);

        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        res.json({ equipment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEquipment = async (req, res) => {
    try {
        const { name, type, totalQuantity, pricePerUnit, description } = req.body;

        if (!name || !type || totalQuantity === undefined) {
            return res.status(400).json({ message: 'Name, type, and total quantity are required' });
        }

        const equipment = await Equipment.create({
            name,
            type,
            totalQuantity,
            pricePerUnit: pricePerUnit || 0,
            description
        });

        res.status(201).json({
            message: 'Equipment created successfully',
            equipment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, totalQuantity, pricePerUnit, isActive, description } = req.body;

        const equipment = await Equipment.findByPk(id);

        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        await equipment.update({
            name: name !== undefined ? name : equipment.name,
            type: type !== undefined ? type : equipment.type,
            totalQuantity: totalQuantity !== undefined ? totalQuantity : equipment.totalQuantity,
            pricePerUnit: pricePerUnit !== undefined ? pricePerUnit : equipment.pricePerUnit,
            isActive: isActive !== undefined ? isActive : equipment.isActive,
            description: description !== undefined ? description : equipment.description
        });

        res.json({
            message: 'Equipment updated successfully',
            equipment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const equipment = await Equipment.findByPk(id);

        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        // Soft delete
        await equipment.update({ isActive: false });

        res.json({
            message: 'Equipment deactivated successfully',
            equipment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
};