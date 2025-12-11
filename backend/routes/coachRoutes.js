const express = require('express');
const {
    getAllCoaches,
    getCoachById,
    getAvailableCoaches,
    createCoach,
    updateCoach,
    deleteCoach
} = require('../controllers/coachController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllCoaches);
router.get('/available', getAvailableCoaches);
router.get('/:id', getCoachById);
router.post('/', adminAuth, createCoach);
router.put('/:id', adminAuth, updateCoach);
router.delete('/:id', adminAuth, deleteCoach);

module.exports = router;