import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { ArrowLeft, Camera, Spinner, Check, TwitterLogo, GithubLogo, Globe } from '@phosphor-icons/react';
import BlogCard from '../components/BlogCard';

export default function Profile() {
    const { user, updateUser } = useAuth();

    // Profile settings states
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [bio, setBio] = useState('Digital creator and writer at BlogSphere. Curious about development, design, and coding architecture.');
    const [twitterLink, setTwitterLink] = useState('https://twitter.com');
    const [githubLink, setGithubLink] = useState('https://github.com');

    // Dynamic posts state
    const [myBlogs, setMyBlogs] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const fileRef = useRef();

    useEffect(() => {
        // Fetch user profile info
        userAPI.getProfile()
            .then(data => {
                const u = data.user || data;
                setFullName(u.name || '');
                setEmail(u.email || '');
                setAvatarPreview(u.profileImage
                    ? `/uploads/${u.profileImage.replace(/^uploads\//, '')}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=f1f5f9&color=4f46e5&size=256&bold=true`
                );
            })
            .catch(err => console.error('Failed to load profile details:', err))
            .finally(() => setLoading(false));

        // Fetch user articles list to show at the bottom
        userAPI.getMyBlogs()
            .then(data => {
                setMyBlogs(Array.isArray(data) ? data : (data.blogs || []));
            })
            .catch(err => console.error(err))
            .finally(() => setLoadingPosts(false));
    }, []);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setAvatarPreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', fullName);
            formData.append('email', email);
            if (avatarFile) formData.append('profileImage', avatarFile);

            const result = await userAPI.updateProfile(formData);
            const updatedUser = result.user || result;

            updateUser({
                id: updatedUser.id || updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profileImage: updatedUser.profileImage,
            });
            alert('Profile updated successfully!');
        } catch (err) {
            alert('Failed to update profile: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="text-slate-800 antialiased min-h-screen bg-mesh">

            {/* Navbar settings header */}
            <nav className="glass-nav sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-wider">
                            <ArrowLeft weight="bold" size={16} /> Back to dashboard
                        </Link>
                        <span className="font-extrabold text-sm tracking-tight text-slate-900 font-display">Creator Profile Settings</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in space-y-12">
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Spinner size={40} className="animate-spin text-slate-800" />
                    </div>
                ) : (
                    <div className="glass-card rounded-3xl overflow-hidden text-left">
                        {/* Banner Cover Cover background */}
                        <div className="h-44 bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 relative" />

                        <div className="px-6 sm:px-10 pb-10">

                            {/* Floating Avatar element with camera edit hover */}
                            <div className="relative w-28 h-28 mx-auto sm:mx-0 -mt-14 mb-6 group">
                                <img
                                    id="profileImagePreview"
                                    src={avatarPreview}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border-4 border-white bg-slate-50 shadow-md ring-4 ring-indigo-50/10"
                                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'U')}&background=6366f1&color=ffffff&size=256&bold=true`; }}
                                />
                                <div
                                    className="absolute inset-0 bg-slate-950/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-white"
                                    onClick={() => fileRef.current.click()}
                                >
                                    <Camera weight="bold" size={24} className="text-white" />
                                </div>
                                <input type="file" ref={fileRef} id="avatarUpload" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </div>

                            {/* General Metadata display details */}
                            <div className="text-center sm:text-left mb-8">
                                <h1 className="text-2xl font-extrabold text-slate-900 font-display">{fullName || 'Unknown Creator'}</h1>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">{user?.role === 'admin' ? 'Administrator' : 'Author'}</p>
                            </div>

                            {/* Form and info configuration */}
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <label htmlFor="fullName" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                            className="w-full px-4 py-3.5 glass-input text-xs font-bold text-slate-850"
                                        />
                                    </div>

                                    {/* Email address */}
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full px-4 py-3.5 glass-input text-xs font-bold text-slate-850"
                                        />
                                    </div>

                                </div>

                                {/* Bio text area */}
                                <div className="space-y-2">
                                    <label htmlFor="bio" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Short Bio</label>
                                    <textarea
                                        id="bio"
                                        rows={4}
                                        value={bio}
                                        onChange={e => setBio(e.target.value)}
                                        className="w-full px-4 py-3.5 glass-input text-xs font-bold text-slate-850 leading-relaxed resize-none"
                                        placeholder="Tell your readers about yourself..."
                                    />
                                </div>

                                {/* Mock Social Links */}
                                <div className="pt-6 border-t border-slate-100/60">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Social Media & Websites</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                                        {/* Twitter */}
                                        <div className="space-y-2">
                                            <label htmlFor="twitter" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                                <TwitterLogo size={14} className="text-indigo-500" /> Twitter URL
                                            </label>
                                            <input
                                                type="url"
                                                id="twitter"
                                                value={twitterLink}
                                                onChange={e => setTwitterLink(e.target.value)}
                                                className="w-full px-4 py-3.5 glass-input text-xs font-bold text-slate-850"
                                            />
                                        </div>

                                        {/* GitHub */}
                                        <div className="space-y-2">
                                            <label htmlFor="github" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                                <GithubLogo size={14} className="text-indigo-500" /> GitHub Profile
                                            </label>
                                            <input
                                                type="url"
                                                id="github"
                                                value={githubLink}
                                                onChange={e => setGithubLink(e.target.value)}
                                                className="w-full px-4 py-3.5 glass-input text-xs font-bold text-slate-850"
                                            />
                                        </div>

                                    </div>
                                </div>

                                {/* Actions row */}
                                <div className="pt-6 border-t border-slate-100/60 flex justify-end gap-3.5">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="btn-primary px-6 py-2.5 rounded-full text-xs font-bold shadow-md disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                                    >
                                        {saving ? (
                                            <Spinner size={14} className="animate-spin text-white" />
                                        ) : (
                                            <Check size={14} weight="bold" />
                                        )}
                                        <span>{saving ? 'Saving changes...' : 'Save Settings'}</span>
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )}

                {/* User's posts grid - makes profile functional and realistic */}
                {!loading && (
                    <div className="space-y-6 text-left">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">Published Articles</h2>
                        {loadingPosts ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(3)].map((_, idx) => (
                                    <div key={idx} className="bg-white border border-slate-100 rounded-3xl h-[420px] p-6 animate-pulse space-y-4" />
                                ))}
                            </div>
                        ) : myBlogs.length === 0 ? (
                            <div className="p-8 border border-dashed border-slate-200 rounded-3xl text-center text-slate-400">
                                You haven't published any articles yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myBlogs.map((b, idx) => (
                                    <BlogCard key={b._id} blog={b} index={idx} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
