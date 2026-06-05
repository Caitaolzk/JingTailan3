import React, { useState, useEffect } from 'react';
import { AppScreen, Artwork, UserProfile } from './types';
import Header from './components/Header';
import Auth from './components/Auth';
import Workstation from './components/Workstation';
import Community from './components/Community';
import Portfolio from './components/Portfolio';
import UploadArtwork from './components/UploadArtwork';
import FooterDialog, { FooterTabType } from './components/FooterDialog';
import { LogOut, Award, Shield, Palette, Compass, User } from 'lucide-react';

// ✅ 仅新增CloudBase导入
import { auth } from './utils/cloudbase';

export const DEFAULT_SEED_FOLLOWERS = [
  {
    id: 'f-1',
    name: '陆华堂',
    title: '故宫博物院特聘文物修复专家',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkBJiH8wE8aLEElDa6dHlO9bZelJA0mz2jgWv_0eZ7l1_pQKAslgEhj35RDiPtgHbR4VsaU0YUlMmqo30QDkIO1a5t_FBO6pAgPSZBS6ph0T1ZJ7xlQBHL5dM4x_OFi5SuP2Ea1dJ5ham07dVXo73i18S0f2ZmvDENTSxe7dtSc3vFj-jHplEhE2T1D-pzuXJrg-r5SmNkecV8YsXZurtSLvTf_Y9HjRxz3tTt7iAJEpZladtZ1qQLRBbt2RC0TSobCMrCxx1K_Rw',
    isFollowingBack: true
  },
  {
    id: 'f-2',
    name: '王映雪',
    title: '青年景泰蓝点蓝艺术家',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-Ol44CDPyaZRvMVBpo7hM_eudPy5BbY06tr_4qhlzxbppYmHtoxeyfIkUQLblR-01QVHt9oIeNJsZ-CsZjFgZznvJW-0ZugAQ6KbSohuMDFIo1As_QWc-i1BdUN0Nz9EcKGeJA-A_h8aQLuSzFkjKiBnqXcscKLJpmdkanH7v9qkcB03DcwDsU_MguXpvABn1ckdV6ryjxhTuvRYkFZgCh0RV7iEyFVRCuVNRYK7g9XqRYDpy8jrtne_z82sHBJZt9cRmMw7xboQ',
    isFollowingBack: true
  },
  {
    id: 'f-3',
    name: '张绍唐',
    title: '国家非物质文化遗产研究会常务理事',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLZLlFQVRIGeYDlDqKubd0QoSOhZY1Uy5mXVc_w6gdJg-8JPhya87HgceDiBRCDUZJkNJBPljaEq9-DEtPRWGlW8sjM3GETsXp4KXQ72uwMgwYixpimtbbHfP6pLZ4sJrVgZwz5MJ-vM-q2Sjs4jWG29Qa8GnPeiYygDI9ODu-mrzDmRVo1WaFGJYyT9CyoVUpc3eTm5tAq8I1aqtLV9ZvaZ9GDeF3ryWPSNuB7QqcqutYGrMflio-mWIxI4v9IDsUPRJMnXmnE2U',
    isFollowingBack: false
  },
  {
    id: 'f-4',
    name: 'Caroline Dupont',
    title: '法国巴黎装饰艺术博物馆文博策展人',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCqybxNWgIk_xz_fe2E9CWN7Deuze3q1KsbhQogs_7L-KNK9SsuqLUlpiDyBPr-p0-aOPWDPHf_pT8_4PmO91oZu7wHvbojqW_1qO2e5PjZEnZnAT4Lik_IL0m5uB8P2ip7k-SsIUu7AIh2EaJOs4qwq-WlR7no_vGhVvaxXQaghpu0F_u43woi_kPMyPDzgdUqzbnm3ImyDyvx8x7MTQxHrb0Tvnw8Tnadxg0Br0OzdJAK45YXATvConeteX9gRE5V1nSqRfYHaM',
    isFollowingBack: false
  },
  {
    id: 'f-5',
    name: '李泽溪',
    title: '琢玉工匠 / 东方玉雕设计名家',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    isFollowingBack: true
  },
  {
    id: 'f-6',
    name: '叶舒怀',
    title: '国风金线刺绣研究室主持人',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    isFollowingBack: true
  },
  {
    id: 'f-7',
    name: '陈怀安',
    title: '天青色柴窑烧制工艺技艺传承人',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    isFollowingBack: false
  },
  {
    id: 'f-8',
    name: '萧默林',
    title: '知名文玩艺术品收藏名家、文博博主',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    isFollowingBack: true
  },
  {
    id: 'f-9',
    name: '顾听风',
    title: '宜兴紫泥紫砂艺术美术名匠',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
    isFollowingBack: true
  },
  {
    id: 'f-10',
    name: '温婉亭',
    title: '掐丝珐琅器物收藏研究协会会长',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    isFollowingBack: false
  },
  {
    id: 'f-11',
    name: '赵云舒',
    title: '清华美院工艺美术系副教授',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    isFollowingBack: true
  },
  {
    id: 'f-12',
    name: '盛唐风华',
    title: '千万级传统工艺文化独立自媒体人',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    isFollowingBack: true
  }
];

export const DEFAULT_SEED_ARTWORKS: Artwork[] = [
  {
    id: 'seed-1',
    title: '天青缠枝莲纹大瓶',
    artist: '林渊',
    tags: ['经典杰作', '天青釉', '天球瓶'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQV_XVnWG5yJp5-pNdEGMkaQ2EYEgErMLSvdqCUtQGlOVAPwV_PDc20exzGND95COfArVSgWunsTd3nSlYInJjCtBUWnTrEl7Cc9ywek-mzWyVwNZVmwLvI9FkewR_aDJClf87Y-V2DlVj9EE_KoY4QM32XJ7k0OXuqy7mRi-SHuKNcLdnRjoQtyYjuMG4-Bos46foNOurZz8eG-c1PCRaeC8JmFRaMS8NNfTT3naHxg6ncvSDasYRWY9GBcVgP3U_EOYesjmbrLg',
    description: '此器为林渊大师代表作，以天青釉为底，采用传统缠枝莲图案精心掐丝、点蓝。器型饱满，掐丝金光奕奕，点蓝釉色细腻、包浆温润，堪称景泰蓝工艺之重器。',
    materials: ['紫铜胎', '手掐金丝', '天青石天然釉料'],
    status: 'completed',
    likes: 128,
    isFavorite: true,
    isPublished: true,
    vaseShape: 'celestial',
    baseBody: 'copper',
    filigree: 'gold',
    pattern: 'lotus',
    zoneColors: { top: '#008080', middle: '#e0f7fa', bottom: '#006064' }
  },
  {
    id: 'seed-2',
    title: '仿古百鸟朝凤大尊',
    artist: '林渊',
    tags: ['重器典藏', '百鸟朝凤', '葫芦瓶'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA95mD3aNwzFQH3rzARwDIMD2_EMRrnXmEUdb2Q5YFXjtWxSulOM3k9KLKnJo6S05RFJNCvghDpmWnPZzoUb9VbYgDtipDCDKZFj8w7_bBGrtlLzIlHBk2kGHhHG8fMPKM8F45H41MR_jO7v42H-VoUMB74RqVpsBwTjNlCM3hW54DOwujeU1TkNRRPBLQtWAUl5uKqk6AsGSKmXv4YgGMYvMGOP9hpw-o31o9Sh31Rh-bUWK2TtSliJXagUaWiy_uWlssjDGt5G0',
    description: '仿清代乾隆宫廷御制样制，掐丝极其繁复，由百余只不同神态的飞鸟围绕祥凤。历经五遍点蓝和六次烧结而成，色彩金碧辉煌，极具宫廷贵气。',
    materials: ['纯铜胎', '手工银丝', '宫廷矿物绿釉'],
    status: 'completed',
    likes: 96,
    isFavorite: false,
    isPublished: true,
    vaseShape: 'gourd',
    baseBody: 'copper',
    filigree: 'silver',
    pattern: 'phoenix',
    zoneColors: { top: '#1a237e', middle: '#2e7d32', bottom: '#e65100' }
  }
];

export default function App() {
  // Navigation states
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  
  // ✅ CloudBase用户认证状态（替换原本地状态）
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // 新增加载状态
  
  // Shared social states
  const [followers, setFollowers] = useState<{ id: string; name: string; title: string; avatar: string; isFollowingBack: boolean }[]>(() => {
    const saved = localStorage.getItem('jingtai_followers_list_global') || localStorage.getItem('jingtai_followers_list');
    if (saved) return JSON.parse(saved);
    return DEFAULT_SEED_FOLLOWERS;
  });

  const [followedArtisans, setFollowedArtisans] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('jingtai_followed_artisans');
    return saved ? JSON.parse(saved) : {};
  });

  const [artisanFollowersOffset, setArtisanFollowersOffset] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('jingtai_artisan_followers_offset');
    return saved ? JSON.parse(saved) : {};
  });

  // User details state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    return {
      nickname: '林渊',
      email: '',
      title: '国家级非物质文化遗产景泰蓝技艺传承人',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkBJiH8wE8aLEElDa6dHlO9bZelJA0mz2jgWv_0eZ7l1_pQKAslgEhj35RDiPtgHbR4VsaU0YUlMmqo30QDkIO1a5t_FBO6pAgPSZBS6ph0T1ZJ7xlQBHL5dM4x_OFi5SuP2Ea1dJ5ham07dVXo73i18S0f2ZmvDENTSxe7dtSc3vFj-jHplEhE2T1D-pzuXJrg-r5SmNkecV8YsXZurtSLvTf_Y9HjRxz3tTt7iAJEpZladtZ1qQLRBbt2RC0TSobCMrCxx1K_Rw',
      levelFiligree: 8,
      levelEnamel: 5,
      completedCount: 2,
      followersCount: 12
    };
  });
  
  // Artwork state database (start as empty or seeds)
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  // Load artworks (global)
  useEffect(() => {
    const saved = localStorage.getItem('jingtai_artworks_db_global');
    setArtworks(saved ? JSON.parse(saved) : DEFAULT_SEED_ARTWORKS);
  }, []);

  // Global query binder
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [footerDialogOpen, setFooterDialogOpen] = useState<boolean>(false);
  const [footerActiveTab, setFooterActiveTab] = useState<FooterTabType>('philosophy');

  const handleOpenFooterTab = (tab: FooterTabType) => {
    setFooterActiveTab(tab);
    setFooterDialogOpen(true);
  };

  // Persist db modification (global)
  useEffect(() => {
    localStorage.setItem('jingtai_artworks_db_global', JSON.stringify(artworks));
  }, [artworks]);

  // Persist user profile modification
  useEffect(() => {
    if (currentUserEmail) {
        localStorage.setItem(`jingtai_user_profile_${currentUserEmail}`, JSON.stringify(userProfile));
    }
  }, [userProfile, currentUserEmail]);

  // Load user-specific followers list when their email changes
  useEffect(() => {
    if (currentUserEmail) {
      const saved = localStorage.getItem(`jingtai_followers_list_${currentUserEmail}`);
      if (saved) {
        setFollowers(JSON.parse(saved));
      } else {
        localStorage.setItem(`jingtai_followers_list_${currentUserEmail}`, JSON.stringify(DEFAULT_SEED_FOLLOWERS));
        setFollowers(DEFAULT_SEED_FOLLOWERS);
      }
    } else {
      const saved = localStorage.getItem('jingtai_followers_list_global');
      if (saved) {
        setFollowers(JSON.parse(saved));
      } else {
        setFollowers(DEFAULT_SEED_FOLLOWERS);
      }
    }
  }, [currentUserEmail]);

  // Save followers list updates
  useEffect(() => {
    if (currentUserEmail) {
      localStorage.setItem(`jingtai_followers_list_${currentUserEmail}`, JSON.stringify(followers));
    } else {
      localStorage.setItem('jingtai_followers_list_global', JSON.stringify(followers));
    }
  }, [followers, currentUserEmail]);

  // Persist followedArtisans and artisanFollowersOffset of user's follow actions
  useEffect(() => {
    localStorage.setItem('jingtai_followed_artisans', JSON.stringify(followedArtisans));
  }, [followedArtisans]);

  useEffect(() => {
    localStorage.setItem('jingtai_artisan_followers_offset', JSON.stringify(artisanFollowersOffset));
  }, [artisanFollowersOffset]);

  // Auto-sync followersCount and completedCount to userProfile state so they match dynamically computed values in real-time
  useEffect(() => {
    const userWorks = artworks.filter(
      (art) => art.artist === userProfile.nickname || art.id.startsWith('custom-')
    );
    const finalCompletedCount = userWorks.length;
    const followersLength = followers.length;

    if (userProfile.completedCount !== finalCompletedCount || userProfile.followersCount !== followersLength) {
      setUserProfile((prev) => ({
        ...prev,
        completedCount: finalCompletedCount,
        followersCount: followersLength
      }));
    }
  }, [artworks, followers, userProfile.nickname, userProfile.completedCount, userProfile.followersCount]);

  // ✅ CloudBase全局登录状态监听【已修复】
  useEffect(() => {
   auth.onAuthStateChange((user) => {
  if (user) {
    setCurrentUser(user);
    setCurrentUserEmail(user.email);
    setCurrentScreen('workstation');
  } else {
    setCurrentUser(null);
    setCurrentUserEmail(null);
    setCurrentScreen('login');
  }
  setLoading(false);
});

return () => {};
  }, []);

  // Navigate trigger
  const handleNavigate = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  // Auth handler
  const handleLoginSuccess = (email: string) => {
    // 登录成功后，CloudBase的onAuthStateChanged会自动处理状态更新
    // 这里只需要加载用户本地资料
    const savedProfile = localStorage.getItem(`jingtai_user_profile_${email}`);
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
    } else {
      const newProfile = {
        nickname: '新传承人',
        email: email,
        title: '新进传承人',
        avatar: '', // 保留你原来的空头像
        levelFiligree: 0,
        levelEnamel: 0,
        completedCount: 0,
        followersCount: 0
      };
      setUserProfile(newProfile);
    }
  };

  // ✅ CloudBase退出登录
  const handleLogout = async () => {
    await auth.signOut();
    // 退出后，onAuthStateChanged会自动跳转到登录页
  };

  // Add custom workspace creations
  const handleAddNewArtwork = (newArt: Artwork) => {
    setArtworks((prev) => [newArt, ...prev]);
  };

  // Toggle favorite trigger
  const handleToggleFavorite = (id: string) => {
    setArtworks((prev) => 
      prev.map((art) => 
        art.id === id 
          ? { ...art, isFavorite: !art.isFavorite } 
          : art
      )
    );
  };

  // Like artwork trigger action
  const handleLikeArtwork = (id: string) => {
    setArtworks((prev) => 
      prev.map((art) => 
        art.id === id 
          ? { 
              ...art, 
              likes: art.isFavorite ? art.likes - 1 : art.likes + 1,
              isFavorite: !art.isFavorite 
            } 
          : art
      )
    );
  };

  // Toggle publish trigger
  const handleTogglePublish = (id: string) => {
    setArtworks((prev) => 
      prev.map((art) => 
        art.id === id 
          ? { ...art, isPublished: !art.isPublished } 
          : art
      )
    );
  };

  // 加载中显示
  if (loading) {
    return (
      <div className="bg-surface-base min-h-screen flex items-center justify-center">
        <div className="text-[#e9c349] text-xl font-serif-garamond">正在加载景泰蓝工坊...</div>
      </div>
    );
  }

  return (
    <div className="bg-surface-base text-on-surface min-h-screen relative font-serif-literata flex flex-col antialiased">
      
      {/* Visual materiality texture overlay */}
      <div className="texture-overlay" />

      {/* Conditional Header Top Nav Render */}
      {currentUser && (
        <>
          <Header 
            currentScreen={currentScreen} 
            onNavigate={handleNavigate}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            userProfile={userProfile}
          />
          
          {/* Miniature logged user info strip */}
          <div className="bg-surface-lowest text-[10px] font-sans-manrope py-2 px-4 border-b border-outline-variant/10 text-on-surface-variant flex justify-between items-center z-30">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span>工作台主入口 · 已联接匠人: <span className="text-secondary font-bold">{currentUser?.email}</span></span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 hover:text-red-400 font-bold transition-colors cursor-pointer"
              title="退出登录"
            >
              <LogOut className="w-3 h-3" />
              <span>退出工坊</span>
            </button>
          </div>
        </>
      )}

      {/* Screen Routing Switcher */}
      <div className={`flex-grow flex flex-col w-full ${currentUser ? 'pb-16 md:pb-0' : ''}`}>
        {/* Auth Entry (Login / Register / Forgot Pass) */}
        {!currentUser && (
          <Auth 
            currentScreen={currentScreen} 
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {/* Authenticated Workspace widgets */}
        {currentUser && (
          <>
            {currentScreen === 'workstation' && (
              <Workstation 
                onAddNewArtwork={handleAddNewArtwork}
                onNavigateToPortfolio={() => setCurrentScreen('portfolio')}
                currentUser={currentUser?.email}
              />
            )}

            {currentScreen === 'community' && (
              <Community 
                artworks={artworks}
                onToggleFavorite={handleToggleFavorite}
                onLikeArtwork={handleLikeArtwork}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAddNewArtwork={handleAddNewArtwork}
                currentUser={currentUser?.email || undefined}
                onNavigateToUpload={() => setCurrentScreen('upload')}
                userProfile={userProfile}
                followedArtisans={followedArtisans}
                setFollowedArtisans={setFollowedArtisans}
                artisanFollowersOffset={artisanFollowersOffset}
                setArtisanFollowersOffset={setArtisanFollowersOffset}
              />
            )}

            {currentScreen === 'portfolio' && (
              <Portfolio 
                artworks={artworks}
                onNavigateToWorkstation={() => setCurrentScreen('workstation')}
                userProfile={userProfile}
                onUpdateProfile={setUserProfile}
                onTogglePublish={handleTogglePublish}
                followers={followers}
                setFollowers={setFollowers}
                followedArtisans={followedArtisans}
                setFollowedArtisans={setFollowedArtisans}
                artisanFollowersOffset={artisanFollowersOffset}
                setArtisanFollowersOffset={setArtisanFollowersOffset}
              />
            )}

            {currentScreen === 'upload' && (
              <UploadArtwork
                onAddNewArtwork={handleAddNewArtwork}
                onNavigate={handleNavigate}
                currentUser={currentUser?.email || ''}
              />
            )}
          </>
        )}
      </div>

      {/* Footer rendering nicely on workstation or community listings */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/30 mt-auto relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-900/10 border border-[#e9c349]/30 flex items-center justify-center">
              <Palette className="w-4 h-4 text-[#e9c349]" />
            </div>
            <div>
              <span className="font-serif-garamond text-lg font-bold text-primary">景泰蓝工坊</span>
              <p className="text-[10px] text-on-surface-variant font-sans-manrope">数字化呈现的景泰蓝手造工艺</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center font-sans-manrope text-xs font-bold text-on-surface-variant">
            <button 
              onClick={() => handleOpenFooterTab('philosophy')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              工艺哲学
            </button>
            <button 
              onClick={() => handleOpenFooterTab('techniques')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              制作技法
            </button>
            <button 
              onClick={() => handleOpenFooterTab('heritage')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              非遗保护传承
            </button>
            <button 
              onClick={() => handleOpenFooterTab('privacy')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              隐私条款
            </button>
          </div>

          <div className="text-[10px] font-sans-manrope text-on-surface-variant">
            © 2026 Jingtailan Craft. Designed and handcrafted with Antigravity Devtools.
          </div>
        </div>
      </footer>

      {/* Exquisite Non-Heritage Academic Archives Dialog */}
      <FooterDialog 
        isOpen={footerDialogOpen}
        activeTab={footerActiveTab}
        onClose={() => setFooterDialogOpen(false)}
        onTabChange={setFooterActiveTab}
      />

      {/* Mobile Bottom Sticky Navigation Bar */}
      {currentUser && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#fdfaf2] border-t-2 border-[#b58b4c]/30 z-40 flex justify-around items-center h-16 shadow-lg backdrop-blur-md bg-opacity-95">
          <button
            onClick={() => handleNavigate('workstation')}
            className={`flex flex-col items-center justify-center w-20 h-full transition-all cursor-pointer ${
              currentScreen === 'workstation' 
                ? 'text-[#8a1c14] scale-105' 
                : 'text-[#6b5035] hover:text-[#8a1c14]'
            }`}
          >
            <Palette className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold font-sans-manrope">工作台</span>
          </button>

          <button
            onClick={() => handleNavigate('community')}
            className={`flex flex-col items-center justify-center w-20 h-full transition-all cursor-pointer ${
              currentScreen === 'community' 
                ? 'text-[#8a1c14] scale-105' 
                : 'text-[#6b5035] hover:text-[#8a1c14]'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold font-sans-manrope">典藏社区</span>
          </button>

          <button
            onClick={() => handleNavigate('portfolio')}
            className={`flex flex-col items-center justify-center w-20 h-full transition-all cursor-pointer ${
              currentScreen === 'portfolio' 
                ? 'text-[#8a1c14] scale-105' 
                : 'text-[#6b5035] hover:text-[#8a1c14]'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold font-sans-manrope">作品集</span>
          </button>
        </div>
      )}

    </div>
  );
}