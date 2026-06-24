import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, blogsAPI } from '../services/api';
import {
    PenNib, SquaresFour, User, ShieldCheck,
    Article, PlusCircle, Trash, PencilLine, Spinner, CalendarBlank,
    ChartBar, Sparkle, Clock
} from '@phosphor-icons/react';

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm mx-4 border border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-lg mb-2 font-display">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors shadow-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ open: false, blogId: null, title: '' });

    const avatarSrc = user?.profileImage
        ? `/uploads/${user.profileImage.replace(/^uploads\//, '')}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=f1f5f9&color=4f46e5&bold=true`;

    useEffect(() => {
        userAPI.getMyBlogs()
            .then(data => setBlogs(Array.isArray(data) ? data : (data.blogs || [])))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async () => {
        try {
            await blogsAPI.delete(modal.blogId);
            setBlogs(prev => prev.filter(b => b._id !== modal.blogId));
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
        setModal({ open: false, blogId: null, title: '' });
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { to: '/dashboard', icon: <SquaresFour weight="bold" size={18} />, label: 'Dashboard', active: true },
        { to: '/profile', icon: <User weight="bold" size={18} />, label: 'Profile Settings', active: false },
        { to: '/create-blog', icon: <PlusCircle weight="bold" size={18} />, label: 'Write Story', active: false },
        ...(user?.role === 'admin' ? [{ to: '/admin', icon: <ShieldCheck weight="bold" size={18} />, label: 'Admin Panel', active: false, divider: true }] : []),
    ];

    // Calculate total reading minutes of all author posts combined
    const totalWords = blogs.reduce((acc, b) => acc + (b.content ? b.content.split(/\s+/).length : 0), 0);
    const totalReadingTime = Math.ceil(totalWords / 225);

    return (
        <div className="text-gray-800 antialiased min-h-screen bg-slate-50/50 flex flex-col">
            <ConfirmModal
                open={modal.open}
                title="Delete Article"
                message={`Are you sure you want to permanently delete "${modal.title}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setModal({ open: false, blogId: null, title: '' })}
            />

            {/* Sticky Dashboard Navbar */}
            <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                                <PenNib weight="bold" size={16} />
                            </div>
                            <span className="font-extrabold text-lg tracking-tight text-slate-900 font-display">BlogSphere</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/create-blog"
                                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors uppercase tracking-wider"
                            >
                                <PlusCircle size={18} weight="bold" /> Write Story
                            </Link>
                            <div className="relative group cursor-pointer">
                                <div className="w-9 h-9 rounded-full border border-slate-200 overflow-hidden shadow-inner">
                                    <img src={avatarSrc} alt={user?.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-50 z-50">
                                    <Link to="/profile" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                        <User size={14} className="inline mr-2" />Profile
                                    </Link>
                                    <div className="border-t border-slate-50 my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left block px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Grid Workspace */}
            <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">

                {/* Left Sidebar navigation panel (hidden on mobile) */}
                <aside className="hidden md:block w-64 pt-8 pr-8 border-r border-slate-100 min-h-[calc(100vh-4rem)]">
                    <nav className="space-y-1">
                        {navItems.map((item, idx) => (
                            <div key={idx}>
                                {item.divider && <div className="border-t border-slate-100 my-4" />}
                                <Link
                                    to={item.to}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-xs uppercase tracking-wider ${item.active
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                >
                                    {item.icon} {item.label}
                                </Link>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Dashboard Work Panel */}
                <main className="flex-1 py-8 md:pl-8 animate-fade-in text-left">

                    {/* Header */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">Dashboard</h1>
                            <p className="text-slate-500 text-xs mt-1">Manage publications, monitor stats, and adjust creator settings.</p>
                        </div>
                        <Link
                            to="/create-blog"
                            className="btn-primary px-4 py-2.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 sm:hidden"
                        >
                            <PlusCircle size={16} weight="bold" /> New
                        </Link>
                    </div>

                    {/* SaaS Statistics cards list */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

                        {/* Stat Card 1 */}
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <Article weight="bold" size={22} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Publications</p>
                                <p className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">{blogs.length}</p>
                            </div>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Clock weight="bold" size={22} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Reading Minutes</p>
                                <p className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">{totalReadingTime} min</p>
                            </div>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Sparkle weight="bold" size={22} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Author Status</p>
                                <p className="text-sm font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${user?.isBlocked ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                                    {user?.isBlocked ? 'Blocked Account' : 'Active Account'}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Main User posts segment */}
                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/30">
                            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Your publications feed</h2>
                        </div>

                        <div className="divide-y divide-slate-50">
                            {loading && (
                                <div className="p-12 text-center flex flex-col items-center gap-3 text-slate-500">
                                    <Spinner size={32} className="animate-spin text-slate-800" />
                                    <p className="font-semibold text-xs">Loading publications list...</p>
                                </div>
                            )}
                            {!loading && blogs.length === 0 && (
                                <div className="p-12 text-center text-slate-500 space-y-4">
                                    <p className="font-semibold text-sm">You haven't composed any stories yet.</p>
                                    <Link
                                        to="/create-blog"
                                        className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-xs font-bold"
                                    >
                                        <span>Write Your First Post</span>
                                        <PlusCircle size={16} weight="bold" />
                                    </Link>
                                </div>
                            )}
                            {!loading && blogs.map(blog => {
                                const date = new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                const imageUrl = blog.image
                                    ? `/uploads/${blog.image.replace(/^uploads\//, '')}`
                                    : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=300&q=80';

                                return (
                                    <div key={blog._id} className="p-5 flex flex-col sm:flex-row gap-5 hover:bg-slate-50/40 transition-colors">
                                        <img
                                            src={imageUrl}
                                            alt="Cover"
                                            className="w-full sm:w-40 h-24 object-cover rounded-2xl border border-slate-100 shadow-sm"
                                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=300&q=80'; }}
                                        />
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start gap-4 mb-1.5">
                                                    <h3 className="text-base font-extrabold text-slate-900 leading-snug hover:text-indigo-600 transition-colors">
                                                        <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                                                    </h3>
                                                    <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-extrabold rounded-full whitespace-nowrap capitalize tracking-wide">
                                                        {blog.category || 'General'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                                                    {blog.content ? blog.content.replace(/<[^>]*>?/gm, '').substring(0, 140) + '...' : ''}
                                                </p>
                                            </div>

                                            {/* Footer Actions */}
                                            <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-50/50">
                                                <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                    <CalendarBlank size={12} /> {date}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Link
                                                        to={`/edit-blog/${blog._id}`}
                                                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                        title="Edit"
                                                    >
                                                        <PencilLine weight="bold" size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => setModal({ open: true, blogId: blog._id, title: blog.title })}
                                                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash weight="bold" size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/10 flex justify-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                Showing {blogs.length} publication{blogs.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile bottom navigations navbar */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 flex justify-around p-3.5 z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
                <Link to="/dashboard" className="flex flex-col items-center gap-1 text-slate-800">
                    <SquaresFour weight="bold" size={20} />
                    <span className="text-[9px] font-extrabold uppercase tracking-wide">Home</span>
                </Link>
                <Link to="/explore" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-800">
                    <Article weight="bold" size={20} />
                    <span className="text-[9px] font-extrabold uppercase tracking-wide">Explore</span>
                </Link>
                <Link to="/create-blog" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-800">
                    <PlusCircle weight="bold" size={20} />
                    <span className="text-[9px] font-extrabold uppercase tracking-wide">Write</span>
                </Link>
                <Link to="/profile" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-800">
                    <User weight="bold" size={20} />
                    <span className="text-[9px] font-extrabold uppercase tracking-wide">Profile</span>
                </Link>
            </div>
        </div>
    );
}
