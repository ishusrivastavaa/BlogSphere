import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import {
    ArrowLeft, CalendarBlank, Clock, ShareNetwork,
    TwitterLogo, LinkedinLogo, FacebookLogo, Copy,
    Check, Chat, ArrowRight, Spinner, User
} from '@phosphor-icons/react';

export default function BlogDetails() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [relatedBlogs, setRelatedBlogs] = useState([]);

    // Reading scroll progress state
    const [scrollProgress, setScrollProgress] = useState(0);

    // Share & copy link action states
    const [copied, setCopied] = useState(false);

    // Local comments state
    const [comments, setComments] = useState([
        { name: 'Sarah Connor', text: 'This was an incredibly detailed guide! I really liked the focus on visual design layouts.', date: '2 hours ago' },
        { name: 'Aman Sharma', text: 'Excellent breakdown. Are you planning to add a section on custom CSS transitions for Tailwind v4?', date: '1 day ago' }
    ]);
    const [commentName, setCommentName] = useState('');
    const [commentText, setCommentText] = useState('');

    // Fetch single blog post details
    useEffect(() => {
        setLoading(true);
        blogsAPI.getById(id)
            .then(data => {
                setBlog(data);
                document.title = `${data.title} | BlogSphere`;
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    // Fetch related blogs in background based on category
    useEffect(() => {
        if (blog) {
            blogsAPI.getAll()
                .then(data => {
                    const list = Array.isArray(data) ? data : (data.blogs || []);
                    const filtered = list
                        .filter(b => b._id !== blog._id && b.category === blog.category)
                        .slice(0, 3);
                    setRelatedBlogs(filtered);
                })
                .catch(err => console.error('Error fetching related posts:', err));
        }
    }, [blog]);

    // Handle scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalScroll > 0) {
                setScrollProgress((window.pageYOffset / totalScroll) * 100);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (commentName.trim() && commentText.trim()) {
            setComments(prev => [
                ...prev,
                {
                    name: commentName.trim(),
                    text: commentText.trim(),
                    date: 'Just now'
                }
            ]);
            setCommentName('');
            setCommentText('');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-3 text-slate-500">
                <Spinner size={40} className="animate-spin text-slate-800" />
                <p className="font-semibold text-sm">Loading article details...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center p-8 bg-white border border-slate-100 rounded-3xl max-w-sm shadow-sm">
                <p className="text-rose-600 text-lg font-bold mb-4">Error loading article: {error}</p>
                <Link to="/" className="btn-primary px-6 py-3 rounded-full text-sm font-semibold inline-block">← Back to Stories</Link>
            </div>
        </div>
    );

    const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const imageUrl = blog.image
        ? `/uploads/${blog.image.replace(/^uploads\//, '')}`
        : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=2000&q=80';

    const authorName = blog.author?.name || 'Unknown Author';
    const authorAvatar = blog.author?.profileImage
        ? `/uploads/${blog.author.profileImage.replace(/^uploads\//, '')}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=6366f1&color=ffffff&bold=true`;

    const words = blog.content ? blog.content.trim().split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 225));

    // Dynamically extract outline headings from the article content
    const headings = [];
    if (blog.content) {
        const lines = blog.content.split('\n');
        lines.forEach((line, idx) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
                headings.push({
                    id: `heading-${idx}`,
                    text: trimmed.replace(/^[#\s]+/, '')
                });
            }
        });
    }

    // Fallback outline if no headings are defined
    if (headings.length === 0) {
        headings.push({ id: 'overview', text: 'Article Overview' });
        headings.push({ id: 'main-concepts', text: 'Main Concepts' });
        headings.push({ id: 'summary', text: 'Key Takeaways' });
    }

    const categoryStyles = {
        technology: 'bg-blue-50/80 text-blue-700 border-blue-100/50',
        design: 'bg-pink-50/80 text-pink-700 border-pink-100/50',
        programming: 'bg-emerald-50/80 text-emerald-700 border-emerald-100/50',
        business: 'bg-amber-50/80 text-amber-700 border-amber-100/50',
        lifestyle: 'bg-purple-50/80 text-purple-700 border-purple-100/50',
        general: 'bg-slate-50/80 text-slate-700 border-slate-100/50'
    };
    const categoryClass = categoryStyles[(blog.category || 'general').toLowerCase()] || categoryStyles.general;

    return (
        <div className="text-gray-800 antialiased min-h-screen flex flex-col bg-mesh">
            <Navbar activePage="explore" />

            {/* Reading Progress Indicator */}
            <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />

            <main className="flex-grow pt-28 pb-24">

                {/* Navigation Bar back link */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
                    <Link to="/explore" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
                        <ArrowLeft weight="bold" size={16} /> Back to explore
                    </Link>
                </div>

                {/* Article Title & Metadata Header section */}
                <header className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
                    <span className="inline-block bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-extrabold mb-4 capitalize tracking-wide border border-indigo-100">
                        {blog.category || 'General'}
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-8 font-display">
                        {blog.title}
                    </h1>

                    {/* Author info row */}
                    <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                        <div className="flex items-center gap-3.5">
                            <img
                                src={authorAvatar}
                                alt={authorName}
                                className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100"
                                onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=f1f5f9&color=4f46e5&bold=true`; }}
                            />
                            <div className="text-left">
                                <p className="text-sm font-bold text-slate-900 leading-none mb-1.5">{authorName}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <CalendarBlank size={12} /> {date}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} /> {readingTime} min read
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Social Share links */}
                        <div className="flex gap-2.5">
                            <button
                                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`)}
                                className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
                                title="Share on Twitter"
                            >
                                <TwitterLogo size={14} weight="fill" />
                            </button>                            <button
                                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`)}
                                className="w-8 h-8 rounded-full border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all cursor-pointer"
                                title="Share on LinkedIn"
                            >
                                <LinkedinLogo size={14} weight="fill" />
                            </button>
                            <button
                                onClick={handleCopyLink}
                                className="w-8 h-8 rounded-full border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all relative cursor-pointer"
                                title="Copy Link"
                            >
                                {copied ? <Check size={14} className="text-emerald-600 animate-pulse" /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                <div className="max-w-5xl mx-auto px-0 sm:px-6 mb-16">
                    <div className="aspect-[21/9] w-full overflow-hidden sm:rounded-3xl shadow-md bg-slate-100 border border-slate-100/50">
                        <img
                            src={imageUrl}
                            alt={blog.title}
                            className="w-full h-full object-cover animate-fade-in"
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=2000&q=80'; }}
                        />
                    </div>
                </div>

                {/* Content & Sidebar Layout */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Outline Sidebar Left Column (Sticky) */}
                        <aside className="hidden lg:block lg:col-span-3">
                            <div className="sticky top-28 space-y-5 text-left p-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-display">
                                    <ShareNetwork size={14} className="text-indigo-500" />
                                    Table of Contents
                                </p>
                                <nav className="space-y-3 border-l border-slate-200/80 pl-4 py-1">
                                    {headings.map((h, idx) => (
                                        <a
                                            key={idx}
                                            href={`#${h.id}`}
                                            className="block text-xs font-bold text-slate-500 hover:text-indigo-600 hover:translate-x-0.5 transition-all leading-tight truncate"
                                        >
                                            {h.text}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Article Content Center Column */}
                        <article className="lg:col-span-6 prose max-w-none text-left">
                            {blog.content && (blog.content.includes('<') && blog.content.includes('>')) ? (
                                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                            ) : (
                                <div style={{ whiteSpace: 'pre-line' }}>{blog.content || ''}</div>
                            )}

                            {/* Tag pill list */}
                            {blog.tags && (() => {
                                const tagList = (Array.isArray(blog.tags) ? blog.tags : blog.tags.split(','))
                                    .map(t => t.trim())
                                    .filter(t => t.length > 0);
                                if (tagList.length === 0) return null;
                                return (
                                    <div className="mt-12 pt-8 border-t border-slate-100/60 flex flex-wrap gap-2">
                                        {tagList.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3.5 py-1.5 bg-white/70 text-slate-600 rounded-full text-xs font-bold border border-slate-200/50 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200/50 transition-all cursor-pointer shadow-sm"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                );
                            })()}
                        </article>

                        {/* Author Sidebar Right Column (Sticky) */}
                        <aside className="hidden lg:block lg:col-span-3">
                            <div className="sticky top-28 glass-card p-6 rounded-3xl text-left">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 font-display">Author Profile</p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={authorAvatar}
                                            alt={authorName}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md shadow-slate-100"
                                        />
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 leading-tight truncate max-w-[140px]">{authorName}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Publisher</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                                        Senior content editor and developer writing guides and insights on the BlogSphere platform.
                                    </p>
                                </div>
                            </div>
                        </aside>

                    </div>
                </div>

                {/* Comment Section Panel */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-20 pt-16 border-t border-slate-100/60 text-left">
                    <div className="flex items-center gap-2.5 mb-10">
                        <Chat size={24} className="text-slate-800" />
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">Discussion ({comments.length})</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

                        {/* Comment Form */}
                        <div className="md:col-span-5">
                            <form onSubmit={handleCommentSubmit} className="space-y-4 glass-card p-5 rounded-3xl">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Add a comment</p>
                                <div className="space-y-1">
                                    <input
                                        type="text"
                                        required
                                        placeholder="Your Name..."
                                        value={commentName}
                                        onChange={e => setCommentName(e.target.value)}
                                        className="w-full text-xs px-3.5 py-3 glass-input text-slate-800 font-semibold"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="What are your thoughts on this story?..."
                                        value={commentText}
                                        onChange={e => setCommentText(e.target.value)}
                                        className="w-full text-xs px-3.5 py-3 glass-input text-slate-800 leading-relaxed resize-none font-semibold"
                                    />
                                </div>
                                <button type="submit" className="w-full btn-primary py-3 text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer">
                                    <span>Submit Comment</span>
                                    <ArrowRight size={14} weight="bold" />
                                </button>
                            </form>
                        </div>

                        {/* Comments Threads List */}
                        <div className="md:col-span-7 space-y-6">
                            {comments.map((c, idx) => (
                                <div key={idx} className="glass-card p-5 rounded-3xl space-y-2.5 hover:border-slate-200 transition-all">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                                {c.name[0]}
                                            </div>
                                            <span className="text-xs font-bold text-slate-800">{c.name}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{c.date}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed font-semibold pl-9">{c.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Related Articles list */}
                {!loading && relatedBlogs.length > 0 && (
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-16 border-t border-slate-100">
                        <div className="mb-10 text-center sm:text-left">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">Related Stories</h2>
                            <p className="text-slate-500 text-xs mt-1">Recommended articles matching this topic.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedBlogs.map((b, idx) => (
                                <BlogCard key={b._id} blog={b} index={idx} />
                            ))}
                        </div>
                    </section>
                )}

            </main>

            <Footer />
        </div>
    );
}
