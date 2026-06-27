import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import {
    Users, Article, ShieldCheck, ArrowsClockwise, MagnifyingGlass,
    User, Shield, Trash, Spinner, ArrowSquareOut, CheckCircle,
    XCircle, Warning, Prohibit, HandWaving, SquaresFour, PlusCircle
} from '@phosphor-icons/react';

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center animate-fade-in p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-slate-100 transform scale-100 transition-transform duration-300">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-rose-100/50">
                        <Warning weight="bold" className="text-lg" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-extrabold text-slate-900 text-lg font-display leading-tight">{title}</h3>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{message}</p>
                    </div>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/15"
                    >
                        Confirm Action
                    </button>
                </div>
            </div>
        </div>
    );
}

function Toast({ show, type, message }) {
    if (!show) return null;
    return (
        <div className="fixed top-6 right-6 z-[120] animate-slide-up">
            <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl text-xs font-bold border border-slate-800">
                {type === 'success' ? (
                    <CheckCircle weight="fill" className="text-emerald-400 text-lg" />
                ) : (
                    <XCircle weight="fill" className="text-rose-400 text-lg" />
                )}
                <span>{message}</span>
            </div>
        </div>
    );
}

export default function Admin() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Modal State
    const [modal, setModal] = useState({
        open: false,
        type: '', // 'deleteUser' or 'deleteBlog'
        targetId: null,
        title: '',
        message: ''
    });

    // Toast State
    const [toast, setToast] = useState({
        show: false,
        type: 'success',
        message: ''
    });

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const loadUsers = async () => {
        setLoadingUsers(true);
        try {
            const data = await adminAPI.getAllUsers();
            const userList = Array.isArray(data) ? data : (data.users || []);
            setUsers(userList);
            setFilteredUsers(userList);
        } catch (err) {
            console.error(err);
            showToast('error', 'Failed to load users: ' + err.message);
        } finally {
            setLoadingUsers(false);
        }
    };

    const loadBlogs = async () => {
        setLoadingBlogs(true);
        try {
            const data = await adminAPI.getAllBlogs();
            const blogList = Array.isArray(data) ? data : (data.blogs || []);
            setBlogs(blogList);
        } catch (err) {
            console.error(err);
            showToast('error', 'Failed to load blogs: ' + err.message);
        } finally {
            setLoadingBlogs(false);
        }
    };

    useEffect(() => {
        loadUsers();
        loadBlogs();
    }, []);

    // Filter Users Search
    useEffect(() => {
        const q = searchQuery.toLowerCase();
        const filtered = users.filter(u =>
            (u.name || '').toLowerCase().includes(q) ||
            (u.email || '').toLowerCase().includes(q)
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await Promise.all([loadUsers(), loadBlogs()]);
        setIsRefreshing(false);
        showToast('success', 'Data refreshed successfully.');
    };

    const handleToggleBlock = async (userId, currentBlocked) => {
        try {
            await adminAPI.toggleBlock(userId);
            showToast('success', currentBlocked ? 'User unblocked successfully' : 'User blocked successfully');
            // Update local state
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: !currentBlocked } : u));
        } catch (err) {
            showToast('error', err.message || 'Failed to update user status');
        }
    };

    const openDeleteUserModal = (userId, name) => {
        setModal({
            open: true,
            type: 'deleteUser',
            targetId: userId,
            title: 'Delete User',
            message: `Are you sure you want to permanently delete user "${name}"? This will delete all of their blogs and account data.`
        });
    };

    const openDeleteBlogModal = (blogId, title) => {
        setModal({
            open: true,
            type: 'deleteBlog',
            targetId: blogId,
            title: 'Delete Blog',
            message: `Are you sure you want to delete the blog post "${title}"?`
        });
    };

    const handleConfirmAction = async () => {
        const { type, targetId } = modal;
        setModal(prev => ({ ...prev, open: false }));

        try {
            if (type === 'deleteUser') {
                await adminAPI.deleteUser(targetId);
                setUsers(prev => prev.filter(u => u._id !== targetId));
                showToast('success', 'User and all their blogs deleted successfully');
                // Refresh blogs as well since user delete cascades to blogs
                loadBlogs();
            } else if (type === 'deleteBlog') {
                await adminAPI.deleteAnyBlog(targetId);
                setBlogs(prev => prev.filter(b => b._id !== targetId));
                showToast('success', 'Blog deleted successfully');
            }
        } catch (err) {
            showToast('error', err.message || 'Action failed');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const adminAvatar = user?.name ? user.name[0].toUpperCase() : 'A';

    const categoryStyles = {
        technology: 'bg-blue-50/80 text-blue-600 border-blue-100/50',
        design: 'bg-pink-50/80 text-pink-600 border-pink-100/50',
        programming: 'bg-emerald-50/80 text-emerald-600 border-emerald-100/50',
        business: 'bg-amber-50/80 text-amber-600 border-amber-100/50',
        lifestyle: 'bg-purple-50/80 text-purple-700 border-purple-100/50',
        general: 'bg-slate-50/80 text-slate-600 border-slate-100/50'
    };

    return (
        <div className="text-slate-800 antialiased min-h-screen bg-mesh flex flex-col">
            <Toast show={toast.show} type={toast.type} message={toast.message} />
            <ConfirmModal
                open={modal.open}
                title={modal.title}
                message={modal.message}
                onConfirm={handleConfirmAction}
                onCancel={() => setModal({ open: false, type: '', targetId: null, title: '', message: '' })}
            />

            {/* Sticky Admin Navbar */}
            <nav className="glass-nav sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-all">
                                <ShieldCheck weight="bold" size={20} />
                            </div>
                            <span className="font-extrabold text-2xl tracking-tight text-slate-900 font-display">
                                BlogSphere <span className="text-indigo-600 font-semibold text-xs tracking-normal uppercase ml-1 px-2 py-0.5 bg-indigo-50 rounded-lg border border-indigo-100">Admin</span>
                            </span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <Link
                                to="/dashboard"
                                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors uppercase tracking-wider"
                            >
                                <ArrowSquareOut size={16} weight="bold" /> Go to Dashboard
                            </Link>
                            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                            <div className="relative group cursor-pointer">
                                <div className="w-9 h-9 rounded-full border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center bg-indigo-50 text-indigo-600 font-extrabold text-xs">
                                    {adminAvatar}
                                </div>
                                <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-50 z-50">
                                    <Link to="/dashboard" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                        Dashboard Home
                                    </Link>
                                    <Link to="/profile" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                        Profile Settings
                                    </Link>
                                    <div className="border-t border-slate-50 my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left block px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                {/* Sidebar Navigation */}
                <aside className="hidden md:block w-64 pt-8 pr-8 border-r border-slate-100 min-h-[calc(100vh-4rem)]">
                    <nav className="space-y-1.5 text-left">
                        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Overview</p>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-xs uppercase tracking-wider ${activeTab === 'users'
                                ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/10'
                                : 'text-slate-500 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-slate-200/50 shadow-sm'
                                }`}
                        >
                            <Users weight="bold" size={18} />
                            <span>Manage Users</span>
                            {!loadingUsers && (
                                <span className={`ml-auto text-[10px] font-extrabold px-2 py-0.5 rounded-full ${activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'}`}>
                                    {users.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('blogs')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-xs uppercase tracking-wider ${activeTab === 'blogs'
                                ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/10'
                                : 'text-slate-500 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-slate-200/50 shadow-sm'
                                }`}
                        >
                            <Article weight="bold" size={18} />
                            <span>Manage Blogs</span>
                            {!loadingBlogs && (
                                <span className={`ml-auto text-[10px] font-extrabold px-2 py-0.5 rounded-full ${activeTab === 'blogs' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'}`}>
                                    {blogs.length}
                                </span>
                            )}
                        </button>
                    </nav>

                    {/* Stats Card */}
                    <div className="mt-8 p-1 text-left">
                        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <ShieldCheck size={120} weight="fill" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[9px] font-extrabold uppercase tracking-widest opacity-80 mb-4">Platform Stats</p>
                                <div className="space-y-3.5">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                                        <span className="text-xs font-semibold opacity-90">Total Users</span>
                                        <span className="font-extrabold text-lg font-display">{loadingUsers ? '—' : users.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-semibold opacity-90">Total Blogs</span>
                                        <span className="font-extrabold text-lg font-display">{loadingBlogs ? '—' : blogs.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 py-8 md:pl-8 animate-fade-in text-left">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">Admin Panel</h1>
                            <p className="text-slate-500 text-xs mt-1 font-semibold">Audit platform users, manage permissions, and clean up content feeds.</p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-xs font-bold shadow-sm disabled:opacity-60 cursor-pointer"
                        >
                            <ArrowsClockwise weight="bold" size={16} className={isRefreshing ? 'animate-spin text-indigo-600' : 'text-slate-600'} />
                            <span>Refresh Workspace</span>
                        </button>
                    </div>

                    {/* Mobile Tab Selectors */}
                    <div className="flex md:hidden bg-slate-200/60 p-1.5 rounded-2xl mb-6">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            Users ({users.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('blogs')}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${activeTab === 'blogs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            Blogs ({blogs.length})
                        </button>
                    </div>

                    {/* Users Section */}
                    {activeTab === 'users' && (
                        <div className="glass-card rounded-3xl overflow-hidden mb-10">
                            <div className="px-6 py-5 border-b border-slate-100/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/40">
                                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Users weight="bold" className="text-indigo-500" size={18} />
                                    <span>User Management</span>
                                    {!loadingUsers && (
                                        <span className="text-[10px] lowercase font-semibold text-slate-500">({filteredUsers.length} matched)</span>
                                    )}
                                </h2>
                                <div className="relative w-full sm:w-64">
                                    <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Search name or email..."
                                        className="w-full pl-10 pr-4 py-2 text-xs glass-input focus:ring-4 focus:ring-indigo-100 font-semibold bg-white/60"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/10">
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Joined Date</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100/60 text-xs font-semibold text-slate-600">
                                        {loadingUsers ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <Spinner size={32} className="animate-spin text-indigo-600" />
                                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading user catalog...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-slate-405">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Users size={36} className="text-slate-300" />
                                                        <span className="font-bold text-slate-400">No users match your criteria.</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map(u => {
                                                const isBlocked = u.isBlocked || u.blocked || false;
                                                const isAdmin = u.role === 'admin';
                                                const joinedDate = u.createdAt
                                                    ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                    : '—';
                                                const avatarUrl = u.profileImage
                                                    ? `/uploads/${u.profileImage.replace(/^uploads\//, '')}`
                                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'User')}&background=f1f5f9&color=4f46e5&bold=true`;

                                                const isSelf = u._id === user?._id;

                                                return (
                                                    <tr key={u._id} className="hover:bg-slate-50/30 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={avatarUrl}
                                                                    alt={u.name}
                                                                    onError={e => {
                                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=f1f5f9&color=4f46e5&bold=true`;
                                                                    }}
                                                                    className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm"
                                                                />
                                                                <div className="text-left">
                                                                    <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5 font-display">
                                                                        {u.name}
                                                                        {isSelf && (
                                                                            <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[8px] font-extrabold uppercase rounded-md tracking-wider">You</span>
                                                                        )}
                                                                    </p>
                                                                    <p className="text-xs text-slate-400 font-semibold mt-0.5">{u.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${isAdmin ? 'bg-purple-50/80 text-purple-700 border-purple-100/50' : 'bg-slate-50/80 text-slate-600 border-slate-100/50'}`}>
                                                                <ShieldCheck size={12} weight="bold" />
                                                                {isAdmin ? 'Admin' : 'Writer'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${isBlocked ? 'bg-rose-50/80 text-rose-700 border-rose-100/50' : 'bg-emerald-50/80 text-emerald-700 border-emerald-100/50'}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                                                                {isBlocked ? 'Blocked' : 'Active'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-semibold">{joinedDate}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                                            {isAdmin ? (
                                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider italic">System Protected</span>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleToggleBlock(u._id, isBlocked)}
                                                                        className={`px-3 py-1.5 border rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                                                                            isBlocked 
                                                                                ? 'bg-emerald-50/80 border-emerald-100 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700' 
                                                                                : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                                                                        }`}
                                                                    >
                                                                        {isBlocked ? 'Unblock' : 'Block'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => openDeleteUserModal(u._id, u.name)}
                                                                        className="px-3 py-1.5 bg-rose-50/80 border border-rose-100 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-all cursor-pointer"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/20 flex justify-end">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Blogs Section */}
                    {activeTab === 'blogs' && (
                        <div className="glass-card rounded-3xl overflow-hidden mb-10">
                            <div className="px-6 py-5 border-b border-slate-100/80 bg-slate-50/40">
                                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Article weight="bold" className="text-indigo-500" size={18} />
                                    <span>Article Management</span>
                                    {!loadingBlogs && (
                                        <span className="text-[10px] lowercase font-semibold text-slate-500">({blogs.length} published)</span>
                                    )}
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/10">
                                            <th className="px-6 py-4">Blog Title</th>
                                            <th className="px-6 py-4">Author</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Publish Date</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100/60 text-xs font-semibold text-slate-600">
                                        {loadingBlogs ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <Spinner size={32} className="animate-spin text-indigo-600" />
                                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading published content...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : blogs.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Article size={36} className="text-slate-300" />
                                                        <span className="font-bold">No published blogs found on this platform.</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            blogs.map(b => {
                                                const date = b.createdAt
                                                    ? new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                    : '—';
                                                const authorName = b.author?.name || b.authorName || '—';
                                                const category = b.category || 'General';
                                                const categoryClass = categoryStyles[category.toLowerCase()] || categoryStyles.general;

                                                return (
                                                    <tr key={b._id} className="hover:bg-slate-50/30 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <Link to={`/blog/${b._id}`} className="font-extrabold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 max-w-sm font-display text-sm text-left block">
                                                                {b.title}
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-bold text-left">{authorName}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-left">
                                                            <span className={`px-2.5 py-1 border text-[10px] font-bold rounded-full capitalize tracking-wide ${categoryClass}`}>
                                                                {category}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-semibold text-left">{date}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <button
                                                                onClick={() => openDeleteBlogModal(b._id, b.title)}
                                                                className="px-3 py-1.5 bg-rose-50/80 border border-rose-100 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-all inline-flex items-center gap-1.5 cursor-pointer animate-fade-in"
                                                            >
                                                                <Trash weight="bold" size={12} />
                                                                <span>Delete</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/20 flex justify-end">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Showing {blogs.length} blog{blogs.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile bottom navigation bar */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 flex justify-around p-3.5 z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
                <Link to="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-800">
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
