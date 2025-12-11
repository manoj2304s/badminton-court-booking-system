const express = require('express');
const {
    getAllEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
} = require('../controllers/equipmentController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);
router.post('/', adminAuth, createEquipment);
router.put('/:id', adminAuth, updateEquipment);
router.delete('/:id', adminAuth, deleteEquipment);

module.exports = router;