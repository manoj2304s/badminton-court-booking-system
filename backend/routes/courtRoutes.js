const express = require('express');
const {
    getAllCourts,
    getCourtById,
    createCourt,
    updateCourt,
    deleteCourt
} = require('../controllers/courtController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllCourts);
router.get('/:id', getCourtById);
router.post('/', adminAuth, createCourt);
router.put('/:id', adminAuth, updateCourt);
router.delete('/:id', adminAuth, deleteCourt);

module.exports = router;