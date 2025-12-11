import { useState, useEffect } from 'react';
import bookingService from '../../services/bookingService';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [cancelModal, setCancelModal] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        loadBookings();
    }, [filter]);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const statusFilter = filter === 'all' ? undefined : filter;
            const response = await bookingService.getUserBookings(statusFilter);
            setBookings(response.bookings);
        } catch (err) {
            setError('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        setCancelling(true);
        try {
            await bookingService.cancelBooking(bookingId);
            setCancelModal(null);
            loadBookings();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel booking');
        } finally {
            setCancelling(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            confirmed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            completed: 'bg-gray-100 text-gray-800',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const canCancelBooking = (booking) => {
        if (booking.status !== 'confirmed') return false;
        const bookingTime = new Date(booking.startTime);
        const now = new Date();
        return bookingTime > now;
    };

    if (loading) return <LoadingSpinner text="Loading your bookings..." />;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">My Bookings</h1>

                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('confirmed')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'confirmed'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('cancelled')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'cancelled'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Cancelled
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {bookings.length === 0 ? (
                <div className="card text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-600">You haven't made any bookings yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking.id} className="card hover:shadow-lg transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex-1 mb-4 lg:mb-0">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {booking.court?.name}
                                        </h3>
                                        {getStatusBadge(booking.status)}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {formatDateTime(booking.startTime)}
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Until {new Date(booking.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                        </div>

                                        {booking.coach && (
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Coach: {booking.coach.name}
                                            </div>
                                        )}

                                        {booking.equipment && booking.equipment.length > 0 && (
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                Equipment: {booking.equipment.length} item(s)
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end space-y-2">
                                    <div className="text-2xl font-bold text-primary-600">
                                        {formatCurrency(booking.totalPrice)}
                                    </div>

                                    {canCancelBooking(booking) && (
                                        <button
                                            onClick={() => setCancelModal(booking)}
                                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                                        >
                                            Cancel Booking
                                        </button>
                                    )}
                                </div>
                            </div>

                            {booking.notes && (
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm text-gray-600">
                                        <strong>Notes:</strong> {booking.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={!!cancelModal}
                onClose={() => setCancelModal(null)}
                title="Cancel Booking"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to cancel this booking? This action cannot be undone.
                    </p>

                    {cancelModal && (
                        <div className="bg-gray-50 p-4 rounded">
                            <p className="text-sm"><strong>Court:</strong> {cancelModal.court?.name}</p>
                            <p className="text-sm"><strong>Date:</strong> {formatDateTime(cancelModal.startTime)}</p>
                            <p className="text-sm"><strong>Amount:</strong> {formatCurrency(cancelModal.totalPrice)}</p>
                        </div>
                    )}

                    <div className="flex space-x-3">
                        <button
                            onClick={() => setCancelModal(null)}
                            className="flex-1 btn-secondary"
                            disabled={cancelling}
                        >
                            Keep Booking
                        </button>
                        <button
                            onClick={() => handleCancelBooking(cancelModal.id)}
                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                            disabled={cancelling}
                        >
                            {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default BookingList;