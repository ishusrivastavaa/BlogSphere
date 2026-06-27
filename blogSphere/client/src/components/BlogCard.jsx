import { Link } from 'react-router-dom';
import { CalendarBlank } from '@phosphor-icons/react';

export default function BlogCard({ blog, index }) {
  const date = blog.createdAt 
    ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  const imageUrl = blog.image
    ? `/uploads/${blog.image.replace(/^uploads\//, '')}`
    : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';

  const authorName = blog.author?.name || 'Unknown Author';
  const authorAvatar = blog.author?.profileImage
    ? `/uploads/${blog.author.profileImage.replace(/^uploads\//, '')}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=6366f1&color=ffffff&bold=true`;

  const categoryStyles = {
    technology: 'bg-blue-50/80 text-blue-600 border-blue-100/50',
    design: 'bg-pink-50/80 text-pink-600 border-pink-100/50',
    programming: 'bg-emerald-50/80 text-emerald-600 border-emerald-100/50',
    business: 'bg-amber-50/80 text-amber-600 border-amber-100/50',
    lifestyle: 'bg-purple-50/80 text-purple-600 border-purple-100/50',
    general: 'bg-slate-50/80 text-slate-600 border-slate-100/50'
  };
  const categoryClass = categoryStyles[(blog.category || 'general').toLowerCase()] || categoryStyles.general;

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col justify-between h-[440px] text-left group">
      <div>
        <Link to={`/blog/${blog._id}`} className="block aspect-[16/10] overflow-hidden rounded-2xl mb-5 bg-slate-100 relative">
          <img
            src={imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'; }}
          />
          <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/5 transition-colors duration-300" />
        </Link>
        <div className="flex justify-between items-center gap-4 mb-3">
          <span className={`px-3 py-1 border text-[10px] font-bold rounded-full whitespace-nowrap capitalize tracking-wide ${categoryClass}`}>
            {blog.category || 'General'}
          </span>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <CalendarBlank size={12} /> {date}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 leading-snug hover:text-indigo-600 transition-colors line-clamp-2 font-display">
          <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
        </h3>
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mt-2">
          {blog.content ? blog.content.replace(/<[^>]*>?/gm, '') : ''}
        </p>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100/60">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 ring-2 ring-slate-100/50 group-hover:ring-indigo-100 transition-all duration-300">
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=6366f1&color=ffffff&bold=true`; }}
          />
        </div>
        <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors duration-200">{authorName}</span>
      </div>
    </div>
  );
}
