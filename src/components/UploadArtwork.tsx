import React, { useState, useRef } from 'react';
import { Artwork, AppScreen } from '../types';
import { 
  ArrowLeft, Upload, Sparkles, Check, Palette, 
  HelpCircle, Shield, Image as ImageIcon, Plus, Trash
} from 'lucide-react';
import CloisonneSvg from './CloisonneSvg';
import { db, cloudStorage, auth } from '../utils/cloudbase';

interface UploadArtworkProps {
  onAddNewArtwork: (newArt: Artwork) => void;
  onNavigate: (screen: AppScreen) => void;
  currentUser: string;
}

export default function UploadArtwork({
  onAddNewArtwork,
  onNavigate,
  currentUser,
}: UploadArtworkProps) {
  // Navigation helper
  const handleBack = () => {
    onNavigate('community');
  };

  // Form Fields
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState(currentUser || '大国工匠');
  const [description, setDescription] = useState('');
  const [uploadType, setUploadType] = useState<'image' | 'custom_svg'>('image');
  const [loading, setLoading] = useState(false);

  // Multi-select Fields
  const [selectedTags, setSelectedTags] = useState<string[]>(['掐丝', '传世珍宝']);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['紫铜胎', '手描金线', '青金石釉料']);

  // Custom SVG properties state
  const [vaseShape, setVaseShape] = useState<'celestial' | 'gourd' | 'basin'>('celestial');
  const [baseBody, setBaseBody] = useState<'copper' | 'silver' | 'gold'>('copper');
  const [filigree, setFiligree] = useState<'gold' | 'silver'>('gold');
  const [pattern, setPattern] = useState<'lotus' | 'phoenix' | 'dragon'>('lotus');
  const [zoneColors, setZoneColors] = useState<{ top: string; middle: string; bottom: string }>({
    top: '#1152a3',
    middle: '#0d6273',
    bottom: '#0f4a31',
  });

  // Image upload properties state
  const [imageUrl, setImageUrl] = useState('');
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableTags = ['掐丝', '点蓝', '珐琅彩', '窑烧', '宫廷珍藏', '传世珍宝', '新秀匠造', '皇家御窑', '禅意中式'];
  const availableMaterials = [
    '紫铜胎', '五金精錾', '纯银胎', '黄金镀面', '手描金线', '纯银丝扣', 
    '青金石釉料', '孔雀石料', '珊瑚红砂釉', '玛瑙研磨彩', '砗磲末亮粉'
  ];

  const presetImages = [
    {
      name: '万寿繁花如意尊',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-Ol44CDPyaZRvMVBpo7hM_eudPy5BbY06tr_4qhlzxbppYmHtoxeyfIkUQLblR-01QVHt9oIeNJsZ-CsZjFgZznvJW-0ZugAQ6KbSohuMDFIo1As_QWc-i1BdUN0Nz9EcKGeJA-A_h8aQLuSzFkjKiBnqXcscKLJpmdkanH7v9qkcB03DcwDsU_MguXpvABn1ckdV6ryjxhTuvRYkFZgCh0RV7iEyFVRCuVNRYK7g9XqRYDpy8jrtne_z82sHBJZt9cRmMw7xboQ',
    },
    {
      name: '九龙夺魁宫廷盘',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLZLlFQVRIGeYDlDqKubd0QoSOhZY1Uy5mXVc_w6gdJg-8JPhya87HgceDiBRCDUZJkNJBPljaEq9-DEtPRWGlW8sjM3GETsXp4KXQ72uwMgwYixpimtbbHfP6pLZ4sJrVgZwz5MJ-vM-q2Sjs4jWG29Qa8GnPeiYygDI9ODu-mrzDmRVo1WaFGJYyT9CyoVUpc3eTm5tAq8I1aqtLV9ZvaZ9GDeF3ryWPSNuB7QqcqutYGrMflio-mWIxI4v9IDsUPRJMnXmnE2U',
    },
    {
      name: '御用翠羽描丝尊',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCqybxNWgIk_xz_fe2E9CWN7Deuze3q1KsbhQogs_7L-KNK9SsuqLUlpiDyBPr-p0-aOPWDPHf_pT8_4PmO91oZu7wHvbojqW_1qO2e5PjZEnZnAT4Lik_IL0m5uB8P2ip7k-SsIUu7AIh2EaJOs4qwq-WlR7no_vGhVvaxXQaghpu0F_u43woi_kPMyPDzgdUqzbnm3ImyDyvx8x7MTQxHrb0Tvnw8Tnadxg0Br0OzdJAK45YXATvConeteX9gRE5V1nSqRfYHaM',
    },
    {
      name: '莲子清逸白玉盘',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdiFsXLgAkjAMQ6FrqSum_S6xuXDHYo6KOXCkSOLiuBw6dleY0z17UPG2xeIlLT5UQPBcIf5ekvim4cUHgjYCW6kAzNOu65hySgN0gdgm3ntn55-5vhBhFKuCmc7isiNRK-D8XP7lfrqzTJd9Iq4Et9ROzMoi2Dxj-8sAYm84usu9Icw4-GTCL1u3tKfBiacm8nl7EeeAl9X_QF7qNVTvKBrhKTcPL6AVW5tIVYBBv3jYDZQGouWVm1V39dHsepRz9iO1negnUY6Y',
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImageBase64(reader.result as string);
        setImageUrl(''); // Clear preset selection URL
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
        setCustomImageBase64(reader.result as string);
        setImageUrl('');
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleMaterial = (mat: string) => {
    setSelectedMaterials(prev => 
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    );
  };

  // base64转File
  const dataURLtoFile = (dataUrl: string, filename: string) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // 云端发布
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert('请先登录！');
      return;
    }
    if (!title.trim()) {
      alert('请为新生景泰蓝珍品命名！');
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      let finalImage = '';
      if (uploadType === 'image') {
        if (customImageBase64) {
          const file = dataURLtoFile(customImageBase64, `artwork-${Date.now()}.png`);
          const cloudPath = `artworks/${user.uid}/${Date.now()}.png`;
          const uploadRes = await storage.uploadFile({ cloudPath, fileContent: file });
          finalImage = uploadRes.fileID;
        } else {
          finalImage = imageUrl || presetImages[0].url;
        }
      }

      const newArtwork: any = {
        title: title.trim(),
        artist: artist.trim() || '大国工匠',
        tags: selectedTags.length > 0 ? selectedTags : ['新生名作'],
        image: finalImage,
        description: description.trim() || '工坊新秀悉心所造景泰蓝新生珍宝。掐丝流畅严密，历经反复点蓝窑烧、见光现润，大巧大雅。',
        materials: selectedMaterials.length > 0 ? selectedMaterials : ['紫铜胎体', '手工金丝'],
        status: 'completed',
        likes: 1,
        isFavorite: false,
        isPublished: true,
        uid: user.uid,
        createdAt: db.serverDate(),
        ...(uploadType === 'custom_svg' ? {
          vaseShape,
          baseBody,
          filigree,
          pattern,
          zoneColors
        } : {})
      };

      await db.collection('artworks').add(newArtwork);
      onAddNewArtwork(newArtwork);
      onNavigate('community');
      alert('珍品成功存入云端典藏！');
    } catch (err) {
      console.error(err);
      alert('上传失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 w-full animate-fade-in relative z-20">
      
      {/* Upper Navigation Header bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/20">
        <button
          onClick={handleBack}
          className="group flex items-center gap-2 font-sans-manrope text-xs font-extrabold uppercase tracking-widest text-[#e9c349] hover:text-[#ffea9d] transition-colors cursor-pointer bg-surface-container-high/50 px-4 py-2 rounded-lg border border-outline-variant/30"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>返回社区典藏</span>
        </button>

        <div className="text-right hidden md:block">
          <p className="font-sans-manrope text-[10px] uppercase tracking-wider text-secondary font-bold">造物法则 · 新生录入</p>
          <p className="font-serif-garamond text-xs text-on-surface-variant font-medium">“匠心点蓝，泥金千度”</p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Previews based on Selected Modes */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <div className="bg-surface-container rounded-2xl border border-outline-variant/30 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[420px] group transition-all duration-300 hover:border-[#e9c349]/30">
            {/* Fine texture & gold border style decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e9c349] to-transparent opacity-60"></div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="font-sans-manrope text-[11px] font-bold text-secondary uppercase bg-secondary-container px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#e9c349] animate-pulse" />
                <span>实时神韵 preview</span>
              </span>
              <span className="font-sans-manrope text-[10px] font-medium text-on-surface-variant italic">
                {uploadType === 'custom_svg' ? '数字矢量模拟' : '匠心写照影像'}
              </span>
            </div>

            {/* Preview Box Wrapper */}
            <div className="flex-grow flex items-center justify-center p-4 bg-black/40 rounded-xl border border-outline-variant/10 aspect-square relative group-hover:scale-[1.01] transition-transform duration-300">
              
              {uploadType === 'custom_svg' ? (
                /* Renders CloisonneSvg vector client component */
                <CloisonneSvg 
                  art={{
                    id: 'temp-preview',
                    title: title || '未命名新生珍品',
                    artist: artist || '大国工匠',
                    tags: selectedTags,
                    image: '',
                    description: description,
                    materials: selectedMaterials,
                    status: 'completed',
                    likes: 0,
                    isFavorite: false,
                    vaseShape,
                    baseBody,
                    filigree,
                    pattern,
                    zoneColors
                  }} 
                  className="w-full h-full max-w-[280px] drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                />
              ) : (
                /* Standard Image Presentation */
                <>
                  {customImageBase64 ? (
                    <img 
                      src={customImageBase64} 
                      alt="uploaded custom visual preview" 
                      className="max-h-[300px] max-w-full object-contain rounded-lg shadow-lg"
                      referrerPolicy="no-referrer"
                    />
                  ) : imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="uploaded web pattern template" 
                      className="max-h-[300px] max-w-full object-contain rounded-lg shadow-lg"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-center p-6 flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-surface-container-high/60 flex items-center justify-center text-outline-variant">
                        <ImageIcon className="w-8 h-8 text-[#e9c349]/70" />
                      </div>
                      <p className="font-serif-garamond text-sm text-on-surface-variant font-medium">请于右侧直接上传图片或输入图样链接</p>
                      <p className="font-sans-manrope text-[10px] text-outline-variant/70">（支持JPG、PNG、GIF、WEBP）</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Quick descriptive footer */}
            <div className="mt-4 pt-3 border-t border-outline-variant/10 text-center">
              <p className="font-serif-garamond text-lg font-semibold text-primary">{title || '未命名新生珍品'}</p>
              <p className="font-sans-manrope text-[10px] text-on-surface-variant font-bold mt-1">
                匠人：<span className="text-secondary">{artist || '大国工匠'}</span>
              </p>
            </div>
          </div>

          {/* Guidelines info card to ensure perfect design context */}
          <div className="bg-surface-container-low/50 rounded-xl border border-outline-variant/10 p-5 font-sans-manrope text-xs leading-relaxed text-on-surface-variant flex gap-3">
            <HelpCircle className="w-5 h-5 text-[#e9c349] shrink-0" />
            <div>
              <p className="font-bold text-on-surface mb-1">典藏库录入法则</p>
              <p className="opacity-80">新生景泰蓝需符合“千锤打胎，纯手工掐丝，点蓝数染，百窑焙火”之神髓。数字发布后将陈列在公共典藏长廊中展现，吸引海内外的国粹爱好者瞩目和赏识。</p>
            </div>
          </div>
        </div>

        {/* Right Column: Complete Interactive Upload Form */}
        <div className="lg:col-span-7 bg-surface-container rounded-2xl border border-outline-variant/30 p-8 shadow-xl">
          <h2 className="font-serif-garamond text-2xl font-bold text-[#e9c349] mb-1">发布新生景泰蓝珍品</h2>
          <p className="font-sans-manrope text-xs text-on-surface-variant mb-6">填入该旷世名作的精细规格，将其永存进“景泰蓝数智非遗典藏库”之中。</p>

          <form onSubmit={handlePublish} className="flex flex-col gap-6">
            
            {/* Part 1: Basic Information */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs uppercase font-sans-manrope font-bold tracking-widest text-[#e9c349] flex items-center gap-1.5 border-b border-outline-variant/10 pb-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>1. 基本信息描述</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name title */}
                <div className="flex flex-col gap-2">
                  <label className="font-sans-manrope text-xs font-bold text-on-surface">
                    珍品命名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例如：万千气象金线御尊"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-surface-container-low border border-outline-variant/50 hover:border-primary/50 focus:border-[#e9c349] rounded-lg px-4 py-2.5 text-xs text-on-surface placeholder:text-outline-variant/40 outline-none transition-all duration-200"
                  />
                </div>

                {/* Artist signature */}
                <div className="flex flex-col gap-2">
                  <label className="font-sans-manrope text-xs font-bold text-on-surface">
                    匠人署名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="您的名讳"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="bg-surface-container-low border border-outline-variant/50 hover:border-primary/50 focus:border-[#e9c349] rounded-lg px-4 py-2.5 text-xs text-on-surface placeholder:text-outline-variant/40 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Detailed introduction description */}
              <div className="flex flex-col gap-2">
                <label className="font-sans-manrope text-xs font-bold text-on-surface flex justify-between items-center">
                  <span>工艺详析与造物心得</span>
                  <span className="text-[10px] text-outline-variant font-medium">（推荐字数：30 - 200字）</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="可描述胎骨的錾刻厚重、掐丝起伏设计理念、天然釉色叠色渲染的美好意象，以及窑变后的宝石光影..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/50 hover:border-primary/50 focus:border-[#e9c349] rounded-lg px-4 py-3 text-xs text-on-surface placeholder:text-outline-variant/40 outline-none transition-all duration-200 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Part 2: Image Selection Strategy */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs uppercase font-sans-manrope font-bold tracking-widest text-[#e9c349] flex items-center gap-1.5 border-b border-outline-variant/10 pb-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>2. 选定成品图样/写照</span>
              </h3>

              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
                <button
                  type="button"
                  onClick={() => setUploadType('image')}
                  className={`flex items-center justify-center gap-1.5 font-sans-manrope text-xs font-bold py-2 px-3 rounded-lg transition-all cursor-pointer ${
                    uploadType === 'image'
                      ? 'bg-[#ffd700] text-black shadow-md'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>自主上传/图片录入</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('custom_svg')}
                  className={`flex items-center justify-center gap-1.5 font-sans-manrope text-xs font-bold py-2 px-3 rounded-lg transition-all cursor-pointer ${
                    uploadType === 'custom_svg'
                      ? 'bg-[#ffd700] text-black shadow-md'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>数字掐丝胎型设计</span>
                </button>
              </div>

              {uploadType === 'image' ? (
                /* Traditional Image Upload and Presets Form Screen */
                <div className="flex flex-col gap-4">
                  
                  {/* File selection + drag zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                      isDragging 
                        ? 'border-[#e9c349] bg-[#e9c349]/10' 
                        : 'border-outline-variant/40 hover:border-[#e9c349]/50 bg-surface-container-low/80 hover:bg-surface-container-low'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <div className="w-12 h-12 rounded-full bg-[#e9c349]/10 flex items-center justify-center text-[#e9c349]">
                      <Upload className="w-6 h-6 animate-pulse" />
                    </div>

                    <p className="font-serif-garamond text-sm font-semibold text-on-surface">
                      {customImageBase64 ? '已上传自选图案 (点击更换)' : '拖拽图片或点击此处上传名作照片'}
                    </p>
                    <p className="font-sans-manrope text-[10px] text-on-surface-variant/70">
                      支持标准格式，图像将经过无损自适应缩放以完美嵌入典藏榜
                    </p>

                    {customImageBase64 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCustomImageBase64(null);
                        }}
                        className="mt-2 text-xs font-bold text-red-500 hover:text-red-400 bg-red-500/10 px-3 py-1 rounded-md transition-colors"
                      >
                        清空已上传
                      </button>
                    )}
                  </div>

                  {/* Inline External URL Input */}
                  <div className="flex flex-col gap-1.5 mt-1">
                    <label className="font-sans-manrope text-[10px] font-bold text-on-surface-variant">
                      外部点蓝设计图 URL 链接 (可填)
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/enamel-treasure.png"
                      value={imageUrl}
                      disabled={!!customImageBase64}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-xs text-on-surface placeholder:text-outline-variant/40 outline-none focus:border-[#e9c349]"
                    />
                  </div>

                  {/* 【补回丢失区块：预设样图选择】 */}
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="font-sans-manrope text-xs font-bold text-on-surface">快速选用典藏参考样稿：</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {presetImages.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setImageUrl(item.url);
                            setCustomImageBase64(null);
                          }}
                          className={`p-2 rounded-lg border text-[10px] truncate ${
                            imageUrl === item.url
                              ? 'border-[#e9c349] bg-[#e9c349]/10'
                              : 'border-outline-variant/30 hover:border-[#e9c349]/40'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                /* Digitally simulated interactive design blueprint customization */
                <div className="bg-surface-container-low border border-outline-variant/30 p-4 rounded-xl flex flex-col gap-4">
                  
                  {/* Vase Shape Choice */}
                  <div className="flex flex-col gap-2">
                    <p className="font-sans-manrope text-xs font-bold text-on-surface">选择胎型尊器形:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'celestial', name: '天球尊大瓶' },
                        { id: 'gourd', name: '万寿大葫芦' },
                        { id: 'basin', name: '宣德福寿尊洗' }
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setVaseShape(s.id as any)}
                          className={`font-sans-manrope text-xs py-1.5 px-2.5 rounded-lg border transition-all font-bold cursor-pointer ${
                            vaseShape === s.id
                              ? 'bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]'
                              : 'border-outline-variant/20 hover:border-[#ffd700]/40 text-on-surface-variant'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Metal Core Base */}
                    <div className="flex flex-col gap-1.5">
                      <p className="font-sans-manrope text-xs font-bold text-on-surface">铜胎合金底:</p>
                      <select
                        value={baseBody}
                        onChange={(e) => setBaseBody(e.target.value as any)}
                        className="bg-surface-container-high border border-outline-variant/50 rounded-lg py-1.5 px-3 text-xs text-on-surface focus:border-[#e9c349] outline-none"
                      >
                        <option value="copper">复古精紫红铜</option>
                        <option value="silver">宫廷冷月纯银</option>
                        <option value="gold">九天宣德金身</option>
                      </select>
                    </div>

                    {/* Gold wire choice */}
                    <div className="flex flex-col gap-1.5">
                      <p className="font-sans-manrope text-xs font-bold text-on-surface">掐丝金丝材质:</p>
                      <select
                        value={filigree}
                        onChange={(e) => setFiligree(e.target.value as any)}
                        className="bg-surface-container-high border border-outline-variant/50 rounded-lg py-1.5 px-3 text-xs text-on-surface focus:border-[#e9c349] outline-none"
                      >
                        <option value="gold">御用八成描金粗丝</option>
                        <option value="silver">雪落素银熟白丝</option>
                      </select>
                    </div>
                  </div>

                  {/* Traditional design pattern stamp overlay */}
                  <div className="flex flex-col gap-2">
                    <p className="font-sans-manrope text-xs font-bold text-on-surface">传统辅助掐丝纹样:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'lotus', name: '唐草宝相华莲' },
                        { id: 'phoenix', name: '九天凤翥九霄' },
                        { id: 'dragon', name: '万历云龙捧寿' }
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPattern(p.id as any)}
                          className={`font-sans-manrope text-[10px] py-1.5 px-2.5 rounded-lg border transition-all font-bold cursor-pointer ${
                            pattern === p.id
                              ? 'bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]'
                              : 'border-outline-variant/20 hover:border-[#ffd700]/40 text-on-surface-variant'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color zones picking */}
                  <div className="flex flex-col gap-2">
                    <p className="font-sans-manrope text-xs font-bold text-on-surface">渐变宝光分段点蓝 (釉色配比):</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-sans-manrope text-[9px] text-on-surface-variant text-center">瓶口点蓝</span>
                        <div className="flex items-center gap-1.5 justify-center">
                          <input 
                            type="color" 
                            value={zoneColors.top} 
                            onChange={(e) => setZoneColors(prev => ({ ...prev, top: e.target.value }))}
                            className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                          />
                          <span className="font-mono text-[9px] text-outline-variant uppercase">{zoneColors.top}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-sans-manrope text-[9px] text-on-surface-variant text-center">腹尊点蓝</span>
                        <div className="flex items-center gap-1.5 justify-center">
                          <input 
                            type="color" 
                            value={zoneColors.middle} 
                            onChange={(e) => setZoneColors(prev => ({ ...prev, middle: e.target.value }))}
                            className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                          />
                          <span className="font-mono text-[9px] text-outline-variant uppercase">{zoneColors.middle}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-sans-manrope text-[9px] text-on-surface-variant text-center">底部点蓝</span>
                        <div className="flex items-center gap-1.5 justify-center">
                          <input 
                            type="color" 
                            value={zoneColors.bottom} 
                            onChange={(e) => setZoneColors(prev => ({ ...prev, bottom: e.target.value }))}
                            className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                          />
                          <span className="font-mono text-[9px] text-outline-variant uppercase">{zoneColors.bottom}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Part 3: Multiple Tag Items Selectors */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs uppercase font-sans-manrope font-bold tracking-widest text-[#e9c349] flex items-center gap-1.5 border-b border-outline-variant/10 pb-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>3. 研选工艺特征与精工原料</span>
              </h3>

              {/* Tag Selection */}
              <div className="flex flex-col gap-2">
                <span className="font-sans-manrope text-xs font-bold text-on-surface">选择分类标签 / 主题:</span>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`font-sans-manrope text-[10px] font-extrabold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-secondary/20 text-secondary border-secondary'
                            : 'border-outline-variant/20 hover:border-outline-variant/50 text-on-surface-variant'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-secondary stroke-[3]" />}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Materials Selection */}
              <div className="flex flex-col gap-2">
                <span className="font-sans-manrope text-xs font-bold text-on-surface">选配贵金属、彩矿釉料:</span>
                <div className="flex flex-wrap gap-1.5">
                  {availableMaterials.map((mat) => {
                    const isSelected = selectedMaterials.includes(mat);
                    return (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => toggleMaterial(mat)}
                        className={`font-sans-manrope text-[10px] px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-primary/20 text-primary border-primary font-bold'
                            : 'border-outline-variant/20 hover:border-outline-variant/50 text-on-surface-variant'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-primary stroke-[3]" />}
                        <span>{mat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Publish & Reset CTA triggers */}
            <div className="flex justify-end items-center gap-4 border-t border-outline-variant/20 pt-6 mt-2">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="font-sans-manrope text-xs font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                取消发布
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 font-sans-manrope text-xs font-extrabold bg-gradient-to-r from-[#ffd700] to-[#ffd700] hover:from-[#ffe24d] hover:to-[#ffd700] text-black px-8 py-3 rounded-xl transition-all shadow-md cursor-pointer hover-lift font-extrabold shadow-yellow-500/10 hover:shadow-yellow-500/20"
              >
                <Sparkles className="w-4 h-4 text-black animate-spin-slow" />
                <span>{loading ? '正在存入典藏...' : '载入典藏画轴 · 正式录入'}</span>
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}