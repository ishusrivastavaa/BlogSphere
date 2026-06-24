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
            <section className="pt-32 pb-20 bg-slate-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Left Content Column */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-6 space-y-6 text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/50 border border-slate-200 text-xs font-bold text-slate-700 shadow-inner">
                                <Sparkle size={14} className="text-indigo-600 animate-spin" />
                                <span>Join a community of writers and innovators</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] font-display">
                                Write. Share. <br />
                                <span className="text-indigo-600">Inspire</span> The World.
                            </h1>
                            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                                Explore deep insights, tech tutorials, and design principles written by creative professionals around the world.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2">
                                <Link to="/explore" className="btn-primary px-7 py-3 text-sm font-semibold flex items-center gap-2 shadow-md">
                                    Explore Stories <ArrowRight size={16} weight="bold" />
                                </Link>
                                <Link to="/create-blog" className="btn-secondary px-7 py-3 text-sm font-semibold">
                                    Start Writing
                                </Link>
                            </div>
                        </motion.div>

                        {/* Right Featured Story Column */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="lg:col-span-6"
                        >
                            {loading ? (
                                <div className="w-full h-80 rounded-3xl bg-slate-100 animate-pulse flex items-center justify-center">
                                    <Spinner size={32} className="animate-spin text-slate-400" />
                                </div>
                            ) : featuredBlog ? (
                                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
                                    <p className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                        <Sparkle size={14} weight="fill" />
                                        Featured Story
                                    </p>
                                    <Link to={`/blog/${featuredBlog._id}`} className="block aspect-[16/10] overflow-hidden rounded-2xl mb-5 bg-slate-100">
                                        <img
                                            src={featuredBlog.image ? `/uploads/${featuredBlog.image.replace(/^uploads\//, '')}` : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
                                            alt={featuredBlog.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>
                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug hover:text-indigo-600 transition-colors mb-3">
                                        <Link to={`/blog/${featuredBlog._id}`}>{featuredBlog.title}</Link>
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                                        {featuredBlog.content ? featuredBlog.content.replace(/<[^>]*>?/gm, '') : ''}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                                            <img
                                                src={featuredBlog.author?.profileImage ? `/uploads/${featuredBlog.author.profileImage.replace(/^uploads\//, '')}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(featuredBlog.author?.name || 'U')}&background=f1f5f9&color=4f46e5&bold=true`}
                                                alt="Author"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-800">{featuredBlog.author?.name || 'Unknown Author'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 border border-slate-200 border-dashed rounded-3xl text-center text-slate-400">
                                    No blog posts seeded yet. Write one now!
                                </div>
                            )}
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Category Pills Grid */}
            <section className="py-12 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-5 text-center sm:text-left">Browse by Topic</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categories.map((cat, idx) => (
                            <Link
                                key={idx}
                                to={`/explore?category=${cat.slug}`}
                                className={`flex items-center gap-3 p-4 rounded-2xl border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${cat.bg}`}
                            >
                                <div className="flex-shrink-0">{cat.icon}</div>
                                <span className="font-bold text-sm text-slate-900">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dynamic Mid section: Trending / Popular Authors */}
            {!loading && trendingBlogs.length > 0 && (
                <section className="py-16 bg-slate-50/50 border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                            {/* Trending Posts */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <TrendUp size={22} className="text-indigo-600" />
                                    <h2 className="text-xl font-extrabold text-slate-900 font-display">Trending Articles</h2>
                                </div>
                                <div className="space-y-4">
                                    {trendingBlogs.map((blog, idx) => {
                                        const date = new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                        return (
                                            <div key={blog._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex gap-4 items-start">
                                                <span className="text-2xl font-black text-slate-200">0{idx + 1}</span>
                                                <div className="space-y-2">
                                                    <h3 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors leading-snug">
                                                        <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                                        <span className="font-bold text-slate-700">{blog.author?.name || 'Staff Writer'}</span>
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
                            <div className="lg:col-span-4 space-y-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <UserList size={22} className="text-indigo-600" />
                                    <h2 className="text-xl font-extrabold text-slate-900 font-display">Popular Contributors</h2>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                    {popularAuthors.map((auth, idx) => (
                                        <div key={idx} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <img src={auth.avatar} alt={auth.name} className="w-10 h-10 rounded-full object-cover" />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{auth.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">{auth.role}</p>
                                                </div>
                                            </div>
                                            <Link
                                                to={`/explore?search=${encodeURIComponent(auth.name)}`}
                                                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors"
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
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">Latest Publications</h2>
                            <p className="text-slate-500 text-sm mt-1">Read the most recent write-ups from our active community.</p>
                        </div>
                        <Link to="/explore" className="text-indigo-600 hover:text-indigo-800 font-bold text-sm flex items-center gap-1.5 transition-colors">
                            Explore Feed <ArrowRight size={16} weight="bold" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, idx) => (
                                <div key={idx} className="bg-white border border-slate-100 rounded-3xl h-[420px] p-6 animate-pulse space-y-4">
                                    <div className="w-full h-48 rounded-2xl bg-slate-100" />
                                    <div className="w-1/3 h-4 bg-slate-100 rounded" />
                                    <div className="w-full h-6 bg-slate-100 rounded" />
                                    <div className="w-2/3 h-6 bg-slate-100 rounded" />
                                    <div className="w-full h-12 bg-slate-100 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="p-8 bg-rose-50 border border-rose-100 text-rose-700 text-center rounded-2xl font-medium">
                            Error fetching publications: {error}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {latestBlogs.length === 0 ? (
                                <div className="col-span-full py-16 text-center text-slate-400 font-medium">
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
