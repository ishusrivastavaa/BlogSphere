import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, EnvelopeSimple, LockKey, Eye, EyeSlash, ArrowRight, WarningCircle, UserPlus } from '@phosphor-icons/react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-gray-800 antialiased min-h-screen flex items-center justify-center relative overflow-hidden py-10">
            {/* Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-blue-300/35 blur-3xl" />
                <div className="absolute bottom-[0%] left-[0%] w-[60%] h-[60%] rounded-full bg-indigo-300/30 blur-3xl" />
            </div>

            <Link to="/" className="absolute top-6 left-6 text-gray-700 hover:text-indigo-700 flex items-center gap-2 font-semibold transition-colors glass px-4 py-2 rounded-full">
                ← Back to Home
            </Link>

            <div className="w-full max-w-lg px-4 fade-in">
                <div className="glass-card p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden mt-10 sm:mt-0">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                            <UserPlus weight="bold" size={28} />
                        </div>
                        <h1 className="text-3xl font-bold text-indigo-950" style={{ fontFamily: 'Outfit, sans-serif' }}>Create an Account</h1>
                        <p className="text-gray-700 mt-2">Join our community and start sharing.</p>
                    </div>

                    <form id="registerForm" onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="text-sm font-semibold text-gray-800 block">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text" id="name" required value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white/60 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-semibold text-gray-800 block">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                    <EnvelopeSimple size={18} />
                                </div>
                                <input
                                    type="email" id="email" required value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white/60 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-sm font-semibold text-gray-800 block">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                    <LockKey size={18} />
                                </div>
                                <input
                                    type={showPw ? 'text' : 'password'} id="password" required value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3 bg-white/60 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="Create a strong password"
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-indigo-700 focus:outline-none">
                                    {showPw ? <EyeSlash size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-600">Must be at least 8 characters long.</p>
                        </div>

                        {error && (
                            <div id="errorMessage" className="bg-red-50 text-red-700 text-sm p-3 rounded-xl flex items-center gap-2 border border-red-200">
                                <WarningCircle weight="fill" size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit" id="submitBtn" disabled={loading}
                            className="w-full btn-primary text-white font-semibold py-3.5 rounded-xl shadow-lg flex justify-center items-center gap-2 mt-2 disabled:opacity-70"
                        >
                            {loading ? <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : null}
                            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                            {!loading && <ArrowRight weight="bold" size={18} />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-700">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-indigo-700 hover:text-indigo-900 transition-colors">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
