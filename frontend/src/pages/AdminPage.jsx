import { useState, useEffect } from 'react';
import courtService from '../services/courtService';
import adminService from '../services/adminService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import { formatCurrency } from '../utils/formatters';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('courts');
    const [courts, setCourts] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [pricingRules, setPricingRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModal, setEditModal] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'courts') {
                const res = await courtService.getAllCourts();
                setCourts(res.courts);
            } else if (activeTab === 'equipment') {
                const res = await courtService.getAllEquipment();
                setEquipment(res.equipment);
            } else if (activeTab === 'coaches') {
                const res = await courtService.getAllCoaches();
                setCoaches(res.coaches);
            } else if (activeTab === 'pricing') {
                const res = await adminService.getAllPricingRules();
                setPricingRules(res.rules);
            }
        } catch (err) {
            console.error('Failed to load data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item, type) => {
        setEditModal({ type, item });
        setFormData(item);
    };

    const handleCreate = (type) => {
        setEditModal({ type, item: null });
        setFormData({});
    };

    const handleSave = async () => {
        try {
            const { type, item } = editModal;

            if (type === 'court') {
                if (item) {
                    await adminService.updateCourt(item.id, formData);
                } else {
                    await adminService.createCourt(formData);
                }
            } else if (type === 'equipment') {
                if (item) {
                    await adminService.updateEquipment(item.id, formData);
                } else {
                    await adminService.createEquipment(formData);
                }
            } else if (type === 'coach') {
                if (item) {
                    await adminService.updateCoach(item.id, formData);
                } else {
                    await adminService.createCoach(formData);
                }
            } else if (type === 'pricing') {
                if (item) {
                    await adminService.updatePricingRule(item.id, formData);
                } else {
                    await adminService.createPricingRule(formData);
                }
            }

            setEditModal(null);
            loadData();
        } catch (err) {
            console.error('Failed to save', err);
        }
    };

    const tabs = [
        { id: 'courts', name: 'Courts', icon: '🏟️' },
        { id: 'equipment', name: 'Equipment', icon: '🎾' },
        { id: 'coaches', name: 'Coaches', icon: '👨‍🏫' },
        { id: 'pricing', name: 'Pricing Rules', icon: '💰' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div>
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={() => handleCreate(activeTab === 'courts' ? 'court' : activeTab === 'equipment' ? 'equipment' : activeTab === 'coaches' ? 'coach' : 'pricing')}
                            className="btn-primary"
                        >
                            + Add New
                        </button>
                    </div>

                    {activeTab === 'courts' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {courts.map(court => (
                                <div key={court.id} className="card">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold">{court.name}</h3>
                                            <span className={`inline-block px-2 py-1 rounded text-xs ${court.type === 'indoor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                {court.type}
                                            </span>
                                        </div>
                                        <button onClick={() => handleEdit(court, 'court')} className="text-primary-600 hover:text-primary-700">
                                            Edit
                                        </button>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">{court.description}</p>
                                    <p className="text-xl font-bold text-primary-600">{formatCurrency(court.basePrice)}/hr</p>
                                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${court.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {court.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'equipment' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {equipment.map(item => (
                                <div key={item.id} className="card">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold">{item.name}</h3>
                                        <button onClick={() => handleEdit(item, 'equipment')} className="text-primary-600 hover:text-primary-700 text-sm">
                                            Edit
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{item.type}</p>
                                    <p className="text-gray-700"><strong>Quantity:</strong> {item.totalQuantity}</p>
                                    <p className="text-gray-700"><strong>Price:</strong> {formatCurrency(item.pricePerUnit)}/hr</p>
                                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {item.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'coaches' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {coaches.map(coach => (
                                <div key={coach.id} className="card">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold">{coach.name}</h3>
                                            <p className="text-sm text-gray-600">{coach.specialization}</p>
                                        </div>
                                        <button onClick={() => handleEdit(coach, 'coach')} className="text-primary-600 hover:text-primary-700">
                                            Edit
                                        </button>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">{coach.bio}</p>
                                    <p className="text-gray-700"><strong>Email:</strong> {coach.email}</p>
                                    <p className="text-gray-700"><strong>Phone:</strong> {coach.phone}</p>
                                    <p className="text-xl font-bold text-primary-600 mt-2">{formatCurrency(coach.pricePerHour)}/hr</p>
                                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${coach.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {coach.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'pricing' && (
                        <div className="space-y-4">
                            {pricingRules.map(rule => (
                                <div key={rule.id} className="card">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold">{rule.name}</h3>
                                                <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                                                    {rule.ruleType}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs ${rule.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {rule.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2">{rule.description}</p>
                                            <div className="text-sm text-gray-700">
                                                {rule.multiplier && <p><strong>Multiplier:</strong> {rule.multiplier}x</p>}
                                                {rule.fixedAmount && <p><strong>Fixed Amount:</strong> {formatCurrency(rule.fixedAmount)}</p>}
                                                <p><strong>Priority:</strong> {rule.priority}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleEdit(rule, 'pricing')} className="text-primary-600 hover:text-primary-700">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={!!editModal}
                onClose={() => setEditModal(null)}
                title={`${editModal?.item ? 'Edit' : 'Create'} ${editModal?.type}`}
                size="lg"
            >
                <div className="space-y-4">
                    {editModal?.type === 'court' && (
                        <>
                            <input
                                type="text"
                                placeholder="Court Name"
                                value={formData.name || ''}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="input-field"
                            />
                            <select
                                value={formData.type || ''}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Select Type</option>
                                <option value="indoor">Indoor</option>
                                <option value="outdoor">Outdoor</option>
                            </select>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Base Price"
                                value={formData.basePrice || ''}
                                onChange={e => setFormData({ ...formData, basePrice: e.target.value })}
                                className="input-field"
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="input-field"
                                rows="3"
                            />
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive ?? true}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="mr-2"
                                />
                                Active
                            </label>
                        </>
                    )}

                    {editModal?.type === 'equipment' && (
                        <>
                            <input
                                type="text"
                                placeholder="Equipment Name"
                                value={formData.name || ''}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="input-field"
                            />
                            <select
                                value={formData.type || ''}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Select Type</option>
                                <option value="racket">Racket</option>
                                <option value="shoes">Shoes</option>
                                <option value="other">Other</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Total Quantity"
                                value={formData.totalQuantity || ''}
                                onChange={e => setFormData({ ...formData, totalQuantity: e.target.value })}
                                className="input-field"
                            />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Price Per Unit"
                                value={formData.pricePerUnit || ''}
                                onChange={e => setFormData({ ...formData, pricePerUnit: e.target.value })}
                                className="input-field"
                            />
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive ?? true}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="mr-2"
                                />
                                Active
                            </label>
                        </>
                    )}

                    {editModal?.type === 'coach' && (
                        <>
                            <input
                                type="text"
                                placeholder="Coach Name"
                                value={formData.name || ''}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="input-field"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email || ''}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="input-field"
                            />
                            <input
                                type="tel"
                                placeholder="Phone"
                                value={formData.phone || ''}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="input-field"
                            />
                            <input
                                type="text"
                                placeholder="Specialization (e.g., Beginner Training)"
                                value={formData.specialization || ''}
                                onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                className="input-field"
                            />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Price Per Hour"
                                value={formData.pricePerHour || ''}
                                onChange={e => setFormData({ ...formData, pricePerHour: e.target.value })}
                                className="input-field"
                            />
                            <textarea
                                placeholder="Bio"
                                value={formData.bio || ''}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                className="input-field"
                                rows="3"
                            />
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive ?? true}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="mr-2"
                                />
                                Active
                            </label>
                        </>
                    )}

                    {editModal?.type === 'pricing' && (
                        <>
                            <input
                                type="text"
                                placeholder="Rule Name (e.g., Peak Hour Premium)"
                                value={formData.name || ''}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="input-field"
                            />
                            <select
                                value={formData.ruleType || ''}
                                onChange={e => setFormData({ ...formData, ruleType: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Select Rule Type</option>
                                <option value="peak_hour">Peak Hour</option>
                                <option value="weekend">Weekend</option>
                                <option value="indoor_premium">Indoor Premium</option>
                                <option value="holiday">Holiday</option>
                                <option value="custom">Custom</option>
                            </select>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Multiplier (e.g., 1.5 for 50% increase)"
                                value={formData.multiplier || ''}
                                onChange={e => setFormData({ ...formData, multiplier: e.target.value })}
                                className="input-field"
                            />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Fixed Amount (alternative to multiplier)"
                                value={formData.fixedAmount || ''}
                                onChange={e => setFormData({ ...formData, fixedAmount: e.target.value })}
                                className="input-field"
                            />
                            <input
                                type="number"
                                placeholder="Priority (higher number = applied first)"
                                value={formData.priority || ''}
                                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                className="input-field"
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="input-field"
                                rows="2"
                            />
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive ?? true}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="mr-2"
                                />
                                Active
                            </label>
                        </>
                    )}

                    <div className="flex space-x-3 mt-6">
                        <button onClick={() => setEditModal(null)} className="flex-1 btn-secondary">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="flex-1 btn-primary">
                            Save
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminPage;