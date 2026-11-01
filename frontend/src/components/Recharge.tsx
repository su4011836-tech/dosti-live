import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Coins, Upload, Loader2 } from 'lucide-react';
import api from '../api/client';

interface Package {
    id: string;
    coins: number;
    price: number;
}

interface PaymentSettings {
    jazzcash_name?: string;
    jazzcash_number?: string;
    jazzcash_enabled?: string;
    easypaisa_name?: string;
    easypaisa_number?: string;
    easypaisa_enabled?: string;
}

const Recharge: React.FC = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState<Package[]>([]);
    const [settings, setSettings] = useState<PaymentSettings>({});
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [method, setMethod] = useState<'JAZZCASH' | 'EASYPAISA' | null>(null);
    const [transactionId, setTransactionId] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/payments/packages').then(res => setPackages(res.data)).catch(console.error);
        api.get('/payments/settings').then(res => setSettings(res.data)).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPackage || !method || !transactionId || !file) {
            setMessage('Please fill all fields and upload a screenshot.');
            return;
        }

        setLoading(true);
        setMessage('');
        const formData = new FormData();
        formData.append('method', method);
        formData.append('amountPaid', selectedPackage.price.toString());
        formData.append('coinsRequested', selectedPackage.coins.toString());
        formData.append('transactionId', transactionId);
        formData.append('screenshot', file);

        try {
            await api.post('/payments/manual', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('Payment submitted! Admin will verify and credit your coins shortly.');
            setTimeout(() => navigate('/wallet'), 3000);
        } catch (error: any) {
            setMessage(error.response?.data?.error || 'Failed to submit payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-darker pb-10">
            <div className="px-4 pt-4 pb-2 flex items-center mb-4 sticky top-0 bg-dark-darker/90 backdrop-blur-md z-10 border-b border-dark-light">
                <button onClick={() => navigate(-1)} className="text-gray-300 hover:text-white transition p-2 -ml-2">
                    <ChevronLeft size={28} />
                </button>
                <h1 className="text-xl font-bold ml-2">Recharge Coins</h1>
            </div>

            <div className="px-4 space-y-6">
                {/* Select Package */}
                <div>
                    <h2 className="text-sm font-bold text-gray-400 mb-3">1. Select Package</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {packages.map(pkg => (
                            <div
                                key={pkg.id}
                                onClick={() => setSelectedPackage(pkg)}
                                className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col items-center ${selectedPackage?.id === pkg.id ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-800 bg-dark hover:border-gray-600'}`}
                            >
                                <Coins size={24} className={selectedPackage?.id === pkg.id ? 'text-yellow-400' : 'text-yellow-600'} />
                                <h3 className="font-bold text-lg mt-2">{pkg.coins}</h3>
                                <p className="text-xs text-gray-400 mt-1">Rs {pkg.price}</p>
                            </div>
                        ))}
                        {packages.length === 0 && <p className="text-gray-500 text-sm">No packages available.</p>}
                    </div>
                </div>

                {/* Select Method */}
                {selectedPackage && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-sm font-bold text-gray-400 mb-3">2. Select Payment Method</h2>
                        <div className="space-y-3">
                            {settings.jazzcash_enabled === 'true' && (
                                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition ${method === 'JAZZCASH' ? 'border-primary bg-primary/10' : 'border-gray-800 bg-dark'}`}>
                                    <input type="radio" name="method" value="JAZZCASH" onChange={() => setMethod('JAZZCASH')} className="hidden" />
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${method === 'JAZZCASH' ? 'border-primary' : 'border-gray-600'}`}>
                                        {method === 'JAZZCASH' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                                    </div>
                                    <span className="font-bold">JazzCash</span>
                                </label>
                            )}
                            {settings.easypaisa_enabled === 'true' && (
                                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition ${method === 'EASYPAISA' ? 'border-green-500 bg-green-500/10' : 'border-gray-800 bg-dark'}`}>
                                    <input type="radio" name="method" value="EASYPAISA" onChange={() => setMethod('EASYPAISA')} className="hidden" />
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${method === 'EASYPAISA' ? 'border-green-500' : 'border-gray-600'}`}>
                                        {method === 'EASYPAISA' && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                                    </div>
                                    <span className="font-bold">Easypaisa</span>
                                </label>
                            )}
                        </div>
                    </div>
                )}

                {/* Payment Instructions & Form */}
                {method && selectedPackage && (
                    <div className="animate-fade-in-up bg-dark rounded-2xl p-5 border border-gray-800">
                        <h3 className="font-bold text-lg mb-2 flex items-center">
                            Pay Rs {selectedPackage.price} via {method === 'JAZZCASH' ? 'JazzCash' : 'Easypaisa'}
                        </h3>
                        <div className="bg-black/30 p-3 rounded-xl mb-4 text-sm text-gray-300">
                            <p>Please send <strong className="text-white">Rs {selectedPackage.price}</strong> to:</p>
                            <div className="mt-2 text-white">
                                <p>Account Name: <strong>{method === 'JAZZCASH' ? settings.jazzcash_name : settings.easypaisa_name}</strong></p>
                                <p>Account Number: <strong className="text-primary-light">{method === 'JAZZCASH' ? settings.jazzcash_number : settings.easypaisa_number}</strong></p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Transaction/Reference ID</label>
                                <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="Enter TID from SMS"
                                    className="w-full bg-dark-light rounded-lg px-4 py-3 text-white border border-gray-700 focus:border-primary outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Upload Screenshot</label>
                                <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-600 rounded-lg hover:border-primary-light transition cursor-pointer bg-dark-light/50">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        required
                                    />
                                    <div className="flex flex-col items-center text-gray-400">
                                        <Upload size={24} className="mb-2" />
                                        <span className="text-xs">{file ? file.name : "Tap to upload image"}</span>
                                    </div>
                                </label>
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg text-sm font-bold text-center ${message.includes('successfully') || message.includes('shortly') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 transition flex items-center justify-center disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Submit Payment Request"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recharge;
