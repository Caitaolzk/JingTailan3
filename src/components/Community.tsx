import React, { useState, useEffect } from 'react';
import { Artwork, ArtworkStatus, UserProfile } from '../types';
import { 
  Heart, Search, Eye, Filter, Calendar, Award, ShieldAlert, Check, Plus, X, 
  Upload, Palette, Sparkles, Image as ImageIcon, Info, 
  Users, UserCheck, UserPlus, Hammer, BookOpen, Share2 
} from 'lucide-react';
import CloisonneSvg from './CloisonneSvg';
import { SHARED_ARTISAN_PROFILES } from '../artisanData';
import { db, auth } from '../utils/cloudbase'; // 引入CloudBase

interface CommunityProps {
  onToggleFavorite: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddNewArtwork?: (newArt: Artwork) => void;
  currentUser?: string;
  onNavigateToUpload?: () => void;
  userProfile?: UserProfile;
}

export default function Community({
  onToggleFavorite,
  searchQuery,
  onSearchChange,
  onAddNewArtwork,
  currentUser,
  onNavigateToUpload,
  userProfile,
}: CommunityProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('所有作品');
  const [selectedArtDetail, setSelectedArtDetail] = useState<Artwork | null>(null);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [selectedArtisanProfileName, setSelectedArtisanProfileName] = useState<string | null>(null);
  
  // 云端作品列表
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  // 云端关注列表
  const [followedArtisans, setFollowedArtisans] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // 1. 从CloudBase加载所有已发布的社区作品
  useEffect(() => {
    const loadCommunityArtworks = async () => {
      try {
        const res = await db.collection('artworks')
          .where({ isPublished: true })
          .orderBy('createdAt', 'desc')
          .get();
        
        setArtworks(res.data as Artwork[]);
      } catch (err) {
        console.error('加载社区作品失败：', err);
      } finally {
        setLoading(false);
      }
    };

    loadCommunityArtworks();
  }, []);

  // 2. 加载当前用户的关注列表
  useEffect(() => {
    const loadUserFollows = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const res = await db.collection('follow').where({
          uid: user.uid,
        }).get();

        const follows: Record<string, boolean> = {};
        res.data.forEach((item: any) => {
          follows[item.artistName] = true;
        });
        setFollowedArtisans(follows);
      } catch (err) {
        console.error('加载关注列表失败：', err);
      }
    };

    loadUserFollows();
  }, []);

  // 同步作品详情
  React.useEffect(() => {
    if (selectedArtDetail) {
      const updatedArt = artworks.find(a => a.id === selectedArtDetail.id);
      if (updatedArt) {
        setSelectedArtDetail(updatedArt);
      }
    }
  }, [artworks, selectedArtDetail?.id]);

  // 获取匠人资料（云端兼容）
  const getArtisanProfile = (name: string) => {
    const isCurrentUser = userProfile && name && userProfile.nickname && 
      name.trim().toLowerCase() === userProfile.nickname.trim().toLowerCase();
    
    if (isCurrentUser) {
      return {
        nickname: userProfile.nickname,
        title: userProfile.title || '国家级非物质文化遗产景泰蓝技艺传承人',
        avatar: userProfile.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkBJiH8wE8aLEElDa6dHlO9bZelJA0mz2jgWv_0eZ7l1_pQKAslgEhj35RDiPtgHbR4VsaU0YUlMmqo30QDkIO1a5t_FBO6pAgPSZBS6ph0T1ZJ7xlQBHL5dM4x_OFi5SuP2Ea1dJ5ham07dVXo73i18S0f2ZmvDENTSxe7dtSc3vFj-jHplEhE2T1D-pzuXJrg-r5SmNkecV8YsXZurtSLvTf_Y9HjRxz3tTt7iAJEpZladtZ1qQLRBbt2RC0TSobCMrCxx1K_Rw',
        levelFiligree: userProfile.levelFiligree,
        levelEnamel: userProfile.levelEnamel,
        completedCount: artworks.filter(art => art.artist === userProfile.nickname).length,
        followersCount: userProfile.followersCount || 0,
        email: userProfile.email || 'linyuan@cloisonne.com'
      };
    }

    const defaultProfile = SHARED_ARTISAN_PROFILES[name];
    if (defaultProfile) {
      return defaultProfile;
    }

    return {
      nickname: name,
      title: '景泰蓝工艺美术研究同好',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
      levelFiligree: 4,
      levelEnamel: 3,
      completedCount: artworks.filter(art => art.artist === name).length || 3,
      followersCount: 380,
      email: `${name.toLowerCase()}@cloisonne-crafts.org`
    };
  };

  const categories = ['所有作品', '掐丝艺术', '珐琅彩绘', '宫廷珍藏'];

  // 云端作品筛选
  const filteredArtworks = artworks.filter((art) => {
    if (!art.isPublished) return false;

    const query = searchQuery.trim().toLowerCase();
    const queryMatch = query === '' || 
      art.title.toLowerCase().includes(query) || 
      art.tags.some(tag => tag.toLowerCase().includes(query)) ||
      art.description.toLowerCase().includes(query) ||
      art.artist.toLowerCase().includes(query);

    if (!queryMatch) return false;

    if (selectedCategory === '所有作品') return true;
    if (selectedCategory === '掐丝艺术') {
      return art.tags.includes('掐丝') || art.tags.includes('掐丝艺术') || art.materials.includes('精掐金丝');
    }
    if (selectedCategory === '珐琅彩绘') {
      return art.tags.includes('珐琅彩') || art.tags.includes('珐琅釉彩 (景泰蓝)') || art.tags.includes('点蓝') || art.tags.includes('珐琅彩绘');
    }
    if (selectedCategory === '宫廷珍藏') {
      return art.tags.includes('宫廷珍藏') || art.artist.includes('宫廷造办处');
    }
    return true;
  });

  // 3. 云端点赞
  const handleLikeArtwork = async (id: string) => {
    const user = auth.currentUser;
    if (!user) {
      alert('请先登录');
      return;
    }

    try {
      const art = artworks.find(item => item.id === id);
      if (!art) return;

      const newLikeStatus = !art.isFavorite;
      const newLikes = newLikeStatus ? art.likes + 1 : art.likes - 1;

      // 更新云端数据库
      await db.collection('artworks').doc(id).update({
        isFavorite: newLikeStatus,
        likes: newLikes,
      });

      // 更新本地状态
      setArtworks(prev => prev.map(item => 
        item.id === id 
          ? { ...item, isFavorite: newLikeStatus, likes: newLikes }
          : item
      ));
    } catch (err) {
      console.error('点赞失败：', err);
    }
  };

  // 4. 云端关注匠人
  const handleFollowArtisan = async (artistName: string) => {
    const user = auth.currentUser;
    if (!user || !userProfile) {
      alert('请先登录');
      return;
    }

    try {
      const isFollowed = followedArtisans[artistName];
      const newFollowStatus = !isFollowed;

      // 1. 更新关注集合
      if (newFollowStatus) {
        await db.collection('follow').add({
          uid: user.uid,
          artistName,
          createdAt: db.serverDate(),
        });
      } else {
        await db.collection('follow').where({
          uid: user.uid,
          artistName,
        }).remove();
      }

      // 2. 更新匠人粉丝数
      const profile = getArtisanProfile(artistName);
      await db.collection('users').where({ nickname: artistName }).update({
        followersCount: newFollowStatus ? profile.followersCount + 1 : profile.followersCount - 1,
      });

      // 3. 更新本地状态
      setFollowedArtisans(prev => ({
        ...prev,
        [artistName]: newFollowStatus,
      }));
    } catch (err) {
      console.error('关注失败：', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-on-surface">加载社区作品中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 w-full font-serif-literata">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-outline-variant/20">
        <div>
          <h1 className="font-serif-garamond text-4xl lg:text-5xl text-on-surface mb-2">景泰蓝艺术长廊</h1>
          <p className="text-sm text-on-surface-variant max-w-2xl font-sans-manrope uppercase tracking-wider">
            探索传世掐丝珐琅工艺的无尽极致魅力。精选的掐丝、点蓝与烧制皇室杰作珍藏。
          </p>
          
          <div className="relative mt-4 md:hidden">
            <input
              type="text"
              placeholder="搜索珍品..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-full py-2 pl-4 pr-10 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none shadow-inner transition-all duration-300"
            />
            <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant" />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center justify-center md:justify-end">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-sans-manrope text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary font-extrabold hover-lift scale-102'
                    : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface hover-lift'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigateToUpload?.()}
            className="flex items-center gap-1.5 font-sans-manrope text-xs font-bold bg-[#ffd700] hover:bg-[#ffe24d] text-black px-4 py-2 rounded-lg transition-all shadow-md cursor-pointer hover-lift"
          >
            <Plus className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            <span>发布新生珍品</span>
          </button>
        </div>
      </header>

      {filteredArtworks.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low rounded-xl border border-outline-variant/20">
          <ShieldAlert className="w-12 h-12 text-secondary/60 mx-auto mb-4" />
          <h3 className="font-serif-garamond text-xl text-on-surface">暂无符合条件的珍品收藏</h3>
          <p className="text-xs text-on-surface-variant font-sans-manrope mt-2">您可以换个搜索词，或清除上方分类过滤器</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((art) => (
            <article 
              key={art.id}
              onClick={() => setSelectedArtDetail(art)}
              className="cursor-pointer break-inside-avoid bg-surface-container-low rounded-xl border border-outline-variant/20 hover:border-secondary/40 ambient-shadow hover-lift overflow-hidden group flex flex-col justify-between transition-all"
            >
              <div className="relative w-full overflow-hidden aspect-square flex items-center justify-center p-2 bg-black/20">
                {art.vaseShape ? (
                  <CloisonneSvg art={art} className="w-full h-full" />
                ) : (
                  <img 
                    alt={art.title} 
                    src={art.image} 
                    className="w-full h-full object-cover rounded-lg inner-glow transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeArtwork(art.id);
                    }}
                    className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-transform active:scale-90 flex items-center justify-center ${
                      art.isFavorite 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                        : 'bg-surface-container-lowest/80 text-on-surface-variant hover:text-primary border border-outline-variant/30'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${art.isFavorite ? 'fill-red-400 text-red-400' : ''}`} />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 flex gap-2">
                  {art.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="bg-surface/80 text-primary backdrop-blur-md px-2 py-1 rounded font-sans-manrope text-[10px] uppercase tracking-wider font-extrabold shadow-sm border border-outline-variant/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                <div>
                  <h3 className="font-serif-garamond text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                    {art.title}
                  </h3>
                  
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArtisanProfileName(art.artist);
                    }}
                    className="flex items-center gap-2 mt-1.5 group/artName cursor-pointer w-fit"
                    title="点击查看匠人主页"
                  >
                    <img 
                      src={getArtisanProfile(art.artist).avatar} 
                      alt={art.artist} 
                      className="w-5 h-5 rounded-full object-cover border border-[#e9c349]/30"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs text-on-surface-variant group-hover/artName:text-[#e9c349] transition-colors">
                      作者：<span className="font-medium">{art.artist}</span>
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant/80 mt-2.5 line-clamp-2">
                    {art.description}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20 mt-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArtDetail(art);
                    }}
                    className="flex items-center gap-1.5 text-xs font-sans-manrope font-bold text-secondary hover:text-[#ffd700] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    鉴赏此珍品
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeArtwork(art.id);
                    }}
                    className="flex items-center gap-1 text-[11px] font-sans-manrope text-on-surface-variant hover:text-red-400 transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${art.isFavorite ? 'fill-red-400 text-red-500' : ''}`} />
                    <span>{art.likes}赞</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedArtDetail && (
        <div 
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedArtDetail(null)}
        >
          <div 
            className="bg-surface-container-low max-w-2xl w-full rounded-xl border border-[#e9c349]/50 overflow-hidden relative soft-shadow enamel-surface flex flex-col max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#e9c349]"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#e9c349]"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#e9c349]"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#e9c349]"></div>
            
            <button 
              onClick={() => setSelectedArtDetail(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 aspect-square rounded-lg overflow-hidden border border-outline-variant/30 flex items-center justify-center bg-black/10">
                {selectedArtDetail.vaseShape ? (
                  <CloisonneSvg art={selectedArtDetail} className="w-full h-full" />
                ) : (
                  <img 
                    alt={selectedArtDetail.title} 
                    src={selectedArtDetail.image} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="w-full md:w-1/2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-sans-manrope uppercase tracking-widest text-[#e9c349] font-bold">
                      非遗珍品鉴赏
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const url = `${window.location.origin}/?artworkId=${selectedArtDetail.id}`;
                          navigator.clipboard.writeText(url);
                          setShowCopiedToast(true);
                          setTimeout(() => setShowCopiedToast(false), 2000);
                        }}
                        className="text-xs p-1.5 rounded bg-surface border border-outline-variant/30 text-on-surface-variant hover:text-[#e9c349] transition-colors"
                        title="分享"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => onToggleFavorite(selectedArtDetail.id)}
                        className={`text-xs p-1.5 rounded bg-surface border transition-colors ${
                          selectedArtDetail.isFavorite
                            ? 'border-red-500/40 text-red-400 hover:bg-red-950/20'
                            : 'border-outline-variant/30 text-on-surface-variant hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${selectedArtDetail.isFavorite ? 'fill-red-400 text-red-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-serif-garamond text-2xl font-bold text-primary mt-2">
                    {selectedArtDetail.title}
                  </h3>
                  
                  <div 
                    onClick={() => {
                      setSelectedArtDetail(null);
                      setSelectedArtisanProfileName(selectedArtDetail.artist);
                    }}
                    className="mt-3 flex items-center gap-3 p-2.5 bg-surface-container-high/60 hover:bg-[#e9c349]/10 rounded-lg border border-outline-variant/15 hover:border-[#e9c349]/35 cursor-pointer transition-all group/artisan"
                    title="点击查看匠人主页"
                  >
                    <img 
                      src={getArtisanProfile(selectedArtDetail.artist).avatar} 
                      alt={selectedArtDetail.artist} 
                      className="w-9 h-9 rounded-full object-cover border border-[#e9c349]/30 shadow-inner"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-on-surface font-sans-manrope font-bold group-hover/artisan:text-[#e9c349] transition-colors">
                          {selectedArtDetail.artist}
                        </span>
                        <span className="text-[8px] font-sans-manrope px-1 rounded bg-[#e9c349]/15 text-[#e9c349]">
                          非遗匠人
                        </span>
                      </div>
                      <p className="text-[9px] text-on-surface-variant/80 font-sans-manrope truncate mt-0.5">
                        {getArtisanProfile(selectedArtDetail.artist).title}
                      </p>
                    </div>
                    <div className="text-[9px] text-secondary font-bold font-sans-manrope flex items-center gap-0.5 group-hover/artisan:translate-x-1 transition-transform">
                      <span>主页</span>
                      <span>→</span>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant mt-4 leading-relaxed bg-surface-container-high/40 p-3 rounded border border-outline-variant/10">
                    {selectedArtDetail.description}
                  </p>

                  <div className="mt-4">
                    <h4 className="text-[10px] font-sans-manrope font-semibold text-secondary uppercase tracking-widest mb-1.5">胎骨与核心工料</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedArtDetail.materials.map((mat, i) => (
                        <span key={i} className="text-[10px] font-sans-manrope bg-surface-container-highest px-2 py-0.5 rounded text-on-surface/90 border border-outline-variant/20">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-[#e9c349]/50 to-transparent flex-grow" />
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => setSelectedArtDetail(null)}
                      className="flex-1 py-2 text-center text-xs font-sans-manrope font-bold text-on-surface border border-outline-variant/50 hover:bg-surface-container-high rounded transition-all cursor-pointer"
                    >
                      返回展廊
                    </button>
                    <button 
                      onClick={() => handleLikeArtwork(selectedArtDetail.id)}
                      className="py-2 px-4 rounded text-xs font-sans-manrope font-bold bg-[#ffd700] text-black hover:bg-[#ffe24d] active:scale-95 transition-all cursor-pointer flex items-center gap-1 justify-center"
                    >
                      <Heart className="w-3.5 h-3.5 text-black" fill={selectedArtDetail.isFavorite ? 'black' : 'none'} />
                      <span>点赞 ({selectedArtDetail.likes})</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {selectedArtisanProfileName && (() => {
        const profile = getArtisanProfile(selectedArtisanProfileName);
        const isFollowed = followedArtisans[selectedArtisanProfileName] || false;
        const isSelf = userProfile && selectedArtisanProfileName && 
          selectedArtisanProfileName.trim().toLowerCase() === userProfile.nickname.trim().toLowerCase();
        
        const artisanWorks = artworks.filter(art => art.artist === selectedArtisanProfileName);

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
            onClick={() => setSelectedArtisanProfileName(null)}
          >
            <div 
              className="bg-surface-container-low max-w-2xl w-full rounded-2xl border border-[#e9c349]/40 overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#e9c349]/40 z-10"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#e9c349]/40 z-10"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#e9c349]/40 z-10"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#e9c349]/40 z-10"></div>

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

              <div className="px-6 md:px-8 pb-6 pt-0 relative flex-1 overflow-y-auto">
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
                  <div className="text-center sm:text-left flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h2 className="font-serif-garamond text-2xl font-bold text-[#e9c349]">{profile.nickname}</h2>
                      {isSelf && (
                        <span className="self-center px-2 py-0.5 text-[10px] bg-indigo-500/10 text-indigo-300 rounded font-bold border border-indigo-500/20">
                          (已登录的您自己)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-sans-manrope mt-1">
                      {profile.title}
                    </p>
                  </div>

                  {!isSelf && (
                    <button
                      onClick={() => handleFollowArtisan(selectedArtisanProfileName)}
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

                <div className="py-2.5 px-4 bg-surface-container-high/40 rounded-lg border border-outline-variant/10 text-[11px] text-on-surface-variant/90 font-sans-manrope mt-4 flex flex-col md:flex-row justify-between items-center gap-2 flex-shrink-0">
                  <span>
                    官方邮箱: <span className="text-secondary font-mono">{profile.email}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[#e9c349] font-medium scale-95 origin-right">
                    <Award className="w-3.5 h-3.5" />
                    中非遗景泰蓝联盟认证
                  </span>
                </div>

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
                          onClick={() => {
                            setSelectedArtDetail(art);
                          }}
                          className="bg-surface-container-lowest hover:bg-surface-container-high p-2 rounded-lg border border-outline-variant/15 hover:border-[#e9c349]/30 transition-all cursor-pointer group/minipic"
                        >
                          <div className="aspect-square rounded overflow-hidden bg-black/10 flex items-center justify-center relative">
                            {art.vaseShape ? (
                              <CloisonneSvg art={art} className="w-full h-full scale-90" />
                            ) : (
                              <img 
                                src={art.image} 
                                alt={art.title} 
                                className="w-full h-full object-cover transition-transform group-hover/minipic:scale-105 duration-500" 
                              />
                            )}
                          </div>
                          <h4 className="text-xs font-serif-garamond font-bold text-on-surface truncate mt-2 group-hover/minipic:text-primary transition-colors">
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

              <div className="p-4 bg-surface-container-high/40 border-t border-outline-variant/10 flex-shrink-0 text-center flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedArtisanProfileName(null)}
                  className="flex-1 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container-high text-[#e9c349] font-serif-garamond text-xs font-bold transition-all cursor-pointer"
                >
                  返回艺术长廊
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {showCopiedToast && (
        <div className="fixed top-4 right-4 bg-primary text-on-primary px-4 py-2 rounded shadow-lg z-[100] text-sm animate-in fade-in slide-in-from-top-2">
          链接已复制
        </div>
      )}

    </div>
  );
}