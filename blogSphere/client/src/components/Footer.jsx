import { Link } from 'react-router-dom';
import { PenNib, TwitterLogo, GithubLogo, LinkedinLogo } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-auto py-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/10">
              <PenNib weight="bold" size={16} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 font-display">BlogSphere</span>
          </div>
          <p className="text-slate-400 text-xs font-semibold text-center md:text-left">
            &copy; {new Date().getFullYear()} BlogSphere. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 hover:bg-indigo-50 rounded-xl">
              <TwitterLogo size={20} weight="fill" />
            </a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 hover:bg-indigo-50 rounded-xl">
              <GithubLogo size={20} weight="fill" />
            </a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 hover:bg-indigo-50 rounded-xl">
              <LinkedinLogo size={20} weight="fill" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
