import { format, parseISO, isValid } from 'date-fns';

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const formatDate = (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    return format(parsedDate, 'MMM dd, yyyy');
};

export const formatTime = (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    return format(parsedDate, 'h:mm a');
};

export const formatDateTime = (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    return format(parsedDate, 'MMM dd, yyyy h:mm a');
};

export const formatDateForInput = (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    return format(parsedDate, 'yyyy-MM-dd');
};

export const formatTimeForInput = (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    return format(parsedDate, 'HH:mm');
};

export const getDurationInHours = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (!isValid(start) || !isValid(end)) return 0;
    return (end - start) / (1000 * 60 * 60);
};