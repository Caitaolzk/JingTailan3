import React, { useState, useRef } from 'react';
import { Artwork, UserProfile } from '../types';
import { 
  Award, Hammer, BookOpen, Star, Sparkles, Compass, LucideIcon, Flame, 
  Edit, Camera, X, Check, Mail, Info, Upload, Image as ImageIcon,
  Users, UserCheck, UserPlus, Search, Palette, Share2
} from 'lucide-react';
import CloisonneSvg from './CloisonneSvg';
import { SHARED_ARTISAN_PROFILES } from '../artisanData';
import { DEFAULT_SEED_FOLLOWERS } from '../App';

// -------------- 🔥 唯一修改1：导入CloudBase实例（和你其他文件统一）--------------
import { db, cloudStorage } from '../utils/cloudbase'; // 改成你的cloudbase路径
// ---------------------------------------------------------------------------

interface PortfolioProps {
  artworks: Artwork[];
  onNavigateToWorkstation: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onTogglePublish: (id: string) => void;
  followers: { id: string; name: string; title: string; avatar: string; isFollowingBack: boolean }[];
  setFollowers: React.Dispatch<React.SetStateAction<{ id: string; name: string; title: string; avatar: string; isFollowingBack: boolean }[]>>;
  followedArtisans: Record<string, boolean>;
  setFollowedArtisans: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  artisanFollowersOffset: Record<string, number>;
  setArtisanFollowersOffset: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const PRESET_AVATARS = [
  {
    name: '青袍宗师',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkBJiH8wE8aLEElDa6dHlO9bZelJA0mz2jgWv_0eZ7l1_pQKAslgEhj35RDiPtgHbR4VsaU0YUlMmqo30QDkIO1a5t_FBO6pAgPSZBS6ph0T1ZJ7xlQBHL5dM4x_OFi5SuP2Ea1dJ5ham07dVXo73i18S0f2ZmvDENTSxe7dtSc3vFj-jHplEhE2T1D-pzuXJrg-r5SmNkecV8YsXZurtSLvTf_Y9HjRxz3tTt7iAJEpZladtZ1qQLRBbt2RC0TSobCMrCxx1K_Rw'
  },
  {
    name: '国宝大师',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-Ol44CDPyaZRvMVBpo7hM_eudPy5BbY06tr_4qhlzxbppYmHtoxeyfIkUQLblR-01QVHt9oIeNJsZ-CsZjFgZznvJW-0ZugAQ6KbSohuMDFIo1As_QWc-i1BdUN0Nz9EcKGeJA-A_h8aQLuSzFkjKiBnqXcscKLJpmdkanH7v9qkcB03DcwDsU_MguXpvABn1ckdV6ryjxhTuvRYkFZgCh0RV7iEyFVRCuVNRYK7g9XqRYDpy8jrtne_z82sHBJZt9cRmMw7xboQ'
  },
  {
    name: '景泰大匠',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLZLlFQVRIGeYDlDqKubd0QoSOhZY1Uy5mXVc_w6gdJg-8JPhya87HgceDiBRCDUZJkNJBPljaEq9-DEtPRWGlW8sjM3GETsXp4KXQ72uwMgwYixpimtbbHfP6pLZ4sJrVgZwz5MJ-vM-q2Sjs4jWG29Qa8GnPeiYygDI9ODu-mrzDmRVo1WaFGJYyT9CyoVUpc3eTm5tAq8I1aqtLV9ZvaZ9GDeF3ryWPSNuB7QqcqutYGrMflio-mWIxI4v9IDsUPRJMnXmnE2U'
  },
  {
    name: '点蓝巨擘',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCqybxNWgIk_xz_fe2E9CWN7Deuze3q1KsbhQogs_7L-KNK9SsuqLUlpiDyBPr-p0-aOPWDPHf_pT8_4PmO91oZu7wHvbojqW_1qO2e5PjZEnZnAT4Lik_IL0m5uB8P2ip7k-SsIUu7AIh2EaJOs4qwq-WlR7no_vGhVvaxXQaghpu0F_u43woi_kPMyPDzgdUqzbnm3ImyDyvx8x7MTQxHrb0Tvnw8Tnadxg0Br0OzdJAK45YXATvConeteX9gRE5V1nSqRfYHaM'
  }
];

export default function Portfolio({
  artworks,
  onNavigateToWorkstation,
  userProfile,
  onUpdateProfile,
  onTogglePublish,
  followers,
  setFollowers,
  followedArtisans,
  setFollowedArtisans,
  artisanFollowersOffset,
  setArtisanFollowersOffset,
}: PortfolioProps) {
  // Extract completed works dynamically for the current user
  const masterArtworks = artworks.filter(
    (art) => art.artist === userProfile.nickname || art.id.startsWith('custom-')
  );

  // Default master's active works matching mockups - only show for master user
  const activeWorks = userProfile.nickname === '林渊' ? [
    {
      id: 'active-1',
      title: '缠枝莲纹大瓶',
      description: '正在进行精细的点蓝工序，填充多种矿物釉料，期待入窑后的高温色彩蜕变。',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQV_XVnWG5yJp5-pNdEGMkaQ2EYEgErMLSvdqCUtQGlOVAPwV_PDc20exzGND95COfArVSgWunsTd3nSlYInJjCtBUWnTrEl7Cc9ywek-mzWyVwNZVmwLvI9FkewR_aDJClf87Y-V2DlVj9EE_KoY4QM32XJ7k0OXuqy7mRi-SHuKNcLdnRjoQtyYjuMG4-Bos46foNOurZz8eG-c1PCRaeC8JmFRaMS8NNfTT3naHxg6ncvSDasYRWY9GBcVgP3U_EOYesjmbrLg',
      status: 'firing',
      materials: ['紫铜胎', '手绘墨稿釉'],
      progressPercent: 75,
      progressMaxLabel: '四遍点蓝',
      progressMinLabel: '第二遍点蓝'
    },
    {
      id: 'active-2',
      title: '仿古百鸟朝凤大尊',
      description: '铜丝已全部掐好并粘固在铜胎骨之上，准备进行焊接稳固工序，流转线条流畅，极具风骨。',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA95mD3aNwzFQH3rzARwDIMD2_EMRrnXmEUdb2Q5YFXjtWxSulOM3k9KLKnJo6S05RFJNCvghDpmWnPZzoUb9VbYgDtipDCDKZFj8w7_bBGrtlLzIlHBk2kGHhHG8fMPKM8F45H41MR_jO7v42H-VoUMB74RqVpsBwTjNlCM3hW54DOwujeU1TkNRRPBLQtWAUl5uKqk6AsGSKmXv4YgGMYvMGOP9hpw-o31o9Sh31Rh-bUWK2TtSliJXagUaWiy_uWlssjDGt5G0',
      status: 'filigree',
      materials: ['紫铜胎', '纯手工掐丝'],
      progressPercent: 40,
      progressMaxLabel: '点蓝准备',
      progressMinLabel: '金丝定位'
    }
  ] : [];

  // Modal Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(userProfile.nickname);
  const [title, setTitle] = useState(userProfile.title || '');
  const [avatar, setAvatar] = useState(userProfile.avatar || '');
  const [levelFiligree, setLevelFiligree] = useState(userProfile.levelFiligree);
  const [levelEnamel, setLevelEnamel] = useState(userProfile.levelEnamel);
  const [email, setEmail] = useState(userProfile.email);
  
  // File upload state for Custom Avatar
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic selected follower/artisan profile name to inspect their homepage
  const [selectedArtisanProfileName, setSelectedArtisanProfileName] = useState<string | null>(null);

  const getArtisanProfile = (name: string) => {
    // Is it current user?
    const isCurrentUser = userProfile && name && userProfile.nickname &&
      name.trim().toLowerCase() === userProfile.nickname.trim().toLowerCase();
    if (isCurrentUser) {
      return {
        nickname: userProfile.nickname,
        title: userProfile.title || '国家级非物质文化遗产景泰蓝技艺传承人',
        avatar: userProfile.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkBJiH8wE8aLEElDa6dHlO9bZelJA0mz2jgWv_0eZ7l1_pQKAslgEhj35RDiPtgHbR4VsaU0YUlMmqo30QDkIO1a5t_FBO6pAgPSZBS6ph0T1ZJ7xlQBHL5dM4x_OFi5SuP2Ea1dJ5ham07dVXo73i18S0f2ZmvDENTSxe7dtSc3vFj-jHplEhE2T1D-pzuXJrg-r5SmNkecV8YsXZurtSLvTf_Y9HjRxz3tTt7iAJEpZladtZ1qQLRBbt2RC0TSobCMrCxx1K_Rw',
        levelFiligree: userProfile.levelFiligree,
        levelEnamel: userProfile.levelEnamel,
        completedCount: artworks.filter(art => art.artist === userProfile.nickname || art.id.startsWith('custom-')).length,
        followersCount: userProfile.followersCount,
        email: userProfile.email || 'linyuan@cloisonne.com'
      };
    }

    // Is it in custom or loaded follower state?
    const followerItem = followers.find(f => f.name === name);
    const defaultProfile = SHARED_ARTISAN_PROFILES[name];

    if (defaultProfile) {
      const offset = artisanFollowersOffset[name] || 0;
      return {
        ...defaultProfile,
        followersCount: defaultProfile.followersCount + offset,
      };
    }

    // Dynamic fallback if manual input / added follower, keeping avatar
    return {
      nickname: name,
      title: followerItem?.title || '景泰蓝工艺美术研究同好',
      avatar: followerItem?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
      levelFiligree: 5,
      levelEnamel: 4,
      completedCount: artworks.filter(art => art.artist === name).length || 2,
      followersCount: 420 + (artisanFollowersOffset[name] || 0),
      email: `${name.toLowerCase()}@cloisonne-crafts.org`
    };
  };

  // Followers modal and list states
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [followerQuery, setFollowerQuery] = useState('');
  const [followerFilter, setFollowerFilter] = useState<'all' | 'mutual' | 'single'>('all');

  // Following modal and list states
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [followingQuery, setFollowingQuery] = useState('');

  // Computed list of followed artisans and users
  const followingList = React.useMemo(() => {
    // Artisans that we explicitly followed (where followedArtisans is true)
    return Object.keys(followedArtisans)
      .filter(name => name.trim().toLowerCase() !== userProfile.nickname.trim().toLowerCase() && followedArtisans[name] === true)
      .map((name, idx) => {
        const profile = getArtisanProfile(name);
        return {
          id: `following-custom-${idx}`,
          name: profile.nickname,
          title: profile.title,
          avatar: profile.avatar,
          isMutual: followers.some(f => f.name === name && f.isFollowingBack)
        };
      });
  }, [followers, followedArtisans]);

  const handleOpenEdit = () => {
    setNickname(userProfile.nickname);
    setTitle(userProfile.title || '国家级非物质文化遗产景泰蓝技艺传承人');
    setAvatar(userProfile.avatar || '');
    setLevelFiligree(userProfile.levelFiligree);
    setLevelEnamel(userProfile.levelEnamel);
    setEmail(userProfile.email || 'linyuan@cloisonne.com');
    setIsEditing(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // -------------- 🔥 唯一修改2：资料保存兼容CloudBase（无Firebase残留）--------------
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert('请输入匠人姓名');
      return;
    }
    
    // 保存逻辑完全不变，由父组件调用CloudBase更新
    onUpdateProfile({
      nickname: nickname.trim(),
      title: title.trim(),
      avatar: avatar.trim(),
      levelFiligree,
      levelEnamel,
      followersCount: userProfile.followersCount,
      completedCount: userProfile.completedCount,
      email: email.trim(),
    });

    setIsEditing(false);
  };
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-10 font-serif-literata relative z-10 w-full">
      
      {/* Profile & Stats Header */}
      <section className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-surface-container-low p-6 md:p-8 rounded-xl shadow-lg border border-outline-variant/20 relative overflow-hidden">
        
        {/* Background glow overlay */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#e9c349]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Profile Pic Card */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface shadow-sm flex-shrink-0 relative group">
          <img 
            alt={userProfile.nickname} 
            src={userProfile.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkBJiH8wE8aLEElDa6dHlO9bZelJA0mz2jgWv_0eZ7l1_pQKAslgEhj35RDiPtgHbR4VsaU0YUlMmqo30QDkIO1a5t_FBO6pAgPSZBS6ph0T1ZJ7xlQBHL5dM4x_OFi5SuP2Ea1dJ5ham07dVXo73i18S0f2ZmvDENTSxe7dtSc3vFj-jHplEhE2T1D-pzuXJrg-r5SmNkecV8YsXZurtSLvTf_Y9HjRxz3tTt7iAJEpZladtZ1qQLRBbt2RC0TSobCMrCxx1K_Rw'} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <button 
            onClick={handleOpenEdit}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 cursor-pointer text-xs"
            title="更换头像"
          >
            <Camera className="w-5 h-5 text-[#e9c349] mb-1" />
            <span>更换头像</span>
          </button>
        </div>

        {/* Master details */}
        <div className="flex-grow flex flex-col gap-4 text-center md:text-left w-full">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
              <h1 className="font-serif-garamond text-3xl md:text-4xl font-extrabold text-[#e9c349]">
                {userProfile.nickname}
              </h1>
              <button
                onClick={handleOpenEdit}
                className="p-1 px-2.5 rounded-md border border-[#e9c349]/30 hover:border-[#e9c349] text-[#e9c349] hover:bg-[#e9c349]/10 transition-colors cursor-pointer text-[10px] font-sans-manrope font-bold uppercase tracking-wider flex items-center gap-1"
                title="修改个人档案"
              >
                <Edit className="w-3 h-3" />
                修改个人信息
              </button>
            </div>
            <p className="text-sm text-on-surface-variant font-sans-manrope uppercase tracking-widest mt-1">
              {userProfile.title || '国家级非物质文化遗产景泰蓝技艺传承人'}
            </p>
            {userProfile.email && (
              <p className="text-xs text-outline-variant font-sans-manrope mt-1 flex items-center justify-center md:justify-start gap-1">
                <Mail className="w-3 h-3" /> {userProfile.email}
              </p>
            )}
          </div>

          <button 
            onClick={onNavigateToWorkstation}
            className="bg-primary hover:bg-primary/90 text-on-primary font-sans-manrope font-bold text-xs px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:scale-101 active:scale-98 transition-all flex items-center gap-2 border-t border-white/20 cursor-pointer w-fit ml-auto"
          >
            <Flame className="w-4 h-4 text-orange-200 fill-orange-200" />
            开始新创作
          </button>

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-2 w-full">
            <StatCard count={String(userProfile.completedCount)} label="已创作品" icon={Award} color="text-primary" />
            <StatCard count={`Lvl ${userProfile.levelFiligree}`} label="掐丝等级" icon={Hammer} color="text-secondary" />
            <StatCard count={`Lvl ${userProfile.levelEnamel}`} label="点蓝造诣" icon={BookOpen} color="text-secondary" />
            <div 
              onClick={() => setIsFollowersOpen(true)}
              className="cursor-pointer group/stat active:scale-[0.98] transition-all duration-300 relative rounded-lg"
              title="查看我的粉丝列表"
            >
              <div className="absolute inset-0 bg-[#e9c349]/5 rounded-lg opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300 border border-[#e9c349]/20" />
              <StatCard count={String(followers.length)} label="我的粉丝 (点击查看) ↗" icon={Users} color="text-primary group-hover/stat:text-[#e9c349]" />
            </div>
            <div 
              onClick={() => setIsFollowingOpen(true)}
              className="cursor-pointer group/stat active:scale-[0.98] transition-all duration-300 relative rounded-lg bg-surface-container-low"
              title="查看我关注的匠人名单"
            >
              <div className="absolute inset-0 bg-[#e9c349]/5 rounded-lg opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300 border border-[#e9c349]/20" />
              <StatCard count={String(followingList.length)} label="我关注的人 (点击查看) ↗" icon={UserCheck} color="text-secondary group-hover/stat:text-[#e9c349]" />
            </div>
          </div>
        </div>

      </section>

      {/* Portfolio Gallery Section */}
      <section className="flex flex-col gap-6">
        <h2 className="font-serif-garamond text-2xl text-on-surface border-b border-outline-variant/30 pb-2">
          我的工作台收藏 - 杰作与在研进程
        </h2>

        {/* Grid containing master works */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Dynamic master completed works listing */}
          {masterArtworks.map((art) => (
            <article 
              key={art.id}
              className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-lg overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300 group"
            >
              <div className="h-64 relative overflow-hidden p-2 bg-black/10">
                {art.vaseShape ? (
                  <CloisonneSvg art={art} className="w-full h-full" />
                ) : (
                  <img 
                    alt={art.title} 
                    src={art.image} 
                    className="w-full h-full object-cover rounded-lg shadow-inner group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute top-4 right-4 bg-secondary-container/90 text-on-secondary-container px-3 py-1 rounded-lg font-sans-manrope text-[10px] tracking-widest uppercase font-bold shadow-sm backdrop-blur-sm flex items-center gap-1.5">
                  {art.isPublished ? <><Check className="w-3 h-3" /> 已发布</> : '仅私有'}
                </div>
                {/* Publish / Private Toggle Button */}
                <button 
                  onClick={() => onTogglePublish(art.id)}
                  className={`absolute bottom-4 right-4 p-2 rounded-full shadow-lg transition-all ${
                    art.isPublished 
                      ? 'bg-outline-variant/60 text-white hover:bg-red-500/80' 
                      : 'bg-[#e9c349] text-black hover:bg-[#ffe24d]'
                  }`}
                  title={art.isPublished ? '设为私有' : '发布到社区'}
                >
                  {art.isPublished ? <X className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="p-5 flex flex-col gap-2">
                <h3 className="font-serif-garamond text-xl font-bold text-on-surface">
                  {art.title}
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-3">
                  {art.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {art.materials.map((mat, i) => (
                    <span 
                      key={i} 
                      className="bg-[#e9c349]/10 text-[#e9c349] px-2 py-0.5 rounded font-sans-manrope text-[10px] font-bold"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}

          {/* Core ongoing works rendered beautifully right out of mockups */}
          {activeWorks.map((work) => (
            <article 
              key={work.id}
              className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-lg overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300 group relative"
            >
              <div className="h-64 relative overflow-hidden p-2 bg-black/10">
                <img 
                  alt={work.title} 
                  src={work.image} 
                  className="w-full h-full object-cover rounded-lg shadow-inner opacity-90 group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {work.status === 'firing' ? (
                  <div className="absolute top-4 right-4 bg-primary-container/90 text-on-primary-container px-3 py-1 rounded-lg font-sans-manrope text-[10px] tracking-widest uppercase font-bold shadow-sm flex items-center gap-1 animate-pulse">
                    <Flame className="w-3 h-3" />
                    点蓝中
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 bg-tertiary-container/90 text-on-tertiary-container px-3 py-1 rounded-lg font-sans-manrope text-[10px] tracking-widest uppercase font-bold shadow-sm">
                    掐丝中
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col gap-2">
                <h3 className="font-serif-garamond text-xl font-bold text-on-surface">
                  {work.title}
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-3">
                  {work.description}
                </p>

                {/* Simulated Process Bar indicator */}
                <div className="mt-4">
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden shadow-inner border border-outline-variant/10">
                    <div 
                      className={`h-full rounded-full ${
                        work.status === 'firing' 
                          ? 'bg-gradient-to-r from-red-600 to-amber-500' 
                          : 'bg-gradient-to-r from-yellow-600 to-amber-400'
                      }`}
                      style={{ width: `${work.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-sans-manrope text-on-surface-variant font-bold mt-1 uppercase tracking-wider">
                    <span>{work.progressMinLabel}</span>
                    <span>{work.progressMaxLabel}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {work.materials.map((mat, i) => (
                    <span 
                      key={i} 
                      className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded font-sans-manrope text-[10px]"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}

        </div>
      </section>

      {/* Profile Modification Overlay Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-surface-container-low max-w-2xl w-full rounded-2xl border border-[#e9c349]/30 shadow-2xl relative p-6 md:p-8 overflow-hidden font-serif-literata max-h-[90vh] flex flex-col">
            
            {/* Elegant Corner Trims */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#e9c349]/40"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#e9c349]/40"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#e9c349]/40"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#e9c349]/40"></div>

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant/20 flex-shrink-0">
              <h3 className="font-serif-garamond text-2xl font-bold text-[#e9c349] flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                编辑非遗匠人档案
              </h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full text-outline-variant hover:text-white hover:bg-surface-container transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll Container */}
            <form onSubmit={handleSaveProfile} className="space-y-6 overflow-y-auto pr-1 flex-grow">
              
              {/* Profile Avatar Selection Section */}
              <div className="space-y-3">
                <label className="block text-xs font-sans-manrope font-bold text-on-surface-variant uppercase tracking-wider">
                  更替匠人肖像 / 头像
                </label>

                {/* Main Avatar Editor Workspace */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  
                  {/* Current Preview */}
                  <div className="flex flex-col items-center gap-2 bg-surface-container/40 p-4 rounded-xl border border-outline-variant/10 text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#e9c349] shadow-inner bg-black">
                      <img 
                        src={avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkBJiH8wE8aLEElDa6dHlO9bZelJA0mz2jgWv_0eZ7l1_pQKAslgEhj35RDiPtgHbR4VsaU0YUlMmqo30QDkIO1a5t_FBO6pAgPSZBS6ph0T1ZJ7xlQBHL5dM4x_OFi5SuP2Ea1dJ5ham07dVXo73i18S0f2ZmvDENTSxe7dtSc3vFj-jHplEhE2T1D-pzuXJrg-r5SmNkecV8YsXZurtSLvTf_Y9HjRxz3tTt7iAJEpZladtZ1qQLRBbt2RC0TSobCMrCxx1K_Rw'} 
                        alt="Avatar Preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] font-sans-manrope text-outline-variant uppercase">当前肖像预览</span>
                  </div>

                  {/* Drag-and-Drop Local File Area */}
                  <div className="md:col-span-2">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 bg-surface-container-lowest/50 ${
                        isDragging 
                          ? 'border-[#e9c349] bg-[#e9c349]/5' 
                          : 'border-outline-variant/30 hover:border-[#e9c349]/40 hover:bg-surface-container-high/40'
                      }`}
                    >
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <Upload className="w-5 h-5 text-[#e9c349] mb-1.5" />
                      <p className="font-sans-manrope text-xs text-on-surface font-medium">拖拽肖像图片到此处，或点击上传</p>
                      <p className="font-sans-manrope text-[9px] text-outline-variant/60 mt-0.5">支持本地JPG、PNG（自动转本地原画）</p>
                    </div>
                  </div>

                </div>

                {/* Preselected Curated Avatars */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-sans-manrope text-outline-variant font-bold">或者 选择国风工匠典藏肖像</span>
                  <div className="grid grid-cols-4 gap-3">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => setAvatar(preset.url)}
                        className={`group relative aspect-square rounded-xl border cursor-pointer overflow-hidden transition-all duration-200 ${
                          avatar === preset.url 
                            ? 'border-[#e9c349] ring-2 ring-[#e9c349]/50' 
                            : 'border-outline-variant/20 hover:border-[#e9c349]/40'
                        }`}
                        title={preset.name}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.name} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1 text-center">
                          <span className="text-[9px] font-medium text-white truncate font-serif-garamond">{preset.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input with Avatar URL direct input */}
                <div className="space-y-1">
                  <span className="text-[10px] font-sans-manrope text-outline-variant font-bold">手动输入肖像链接 (URL)</span>
                  <input
                    type="url"
                    value={avatar.startsWith('data:') ? '' : avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="可在此粘贴任意网络图片链接地址"
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Nickname / Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans-manrope font-bold text-on-surface-variant uppercase tracking-wider">
                    匠人姓名 / 昵称 (作品签名代表)
                  </label>
                  <input
                    type="text"
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="匠人姓名..."
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary font-sans-manrope"
                  />
                </div>

                {/* Heritage Rank Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans-manrope font-bold text-on-surface-variant uppercase tracking-wider">
                    匠人头衔 / 徽号
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="国家级非物质文化遗产传承人..."
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary font-sans-manrope"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans-manrope font-bold text-on-surface-variant uppercase tracking-wider font-sans-manrope font-sans-manrope">
                    联络邮箱地址
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="artisan@cloisonne.com"
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary font-sans-manrope"
                  />
                </div>

              </div>

              {/* Range settings for Artisan Levels with nice sliders */}
              <div className="bg-surface-container/20 p-4 rounded-xl border border-outline-variant/10 space-y-4">
                <span className="text-xs font-sans-manrope font-bold uppercase tracking-wider text-[#e9c349] flex items-center gap-1.5 mb-2">
                  <Award className="w-4 h-4 text-[#e9c349]" /> 技能功力修养等阶
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Filigree Level slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-sans-manrope text-on-surface-variant font-bold flex items-center gap-1.5">
                        <Hammer className="w-3.5 h-3.5 text-secondary" /> 掐丝金丝造诣
                      </span>
                      <span className="text-secondary font-bold font-sans-manrope">Level {levelFiligree}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={levelFiligree}
                      onChange={(e) => setLevelFiligree(Number(e.target.value))}
                      className="w-full accent-secondary bg-surface-container cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-outline-variant font-bold">
                      <span>初窥门径</span>
                      <span>炉火纯青</span>
                    </div>
                  </div>

                  {/* Enamel Level slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-sans-manrope text-on-surface-variant font-bold flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-secondary" /> 点蓝煅烧理解
                      </span>
                      <span className="text-secondary font-bold font-sans-manrope">Level {levelEnamel}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={levelEnamel}
                      onChange={(e) => setLevelEnamel(Number(e.target.value))}
                      className="w-full accent-secondary bg-surface-container cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-outline-variant font-bold">
                      <span>见色闻烟</span>
                      <span>大成至臻</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Save Controls Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface text-xs font-bold font-sans-manrope hover:bg-surface-container hover:text-white transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-on-primary rounded-lg text-xs font-bold font-sans-manrope shadow-md tracking-wider flex items-center gap-1.5 cursor-pointer hover-lift border-t border-white/20"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  保存匠人档案
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Followers List Overlay Modal */}
      {isFollowersOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-surface-container-low max-w-xl w-full rounded-2xl border border-[#e9c349]/35 shadow-2xl relative p-6 md:p-8 flex flex-col max-h-[85vh] font-serif-literata overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Elegant Traditional Chinese Corner Trims */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#e9c349]/40"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#e9c349]/40"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#e9c349]/40"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#e9c349]/40"></div>

            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#e9c349]/10 flex items-center justify-center text-[#e9c349]">
                  <Users className="w-5 h-5 text-[#e9c349]" />
                </div>
                <div>
                  <h3 className="font-serif-garamond text-xl font-bold text-[#e9c349]">
                    我的关注者
                  </h3>
                  <p className="font-sans-manrope text-[10px] text-outline-variant uppercase tracking-wider">
                    共 {followers.length} 位艺术界同仁、藏家与支持者
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsFollowersOpen(false);
                  setFollowerQuery('');
                  setFollowerFilter('all');
                }}
                className="p-1.5 rounded-full text-outline-variant hover:text-white hover:bg-surface-container transition-all cursor-pointer"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Search and Filter Tabs */}
            <div className="my-4 flex flex-col gap-3 flex-shrink-0">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-outline-variant" />
                <input
                  type="text"
                  placeholder="输入姓名或身兼职务搜索关注者..."
                  value={followerQuery}
                  onChange={(e) => setFollowerQuery(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg pl-9 pr-4 py-2 font-sans-manrope text-xs text-on-surface focus:outline-none focus:border-[#e9c349] placeholder-outline-variant/60"
                />
                {followerQuery && (
                  <button 
                    onClick={() => setFollowerQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-[#e9c349] hover:underline cursor-pointer"
                  >
                    清除
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-1.5 p-1 bg-surface-container-high/40 rounded-lg border border-outline-variant/10">
                <button
                  type="button"
                  onClick={() => setFollowerFilter('all')}
                  className={`flex-1 text-center py-1.5 rounded font-sans-manrope text-xs font-bold transition-all cursor-pointer ${
                    followerFilter === 'all' 
                      ? 'bg-[#e9c349] text-black shadow-sm' 
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  全部 ({followers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFollowerFilter('mutual')}
                  className={`flex-1 text-center py-1.5 rounded font-sans-manrope text-xs font-bold transition-all cursor-pointer ${
                    followerFilter === 'mutual' 
                      ? 'bg-[#e9c349] text-black shadow-sm' 
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  互相关注 ({followers.filter(f => f.isFollowingBack).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFollowerFilter('single')}
                  className={`flex-1 text-center py-1.5 rounded font-sans-manrope text-xs font-bold transition-all cursor-pointer ${
                    followerFilter === 'single' 
                      ? 'bg-[#e9c349] text-black shadow-sm' 
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  已关注我 ({followers.filter(f => !f.isFollowingBack).length})
                </button>
              </div>
            </div>

            {/* Scrollable Followers List Container */}
            <div className="flex-grow overflow-y-auto pr-1 divide-y divide-outline-variant/10">
              {(() => {
                // Apply query search and filter parameters
                const filtered = followers.filter(f => {
                  const matchQuery = 
                    f.name.toLowerCase().includes(followerQuery.toLowerCase()) ||
                    f.title.toLowerCase().includes(followerQuery.toLowerCase());
                  
                  if (followerFilter === 'mutual') {
                    return matchQuery && f.isFollowingBack;
                  }
                  if (followerFilter === 'single') {
                    return matchQuery && !f.isFollowingBack;
                  }
                  return matchQuery;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-12 text-center flex flex-col items-center justify-center gap-2 text-outline-variant">
                      <Users className="w-8 h-8 stroke-[1.5] text-outline-variant/30" />
                      <p className="font-sans-manrope text-xs font-bold">没有寻得符合筛选条件的关注者</p>
                    </div>
                  );
                }

                return filtered.map(f => (
                  <div key={f.id} className="py-3 flex items-center justify-between gap-4 group">
                    <div 
                      onClick={() => {
                        setSelectedArtisanProfileName(f.name);
                      }}
                      className="flex items-center gap-3 min-w-0 cursor-pointer group/artisanTitle hover:opacity-90 active:scale-[0.99] transition-all"
                      title="点击查看匠人主页"
                    >
                      {/* Avatar preview */}
                      <img 
                        src={f.avatar} 
                        alt={f.name} 
                        className="w-10 h-10 rounded-full object-cover border border-outline-variant/30 group-hover/artisanTitle:border-[#e9c349]/60 flex-shrink-0 shadow-sm transition-all"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Fallback if image does not load
                          (e.target as HTMLImageElement).src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkBJiH8wE8aLEElDa6dHlO9bZelJA0mz2jgWv_0eZ7l1_pQKAslgEhj35RDiPtgHbR4VsaU0YUlMmqo30QDkIO1a5t_FBO6pAgPSZBS6ph0T1ZJ7xlQBHL5dM4x_OFi5SuP2Ea1dJ5ham07dVXo73i18S0f2ZmvDENTSxe7dtSc3vFj-jHplEhE2T1D-pzuXJrg-r5SmNkecV8YsXZurtSLvTf_Y9HjRxz3tTt7iAJEpZladtZ1qQLRBbt2RC0TSobCMrCxx1K_Rw';
                        }}
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif-garamond text-base font-bold text-on-surface group-hover/artisanTitle:text-[#e9c349] transition-colors truncate">
                          {f.name}
                        </h4>
                        <p className="font-sans-manrope text-[11px] text-[#e9c349]/80 font-medium truncate">
                          {f.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 font-sans-manrope text-xs">
                      {/* Interactive toggle follow state back */}
                      <button
                        onClick={() => {
                          const nextFollowingBack = !f.isFollowingBack;
                          setFollowers(prev => prev.map(item => 
                            item.id === f.id ? { ...item, isFollowingBack: nextFollowingBack } : item
                          ));
                          setFollowedArtisans(prev => ({
                            ...prev,
                            [f.name]: nextFollowingBack
                          }));
                          setArtisanFollowersOffset(prev => ({
                            ...prev,
                            [f.name]: (prev[f.name] || 0) + (nextFollowingBack ? 1 : -1)
                          }));
                        }}
                        className={`px-2.5 py-1.5 rounded-lg font-bold tracking-wider text-[10px] transition-all cursor-pointer flex items-center gap-1 ${
                          f.isFollowingBack 
                            ? 'bg-surface-container-high text-outline-variant hover:bg-[#e9c349]/10 hover:text-[#e9c349] hover:border-[#e9c349]/30 border border-outline-variant/20' 
                            : 'bg-primary hover:bg-primary/90 text-on-primary'
                        }`}
                        title={f.isFollowingBack ? '取消回关' : '回关该同好'}
                      >
                        {f.isFollowingBack ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5 text-[#e9c349]" />
                            <span>互相关注</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5 text-white" />
                            <span>回关</span>
                          </>
                        )}
                      </button>

                      {/* Remove safely action */}
                      <button
                        onClick={() => {
                          if (confirm(`确定要移除对关注者「${f.name}」的粉丝关联吗？`)) {
                            setFollowers(prev => prev.filter(item => item.id !== f.id));
                          }
                        }}
                        className="p-1.5 rounded text-outline-variant hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="移出粉丝列表"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Modal footer with diagnostic indicator */}
            <div className="pt-4 border-t border-outline-variant/10 mt-3 flex items-center justify-between flex-shrink-0 text-[10px] font-sans-manrope text-outline-variant">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#e9c349]" />
                数据已与此景泰蓝非遗大赏安全同步。
              </span>
              <button
                type="button"
                onClick={() => {
                  const newName = prompt("请输入模拟新增的关注者姓名：");
                  if (newName && newName.trim()) {
                    const newTitle = prompt("请输入新增关注者的身兼职务或称号：", "景泰蓝艺术收藏家");
                    const newFollower = {
                      id: `f-${Date.now()}`,
                      name: newName.trim(),
                      title: newTitle ? newTitle.trim() : "景泰蓝艺术收藏家",
                      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
                      isFollowingBack: false
                    };
                    setFollowers(prev => [newFollower, ...prev]);
                  }
                }}
                className="text-[#e9c349] hover:underline cursor-pointer font-bold flex items-center gap-1"
              >
                + 手工模拟新增关注者
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Following List Overlay Modal */}
      {isFollowingOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-surface-container-low max-w-xl w-full rounded-2xl border border-[#e9c349]/35 shadow-2xl relative p-6 md:p-8 flex flex-col max-h-[85vh] font-serif-literata overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Elegant Traditional Chinese Corner Trims */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#e9c349]/40"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#e9c349]/40"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#e9c349]/40"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#e9c349]/40"></div>

            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#e9c349]/10 flex items-center justify-center text-[#e9c349]">
                  <UserCheck className="w-5 h-5 text-[#e9c349]" />
                </div>
                <div>
                  <h3 className="font-serif-garamond text-xl font-bold text-[#e9c349]">
                    我关注的人
                  </h3>
                  <p className="font-sans-manrope text-[10px] text-outline-variant uppercase tracking-wider">
                    共 {followingList.length} 位您关注和支持的艺术匠人与同好
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsFollowingOpen(false);
                  setFollowingQuery('');
                }}
                className="p-1.5 rounded-full text-outline-variant hover:text-white hover:bg-surface-container transition-all cursor-pointer"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="my-4 flex flex-col gap-3 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-outline-variant" />
                <input
                  type="text"
                  placeholder="输入姓名或身兼职务搜索关注的匠人..."
                  value={followingQuery}
                  onChange={(e) => setFollowingQuery(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg pl-9 pr-4 py-2 font-sans-manrope text-xs text-on-surface focus:outline-none focus:border-[#e9c349] placeholder-outline-variant/60"
                />
                {followingQuery && (
                  <button 
                    onClick={() => setFollowingQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-[#e9c349] hover:underline cursor-pointer"
                  >
                    清除
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable List Container */}
            <div className="flex-grow overflow-y-auto pr-1 divide-y divide-outline-variant/10">
              {(() => {
                const filtered = followingList.filter(f => {
                  const matchQuery = 
                    f.name.toLowerCase().includes(followingQuery.toLowerCase()) ||
                    f.title.toLowerCase().includes(followingQuery.toLowerCase());
                  return matchQuery;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-12 text-center flex flex-col items-center justify-center gap-2 text-outline-variant">
                      <Users className="w-8 h-8 stroke-[1.5] text-outline-variant/30" />
                      <p className="font-sans-manrope text-xs font-bold">没有寻得符合您关注的匠人</p>
                    </div>
                  );
                }

                return filtered.map(f => (
                  <div key={f.id} className="py-3 flex items-center justify-between gap-4 group cursor-pointer"
                    onClick={() => {
                      setIsFollowingOpen(false);
                      setSelectedArtisanProfileName(f.name);
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0 group/artisanTitle hover:opacity-90 transition-all">
                      <img 
                        src={f.avatar} 
                        alt={f.name} 
                        className="w-10 h-10 rounded-full object-cover border border-outline-variant/30 group-hover/artisanTitle:border-[#e9c349]/60 flex-shrink-0 shadow-sm transition-all"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120';
                        }}
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif-garamond text-base font-bold text-on-surface group-hover/artisanTitle:text-[#e9c349] transition-colors truncate">
                          {f.name}
                        </h4>
                        <p className="font-sans-manrope text-[11px] text-[#e9c349]/80 font-medium truncate">
                          {f.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 font-sans-manrope text-xs" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          // Unfollow them
                          setFollowedArtisans(prev => ({ ...prev, [f.name]: false }));
                          setFollowers(prev => prev.map(item => 
                            item.name === f.name ? { ...item, isFollowingBack: false } : item
                          ));
                        }}
                        className="px-2.5 py-1.5 rounded-lg font-bold border border-outline-variant/30 hover:border-red-500/40 hover:bg-red-500/5 text-outline-variant hover:text-red-400 text-[10px] transition-colors cursor-pointer"
                        title="取消关注这位匠人"
                      >
                        取消关注
                      </button>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-outline-variant/10 mt-3 flex items-center justify-between flex-shrink-0 text-[10px] font-sans-manrope text-outline-variant">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#e9c349]" />
                点击匠人整行，可直接翻阅其景泰蓝工艺主页。
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic Artisan Profile Detail Modal */}
      {selectedArtisanProfileName && (() => {
        const profile = getArtisanProfile(selectedArtisanProfileName);
        const isFollowed = followedArtisans[selectedArtisanProfileName] || false;
        const isSelf = userProfile && selectedArtisanProfileName && 
          selectedArtisanProfileName.trim().toLowerCase() === userProfile.nickname.trim().toLowerCase();
        
        // Filter artworks by this artisan specifically
        const artisanWorks = artworks.filter(art => art.artist === selectedArtisanProfileName);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-surface-container-low max-w-2xl w-full rounded-2xl border border-[#e9c349]/40 overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh]">
              
              {/* Corner Ornaments */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#e9c349]/40 z-10"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#e9c349]/40 z-10"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#e9c349]/40 z-10"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#e9c349]/40 z-10"></div>

              {/* Back Banner */}
              <div className="relative h-28 bg-gradient-to-r from-[#800020] via-surface-lowest to-[#4B0082] flex-shrink-0">
                <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
                <button 
                  onClick={() => setSelectedArtisanProfileName(null)}
                  className="absolute top-4 left-4 p-2 rounded-full bg-black/40 text-on-surface hover:text-[#e9c349] hover:bg-black/60 transition-colors z-20 cursor-pointer"
                  title="关闭主页"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Main Body */}
              <div className="px-6 md:px-8 pb-6 pt-0 relative flex-1 overflow-y-auto">
                {/* Meta Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-10 sm:mb-4">
                  <img 
                    src={profile.avatar} 
                    alt={profile.nickname} 
                    className="w-20 h-20 rounded-full border-4 border-surface-container-low object-cover shadow-lg relative z-20"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120';
                    }}
                  />
                  <div className="text-center sm:text-left flex-1 font-serif-garamond">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h2 className="text-2xl font-bold text-[#e9c349]">{profile.nickname}</h2>
                      {isSelf && (
                        <span className="self-center px-2 py-0.5 text-[10px] bg-indigo-500/10 text-indigo-300 rounded font-bold border border-indigo-500/20 font-sans-manrope">
                          (已登录的您自己)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-sans-manrope mt-1">
                      {profile.title}
                    </p>
                  </div>

                  {/* interactive follow buttons */}
                  {!isSelf && (
                    <button
                      onClick={() => {
                        if (isSelf) return;
                        const nextFollowed = !isFollowed;
                        setFollowedArtisans(prev => ({
                          ...prev,
                          [selectedArtisanProfileName]: nextFollowed
                        }));
                        setArtisanFollowersOffset(prev => ({
                          ...prev,
                          [selectedArtisanProfileName]: (prev[selectedArtisanProfileName] || 0) + (nextFollowed ? 1 : -1)
                        }));
                        // Also sync isFollowingBack state inside the followers array!
                        setFollowers(prev => prev.map(item => 
                          item.name === selectedArtisanProfileName 
                            ? { ...item, isFollowingBack: nextFollowed } 
                            : item
                        ));

                        // Sync target profile's followers list in localStorage
                        if (profile.email && userProfile) {
                          const targetStorageKey = `jingtai_followers_list_${profile.email}`;
                          const rawSaved = localStorage.getItem(targetStorageKey);
                          let targetFollowers = rawSaved ? JSON.parse(rawSaved) : [...DEFAULT_SEED_FOLLOWERS];
                          
                          if (nextFollowed) {
                            // Add current user as follower to target profile
                            const alreadyFollower = targetFollowers.some((f: any) => 
                              f.name.trim().toLowerCase() === userProfile.nickname.trim().toLowerCase()
                            );
                            if (!alreadyFollower) {
                              targetFollowers = [{
                                id: `f-user-${Date.now()}`,
                                name: userProfile.nickname,
                                title: userProfile.title || '景泰蓝工艺美术研究同好',
                                avatar: userProfile.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkBJiH8wE8aLEElDa6dHlO9bZelJA0mz2jgWv_0eZ7l1_pQKAslgEhj35RDiPtgHbR4VsaU0YUlMmqo30QDkIO1a5t_FBO6pAgPSZBS6ph0T1ZJ7xlQBHL5dM4x_OFi5SuP2Ea1dJ5ham07dVXo73i18S0f2ZmvDENTSxe7dtSc3vFj-jHplEhE2T1D-pzuXJrg-r5SmNkecV8YsXZurtSLvTf_Y9HjRxz3tTt7iAJEpZladtZ1qQLRBbt2RC0TSobCMrCxx1K_Rw',
                                isFollowingBack: false
                              }, ...targetFollowers];
                            }
                          } else {
                            // Remove current user from target's followers
                            targetFollowers = targetFollowers.filter((f: any) => 
                              f.name.trim().toLowerCase() !== userProfile.nickname.trim().toLowerCase()
                            );
                          }
                          localStorage.setItem(targetStorageKey, JSON.stringify(targetFollowers));
                        }
                      }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-sans-manrope font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow ${
                        isFollowed 
                          ? 'bg-surface-container-highest border border-outline-variant text-[#e9c349] hover:bg-surface' 
                          : 'bg-[#e9c349] text-black hover:bg-[#ffe24d]'
                      }`}
                    >
                      {isFollowed ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>已关注其作</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>关注此匠人</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Sub Contact Strip */}
                <div className="py-2.5 px-4 bg-surface-container-high/40 rounded-lg border border-outline-variant/10 text-[11px] text-on-surface-variant/90 font-sans-manrope mt-4 flex flex-col md:flex-row justify-between items-center gap-2 flex-shrink-0">
                  <span>
                    官方邮箱: <span className="text-secondary font-mono">{profile.email}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[#e9c349] font-medium scale-95 origin-right">
                    <Award className="w-3.5 h-3.5" />
                    中非遗景泰蓝联盟认证
                  </span>
                </div>

                {/* Dynamic Traditional Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/15 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Palette className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant block uppercase font-sans-manrope font-bold">已创作品</span>
                      <strong className="text-sm font-semibold font-serif-garamond text-on-surface">{profile.completedCount}件</strong>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/15 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Hammer className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant block uppercase font-sans-manrope font-bold">掐丝造诣</span>
                      <strong className="text-sm font-semibold font-serif-garamond text-on-surface">Lvl {profile.levelFiligree}</strong>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/15 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant block uppercase font-sans-manrope font-bold">点蓝功底</span>
                      <strong className="text-sm font-semibold font-serif-garamond text-on-surface">Lvl {profile.levelEnamel}</strong>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/15 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant block uppercase font-sans-manrope font-bold">粉丝人数</span>
                      <strong className="text-sm font-semibold font-serif-garamond text-on-surface">
                        {profile.followersCount >= 1000 
                          ? `${(profile.followersCount / 1000).toFixed(1)}k` 
                          : profile.followersCount}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Artisan works list */}
                <div>
                  <h3 className="text-sm font-serif-garamond text-[#e9c349] font-bold pb-2 border-b border-outline-variant/20 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-4 h-4" />
                    传世收藏与精品阁 ({artisanWorks.length})
                  </h3>
                  {artisanWorks.length === 0 ? (
                    <div className="py-8 text-center bg-surface-container-lowest/30 rounded border border-dashed border-outline-variant/10 text-xs text-on-surface-variant font-sans-manrope">
                      该匠人暂未在此艺术大赏发表其手造作品
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {artisanWorks.map(art => (
                        <div 
                          key={art.id}
                          className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/15 flex flex-col justify-between"
                        >
                          <div className="aspect-square rounded overflow-hidden bg-black/10 flex items-center justify-center relative">
                            {art.vaseShape ? (
                              <CloisonneSvg art={art} className="w-full h-full scale-90" />
                            ) : (
                              <img 
                                src={art.image} 
                                alt={art.title} 
                                className="w-full h-full object-cover" 
                              />
                            )}
                          </div>
                          <h4 className="text-xs font-serif-garamond font-bold text-on-surface truncate mt-2">
                            {art.title}
                          </h4>
                          <p className="text-[9px] text-[#e9c349]/80 font-sans-manrope flex justify-between items-center mt-0.5">
                            <span>{art.likes} 赞</span>
                            <span className="text-[8px] bg-surface-container-highest px-1 rounded border border-outline-variant/15">
                              {art.tags[0]}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button Footer */}
              <div className="p-4 bg-surface-container-high/40 border-t border-outline-variant/10 flex-shrink-0 text-center flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedArtisanProfileName(null)}
                  className="flex-1 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container-high text-[#e9c349] font-serif-garamond text-xs font-bold transition-all cursor-pointer"
                >
                  返回关注列表
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}

// Sub-card for profile levels stats
interface StatCardProps {
  count: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

function StatCard({ count, label, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-surface-container p-3 rounded-lg shadow-inner border border-outline-variant/20 flex flex-col items-center md:items-start transition-all hover:bg-surface-container-high">
      <div className="flex items-center gap-1.5">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <span className={`font-serif-garamond text-xl font-bold ${color}`}>
          {count}
        </span>
      </div>
      <span className="text-on-surface-variant font-sans-manrope text-[9px] uppercase tracking-widest font-extrabold mt-0.5">
        {label}
      </span>
    </div>
  );
}