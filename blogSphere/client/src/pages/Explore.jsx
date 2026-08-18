import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import { blogsAPI } from '../services/api';
import { MagnifyingGlass, SortAscending, BookmarkSimple, ArrowLeft, ArrowRight } from '@phosphor-icons/react';

export default function Explore() {
    const location = useLocation();
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const limit = 9;

    // Filters State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Read URL params (e.g. ?search=... or ?category=...)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search');
        const categoryParam = params.get('category');
        if (searchParam) setSearchQuery(searchParam);
        if (categoryParam) setSelectedCategory(categoryParam);
    }, [location]);

    // Fetch paginated blogs
    useEffect(() => {
        setLoading(true);
        blogsAPI.getAll(page, limit)
            .then(data => {
                if (Array.isArray(data)) {
                    setBlogs(data);
                    setFilteredBlogs(data);
                    setTotalPages(1);
                    setTotalBlogs(data.length);
                } else {
                    const list = data.blogs || [];
                    setBlogs(list);
                    setFilteredBlogs(list);
                    setTotalPages(data.totalPages || 1);
                    setTotalBlogs(data.totalBlogs || 0);
                }
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [page]);

    // Filter and Sort Processing (client-side within current page)
    useEffect(() => {
        let result = [...blogs];

        // Category Filter
        if (selectedCategory) {
            result = result.filter(b =>
                (b.category || '').toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // Search Query Filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter(b =>
                (b.title || '').toLowerCase().includes(q) ||
                (b.content || '').toLowerCase().includes(q) ||
                (b.author?.name || '').toLowerCase().includes(q)
            );
        }

        // Sorting
        if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'oldest') {
            result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        setFilteredBlogs(result);
    }, [blogs, searchQuery, selectedCategory, sortBy]);

    // Handle Page Changes
    const handlePrevPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
            window.scrollTo({ top: 200, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
            window.scrollTo({ top: 200, behavior: 'smooth' });
        }
    };

    // Category pills config
    const categoriesList = [
        { label: 'All Topics', value: '' },
        { label: 'Technology', value: 'technology' },
        { label: 'Design', value: 'design' },
        { label: 'Lifestyle', value: 'lifestyle' },
        { label: 'Programming', value: 'programming' },
        { label: 'Business', value: 'business' }
    ];

    return (
        <div className="text-gray-800 antialiased min-h-screen flex flex-col bg-mesh">
            <Navbar activePage="explore" />

            <main className="flex-grow pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header text */}
                    <div className="mb-10 text-left flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
                                Explore Stories
                            </h1>
                            <p className="text-slate-500 text-xs font-semibold mt-1">
                                Dive deep into write-ups, code guides, creative reviews, and technical research.
                            </p>
                        </div>
                        {totalBlogs > 0 && (
                            <div className="text-xs font-bold text-slate-400 bg-white/70 px-3.5 py-1.5 rounded-full border border-slate-200/60 shadow-sm self-start sm:self-auto">
                                Showing {blogs.length} of {totalBlogs} articles
                            </div>
                        )}
                    </div>

                    {/* Filtering Layout Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-center">

                        {/* Search Box */}
                        <div className="lg:col-span-6 relative">
                            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 animate-pulse" size={18} weight="bold" />
                            <input
                                type="text"
                                placeholder="Search articles by title, content, or author..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 glass-input text-xs text-slate-800 placeholder-slate-400 font-semibold"
                            />
                        </div>

                        {/* Sort Actions */}
                        <div className="lg:col-span-6 flex flex-wrap gap-4 items-center justify-start lg:justify-end">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <SortAscending size={16} />
                                <span>Sort By</span>
                            </div>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                    className="pl-4 pr-10 py-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs font-bold text-slate-700 appearance-none cursor-pointer shadow-sm hover:bg-white transition-all"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    {/* Category Pill Selectors list */}
                    <div className="flex flex-wrap gap-2.5 mb-12 pb-4 border-b border-slate-100/60">
                        {categoriesList.map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${(selectedCategory === cat.value)
                                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-transparent shadow-md shadow-indigo-500/10'
                                    : 'bg-white/80 hover:bg-white text-slate-600 border-slate-200 hover:border-indigo-100 hover:text-indigo-600 shadow-sm'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Grid Layout list */}
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
                        <div className="p-8 bg-rose-50 border border-rose-100 text-rose-700 text-center rounded-3xl font-semibold">
                            Error fetching publications: {error}
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {filteredBlogs.length === 0 ? (
                                    <div className="col-span-full py-20 px-6 text-center flex flex-col items-center justify-center gap-4 text-slate-400 glass-card rounded-3xl max-w-lg mx-auto">
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-inner">
                                            <BookmarkSimple size={32} weight="light" />
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-slate-800 text-sm">No stories found</p>
                                            <p className="text-xs text-slate-400 max-w-xs leading-relaxed mt-1 font-medium">
                                                We couldn't find any stories matching your selection. Try clearing filters or revising your query.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    filteredBlogs.map((blog, idx) => (
                                        <motion.div
                                            key={blog._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <BlogCard blog={blog} index={idx} />
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {/* Pagination UI Controls */}
                    {!loading && totalPages > 1 && (
                        <div className="mt-14 flex items-center justify-center gap-3">
                            <button
                                onClick={handlePrevPage}
                                disabled={page <= 1 || loading}
                                className="btn-secondary px-5 py-2.5 text-xs font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                            >
                                <ArrowLeft size={16} weight="bold" />
                                <span>Previous</span>
                            </button>

                            <div className="px-5 py-2.5 bg-white/80 border border-slate-200/80 rounded-full text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md">
                                Page <span className="text-indigo-600 font-extrabold">{page}</span> of <span className="text-slate-800">{totalPages}</span>
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={page >= totalPages || loading}
                                className="btn-secondary px-5 py-2.5 text-xs font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                            >
                                <span>Next</span>
                                <ArrowRight size={16} weight="bold" />
                            </button>
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}
