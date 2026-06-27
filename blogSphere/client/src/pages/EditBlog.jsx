import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { blogsAPI } from '../services/api';
import { ArrowLeft, Check, Image, CaretDown, Spinner, PenNib } from '@phosphor-icons/react';

export default function EditBlog() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileRef = useRef();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loadingBlog, setLoadingBlog] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        blogsAPI.getById(id)
            .then(blog => {
                setTitle(blog.title || '');
                setCategory(blog.category || '');
                setTags((blog.tags || []).join(', '));
                setContent(blog.content || '');
                if (blog.image) {
                    setImagePreview(`/uploads/${blog.image.replace(/^uploads\//, '')}`);
                }
            })
            .catch(err => setLoadError(err.message))
            .finally(() => setLoadingBlog(false));
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('category', category);
            formData.append('tags', tags);
            formData.append('content', content);
            if (imageFile) formData.append('image', imageFile);
            await blogsAPI.update(id, formData);
            navigate('/dashboard');
        } catch (err) {
            alert('Failed to update: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loadingBlog) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-3 text-slate-500">
                <Spinner size={36} className="animate-spin text-slate-800" />
                <span className="font-semibold text-sm">Loading story details...</span>
            </div>
        </div>
    );

    if (loadError) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center p-8 bg-white border border-slate-100 rounded-3xl max-w-sm shadow-sm">
                <p className="text-rose-600 text-lg font-bold mb-4">Error loading draft: {loadError}</p>
                <Link to="/dashboard" className="btn-primary px-6 py-3 rounded-full text-sm font-semibold inline-block">← Back to Dashboard</Link>
            </div>
        </div>
    );

    return (
        <div className="text-gray-800 antialiased min-h-screen flex flex-col bg-mesh">

            {/* Editor control header */}
            <nav className="glass-nav sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-wider">
                            <ArrowLeft weight="bold" size={16} /> Back
                        </Link>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/10">
                                <PenNib weight="bold" size={16} />
                            </div>
                            <span className="font-extrabold text-sm tracking-tight text-slate-900 font-display">Edit Story Draft</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                form="editBlogForm"
                                disabled={saving}
                                className="btn-primary px-5 py-2.5 text-xs font-bold shadow-md flex items-center gap-2 disabled:opacity-70 cursor-pointer"
                            >
                                {saving ? (
                                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                    <>
                                        <span>Update Story</span>
                                        <Check weight="bold" size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Composition Panel */}
            <main className="flex-grow py-12 px-4 sm:px-6 max-w-3xl mx-auto w-full animate-fade-in">
                <div className="glass-card rounded-3xl p-6 sm:p-10">
                    <form id="editBlogForm" onSubmit={handleSubmit} className="space-y-8 text-left">

                        {/* Image upload preview */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Article Cover Photo</label>
                            <div
                                className="relative w-full h-56 sm:h-64 rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 hover:bg-white hover:border-indigo-300 transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer group"
                                onClick={() => fileRef.current.click()}
                            >
                                <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleImageChange} />
                                {!imagePreview ? (
                                    <div className="text-center p-6 flex flex-col items-center space-y-3">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-500 group-hover:scale-105 transition-transform duration-300">
                                            <Image weight="bold" size={24} className="text-slate-400 group-hover:text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">Click to upload cover photo</p>
                                            <p className="text-[10px] text-slate-400 mt-1">Recommended width: 1600px (JPG, PNG)</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="absolute inset-0 w-full h-full object-cover"
                                            onError={e => { e.target.src = ''; setImagePreview(''); }}
                                        />
                                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="bg-white text-slate-800 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg">
                                                Change cover photo
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Article Title</label>
                            <input
                                type="text"
                                id="title"
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 placeholder-slate-300 bg-transparent border-0 border-b border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none pb-3 font-display transition-colors"
                                placeholder="Title of your story..."
                            />
                        </div>

                        {/* Category + Tags Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            {/* Category */}
                            <div className="space-y-2">
                                <label htmlFor="category" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Topic / Category</label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        required
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="w-full pl-4 pr-10 py-3.5 glass-input text-xs font-bold text-slate-700 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select a category</option>
                                        <option value="technology">Technology</option>
                                        <option value="design">Design</option>
                                        <option value="lifestyle">Lifestyle</option>
                                        <option value="programming">Programming</option>
                                        <option value="business">Business</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                        <CaretDown weight="bold" size={14} />
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <label htmlFor="tags" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    id="tags"
                                    value={tags}
                                    onChange={e => setTags(e.target.value)}
                                    className="w-full px-4 py-3.5 glass-input text-xs font-bold text-slate-700 placeholder-slate-400"
                                    placeholder="web, tutorial, design"
                                />
                            </div>

                        </div>

                        {/* Article Content Area */}
                        <div className="space-y-2 pt-4 border-t border-slate-100/60">
                            <label htmlFor="content" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Story Content</label>
                            <textarea
                                id="content"
                                required
                                rows={16}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                className="w-full text-sm text-slate-700 placeholder-slate-400 bg-transparent border-0 focus:ring-0 outline-none p-0 resize-none leading-relaxed font-sans"
                                placeholder="Tell your story..."
                            />
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}
