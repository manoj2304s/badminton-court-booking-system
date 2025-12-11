const PricingRule = require('../models/PricingRule');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');

const calculatePrice = async (bookingData) => {
    const { courtId, startTime, endTime, coachId, equipment = [] } = bookingData;

    // Get court details
    const court = await Court.findByPk(courtId);
    if (!court) {
        throw new Error('Court not found');
    }

    const bookingStart = new Date(startTime);
    const bookingEnd = new Date(endTime);
    const durationHours = (bookingEnd - bookingStart) / (1000 * 60 * 60);

    let breakdown = {
        basePrice: parseFloat(court.basePrice) * durationHours,
        appliedRules: [],
        equipmentFee: 0,
        coachFee: 0,
        totalPrice: 0
    };

    // Apply pricing rules
    const activeRules = await PricingRule.findAll({
        where: { isActive: true },
        order: [['priority', 'DESC']]
    });

    let currentPrice = breakdown.basePrice;

    for (const rule of activeRules) {
        let ruleApplies = false;

        switch (rule.ruleType) {
            case 'peak_hour':
                ruleApplies = checkPeakHour(bookingStart, rule.conditions);
                break;
            case 'weekend':
                ruleApplies = checkWeekend(bookingStart);
                break;
            case 'indoor_premium':
                ruleApplies = court.type === 'indoor';
                break;
            case 'holiday':
                ruleApplies = checkHoliday(bookingStart, rule.conditions);
                break;
            case 'custom':
                ruleApplies = evaluateCustomRule(bookingStart, bookingEnd, court, rule.conditions);
                break;
        }

        if (ruleApplies) {
            let ruleAmount = 0;
            if (rule.multiplier) {
                ruleAmount = currentPrice * (parseFloat(rule.multiplier) - 1);
                currentPrice = currentPrice * parseFloat(rule.multiplier);
            } else if (rule.fixedAmount) {
                ruleAmount = parseFloat(rule.fixedAmount);
                currentPrice += ruleAmount;
            }

            breakdown.appliedRules.push({
                name: rule.name,
                type: rule.ruleType,
                amount: ruleAmount.toFixed(2)
            });
        }
    }

    breakdown.basePrice = breakdown.basePrice.toFixed(2);
    breakdown.totalPrice = currentPrice;

    // Add coach fee
    if (coachId) {
        const coach = await Coach.findByPk(coachId);
        if (coach) {
            breakdown.coachFee = (parseFloat(coach.pricePerHour) * durationHours).toFixed(2);
            breakdown.totalPrice += parseFloat(breakdown.coachFee);
        }
    }

    // Add equipment fees
    if (equipment && equipment.length > 0) {
        for (const item of equipment) {
            const equipmentItem = await Equipment.findByPk(item.equipmentId);
            if (equipmentItem) {
                const itemCost = parseFloat(equipmentItem.pricePerUnit) * item.quantity * durationHours;
                breakdown.equipmentFee += itemCost;
            }
        }
        breakdown.equipmentFee = breakdown.equipmentFee.toFixed(2);
        breakdown.totalPrice += parseFloat(breakdown.equipmentFee);
    }

    breakdown.totalPrice = breakdown.totalPrice.toFixed(2);

    return breakdown;
};

const checkPeakHour = (dateTime, conditions) => {
    if (!conditions || !conditions.startTime || !conditions.endTime) return false;

    const hour = dateTime.getHours();
    const minute = dateTime.getMinutes();
    const timeInMinutes = hour * 60 + minute;

    const [startHour, startMinute] = conditions.startTime.split(':').map(Number);
    const [endHour, endMinute] = conditions.endTime.split(':').map(Number);
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    return timeInMinutes >= startTimeInMinutes && timeInMinutes < endTimeInMinutes;
};

const checkWeekend = (dateTime) => {
    const day = dateTime.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

const checkHoliday = (dateTime, conditions) => {
    if (!conditions || !conditions.holidays) return false;

    const dateString = dateTime.toISOString().split('T')[0];
    return conditions.holidays.includes(dateString);
};

const evaluateCustomRule = (startTime, endTime, court, conditions) => {
    if (!conditions) return false;

    // Check if all conditions in the custom rule are met
    if (conditions.courtType && court.type !== conditions.courtType) {
        return false;
    }

    if (conditions.days) {
        const day = startTime.getDay();
        if (!conditions.days.includes(day)) {
            return false;
        }
    }

    if (conditions.startTime && conditions.endTime) {
        if (!checkPeakHour(startTime, conditions)) {
            return false;
        }
    }

    return true;
};

module.exports = { calculatePrice };