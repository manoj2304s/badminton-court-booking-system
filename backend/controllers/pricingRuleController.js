const PricingRule = require('../models/PricingRule');

const getAllPricingRules = async (req, res) => {
    try {
        const { isActive, ruleType } = req.query;

        const whereClause = {};
        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }
        if (ruleType) {
            whereClause.ruleType = ruleType;
        }

        const rules = await PricingRule.findAll({
            where: whereClause,
            order: [['priority', 'DESC']]
        });

        res.json({ rules });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPricingRuleById = async (req, res) => {
    try {
        const { id } = req.params;
        const rule = await PricingRule.findByPk(id);

        if (!rule) {
            return res.status(404).json({ message: 'Pricing rule not found' });
        }

        res.json({ rule });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPricingRule = async (req, res) => {
    try {
        const { name, ruleType, multiplier, fixedAmount, conditions, priority, description } = req.body;

        if (!name || !ruleType) {
            return res.status(400).json({ message: 'Name and rule type are required' });
        }

        if (!multiplier && !fixedAmount) {
            return res.status(400).json({ message: 'Either multiplier or fixed amount must be provided' });
        }

        const rule = await PricingRule.create({
            name,
            ruleType,
            multiplier,
            fixedAmount,
            conditions,
            priority: priority || 0,
            description
        });

        res.status(201).json({
            message: 'Pricing rule created successfully',
            rule
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePricingRule = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, ruleType, multiplier, fixedAmount, conditions, priority, isActive, description } = req.body;

        const rule = await PricingRule.findByPk(id);

        if (!rule) {
            return res.status(404).json({ message: 'Pricing rule not found' });
        }

        await rule.update({
            name: name !== undefined ? name : rule.name,
            ruleType: ruleType !== undefined ? ruleType : rule.ruleType,
            multiplier: multiplier !== undefined ? multiplier : rule.multiplier,
            fixedAmount: fixedAmount !== undefined ? fixedAmount : rule.fixedAmount,
            conditions: conditions !== undefined ? conditions : rule.conditions,
            priority: priority !== undefined ? priority : rule.priority,
            isActive: isActive !== undefined ? isActive : rule.isActive,
            description: description !== undefined ? description : rule.description
        });

        res.json({
            message: 'Pricing rule updated successfully',
            rule
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePricingRule = async (req, res) => {
    try {
        const { id } = req.params;
        const rule = await PricingRule.findByPk(id);

        if (!rule) {
            return res.status(404).json({ message: 'Pricing rule not found' });
        }

        // Soft delete
        await rule.update({ isActive: false });

        res.json({
            message: 'Pricing rule deactivated successfully',
            rule
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllPricingRules,
    getPricingRuleById,
    createPricingRule,
    updatePricingRule,
    deletePricingRule
};