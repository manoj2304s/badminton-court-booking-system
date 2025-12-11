import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import courtService from '../../services/courtService';
import bookingService from '../../services/bookingService';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import { formatCurrency, formatDateTime, getDurationInHours } from '../../utils/formatters';

const BookingForm = () => {
    const navigate = useNavigate();
    const [courts, setCourts] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [formData, setFormData] = useState({
        courtId: '',
        date: '',
        startTime: '',
        endTime: '',
        coachId: '',
        equipment: [],
        notes: '',
    });

    const [availability, setAvailability] = useState(null);
    const [pricing, setPricing] = useState(null);
    const [checkingPrice, setCheckingPrice] = useState(false);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (formData.courtId && formData.date && formData.startTime && formData.endTime) {
            checkPricing();
        }
    }, [formData.courtId, formData.date, formData.startTime, formData.endTime, formData.coachId, formData.equipment]);

    const loadInitialData = async () => {
        try {
            const [courtsRes, equipmentRes] = await Promise.all([
                courtService.getAllCourts({ isActive: true }),
                courtService.getAllEquipment(),
            ]);
            setCourts(courtsRes.courts);
            setEquipment(equipmentRes.equipment.filter(e => e.isActive));
        } catch (err) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const loadAvailableCoaches = async (startTime, endTime) => {
        try {
            const response = await courtService.getAvailableCoaches(startTime, endTime);
            setCoaches(response.coaches);
        } catch (err) {
            console.error('Failed to load coaches', err);
            setCoaches([]);
        }
    };

    const checkPricing = async () => {
        if (!formData.courtId || !formData.date || !formData.startTime || !formData.endTime) {
            return;
        }

        setCheckingPrice(true);
        setError('');

        const startTime = new Date(`${formData.date}T${formData.startTime}`);
        const endTime = new Date(`${formData.date}T${formData.endTime}`);

        if (endTime <= startTime) {
            setError('End time must be after start time');
            setCheckingPrice(false);
            return;
        }

        try {
            const bookingData = {
                courtId: parseInt(formData.courtId),
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                coachId: formData.coachId ? parseInt(formData.coachId) : null,
                equipment: formData.equipment.map(e => ({
                    equipmentId: e.equipmentId,
                    quantity: e.quantity
                }))
            };

            const [availabilityRes, pricingRes] = await Promise.all([
                bookingService.checkAvailability(bookingData),
                bookingService.calculatePrice(bookingData)
            ]);

            setAvailability(availabilityRes);
            setPricing(pricingRes);

            // Load available coaches
            await loadAvailableCoaches(startTime.toISOString(), endTime.toISOString());
        } catch (err) {
            setError('Failed to check availability');
        } finally {
            setCheckingPrice(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEquipmentChange = (equipmentId, quantity) => {
        const existingIndex = formData.equipment.findIndex(e => e.equipmentId === equipmentId);

        if (quantity === 0) {
            setFormData({
                ...formData,
                equipment: formData.equipment.filter(e => e.equipmentId !== equipmentId)
            });
        } else if (existingIndex >= 0) {
            const newEquipment = [...formData.equipment];
            newEquipment[existingIndex].quantity = quantity;
            setFormData({
                ...formData,
                equipment: newEquipment
            });
        } else {
            setFormData({
                ...formData,
                equipment: [...formData.equipment, { equipmentId, quantity }]
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!availability?.available) {
            setError('Selected resources are not available');
            return;
        }

        setShowConfirmModal(true);
    };

    const confirmBooking = async () => {
        setSubmitting(true);
        setError('');

        try {
            const startTime = new Date(`${formData.date}T${formData.startTime}`);
            const endTime = new Date(`${formData.date}T${formData.endTime}`);

            const bookingData = {
                courtId: parseInt(formData.courtId),
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                coachId: formData.coachId ? parseInt(formData.coachId) : null,
                equipment: formData.equipment.map(e => ({
                    equipmentId: e.equipmentId,
                    quantity: e.quantity
                })),
                notes: formData.notes
            };

            await bookingService.createBooking(bookingData);
            navigate('/my-bookings');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking');
            setShowConfirmModal(false);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading booking form..." />;

    const selectedCourt = courts.find(c => c.id === parseInt(formData.courtId));
    const duration = formData.startTime && formData.endTime
        ? getDurationInHours(
            new Date(`${formData.date}T${formData.startTime}`),
            new Date(`${formData.date}T${formData.endTime}`)
        )
        : 0;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Book a Court</h1>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="card space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Court *
                            </label>
                            <select
                                name="courtId"
                                value={formData.courtId}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            >
                                <option value="">Choose a court</option>
                                {courts.map(court => (
                                    <option key={court.id} value={court.id}>
                                        {court.name} - {court.type} (${court.basePrice}/hr)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time *
                                </label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Time *
                                </label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    required
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {duration > 0 && (
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                Duration: {duration} hour{duration !== 1 ? 's' : ''}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add Coach (Optional)
                            </label>
                            <select
                                name="coachId"
                                value={formData.coachId}
                                onChange={handleInputChange}
                                className="input-field"
                                disabled={coaches.length === 0}
                            >
                                <option value="">No coach needed</option>
                                {coaches.map(coach => (
                                    <option key={coach.id} value={coach.id}>
                                        {coach.name} - {coach.specialization} (${coach.pricePerHour}/hr)
                                    </option>
                                ))}
                            </select>
                            {coaches.length === 0 && formData.date && formData.startTime && (
                                <p className="mt-1 text-sm text-gray-500">No coaches available for selected time</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Add Equipment (Optional)
                            </label>
                            <div className="space-y-3">
                                {equipment.map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-600">${item.pricePerUnit}/hr each</p>
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            max={item.totalQuantity}
                                            value={formData.equipment.find(e => e.equipmentId === item.id)?.quantity || 0}
                                            onChange={(e) => handleEquipmentChange(item.id, parseInt(e.target.value) || 0)}
                                            className="w-20 input-field"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes (Optional)
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows="3"
                                className="input-field"
                                placeholder="Any special requests or notes..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!availability?.available || checkingPrice || submitting}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Booking...' : 'Proceed to Confirm'}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-1">
                    <div className="card sticky top-4">
                        <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>

                        {checkingPrice ? (
                            <LoadingSpinner size="sm" text="Calculating..." />
                        ) : pricing ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Base Price:</span>
                                        <span className="font-medium">{formatCurrency(pricing.basePrice)}</span>
                                    </div>

                                    {pricing.appliedRules?.map((rule, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{rule.name}:</span>
                                            <span className="font-medium text-green-600">+{formatCurrency(rule.amount)}</span>
                                        </div>
                                    ))}

                                    {pricing.coachFee > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Coach Fee:</span>
                                            <span className="font-medium">{formatCurrency(pricing.coachFee)}</span>
                                        </div>
                                    )}

                                    {pricing.equipmentFee > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Equipment Fee:</span>
                                            <span className="font-medium">{formatCurrency(pricing.equipmentFee)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total:</span>
                                        <span className="text-primary-600">{formatCurrency(pricing.totalPrice)}</span>
                                    </div>
                                </div>

                                {availability && (
                                    <div className={`p-3 rounded ${availability.available ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                        <p className="text-sm font-medium">
                                            {availability.available ? '✓ All resources available' : '✗ Some resources unavailable'}
                                        </p>
                                        {!availability.available && availability.conflicts && (
                                            <ul className="mt-2 text-xs space-y-1">
                                                {availability.conflicts.map((conflict, idx) => (
                                                    <li key={idx}>• {conflict.message}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">Fill in the booking details to see pricing</p>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Confirm Booking"
            >
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Booking Details:</h4>
                        <div className="text-sm space-y-1 text-gray-600">
                            <p><strong>Court:</strong> {selectedCourt?.name}</p>
                            <p><strong>Date & Time:</strong> {formatDateTime(new Date(`${formData.date}T${formData.startTime}`))} - {formData.endTime}</p>
                            <p><strong>Duration:</strong> {duration} hour{duration !== 1 ? 's' : ''}</p>
                            {formData.coachId && (
                                <p><strong>Coach:</strong> {coaches.find(c => c.id === parseInt(formData.coachId))?.name}</p>
                            )}
                        </div>
                    </div>

                    {pricing && (
                        <div className="bg-gray-50 p-4 rounded">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Amount:</span>
                                <span className="text-primary-600">{formatCurrency(pricing.totalPrice)}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="flex-1 btn-secondary"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmBooking}
                            className="flex-1 btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Booking...' : 'Confirm & Book'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default BookingForm;