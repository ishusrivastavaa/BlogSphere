import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import { blogsAPI } from '../services/api';
import {
    ArrowRight, Spinner, Cpu, Palette, BookOpen,
    Terminal, Briefcase, TrendUp, Sparkle, UserList
} from '@phosphor-icons/react';

export default function Home() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        blogsAPI.getAll()
            .then(data => {
                const list = Array.isArray(data) ? data : (data.blogs || []);
                setBlogs(list);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const latestBlogs = blogs.slice(0, 6);
    // Pick the first blog as the Featured Story
    const featuredBlog = blogs[0];
    // Pick next 3 blogs as Trending
    const trendingBlogs = blogs.slice(1, 4);

    // Category list configuration
    const categories = [
        { name: 'Technology', slug: 'technology', icon: <Cpu size={24} />, bg: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100/60' },
        { name: 'Design', slug: 'design', icon: <Palette size={24} />, bg: 'bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100/60' },
        { name: 'Programming', slug: 'programming', icon: <Terminal size={24} />, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/60' },
        { name: 'Business', slug: 'business', icon: <Briefcase size={24} />, bg: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/60' },
        { name: 'Lifestyle', slug: 'lifestyle', icon: <BookOpen size={24} />, bg: 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100/60' },
    ];

    // Mock popular authors
    const popularAuthors = [
        { name: 'Ishu Updated', role: 'Staff Writer', avatar: 'https://ui-avatars.com/api/?name=Ishu+Updated&background=4f46e5&color=fff&bold=true' },
        { name: 'Akshit Saxena', role: 'Tech Enthusiast', avatar: 'https://ui-avatars.com/api/?name=Akshit+Saxena&background=0284c7&color=fff&bold=true' },
        { name: 'Aman', role: 'Business Architect', avatar: 'https://ui-avatars.com/api/?name=Aman&background=0d9488&color=fff&bold=true' },
    ];

    return (
        <div className="text-gray-800 antialiased min-h-screen flex flex-col bg-white">
            <Navbar activePage="home" />

            {/* Hero Header Section */}
            <section className="pt-36 pb-24 bg-mesh border-b border-slate-100/60 relative overflow-hidden">
                {/* Decorative blurred background blobs */}
                <div className="absolute top-[20%] left-[-10%] w-[35%] h-[35%] rounded-full bg-indigo-200/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-200/15 blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Left Content Column */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-6 space-y-6 text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-slate-200/50 text-xs font-bold text-slate-600 shadow-sm">
                                <Sparkle size={14} className="text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
                                <span>Join a community of writers and innovators</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] font-display">
                                Write. Share. <br />
                                <span className="text-gradient">Inspire</span> The World.
                            </h1>
                            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl font-medium">
                                Explore deep insights, tech tutorials, and design principles written by creative professionals around the world.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2">
                                <Link to="/explore" className="btn-primary px-7 py-3 text-xs font-bold flex items-center gap-2 shadow-md">
                                    Explore Stories <ArrowRight size={16} weight="bold" />
                                </Link>
                                <Link to="/create-blog" className="btn-secondary px-7 py-3 text-xs font-bold shadow-sm">
                                    Start Writing
                                </Link>
                            </div>
                        </motion.div>

                        {/* Right Featured Story Column */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="lg:col-span-6"
                        >
                            {loading ? (
                                <div className="w-full h-80 rounded-3xl bg-slate-100/50 animate-pulse flex items-center justify-center border border-slate-100">
                                    <Spinner size={32} className="animate-spin text-slate-400" />
                                </div>
                            ) : featuredBlog ? (
                                <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4.5 flex items-center gap-1.5">
                                        <Sparkle size={14} weight="fill" className="text-indigo-500" />
                                        Featured Story
                                    </p>
                                    <Link to={`/blog/${featuredBlog._id}`} className="block aspect-[16/10] overflow-hidden rounded-2xl mb-5 bg-slate-100 relative">
                                        <img
                                            src={featuredBlog.image ? `/uploads/${featuredBlog.image.replace(/^uploads\//, '')}` : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
                                            alt={featuredBlog.title}
                                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/5 transition-colors duration-300" />
                                    </Link>
                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug hover:text-indigo-600 transition-colors mb-3 font-display">
                                        <Link to={`/blog/${featuredBlog._id}`}>{featuredBlog.title}</Link>
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-5">
                                        {featuredBlog.content ? featuredBlog.content.replace(/<[^>]*>?/gm, '') : ''}
                                    </p>
                                    <div className="flex items-center gap-3 border-t border-slate-100/60 pt-4 mt-auto">
                                        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 ring-2 ring-slate-100">
                                            <img
                                                src={featuredBlog.author?.profileImage ? `/uploads/${featuredBlog.author.profileImage.replace(/^uploads\//, '')}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(featuredBlog.author?.name || 'U')}&background=6366f1&color=ffffff&bold=true`}
                                                alt="Author"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">{featuredBlog.author?.name || 'Unknown Author'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 border border-slate-200 border-dashed rounded-3xl text-center text-slate-400 font-semibold glass-card">
                                    No blog posts seeded yet. Write one now!
                                </div>
                            )}
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Category Pills Grid */}
            <section className="py-14 border-b border-slate-100/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-6 text-center sm:text-left">Browse by Topic</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categories.map((cat, idx) => (
                            <Link
                                key={idx}
                                to={`/explore?category=${cat.slug}`}
                                className={`flex items-center gap-3.5 p-4 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${cat.bg}`}
                            >
                                <div className="flex-shrink-0 p-1.5 rounded-xl bg-white/40">{cat.icon}</div>
                                <span className="font-bold text-sm text-slate-800">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dynamic Mid section: Trending / Popular Authors */}
            {!loading && trendingBlogs.length > 0 && (
                <section className="py-16 bg-slate-50/30 border-b border-slate-100/60">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                            {/* Trending Posts */}
                            <div className="lg:col-span-8 space-y-6 text-left">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendUp size={22} className="text-indigo-500" />
                                    <h2 className="text-xl font-extrabold text-slate-900 font-display">Trending Articles</h2>
                                </div>
                                <div className="space-y-4">
                                    {trendingBlogs.map((blog, idx) => {
                                        const date = new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                        return (
                                            <div key={blog._id} className="glass-card p-5 rounded-2xl flex gap-4 items-start group">
                                                <span className="text-2xl font-black text-slate-200 group-hover:text-indigo-400 transition-colors">0{idx + 1}</span>
                                                <div className="space-y-2">
                                                    <h3 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors leading-snug font-display">
                                                        <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                                                        <span className="text-slate-700">{blog.author?.name || 'Staff Writer'}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                        <span>{date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Popular Authors list */}
                            <div className="lg:col-span-4 space-y-6 text-left">
                                <div className="flex items-center gap-2 mb-4">
                                    <UserList size={22} className="text-indigo-500" />
                                    <h2 className="text-xl font-extrabold text-slate-900 font-display">Popular Contributors</h2>
                                </div>
                                <div className="glass-card p-5 rounded-2xl space-y-4">
                                    {popularAuthors.map((auth, idx) => (
                                        <div key={idx} className="flex items-center justify-between pb-3 border-b border-slate-100/60 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <img src={auth.avatar} alt={auth.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100/50" />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{auth.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{auth.role}</p>
                                                </div>
                                            </div>
                                            <Link
                                                to={`/explore?search=${encodeURIComponent(auth.name)}`}
                                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                                            >
                                                Articles
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            )}

            {/* Main Discover Feed Grid */}
            <section className="py-20 bg-mesh">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10 text-left">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Latest Publications</h2>
                            <p className="text-slate-500 text-xs mt-1 font-semibold">Read the most recent write-ups from our active community.</p>
                        </div>
                        <Link to="/explore" className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-1.5 transition-colors uppercase tracking-wider">
                            Explore Feed <ArrowRight size={16} weight="bold" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, idx) => (
                                <div key={idx} className="glass-card rounded-3xl h-[440px] p-6 animate-pulse space-y-4">
                                    <div className="w-full h-48 rounded-2xl bg-slate-100/50" />
                                    <div className="w-1/3 h-4 bg-slate-100/50 rounded" />
                                    <div className="w-full h-6 bg-slate-100/50 rounded" />
                                    <div className="w-2/3 h-6 bg-slate-100/50 rounded" />
                                    <div className="w-full h-12 bg-slate-100/50 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="p-8 bg-rose-50 border border-rose-100 text-rose-700 text-center rounded-2xl font-semibold">
                            Error fetching publications: {error}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {latestBlogs.length === 0 ? (
                                <div className="col-span-full py-16 text-center text-slate-400 font-semibold glass-card rounded-3xl">
                                    No publications found. Be the first to compose!
                                </div>
                            ) : (
                                latestBlogs.map((blog, idx) => (
                                    <BlogCard key={blog._id} blog={blog} index={idx} />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
