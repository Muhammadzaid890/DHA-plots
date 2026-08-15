'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Phone, Mail, MapPin, Search, Plus, Shield, CheckCircle, 
  ChevronDown, ChevronUp, User, Lock, LogOut, ArrowRight, Eye, Trash2, 
  MessageSquare, Sparkles, SlidersHorizontal, Share2, Check, RefreshCw, X, Menu,
  AlertTriangle
} from 'lucide-react';

const BrandLogo = ({ className = "h-10 w-10" }) => (
  <svg viewBox="0 0 500 500" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M65 155 L165 115 L165 375 L65 335 Z" fill="#9CA3AF" />
    <path d="M165 115 L245 150 L245 270 L165 235 Z" fill="#E5E7EB" />
    <path d="M115 150 L165 130 L165 270 L115 250 Z" fill="#E5B264" />
    <path d="M165 130 L198 145 L198 270 L165 270 Z" fill="#c8984e" />
    <path d="M245 40 L430 170 L430 335 L245 205 Z" fill="#0B1A28" />
    <path d="M305 150 L400 200 L400 335 L305 280 Z" fill="#060e16" />
    <path d="M308 200 L400 198 L400 335 L308 335 Z" fill="#E5B264" />
    <path d="M308 200 L400 335 L308 335 Z" fill="#a87a38" />
  </svg>
);

const OWNER_NAME = "Zeshan Khurshid";
const ESTATE_NAME = "SADAF ESTATE";
const PHONE_NUMBER = "03331234201";
const WHATSAPP_LINK = "https://wa.me/923331234201";
const OFFICE_ADDRESS = "1st floor Building #37C, 11 corner, Office #1 Lane 4, Bukhari Commercial Area Phase 6 Defence Housing Authority, Karachi, 75500";

// Social media links - easily replace '#' with your actual profile links
const SOCIAL_LINKS = {
  facebook: "#",
  instagram: "#",
  tiktok: "#",
  youtube: "#"
};

const COMMERCIAL_AREAS = [
  "BUSINESS ZONE COM",
  "BEACH AVENUE COM",
  "SAHIL COMMERCIAL",
  "ZULFIQAR COM",
  "AL MURTAZA COM",
  "PENINSULA COM"
];

const HOME_COMMERCIAL_AREAS = [
  "BUSINESS ZONE COM",
  "ZULFIQAR COM",
  "AL MURTAZA COM",
  "SAHIL COMMERCIAL",
  "PENINSULA COM"
];

const RESIDENTIAL_SIZES = [
  "300 YRD",
  "500 YRD",
  "600 YRD",
  "666 YRD",
  "1000 YRD",
  "2000 YRD"
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [ads, setAds] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [dbError, setDbError] = useState('');

  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('dha_current_user');
        return savedUser ? JSON.parse(savedUser) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser) {
        localStorage.setItem('dha_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('dha_current_user');
      }
    }
  }, [currentUser]);

  const fetchAds = async () => {
    try {
      setIsPageLoading(true);
      const res = await fetch('/api/ads');
      const data = await res.json();
      
      if (data.success && Array.isArray(data.ads)) {
        setAds(data.ads);
        setDbError('');
      } else {
        setAds([]);
        if (data.error) {
          setDbError(data.error);
        }
      }
    } catch (err) {
      console.error('Failed to load ads:', err);
      setAds([]);
      setDbError('Database Connection Error');
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const toggleCategory = (catName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: authMode,
          email: authEmail,
          password: authPassword,
          name: authName,
          phone: authPhone
        })
      });
      const data = await res.json();

      if (data.success && data.user) {
        setCurrentUser(data.user);
        showToast(authMode === 'login' ? `Welcome back, ${data.user.name}!` : `Account saved in DB! Welcome ${data.user.name}`);
        setIsAuthModalOpen(false);
        setAuthPassword('');
      } else {
        showToast(data.error || 'Authentication failed');
      }
    } catch (err) {
      showToast('Network error during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dha_current_user');
    }
    if (currentPage === 'admin') setCurrentPage('home');
    showToast('Logged out successfully.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-[#E5B264] selection:text-slate-950 relative">
      
      {/* Toast Popup */}
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 bg-[#E5B264] text-slate-950 px-6 py-3.5 rounded-2xl shadow-2xl font-black flex items-center gap-2.5 border border-[#d6a354] animate-bounce">
          <Sparkles className="w-5 h-5 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Database Error Warning Banner */}
      {dbError && (
        <div className="bg-[#E5B264]/10 border-b border-[#E5B264]/30 text-amber-900 text-xs px-4 py-3 flex items-center justify-between">
          <div className="max-w-7xl mx-auto flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-[#E5B264] flex-shrink-0" />
            <span>Database Status: {dbError}</span>
          </div>
          <button 
            onClick={fetchAds} 
            className="bg-[#E5B264] text-slate-950 px-3 py-1 rounded-lg font-bold hover:bg-[#d4a052] transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-[#0B1A28]/95 backdrop-blur-md text-white border-b border-[#183048] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <div 
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="p-1.5 rounded-2xl bg-[#060e16] border border-[#183048] group-hover:border-[#E5B264] transition-all shadow-md">
                <BrandLogo className="h-10 w-10 transition-transform group-hover:scale-105" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white block leading-none">
                  DHA <span className="text-[#E5B264]">PLOTS</span>
                </span>
                <span className="text-[10px] text-[#E5B264] font-extrabold uppercase tracking-widest block mt-1">
                  Phase 8 Property Network
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all ${currentPage === 'home' ? 'bg-[#E5B264] text-slate-950 shadow-lg shadow-[#E5B264]/20' : 'text-slate-300 hover:text-white hover:bg-[#13283b]'}`}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage('commercial')}
                className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all ${currentPage === 'commercial' ? 'bg-[#E5B264] text-slate-950 shadow-lg shadow-[#E5B264]/20' : 'text-slate-300 hover:text-white hover:bg-[#13283b]'}`}
              >
                Commercial
              </button>
              <button 
                onClick={() => setCurrentPage('residential')}
                className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all ${currentPage === 'residential' ? 'bg-[#E5B264] text-slate-950 shadow-lg shadow-[#E5B264]/20' : 'text-slate-300 hover:text-white hover:bg-[#13283b]'}`}
              >
                Residential
              </button>
              <button 
                onClick={() => setCurrentPage('contact')}
                className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all ${currentPage === 'contact' ? 'bg-[#E5B264] text-slate-950 shadow-lg shadow-[#E5B264]/20' : 'text-slate-300 hover:text-white hover:bg-[#13283b]'}`}
              >
                Contact
              </button>
              {currentUser?.role === 'admin' && (
                <button 
                  onClick={() => setCurrentPage('admin')}
                  className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all border border-[#E5B264]/40 flex items-center gap-1.5 ${currentPage === 'admin' ? 'bg-[#E5B264] text-slate-950' : 'text-[#E5B264] bg-[#E5B264]/10 hover:bg-[#E5B264]/20'}`}
                >
                  <Shield className="w-4 h-4" /> Admin Panel
                </button>
              )}
            </nav>

            <div className="hidden md:flex items-center space-x-3">
              {currentUser ? (
                <div className="flex items-center gap-3 bg-[#060e16] px-4 py-2 rounded-2xl border border-[#183048]">
                  <div className="text-right">
                    <span className="block text-xs font-bold text-white">{currentUser.name || 'User'}</span>
                    <span className="block text-[10px] text-[#E5B264] font-extrabold uppercase tracking-wider">{currentUser.role}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-[#E5B264] hover:bg-[#d8a353] text-slate-950 font-black px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-[#E5B264]/20 active:scale-95 flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> Login / Sign Up
                </button>
              )}
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-[#E5B264]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0B1A28] border-b border-[#183048] px-4 py-4 space-y-2">
            <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-bold text-slate-100 hover:bg-[#13283b]">Home</button>
            <button onClick={() => { setCurrentPage('commercial'); setMobileMenuOpen(false); }} className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-bold text-slate-100 hover:bg-[#13283b]">Commercial</button>
            <button onClick={() => { setCurrentPage('residential'); setMobileMenuOpen(false); }} className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-bold text-slate-100 hover:bg-[#13283b]">Residential</button>
            <button onClick={() => { setCurrentPage('contact'); setMobileMenuOpen(false); }} className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-bold text-slate-100 hover:bg-[#13283b]">Contact</button>
            {currentUser?.role === 'admin' && (
              <button onClick={() => { setCurrentPage('admin'); setMobileMenuOpen(false); }} className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-bold text-[#E5B264] hover:bg-[#13283b]">Admin Panel</button>
            )}
            {!currentUser ? (
              <button onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }} className="w-full bg-[#E5B264] text-slate-950 font-extrabold py-2.5 rounded-xl text-center text-sm mt-2">Login / Sign Up</button>
            ) : (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full bg-rose-500/20 text-rose-300 font-bold py-2.5 rounded-xl text-center text-sm mt-2">Logout</button>
            )}
          </div>
        )}
      </header>

      {/* Main Page Dynamic Routing */}
      <main className="flex-grow bg-white">
        {currentPage === 'home' && (
          <HomePage 
            ads={ads} 
            setCurrentPage={setCurrentPage} 
            setSelectedPlot={setSelectedPlot}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isPageLoading={isPageLoading}
          />
        )}

        {currentPage === 'commercial' && (
          <CategoryListingPage 
            title="DHA PHASE 8 COMMERCIAL AREAS"
            subtitle="Click any commercial area below to view posted ads for that zone."
            categories={COMMERCIAL_AREAS}
            ads={ads}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
            setSelectedPlot={setSelectedPlot}
            type="Commercial"
          />
        )}

        {currentPage === 'residential' && (
          <CategoryListingPage 
            title="DHA PHASE 8 RESIDENTIAL SIZES"
            subtitle="Click any yard category below to view posted ads for that size."
            categories={RESIDENTIAL_SIZES}
            ads={ads}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
            setSelectedPlot={setSelectedPlot}
            type="Residential"
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage showToast={showToast} />
        )}

        {currentPage === 'admin' && currentUser?.role === 'admin' && (
          <AdminPanelPage 
            ads={ads} 
            fetchAds={fetchAds} 
            showToast={showToast} 
          />
        )}
      </main>

      <footer className="bg-[#0B1A28] border-t border-[#183048] text-slate-400 text-xs py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <BrandLogo className="h-9 w-9" />
              <span className="text-xl font-black text-white tracking-tight">DHA <span className="text-[#E5B264]">PLOTS</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Premier DHA Karachi & Phase 8 Real Estate Advisory. Specializing in high-value commercial zones and luxury residential plots.
            </p>
            <p className="text-xs text-[#E5B264] font-extrabold tracking-wide">
              Project by Earth Develope&apos;s
            </p>

            {/* Social Media Links with Inline SVGs */}
            <div className="pt-2 flex items-center space-x-3">
              <a 
                href={SOCIAL_LINKS.facebook} 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl bg-[#060e16] border border-[#183048] flex items-center justify-center text-slate-300 hover:text-[#E5B264] hover:border-[#E5B264] transition-all"
                title="Facebook"
              >
                {/* Facebook SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href={SOCIAL_LINKS.instagram} 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl bg-[#060e16] border border-[#183048] flex items-center justify-center text-slate-300 hover:text-[#E5B264] hover:border-[#E5B264] transition-all"
                title="Instagram"
              >
                {/* Instagram SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href={SOCIAL_LINKS.tiktok} 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl bg-[#060e16] border border-[#183048] flex items-center justify-center text-slate-300 hover:text-[#E5B264] hover:border-[#E5B264] transition-all"
                title="TikTok"
              >
                {/* TikTok Icon SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.887 2.89 2.89 0 0 1-2.887-2.887 2.89 2.89 0 0 1 2.887-2.887c.307 0 .602.053.88.146V9.45a6.31 6.31 0 0 0-.88-.063C6.182 9.387 3.5 12.07 3.5 15.378c0 3.308 2.682 5.99 5.99 5.99 3.308 0 5.99-2.682 5.99-5.99V8.6a8.212 8.212 0 0 0 4.109 1.531V6.686z"/>
                </svg>
              </a>
              <a 
                href={SOCIAL_LINKS.youtube} 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl bg-[#060e16] border border-[#183048] flex items-center justify-center text-slate-300 hover:text-[#E5B264] hover:border-[#E5B264] transition-all"
                title="YouTube"
              >
                {/* YouTube SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black text-white uppercase tracking-widest text-[#E5B264] mb-3">Quick Navigation</h4>
            <div className="flex flex-col space-y-2 font-bold">
              <button onClick={() => setCurrentPage('home')} className="text-left hover:text-[#E5B264] transition-colors">Home Page</button>
              <button onClick={() => setCurrentPage('commercial')} className="text-left hover:text-[#E5B264] transition-colors">Phase 8 Commercial</button>
              <button onClick={() => setCurrentPage('residential')} className="text-left hover:text-[#E5B264] transition-colors">Residential Yard Sizes</button>
              <button onClick={() => setCurrentPage('contact')} className="text-left hover:text-[#E5B264] transition-colors">Direct Contact & Address</button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-widest text-[#E5B264] mb-3">Direct Contact</h4>
            <p className="text-slate-200 font-black flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-[#E5B264]" /> {PHONE_NUMBER}
            </p>
            <p className="text-slate-300 font-medium">Principal Consultant: <strong>{OWNER_NAME} {ESTATE_NAME}</strong></p>
            <p className="text-slate-400 font-medium leading-relaxed">{OFFICE_ADDRESS}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-[#183048] text-center text-slate-500 text-[11px] font-semibold">
          &copy; {new Date().getFullYear()} DHA Plots Real Estate Network. All Rights Reserved. | <span className="text-[#E5B264] font-bold">Project by Earth Develope&apos;s</span>
        </div>
      </footer>

      {/* Floating Circular WhatsApp Chat Button */}
      <a 
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-500 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/30 group"
        title="Chat on WhatsApp"
      >
        <MessageSquare className="w-7 h-7 text-white fill-white" />
        <span className="absolute right-16 bg-[#0B1A28] text-[#E5B264] border border-[#183048] text-xs font-black px-3 py-1.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          WhatsApp Chat
        </span>
      </a>

      {selectedPlot && (
        <PlotDetailsModal 
          plot={selectedPlot} 
          onClose={() => setSelectedPlot(null)} 
        />
      )}

      {isAuthModalOpen && (
        <AuthModal 
          mode={authMode} 
          setAuthMode={setAuthMode} 
          email={authEmail} 
          setEmail={setAuthEmail} 
          password={authPassword} 
          setPassword={setAuthPassword} 
          name={authName}
          setName={setAuthName}
          phone={authPhone}
          setPhone={setAuthPhone}
          onSubmit={handleAuthSubmit} 
          isLoading={isLoading} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      )}

    </div>
  );
}

function HomePage({ ads, setCurrentPage, setSelectedPlot, searchQuery, setSearchQuery, isPageLoading }) {
  const [expandedHomeCat, setExpandedHomeCat] = useState({});

  const toggleHomeCategory = (catName) => {
    setExpandedHomeCat(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  const filteredAds = useMemo(() => {
    if (!searchQuery) return ads;
    return ads.filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.plotNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [ads, searchQuery]);

  return (
    <div className="space-y-12 py-8 bg-white">
      {/* Hero Banner with Background Skyline Image */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-[#183048] shadow-2xl min-h-[380px] flex items-center">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80" 
            alt="DHA Phase 8 Commercial Skyline" 
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A28] via-[#0B1A28]/90 to-[#0B1A28]/40"></div>

          <div className="max-w-3xl space-y-6 relative z-10 p-8 sm:p-14 text-white">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-[#E5B264]/20 text-[#E5B264] border border-[#E5B264]/40 backdrop-blur-sm tracking-wide">
              <Building2 className="w-3.5 h-3.5 text-[#E5B264]" /> Direct DHA Phase 8 Verified Listings
            </span>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              Exclusive <span className="text-[#E5B264]">Commercial & Residential</span> Plots
            </h1>
            
            <p className="text-slate-200 text-base sm:text-lg font-medium leading-relaxed drop-shadow">
              Managed by <strong className="text-white">{OWNER_NAME} {ESTATE_NAME}</strong>. Direct market inventory for Business Zone, Zulfiqar Com, Al Murtaza Com, Sahil Com, Peninsula Com, and Residential Yards (300 YRD to 2000 YRD).
            </p>
          </div>
        </div>
      </section>

      {/* Commercial & Residential Quick Navigation Buttons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => setCurrentPage('commercial')}
            className="group bg-[#0B1A28] hover:bg-[#0e2235] border border-[#183048] hover:border-[#E5B264]/50 p-6 sm:p-8 rounded-3xl text-left transition-all duration-300 shadow-xl flex items-center justify-between cursor-pointer"
          >
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#E5B264]">Explore Commercial</span>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#E5B264] transition-colors">
                DHA Phase 8 Commercial Areas
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Business Zone, Beach Avenue, Sahil Com, Zulfiqar Com & Peninsula Com.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E5B264]/10 group-hover:bg-[#E5B264] group-hover:text-slate-950 text-[#E5B264] flex items-center justify-center transition-all flex-shrink-0 ml-4">
              <ArrowRight className="w-6 h-6" />
            </div>
          </button>

          <button 
            onClick={() => setCurrentPage('residential')}
            className="group bg-[#0B1A28] hover:bg-[#0e2235] border border-[#183048] hover:border-[#E5B264]/50 p-6 sm:p-8 rounded-3xl text-left transition-all duration-300 shadow-xl flex items-center justify-between cursor-pointer"
          >
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#E5B264]">Explore Residential</span>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#E5B264] transition-colors">
                Residential Yard Categories
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                300 YRD, 500 YRD, 600 YRD, 666 YRD, 1000 YRD & 2000 YRD plots.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E5B264]/10 group-hover:bg-[#E5B264] group-hover:text-slate-950 text-[#E5B264] flex items-center justify-center transition-all flex-shrink-0 ml-4">
              <ArrowRight className="w-6 h-6" />
            </div>
          </button>
        </div>
      </section>

      {/* Accordion Categories Direct Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {HOME_COMMERCIAL_AREAS.map((catName) => {
          const matchingAds = filteredAds.filter(a => a.category === catName);
          const isExpanded = expandedHomeCat[catName] || Boolean(searchQuery);

          return (
            <div 
              key={catName}
              className="bg-[#E8F1F9] border border-slate-300/80 rounded-2xl overflow-hidden transition-all shadow-md hover:bg-[#dbe7f3]"
            >
              <button 
                onClick={() => toggleHomeCategory(catName)}
                className="w-full px-5 py-4 sm:py-5 flex items-center justify-between text-left focus:outline-none transition-colors"
              >
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <div className="bg-[#0B1A28] text-[#E5B264] font-black text-xs px-3.5 py-2 rounded-xl shadow-sm tracking-wider whitespace-nowrap">
                    {matchingAds.length} Ads
                  </div>
                  <span className="font-black text-sm sm:text-base text-slate-900 uppercase tracking-widest">
                    {catName}
                  </span>
                </div>

                <div className="text-slate-700 pl-2">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#b08034] transition-transform" />
                  ) : (
                    <ChevronDown className="w-5 h-5 transition-transform" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="p-3 sm:p-5 border-t border-slate-300/80 bg-white/80 space-y-3">
                  {matchingAds.length === 0 ? (
                    <div className="text-center py-8 text-slate-600 text-xs font-semibold">
                      Currently no active ads in <span className="text-[#b08034] font-bold">{catName}</span>.
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-300 shadow-md overflow-hidden divide-y divide-slate-200 bg-[#E8F1F9]">
                      {matchingAds.map((ad, idx) => (
                        <AdRowItem key={ad.id || idx} ad={ad} index={idx} onClick={() => setSelectedPlot(ad)} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}

function CategoryListingPage({ title, subtitle, categories, ads, expandedCategories, toggleCategory, setSelectedPlot, type }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase bg-[#E5B264]/10 text-slate-900 border border-[#E5B264]/30">
          {type} Directory
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">{title}</h1>
        <p className="text-slate-500 text-sm font-medium">{subtitle}</p>
      </div>

      <div className="space-y-3.5">
        {categories.map((catName) => {
          const matchingAds = ads.filter(a => a.category === catName);
          const isExpanded = expandedCategories[catName];

          return (
            <div 
              key={catName}
              className="bg-[#E8F1F9] border border-slate-300/80 rounded-2xl overflow-hidden transition-all shadow-md hover:bg-[#dbe7f3]"
            >
              <button 
                onClick={() => toggleCategory(catName)}
                className="w-full px-5 py-4 sm:py-5 flex items-center justify-between text-left focus:outline-none transition-colors"
              >
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <div className="bg-[#0B1A28] text-[#E5B264] font-black text-xs px-3.5 py-2 rounded-xl shadow-sm tracking-wider whitespace-nowrap">
                    {matchingAds.length} Ads
                  </div>
                  <span className="font-black text-sm sm:text-base text-slate-900 uppercase tracking-widest">
                    {catName}
                  </span>
                </div>

                <div className="text-slate-700 pl-2">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#b08034] transition-transform" />
                  ) : (
                    <ChevronDown className="w-5 h-5 transition-transform" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="p-3 sm:p-5 border-t border-slate-300/80 bg-white/80 space-y-3">
                  {matchingAds.length === 0 ? (
                    <div className="text-center py-8 text-slate-600 text-xs font-semibold">
                      Currently no active ads in <span className="text-[#b08034] font-bold">{catName}</span>.
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-300 shadow-md overflow-hidden divide-y divide-slate-200 bg-[#E8F1F9]">
                      {matchingAds.map((ad, idx) => (
                        <AdRowItem key={ad.id || idx} ad={ad} index={idx} onClick={() => setSelectedPlot(ad)} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdRowItem({ ad, index, onClick }) {
  const formatPkr = (croreStr) => {
    if (!croreStr) return '—';
    const num = parseFloat(croreStr);
    if (isNaN(num)) return `PKR ${croreStr}`;
    const pkrNum = Math.round(num * 10000000);
    return `PKR ${pkrNum.toLocaleString('en-PK')}`;
  };

  const isRowEven = index % 2 === 0;

  return (
    <div 
      onClick={onClick}
      className={`p-4 sm:p-5 transition-all cursor-pointer hover:bg-[#dbe7f3] text-slate-900 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 ${
        isRowEven ? 'bg-[#E8F1F9]' : 'bg-[#f2f7fc]'
      }`}
    >
      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-[240px]">
        <span className="text-sm font-extrabold text-slate-500 w-8 flex-shrink-0">
          #{ad.id || (index + 1)}
        </span>
        <div>
          <h4 className="font-black text-base text-slate-900 leading-snug hover:text-[#b08034] transition-colors">
            {ad.title}
          </h4>
          <p className="text-xs text-slate-600 font-bold mt-0.5">
            {ad.plotNo || "DHA Karachi"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-xl">
        <span className="bg-[#0B1A28] text-white text-xs font-black px-3 py-1.5 rounded-lg border border-[#183048]">
          {ad.size?.includes('sq.yd') || ad.size?.includes('YRD') ? ad.size : `${ad.size} sq.yd`}
        </span>

        <span className="text-slate-400 hidden sm:inline">&mdash;</span>

        <span className="bg-[#0B1A28] text-white text-xs font-black px-3 py-1.5 rounded-lg border border-[#183048]">
          DHA {ad.phase || 'Phase 8'}
        </span>

        {ad.corner && (
          <span className="bg-[#E5B264]/20 text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg border border-[#E5B264]/60">
            Corner
          </span>
        )}
        {ad.parkFacing && (
          <span className="bg-[#E5B264]/20 text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg border border-[#E5B264]/60">
            Facing Commercial / Park
          </span>
        )}
        {ad.westOpen && (
          <span className="bg-[#E5B264]/20 text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg border border-[#E5B264]/60">
            West open
          </span>
        )}
        {ad.mainBoulevard && (
          <span className="bg-[#E5B264]/20 text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg border border-[#E5B264]/60">
            Main Blvd
          </span>
        )}
      </div>

      <div className="min-w-[160px] text-left lg:text-center">
        <span className="bg-[#E5B264] text-slate-950 px-3.5 py-1.5 rounded-xl font-black text-sm sm:text-base tracking-tight shadow-sm inline-block">
          {formatPkr(ad.priceCrore)}
        </span>
      </div>

      <div className="min-w-[210px] border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-300">
        <span className="block font-black text-xs sm:text-sm text-slate-900">
          Zeshan Khurshid SADAF ESTATE
        </span>
        <div className="mt-1 space-y-0.5">
          <a 
            href={WHATSAPP_LINK} 
            target="_blank" 
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
            {PHONE_NUMBER}
          </a>
        </div>
      </div>
    </div>
  );
}

function ContactPage({ showToast }) {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Thank you! Your message has been saved.');
        setFormData({ name: '', phone: '', message: '' });
      } else {
        showToast('Message submitted successfully!');
        setFormData({ name: '', phone: '', message: '' });
      }
    } catch (err) {
      showToast('Message submitted.');
      setFormData({ name: '', phone: '', message: '' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-white">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase bg-[#E5B264]/10 text-slate-900 border border-[#E5B264]/30">
          Direct Estate Advisory
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">Get in Touch With Us</h1>
        <p className="text-slate-500 text-sm font-medium">Direct consultation for Phase 8 plots, files, and high-value commercial investments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-[#0B1A28] border border-[#183048] rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden text-white">
          <div>
            <span className="text-xs font-black text-[#E5B264] uppercase tracking-widest">Principal Estate Agent</span>
            <h2 className="text-2xl font-black text-white mt-1">{OWNER_NAME} {ESTATE_NAME}</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">DHA Karachi Phase 8 Real Estate Specialist</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#183048]">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-2xl bg-[#E5B264]/10 text-[#E5B264] flex items-center justify-center flex-shrink-0 font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Phone / Call Line</span>
                <a href={`tel:${PHONE_NUMBER}`} className="text-base font-black text-white hover:text-[#E5B264] transition-colors">
                  {PHONE_NUMBER}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">WhatsApp Direct</span>
                <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="text-base font-extrabold text-emerald-400 hover:underline">
                  Chat on WhatsApp ({PHONE_NUMBER})
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-2xl bg-[#13283b] text-slate-300 flex items-center justify-center flex-shrink-0 font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Office Address</span>
                <span className="text-xs font-semibold text-slate-200 leading-relaxed block">
                  {OFFICE_ADDRESS}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0B1A28] border border-[#183048] rounded-3xl p-8 space-y-6 shadow-2xl text-white">
          <h3 className="text-xl font-black text-white">Send Direct Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Your Name</label>
              <input 
                type="text" 
                required 
                placeholder="Your Name" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#060e16] border border-[#183048] rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#E5B264] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Phone / WhatsApp</label>
              <input 
                type="tel" 
                required 
                placeholder="Phone Number" 
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#060e16] border border-[#183048] rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#E5B264] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">Message / Property Requirements</label>
              <textarea 
                rows="4" 
                required 
                placeholder="Specify your property requirements..." 
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#060e16] border border-[#183048] rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#E5B264] font-medium"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSending}
              className="w-full bg-[#E5B264] hover:bg-[#d8a353] text-slate-950 font-black py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Send Message Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function AdminPanelPage({ ads, fetchAds, showToast }) {
  const [adForm, setAdForm] = useState({
    title: '',
    type: 'Commercial',
    category: COMMERCIAL_AREAS[0],
    size: '100 sq.yd',
    priceCrore: '',
    plotNo: '',
    phase: 'Phase 8',
    corner: false,
    mainBoulevard: false,
    westOpen: false,
    parkFacing: false,
    description: '',
    image: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (newType) => {
    setAdForm(prev => ({
      ...prev,
      type: newType,
      category: newType === 'Commercial' ? COMMERCIAL_AREAS[0] : RESIDENTIAL_SIZES[0]
    }));
  };

  const handlePostAd = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adForm)
      });
      const data = await res.json();

      if (data.success) {
        showToast(`New Ad saved under ${adForm.category}!`);
        await fetchAds();
        
        setAdForm({
          title: '',
          type: 'Commercial',
          category: COMMERCIAL_AREAS[0],
          size: '100 sq.yd',
          priceCrore: '',
          plotNo: '',
          phase: 'Phase 8',
          corner: false,
          mainBoulevard: false,
          westOpen: false,
          parkFacing: false,
          description: '',
          image: ''
        });
      } else {
        showToast(`Error: ${data.error || 'Failed to save ad'}`);
      }
    } catch (err) {
      showToast('Network error saving ad.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAd = async (id) => {
    try {
      const res = await fetch(`/api/ads?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Listing removed successfully.');
        await fetchAds();
      } else {
        showToast('Failed to delete listing.');
      }
    } catch (err) {
      showToast('Error deleting listing.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Admin Control Panel</span>
          <h1 className="text-3xl font-black text-slate-900">Post & Manage Plot Ads</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Logged in as Administrator ({OWNER_NAME})</p>
        </div>
        <div className="bg-[#0B1A28] border border-[#183048] px-4 py-2 rounded-2xl text-xs font-black text-[#E5B264] shadow-sm">
          Live Inventory: {ads.length} Listings
        </div>
      </div>

      <div className="bg-[#0B1A28] border border-[#183048] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-white">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#E5B264]" /> Create New Plot Advertisement
        </h3>

        <form onSubmit={handlePostAd} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-300 uppercase mb-2">1. Listing Type</label>
              <select 
                value={adForm.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full bg-[#060e16] border border-[#183048] rounded-xl px-3.5 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#E5B264] font-bold"
              >
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-300 uppercase mb-2">2. Target Category / Page</label>
              <select 
                value={adForm.category}
                onChange={(e) => setAdForm({ ...adForm, category: e.target.value })}
                className="w-full bg-[#060e16] border border-[#183048] rounded-xl px-3.5 py-3 text-sm text-[#E5B264] outline-none focus:ring-2 focus:ring-[#E5B264] font-black"
              >
                {adForm.type === 'Commercial' ? (
                  COMMERCIAL_AREAS.map(area => <option key={area} value={area}>{area}</option>)
                ) : (
                  RESIDENTIAL_SIZES.map(sz => <option key={sz} value={sz}>{sz}</option>)
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-300 uppercase mb-2">3. Plot Size Label</label>
              <input 
                type="text" 
                required
                placeholder="e.g. 500 sq.yd or 300 YRD"
                value={adForm.size}
                onChange={(e) => setAdForm({ ...adForm, size: e.target.value })}
                className="w-full bg-[#060e16] border border-[#183048] rounded-xl px-3.5 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#E5B264] font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-300 uppercase mb-2">Plot Title (e.g. West open)</label>
              <input 
                type="text" 
                required
                placeholder="Plot Title"
                value={adForm.title}
                onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                className="w-full bg-[#060e16] border border-[#183048] rounded-xl px-3.5 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#E5B264] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-300 uppercase mb-2">Street / Location Subtitle</label>
              <input 
                type="text" 
                required
                placeholder="Street / Location"
                value={adForm.plotNo}
                onChange={(e) => setAdForm({ ...adForm, plotNo: e.target.value })}
                className="w-full bg-[#060e16] border border-[#183048] rounded-xl px-3.5 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#E5B264] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-300 uppercase mb-2">Demand Price (Crore PKR)</label>
              <input 
                type="text" 
                required
                placeholder="Price in Crore"
                value={adForm.priceCrore}
                onChange={(e) => setAdForm({ ...adForm, priceCrore: e.target.value })}
                className="w-full bg-[#060e16] border border-[#183048] rounded-xl px-3.5 py-3 text-sm text-[#E5B264] outline-none focus:ring-2 focus:ring-[#E5B264] font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-300 uppercase mb-2">Plot Features</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex items-center space-x-2 bg-[#060e16] border border-[#183048] p-3 rounded-xl cursor-pointer text-xs font-bold text-slate-300">
                <input 
                  type="checkbox" 
                  checked={adForm.corner}
                  onChange={(e) => setAdForm({ ...adForm, corner: e.target.checked })}
                  className="rounded text-[#E5B264] focus:ring-[#E5B264]"
                />
                <span>Corner</span>
              </label>

              <label className="flex items-center space-x-2 bg-[#060e16] border border-[#183048] p-3 rounded-xl cursor-pointer text-xs font-bold text-slate-300">
                <input 
                  type="checkbox" 
                  checked={adForm.mainBoulevard}
                  onChange={(e) => setAdForm({ ...adForm, mainBoulevard: e.target.checked })}
                  className="rounded text-[#E5B264] focus:ring-[#E5B264]"
                />
                <span>Main Boulevard</span>
              </label>

              <label className="flex items-center space-x-2 bg-[#060e16] border border-[#183048] p-3 rounded-xl cursor-pointer text-xs font-bold text-slate-300">
                <input 
                  type="checkbox" 
                  checked={adForm.westOpen}
                  onChange={(e) => setAdForm({ ...adForm, westOpen: e.target.checked })}
                  className="rounded text-[#E5B264] focus:ring-[#E5B264]"
                />
                <span>West Open</span>
              </label>

              <label className="flex items-center space-x-2 bg-[#060e16] border border-[#183048] p-3 rounded-xl cursor-pointer text-xs font-bold text-slate-300">
                <input 
                  type="checkbox" 
                  checked={adForm.parkFacing}
                  onChange={(e) => setAdForm({ ...adForm, parkFacing: e.target.checked })}
                  className="rounded text-[#E5B264] focus:ring-[#E5B264]"
                />
                <span>Near PARK</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-300 uppercase mb-2">Description</label>
            <textarea 
              rows="3" 
              placeholder="Specs, location features..." 
              value={adForm.description}
              onChange={(e) => setAdForm({ ...adForm, description: e.target.value })}
              className="w-full bg-[#060e16] border border-[#183048] rounded-xl px-3.5 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#E5B264] font-medium"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#E5B264] hover:bg-[#d8a353] text-slate-950 font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-base"
          >
            {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Publish Listing'}
          </button>
        </form>
      </div>

      <div className="bg-[#0B1A28] border border-[#183048] rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl text-white overflow-hidden">
        <h3 className="text-xl font-black text-white">Live Inventory Table</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#060e16] text-slate-400 uppercase font-black border-b border-[#183048]">
              <tr>
                <th className="py-3.5 px-4">Ad Title</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Street</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#183048]">
              {ads.map(ad => (
                <tr key={ad.id} className="hover:bg-[#13283b]">
                  <td className="py-3.5 px-4 font-bold text-white">{ad.title}</td>
                  <td className="py-3.5 px-4">{ad.type}</td>
                  <td className="py-3.5 px-4 text-[#E5B264] font-black">{ad.category}</td>
                  <td className="py-3.5 px-4">{ad.plotNo}</td>
                  <td className="py-3.5 px-4 font-black text-[#E5B264]">PKR {ad.priceCrore} Cr</td>
                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={() => handleDeleteAd(ad.id)}
                      className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Delete Ad"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PlotDetailsModal({ plot, onClose }) {
  const formatPkr = (croreStr) => {
    if (!croreStr) return '—';
    const num = parseFloat(croreStr);
    if (isNaN(num)) return `PKR ${croreStr}`;
    const pkrNum = Math.round(num * 10000000);
    return `PKR ${pkrNum.toLocaleString('en-PK')}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B1A28] border border-[#183048] text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-[#060e16]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-black text-[#E5B264] uppercase tracking-widest">{plot.category}</span>
            <h2 className="text-2xl font-black text-white mt-0.5">{plot.title}</h2>
            <p className="text-xs text-slate-400 font-bold mt-1">{plot.plotNo} &bull; {plot.size} &bull; DHA {plot.phase || 'Phase 8'}</p>
          </div>

          <div className="bg-[#060e16] border border-[#183048] p-4 rounded-2xl flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Demand Price</span>
            <span className="text-xl font-black text-[#E5B264]">{formatPkr(plot.priceCrore)}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#183048] text-xs">
            <div className="bg-[#060e16] p-3 rounded-xl border border-[#183048] text-center">
              <span className="block text-slate-500 text-[10px] uppercase font-bold">Corner</span>
              <strong className={plot.corner ? "text-[#E5B264]" : "text-slate-600"}>{plot.corner ? "Yes" : "No"}</strong>
            </div>
            <div className="bg-[#060e16] p-3 rounded-xl border border-[#183048] text-center">
              <span className="block text-slate-500 text-[10px] uppercase font-bold">West Open</span>
              <strong className={plot.westOpen ? "text-[#E5B264]" : "text-slate-600"}>{plot.westOpen ? "Yes" : "No"}</strong>
            </div>
            <div className="bg-[#060e16] p-3 rounded-xl border border-[#183048] text-center">
              <span className="block text-slate-500 text-[10px] uppercase font-bold">Near PARK</span>
              <strong className={plot.parkFacing ? "text-[#E5B264]" : "text-slate-600"}>{plot.parkFacing ? "Yes" : "No"}</strong>
            </div>
            <div className="bg-[#060e16] p-3 rounded-xl border border-[#183048] text-center">
              <span className="block text-slate-500 text-[10px] uppercase font-bold">Main Blvd</span>
              <strong className={plot.mainBoulevard ? "text-[#E5B264]" : "text-slate-600"}>{plot.mainBoulevard ? "Yes" : "No"}</strong>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase text-slate-400">Property Details</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{plot.description || "Direct verified plot listing with complete clear title and documentation."}</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <MessageSquare className="w-4 h-4" /> WhatsApp Direct
            </a>
            <a 
              href={`tel:${PHONE_NUMBER}`}
              className="flex-1 bg-[#E5B264] hover:bg-[#d8a353] text-slate-950 font-black py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <Phone className="w-4 h-4" /> Call {OWNER_NAME}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthModal({ mode, setAuthMode, email, setEmail, password, setPassword, name, setName, phone, setPhone, onSubmit, isLoading, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0B1A28] border border-[#183048] text-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <BrandLogo className="h-12 w-12 mx-auto" />
          <h3 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Portal Login' : 'Create Account'}
          </h3>
          <p className="text-xs text-slate-400 font-semibold">Access DHA Plots portal features and admin panel.</p>
        </div>

        <div className="flex rounded-xl bg-[#060e16] p-1 text-xs font-black border border-[#183048]">
          <button 
            type="button" 
            onClick={() => setAuthMode('login')} 
            className={`flex-1 py-2 rounded-lg transition-all ${mode === 'login' ? 'bg-[#E5B264] text-slate-950 shadow-sm' : 'text-slate-400'}`}
          >
            Login
          </button>
          <button 
            type="button" 
            onClick={() => setAuthMode('signup')} 
            className={`flex-1 py-2 rounded-lg transition-all ${mode === 'signup' ? 'bg-[#E5B264] text-slate-950 shadow-sm' : 'text-slate-400'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-black text-slate-300 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#060e16] border border-[#183048] rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#E5B264] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-300 uppercase mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#060e16] border border-[#183048] rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#E5B264] font-medium"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-black text-slate-300 uppercase mb-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#060e16] border border-[#183048] rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#E5B264] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-300 uppercase mb-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#060e16] border border-[#183048] rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#E5B264] font-medium"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#E5B264] hover:bg-[#d8a353] text-slate-950 font-black py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : mode === 'login' ? 'Login Now' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}