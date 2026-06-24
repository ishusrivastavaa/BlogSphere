import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import {
    Users, Article, ShieldCheck, ArrowsClockwise, MagnifyingGlass,
    User, Shield, Trash, Spinner, ArrowSquareOut, CheckCircle,
    XCircle, Warning, Prohibit, HandWaving
} from '@phosphor-icons/react';

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 border border-gray-100 transform scale-100 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                        <Warning weight="bold" className="text-red-600 text-xl" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{message}</p>
                    </div>
                </div>
                <div className="flex gap-3 justify-end mt-6">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">Confirm</button>
                </div>
            </div>
        </div>
    );
}

function Toast({ show, type, message }) {
    if (!show) return null;
    return (
        <div className="fixed top-6 right-6 z-[120] animate-slideUp">
            <div className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold border border-gray-800">
                {type === 'success' ? (
                    <CheckCircle weight="fill" className="text-emerald-400 text-xl" />
                ) : (
                    <XCircle weight="fill" className="text-rose-400 text-xl" />
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

    return (
        <div className="text-gray-800 antialiased min-h-screen bg-gray-50 flex flex-col">
            <Toast show={toast.show} type={toast.type} message={toast.message} />
            <ConfirmModal
                open={modal.open}
                title={modal.title}
                message={modal.message}
                onConfirm={handleConfirmAction}
                onCancel={() => setModal({ open: false, type: '', targetId: null, title: '', message: '' })}
            />

            {/* Admin Navbar */}
            <nav className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
                                <ShieldCheck weight="bold" className="text-white text-xl" />
                            </div>
                            <span className="font-bold text-lg tracking-wide outfit-font">BlogSphere Admin</span>
                        </div>

                        <div className="flex items-center gap-5">
                            <Link to="/" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                                <ArrowSquareOut size={16} /> Go to App
                            </Link>
                            <div className="h-5 w-px bg-slate-700"></div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                                    {adminAvatar}
                                </div>
                                <button onClick={handleLogout} className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 max-w-7xl mx-auto w-full">
                {/* Sidebar Navigation */}
                <aside className="hidden md:block w-64 pt-8 pr-8 border-r border-gray-200 min-h-[calc(100vh-4rem)]">
                    <nav className="space-y-1">
                        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Overview</p>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'users'
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <Users weight="bold" size={20} />
                            <span>Manage Users</span>
                            {!loadingUsers && (
                                <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs font-extrabold px-2 py-0.5 rounded-full">
                                    {users.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('blogs')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'blogs'
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <Article weight="bold" size={20} />
                            <span>Manage Blogs</span>
                            {!loadingBlogs && (
                                <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs font-extrabold px-2 py-0.5 rounded-full">
                                    {blogs.length}
                                </span>
                            )}
                        </button>
                    </nav>

                    {/* Stats Card */}
                    <div className="mt-8 p-1">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <ShieldCheck size={120} weight="fill" />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-4">Platform Stats</p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                    <span className="text-sm font-medium opacity-90">Total Users</span>
                                    <span className="font-bold text-xl">{loadingUsers ? '—' : users.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium opacity-90">Total Blogs</span>
                                    <span className="font-bold text-xl">{loadingBlogs ? '—' : blogs.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 fade-in">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-indigo-950 outfit-font">Admin Panel</h1>
                            <p className="text-sm text-gray-600 mt-1">Manage users and content across the platform.</p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-60"
                        >
                            <ArrowsClockwise weight="bold" size={16} className={isRefreshing ? 'animate-spin' : ''} />
                            <span>Refresh</span>
                        </button>
                    </div>

                    {/* Mobile Tab Selectors */}
                    <div className="flex md:hidden bg-gray-200/60 p-1 rounded-xl mb-6">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600'
                                }`}
                        >
                            Users ({users.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('blogs')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'blogs' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600'
                                }`}
                        >
                            Blogs ({blogs.length})
                        </button>
                    </div>

                    {/* Users Section */}
                    {activeTab === 'users' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50/50">
                                <h2 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
                                    <Users weight="bold" className="text-indigo-600" size={22} />
                                    <span>Users</span>
                                    <span className="text-sm font-normal text-gray-500">({filteredUsers.length} active matching)</span>
                                </h2>
                                <div className="relative w-full sm:w-64">
                                    <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Search name or email..."
                                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Joined</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {loadingUsers ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <Spinner size={36} className="animate-spin text-indigo-600" />
                                                        <span className="font-medium">Loading users details...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Users size={40} className="text-gray-300" />
                                                        <span className="font-semibold text-gray-600">No users match search query.</span>
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
                                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'User')}&background=4f46e5&color=fff`;

                                                // Don't show action buttons for the current logged in user
                                                const isSelf = u._id === user?._id;

                                                return (
                                                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={avatarUrl}
                                                                    alt={u.name}
                                                                    onError={e => {
                                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=4f46e5&color=fff`;
                                                                    }}
                                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                                />
                                                                <div>
                                                                    <p className="font-bold text-gray-900 flex items-center gap-1.5">
                                                                        {u.name}
                                                                        {isSelf && (
                                                                            <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-extrabold rounded">You</span>
                                                                        )}
                                                                    </p>
                                                                    <p className="text-xs text-gray-600">{u.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                                                                }`}>
                                                                <ShieldCheck size={14} weight="bold" />
                                                                {isAdmin ? 'Admin' : 'User'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isBlocked ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                                                                }`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                                                                {isBlocked ? 'Blocked' : 'Active'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{joinedDate}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                                            {isAdmin ? (
                                                                <span className="text-xs text-gray-400 font-medium italic">System Protected</span>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleToggleBlock(u._id, isBlocked)}
                                                                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                                                                    >
                                                                        {isBlocked ? 'Unblock' : 'Block'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => openDeleteUserModal(u._id, u.name)}
                                                                        className="px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors shadow-sm"
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
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                                <span className="text-xs font-semibold text-gray-600">
                                    Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Blogs Section */}
                    {activeTab === 'blogs' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                                <h2 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
                                    <Article weight="bold" className="text-indigo-600" size={22} />
                                    <span>Blogs</span>
                                    <span className="text-sm font-normal text-gray-500">({blogs.length} total published)</span>
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <th className="px-6 py-4">Blog Title</th>
                                            <th className="px-6 py-4">Author</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {loadingBlogs ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <Spinner size={36} className="animate-spin text-indigo-600" />
                                                        <span className="font-medium">Loading platform stories...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : blogs.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Article size={40} className="text-gray-300" />
                                                        <span className="font-semibold text-gray-600">No blog posts found on this platform.</span>
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

                                                return (
                                                    <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <Link to={`/blog/${b._id}`} className="font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1 max-w-sm">
                                                                {b.title}
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-semibold">{authorName}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 capitalize">
                                                                {category}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{date}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <button
                                                                onClick={() => openDeleteBlogModal(b._id, b.title)}
                                                                className="px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors inline-flex items-center gap-1 shadow-sm"
                                                            >
                                                                <Trash weight="bold" size={14} />
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
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                                <span className="text-xs font-semibold text-gray-600">
                                    Showing {blogs.length} blog{blogs.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
