import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EnvelopeSimple, LockKey, Eye, EyeSlash, ArrowRight, WarningCircle, PenNib } from '@phosphor-icons/react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-gray-800 antialiased min-h-screen flex items-center justify-center relative overflow-hidden bg-mesh py-12">
            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[45%] h-[45%] rounded-full bg-indigo-200/30 blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-[10%] right-[5%] w-[50%] h-[55%] rounded-full bg-violet-200/25 blur-3xl animate-pulse-slow" />
            </div>

            {/* Back to home */}
            <Link to="/" className="absolute top-6 left-6 text-slate-600 hover:text-indigo-600 flex items-center gap-2 font-bold text-xs transition-all btn-secondary px-4.5 py-2.5 rounded-full shadow-sm uppercase tracking-wider">
                ← Back to Home
            </Link>

            <div className="w-full max-w-md px-4 animate-fade-in">
                <div className="glass-card p-8 sm:p-10 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-violet-600" />

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-500/20">
                            <PenNib weight="bold" size={28} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Welcome Back</h1>
                        <p className="text-slate-500 text-sm mt-2 font-medium">Please enter your credentials to sign in.</p>
                    </div>

                    <form id="loginForm" onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2 text-left">
                            <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <EnvelopeSimple size={18} />
                                </div>
                                <input
                                    type="email" id="email" required value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 glass-input text-xs text-slate-800 placeholder-slate-400 font-semibold"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2 text-left">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot?</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <LockKey size={18} />
                                </div>
                                <input
                                    type={showPw ? 'text' : 'password'} id="password" required value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3.5 glass-input text-xs text-slate-800 placeholder-slate-400 font-semibold"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 focus:outline-none cursor-pointer">
                                    {showPw ? <EyeSlash size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div id="errorMessage" className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3.5 rounded-xl flex items-center gap-2 font-semibold">
                                <WarningCircle weight="fill" size={18} className="text-rose-500 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                          type="submit" id="submitBtn"
                          disabled={loading}
                          className="w-full btn-primary text-xs font-bold py-3.5 rounded-xl shadow-md flex justify-center items-center gap-2 disabled:opacity-70 cursor-pointer"
                        >
                            {loading ? <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : null}
                            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                            {!loading && <ArrowRight weight="bold" size={16} />}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100/60 pt-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-600 hover:text-indigo-800 transition-colors">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
