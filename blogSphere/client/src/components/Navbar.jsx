import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PenNib, PlusCircle, User, SquaresFour, SignOut, List, X } from '@phosphor-icons/react';

export default function Navbar({ activePage }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const avatarSrc = user?.profileImage
    ? `/uploads/${user.profileImage.replace(/^uploads\//, '')}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=ffffff&bold=true`;

  return (
    <nav className="fixed w-full z-50 glass-nav transition-all duration-300 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <PenNib weight="bold" size={20} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900 font-display transition-colors group-hover:text-indigo-600">BlogSphere</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-semibold text-sm transition-all duration-200 relative py-1 group ${activePage === 'home' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Home
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full transition-transform duration-300 origin-left ${activePage === 'home' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </Link>
            <Link
              to="/explore"
              className={`font-semibold text-sm transition-all duration-200 relative py-1 group ${activePage === 'explore' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Explore
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full transition-transform duration-300 origin-left ${activePage === 'explore' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </Link>

            {user ? (
              <div className="flex items-center gap-6">
                <Link
                  to="/create-blog"
                  className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors flex items-center gap-1.5 hover:scale-102"
                >
                  <PlusCircle size={18} weight="bold" /> Write
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-full border-2 border-indigo-100 hover:border-indigo-400 overflow-hidden shadow-sm focus:outline-none transition-all duration-300"
                  >
                    <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                      <div className="absolute right-0 mt-3 w-52 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl py-2 border border-slate-100 z-20 animate-fade-in text-left">
                        <div className="px-4 py-2 border-b border-slate-100 mb-1.5">
                          <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{user.email}</p>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                        >
                          <SquaresFour size={14} className="inline mr-2" /> Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                        >
                          <User size={14} className="inline mr-2" /> Profile
                        </Link>
                        <div className="border-t border-slate-50 my-1" />
                        <button
                          onClick={() => { setDropdownOpen(false); handleLogout(); }}
                          className="w-full text-left block px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <SignOut size={14} className="inline mr-2" /> Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="btn-primary text-white px-6 py-2.5 rounded-full font-semibold shadow-sm hover:shadow-md transition-all text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-indigo-600 focus:outline-none transition-colors"
            >
              {mobileMenuOpen ? <X size={28} /> : <List size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-100 absolute w-full left-0 shadow-lg animate-fade-in text-left z-50">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-3 rounded-xl text-base font-semibold transition-colors ${activePage === 'home' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-3 rounded-xl text-base font-semibold transition-colors ${activePage === 'explore' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              Explore
            </Link>

            {user ? (
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                <div className="px-3 py-1 mb-2">
                  <p className="text-sm font-bold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">{user.email}</p>
                </div>
                <Link
                  to="/create-blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Write a Blog
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Profile
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="w-full text-left block px-3 py-3 rounded-xl text-base font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-3 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-3 py-3 rounded-xl text-base font-semibold text-white btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
