const express = require('express');
const {
    getAllPricingRules,
    getPricingRuleById,
    createPricingRule,
    updatePricingRule,
    deletePricingRule
} = require('../controllers/pricingRuleController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllPricingRules);
router.get('/:id', getPricingRuleById);
router.post('/', adminAuth, createPricingRule);
router.put('/:id', adminAuth, updatePricingRule);
router.delete('/:id', adminAuth, deletePricingRule);

module.exports = router;