import React, { useState, useEffect } from 'react';
import { AppScreen, UserProfile } from '../types';
import { Palette, Search, User, Compass, Layers, Menu, X, Hammer } from 'lucide-react';

interface HeaderProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userProfile?: UserProfile;
}

export default function Header({
  currentScreen,
  onNavigate,
  searchQuery,
  onSearchChange,
  userProfile,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [defaultAvatar, setDefaultAvatar] = useState<string>('');
  const defaultAvatars = [
    '/a97c8650-d5af-4e3f-90e8-f8d938ffc3ae/unnamed.png',
    '/a97c8650-d5af-4e3f-90e8-f8d938ffc3ae/unnamed (1).png',
    '/a97c8650-d5af-4e3f-90e8-f8d938ffc3ae/unnamed.jpg'
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
    setDefaultAvatar(defaultAvatars[randomIndex]);
  }, []);

  return (
    <>
      <header className="bg-surface-container border-b border-outline-variant/30 sticky top-0 z-40 w-full transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-20">
          
          <div 
            onClick={() => {
              onNavigate('workstation');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-container border border-secondary flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <Palette className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <span className="font-serif-garamond text-2xl font-semibold tracking-wide text-primary">
                景泰蓝工坊
              </span>
              <span className="hidden sm:block text-[10px] font-sans-manrope uppercase tracking-widest text-secondary -mt-1 font-bold">
                Jingtai Digital
              </span>
            </div>
          </div>

          <nav className="hidden md:flex gap-8 h-full items-center">
            <button
              onClick={() => onNavigate('workstation')}
              className={`font-sans-manrope text-sm uppercase tracking-widest font-bold h-full border-b-2 flex items-center px-2 transition-all duration-200 ${
                currentScreen === 'workstation'
                  ? 'text-secondary border-secondary font-extrabold scale-102'
                  : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/50'
              }`}
            >
              工作台
            </button>
            <button
              onClick={() => onNavigate('community')}
              className={`font-sans-manrope text-sm uppercase tracking-widest font-bold h-full border-b-2 flex items-center px-2 transition-all duration-200 ${
                currentScreen === 'community'
                  ? 'text-secondary border-secondary font-extrabold scale-102'
                  : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/50'
              }`}
            >
              典藏社区
            </button>
            <button
              onClick={() => onNavigate('portfolio')}
              className={`font-sans-manrope text-sm uppercase tracking-widest font-bold h-full border-b-2 flex items-center px-2 transition-all duration-200 ${
                currentScreen === 'portfolio'
                  ? 'text-secondary border-secondary font-extrabold scale-102'
                  : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/50'
              }`}
            >
              作品集
            </button>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4 text-primary">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="搜索珍品..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentScreen !== 'community') {
                    onNavigate('community');
                  }
                }}
                className="bg-surface-container-low border border-outline-variant/50 rounded-full py-2 pl-4 pr-10 text-xs text-on-surface placeholder:text-outline-variant/60 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant/70 w-4 h-4 pointer-events-none" />
            </div>

            <button
              onClick={() => {
                onNavigate('portfolio');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 relative group"
              title={`${userProfile?.nickname || '未登录用户'}的个人主页`}
            >
              {userProfile?.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt={userProfile.nickname}
                  className="w-7 h-7 rounded-full object-cover transition-transform group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img
                  src={defaultAvatar || '/a97c8650-d5af-4e3f-90e8-f8d938ffc3ae/unnamed.png'}
                  alt="默认头像"
                  className="w-7 h-7 rounded-full object-cover transition-transform group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-surface-container"></span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-surface-container-low text-on-surface-variant transition-colors"
              title="切换导航菜单"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#fdfaf2] border-b-2 border-[#b58b4c]/30 shadow-xl px-4 py-4 space-y-2.5 animate-in slide-in-from-top-4 duration-200 z-50 relative">
            <div className="text-[10px] uppercase tracking-widest font-sans-manrope font-extrabold text-[#856543] mb-1.5 px-2">
              非遗工坊导航
            </div>
            <button
              onClick={() => {
                onNavigate('workstation');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left font-sans-manrope text-sm uppercase tracking-widest font-bold py-3 px-4 rounded-xl flex items-center gap-3.5 transition-all ${
                currentScreen === 'workstation'
                  ? 'bg-[#8a1c14] text-white shadow-md'
                  : 'bg-[#fbf6ea] text-[#543b1f] hover:bg-[#ebdcb9]'
              }`}
            >
              <Hammer className="w-4 h-4 shrink-0" />
              <span>1. 模拟烧制工作台</span>
            </button>
            <button
              onClick={() => {
                onNavigate('community');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left font-sans-manrope text-sm uppercase tracking-widest font-bold py-3 px-4 rounded-xl flex items-center gap-3.5 transition-all ${
                currentScreen === 'community'
                  ? 'bg-[#8a1c14] text-white shadow-md'
                  : 'bg-[#fbf6ea] text-[#543b1f] hover:bg-[#ebdcb9]'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>2. 景泰蓝典藏社区</span>
            </button>
            <button
              onClick={() => {
                onNavigate('portfolio');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left font-sans-manrope text-sm uppercase tracking-widest font-bold py-3 px-4 rounded-xl flex items-center gap-3.5 transition-all ${
                currentScreen === 'portfolio'
                  ? 'bg-[#8a1c14] text-white shadow-md'
                  : 'bg-[#fbf6ea] text-[#543b1f] hover:bg-[#ebdcb9]'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>3. 个人工艺作品集</span>
            </button>
          </div>
        )}
      </header>
    </>
  );
}