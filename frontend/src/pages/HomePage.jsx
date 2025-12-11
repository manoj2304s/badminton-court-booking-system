import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                            Book Your Court in Seconds
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100">
                            Premium badminton courts, professional coaches, and quality equipment
                        </p>
                        <div className="flex justify-center space-x-4">
                            {isAuthenticated() ? (
                                <Link to="/booking" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                                    Book Now
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                                        Get Started
                                    </Link>
                                    <Link to="/login" className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary-400 transition-colors border-2 border-white">
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Why Choose CourtBook?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Real-Time Availability</h3>
                            <p className="text-gray-600">
                                See live availability and book instantly. No waiting, no hassle.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Dynamic Pricing</h3>
                            <p className="text-gray-600">
                                Transparent pricing based on time, court type, and demand.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Professional Coaches</h3>
                            <p className="text-gray-600">
                                Book experienced coaches to improve your game.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Facilities Section */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Our Facilities
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="card">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                    <span className="text-3xl">🏢</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Indoor Courts</h3>
                                    <p className="text-gray-600">2 Premium AC Courts</p>
                                </div>
                            </div>
                            <ul className="space-y-2 text-gray-600">
                                <li>✓ Climate controlled environment</li>
                                <li>✓ Professional lighting</li>
                                <li>✓ Non-slip flooring</li>
                                <li>✓ Spectator seating</li>
                            </ul>
                        </div>

                        <div className="card">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-100 p-3 rounded-lg mr-4">
                                    <span className="text-3xl">🌳</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Outdoor Courts</h3>
                                    <p className="text-gray-600">2 Standard Courts</p>
                                </div>
                            </div>
                            <ul className="space-y-2 text-gray-600">
                                <li>✓ Natural playing conditions</li>
                                <li>✓ Well-maintained courts</li>
                                <li>✓ Covered waiting area</li>
                                <li>✓ Budget-friendly rates</li>
                            </ul>
                        </div>

                        <div className="card">
                            <div className="flex items-center mb-4">
                                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                                    <span className="text-3xl">🎾</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Equipment Rental</h3>
                                    <p className="text-gray-600">Quality Gear Available</p>
                                </div>
                            </div>
                            <ul className="space-y-2 text-gray-600">
                                <li>✓ Professional rackets</li>
                                <li>✓ Non-marking shoes</li>
                                <li>✓ Premium shuttlecocks</li>
                                <li>✓ Affordable hourly rates</li>
                            </ul>
                        </div>

                        <div className="card">
                            <div className="flex items-center mb-4">
                                <div className="bg-orange-100 p-3 rounded-lg mr-4">
                                    <span className="text-3xl">👨‍🏫</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Expert Coaching</h3>
                                    <p className="text-gray-600">3 Certified Coaches</p>
                                </div>
                            </div>
                            <ul className="space-y-2 text-gray-600">
                                <li>✓ Beginner to advanced training</li>
                                <li>✓ Personalized sessions</li>
                                <li>✓ Kids programs available</li>
                                <li>✓ Flexible scheduling</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Play?
                    </h2>
                    <p className="text-xl mb-8 text-primary-100">
                        Join hundreds of players who book with us every week
                    </p>
                    <Link
                        to={isAuthenticated() ? '/booking' : '/register'}
                        className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                    >
                        {isAuthenticated() ? 'Book Your Court' : 'Create Free Account'}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;