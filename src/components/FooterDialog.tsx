import React from 'react';
import { X, BookOpen, Hammer, Award, Shield, Compass, Sparkles } from 'lucide-react';

export type FooterTabType = 'philosophy' | 'techniques' | 'heritage' | 'privacy';

interface FooterDialogProps {
  isOpen: boolean;
  activeTab: FooterTabType;
  onClose: () => void;
  onTabChange: (tab: FooterTabType) => void;
}

export default function FooterDialog({ isOpen, activeTab, onClose, onTabChange }: FooterDialogProps) {
  if (!isOpen) return null;

  const tabs = [
    { id: 'philosophy' as FooterTabType, label: '工艺哲学', icon: Compass, subtitle: '天人合一 · 金石珐琅' },
    { id: 'techniques' as FooterTabType, label: '制作技法', icon: Hammer, subtitle: '五彩斑斓 · 百炼金华' },
    { id: 'heritage' as FooterTabType, label: '非遗保护传承', icon: Award, subtitle: '薪火相传 · 国宝守护' },
    { id: 'privacy' as FooterTabType, label: '隐私条款', icon: Shield, subtitle: '匠心守护 · 隐私安全' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Box Container */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#fdfaf2] text-[#2c1d11] rounded-2xl shadow-2xl border-2 border-[#b58b4c]/40 flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top imperial styled bar decoration */}
        <div className="h-2 bg-gradient-to-r from-[#8a1c14] via-[#c28e2b] to-[#8a1c14]" />
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#b58b4c]/20 flex items-center justify-between bg-[#fbf6ea]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8a1c14]/10 flex items-center justify-center border border-[#8a1c14]/20">
              <Sparkles className="w-5 h-5 text-[#8a1c14]" />
            </div>
            <div>
              <h2 className="font-serif-garamond text-xl font-extrabold text-[#8a1c14] tracking-wider">景泰蓝非遗学术典藏阁</h2>
              <p className="text-[10px] text-[#6b5035] font-sans-manrope uppercase tracking-widest mt-0.5">Cloisonné Academic & Heritage Archives</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#8a1c14]/10 text-[#6b5035] hover:text-[#8a1c14] transition-colors cursor-pointer"
            aria-label="关闭窗口"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Layout */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden min-h-[50vh]">
          
          {/* Left Sidebar Menu */}
          <div className="w-full md:w-64 bg-[#f9f2e3] border-b md:border-b-0 md:border-r border-[#b58b4c]/20 p-4 grid grid-cols-2 md:grid-cols-1 gap-2 overflow-y-auto shrink-0 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col md:flex-row items-center md:items-start gap-2.5 md:gap-3 p-3 rounded-xl border text-center md:text-left transition-all w-full cursor-pointer ${
                    isActive 
                      ? 'bg-[#8a1c14] text-white border-transparent shadow-md transform scale-[1.02]' 
                      : 'bg-[#f6eee0] hover:bg-[#ebdcb9] border-[#b58b4c]/15 text-[#543b1f]'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isActive ? 'text-[#ebdcb9]' : 'text-[#8a1c14]'}`} />
                  <div className="overflow-hidden">
                    <span className="block text-xs md:text-sm font-extrabold font-serif-garamond truncate leading-tight">{tab.label}</span>
                    <span className={`hidden md:block text-[9px] mt-0.5 ${isActive ? 'text-white/80' : 'text-[#856543]'}`}>{tab.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Content View Area */}
          <div className="flex-grow overflow-y-auto p-6 md:p-8 bg-[#fdfaf2] text-[#3c2a1a] font-serif-literata text-sm leading-relaxed scroll-smooth">
            
            {/* Tab: Philosophy */}
            {activeTab === 'philosophy' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="border-b border-[#b58b4c]/30 pb-3">
                  <h3 className="text-xl md:text-2xl font-extrabold text-[#8a1c14] font-serif-garamond">天人合德 · 金石与珐琅的淬炼哲学</h3>
                  <p className="text-[11px] text-[#856543] font-sans-manrope uppercase tracking-widest mt-1">Cosmic Harmony: The Alchemy of Metal and Glass</p>
                </div>
                
                <p className="text-justify leading-loose">
                  景泰蓝（铜胎掐丝珐琅）不仅是一门繁复绝伦的宫廷手造器物，更是一门体现东方<strong>“天人合一”</strong>与<strong>“阴阳融合”</strong>精神的造物哲学。它巧妙地以质地温厚、延展性极佳的红铜作为五行之“金”胎体，配以五彩天然矿物（玛瑙、石英、长石、云母等）研磨而成的釉料作为“水”与“木”的流溢，并利用红木木炭熊熊烈火的“火”之千度淬炼，历经重重蜕变，终化为金碧莹润、光色夺目的传世巨作。
                </p>

                <div className="bg-[#f6eee0] border-l-4 border-[#8a1c14] p-4 rounded-r-lg shadow-sm font-sans-manrope">
                  <blockquote className="italic text-[#5e4125] font-medium">
                    “金石之坚，经火而不毁；色釉之温，入水亦不蠹。两者合度，大匠至臻。”
                  </blockquote>
                  <p className="text-[11px] text-[#856543] text-right mt-1.5">— 《考工记》哲学意蕴引伸</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-base font-extrabold text-[#8a1c14] font-serif-garamond border-b border-dashed border-[#b58b4c]/30 pb-1">
                    三大核心造物原则
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <li className="bg-[#fbf6ea] p-4 rounded-xl border border-[#b58b4c]/15">
                      <strong className="block text-[#8a1c14] text-xs font-bold mb-1">【器以载道】</strong>
                      <span className="text-xs text-[#5e4125]">器物的每一次敲击、每一根掐金线的丝丝相护，都有其寓意。忍冬繁衍、宝相尊贵、西番富贵，将自然万物之律理，融于精铜方寸。</span>
                    </li>
                    <li className="bg-[#fbf6ea] p-4 rounded-xl border border-[#b58b4c]/15">
                      <strong className="block text-[#8a1c14] text-xs font-bold mb-1">【人工与天成】</strong>
                      <span className="text-xs text-[#5e4125]">虽由人作，宛自天开。极致的人工掐丝规整，必须与极难预测的多次窑烧“火之洗礼”相磨合，唯有大匠方能完美驾驭熔隔、流溢与气孔。</span>
                    </li>
                    <li className="bg-[#fbf6ea] p-4 rounded-xl border border-[#b58b4c]/15">
                      <strong className="block text-[#8a1c14] text-xs font-bold mb-1">【莹润包浆】</strong>
                      <span className="text-xs text-[#5e4125]">非金非石，胜似玉石。好的景泰蓝绝不追求世俗的浮华反光，而通过反复磨砂和椴木最终抛光，展现如璞玉般温和内敛、厚实宝光的包浆美。</span>
                    </li>
                    <li className="bg-[#fbf6ea] p-4 rounded-xl border border-[#b58b4c]/15">
                      <strong className="block text-[#8a1c14] text-xs font-bold mb-1">【流光溢彩】</strong>
                      <span className="text-xs text-[#5e4125]">蓝面与金丝，是黑夜与星空的写照。在深翠、孔雀绿、霁蓝中，以金线勾框，实现了华美与庄重的极点。</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Techniques */}
            {activeTab === 'techniques' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="border-b border-[#b58b4c]/30 pb-3">
                  <h3 className="text-xl md:text-2xl font-extrabold text-[#8a1c14] font-serif-garamond">五彩耀光 · 皇家景泰蓝经典五部法</h3>
                  <p className="text-[11px] text-[#856543] font-sans-manrope uppercase tracking-widest mt-1">The Grand Quintuplet Craftsmanship System</p>
                </div>

                <p className="text-justify leading-loose">
                  真正的景泰蓝需要经历无数道工序，其中最为关键、在数字工坊高度还原的即为以下五大核心技法。每一道步骤都是对匠人耐性、精细度、力道以及审美的极限磨练。
                </p>

                <div className="space-y-5">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-[#fbf6ea] border border-[#b58b4c]/20 hover:border-[#8a1c14]/30 transition-all">
                    <span className="w-8 h-8 rounded-full bg-[#8a1c14] text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                    <div>
                      <h4 className="font-extrabold text-[#8a1c14] text-sm md:text-base">制胎 (Vessel Handcrafting)</h4>
                      <p className="text-xs text-[#5e4125] mt-1">
                        精铜捶打，千锤万击。选用延展性优良的紫金或纯铜，通过无数次冷推、热煅、反复敲击，使金属胎壁薄厚一律，器形稳重挺拔、大器端庄。这也是整个珐琅器的身骨骨骼，厚重不倒。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-[#fbf6ea] border border-[#b58b4c]/20 hover:border-[#8a1c14]/30 transition-all">
                    <span className="w-8 h-8 rounded-full bg-[#8a1c14] text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                    <div>
                      <h4 className="font-extrabold text-[#8a1c14] text-sm md:text-base">手绘掐丝 (Filigree Tracing & Coiling)</h4>
                      <p className="text-xs text-[#5e4125] mt-1">
                        以金为意，以丝为线。大匠用极细的金扁丝或纯银白丝，通过徒手用小镊子对丝盘扭，剪断、弯折，勾画出忍冬纹、宝相花等极其精微而瑰丽的图案轮廓。接着用白芨糊或焊剂将其牢固粘附或烧结在铜胎上，奠定画面灵魂。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-[#fbf6ea] border border-[#b58b4c]/20 hover:border-[#8a1c14]/30 transition-all">
                    <span className="w-8 h-8 rounded-full bg-[#8a1c14] text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                    <div>
                      <h4 className="font-extrabold text-[#8a1c14] text-sm md:text-base">精细点蓝 (Glaze Painting / Enameling)</h4>
                      <p className="text-xs text-[#5e4125] mt-1">
                        研玛瑙为砂，调五彩飞虹。点蓝人手持吸管或铲刀，在微小的掐丝铜格和空隙中，逐一填充孔雀石最翠红、青金石亮蓝、珊瑚红、石英等研磨成的天然色釉浆料。此过程绝非平涂，而是采用多色层叠渐变填塞，以成就窑变后色深多变的通透感。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-[#fbf6ea] border border-[#b58b4c]/20 hover:border-[#8a1c14]/30 transition-all">
                    <span className="w-8 h-8 rounded-full bg-[#8a1c14] text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
                    <div>
                      <h4 className="font-extrabold text-[#8a1c14] text-sm md:text-base">焙火窑烧 (Kiln Baking & Melting)</h4>
                      <p className="text-xs text-[#5e4125] mt-1">
                        炉火熔融合璧，七彩凝固成玉。将点蓝好的器物推入最高700-900摄氏度的高温炉中进行多轮烧结。矿物釉料在此温度下融化为流体，冷却后化为闪闪发亮的珐琅晶体。由于烧结后体积收缩，往往需要重复点蓝及烧制等工艺累加，直至浆体与丝高完全平齐。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-[#fbf6ea] border border-[#b58b4c]/20 hover:border-[#8a1c14]/30 transition-all">
                    <span className="w-8 h-8 rounded-full bg-[#8a1c14] text-white flex items-center justify-center font-bold text-xs shrink-0">5</span>
                    <div>
                      <h4 className="font-extrabold text-[#8a1c14] text-sm md:text-base">细擦磨光 (Polishing / Finishing)</h4>
                      <p className="text-xs text-[#5e4125] mt-1">
                        粗砂除渣，椴木取泽。通过粗金刚砂初步压平、特细黑碳石对蓝面进行温润研磨，直至掐丝的金丝、银丝光芒熠熠显露，与蓝底齐平。最后用上等椴木细心揉搓，直至器身显出清莹饱满之皇家宝光状态。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Heritage */}
            {activeTab === 'heritage' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="border-b border-[#b58b4c]/30 pb-3">
                  <h3 className="text-xl md:text-2xl font-extrabold text-[#8a1c14] font-serif-garamond">薪火护持 · 景泰蓝非物质文化遗产保护</h3>
                  <p className="text-[11px] text-[#856543] font-sans-manrope uppercase tracking-widest mt-1">Preservation of Intangible Cultural Heritage: Handing Down the Torch</p>
                </div>

                <div className="relative overflow-hidden group rounded-xl border border-[#b58b4c]/20 shadow-sm bg-[#fbf6ea] p-5">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#8a1c14]/5 rounded-bl-full flex items-center justify-center">
                    <Award className="w-10 h-10 text-[#8a1c14] opacity-25" />
                  </div>
                  <h4 className="text-base font-extrabold text-[#8a1c14] mb-2 font-serif-garamond flex items-center gap-1.5">
                    国家级非遗名师专志
                  </h4>
                  <ul className="text-xs space-y-2 text-[#5e4125] leading-relaxed">
                    <li>• <strong>首批保护项目</strong>: 2006年5月20日被列入中华人民共和国第一批《国家级非物质文化遗产名录》（编号：VIII-96，铜胎掐丝珐琅）。</li>
                    <li>• <strong>北京工艺“八绝”之冠</strong>: 作为明清两代皇家造办处专属奇珍，其工艺精微、用料繁复、金石重彩，具有崇高无上的古典工艺美学价值。</li>
                    <li>• <strong>非遗新锐与数智救赎</strong>: 精妙的手脑协调磨练正面临严峻的老龄传承危机。此数字工坊旨在打破时间阻隔，在指尖让万千青年匠人了解底蕴。</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-base font-extrabold text-[#8a1c14] font-serif-garamond">
                    经典纹样在数字工坊的极致复原
                  </h4>
                  <p className="text-xs text-[#5e4125] leading-loose">
                    我们严密学术参考了前人留存的珍贵图录（如 <em>《中国工艺珍藏图典·珐琅篇》</em>），通过精密矢量几何算法在工坊掐丝阶段完美还原了极其高频、极具史学价值的四大经典皇家纹理：
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#fbf6ea] rounded-xl border border-[#b58b4c]/15 hover:shadow-md transition-all">
                      <strong className="block text-sm text-[#8a1c14] font-serif-garamond mb-1">魏晋六朝 · 忍冬纹 (Honeysuckle Scroll)</strong>
                      <span className="text-xs text-[#5e4125] block">
                        蔓草连缀、曼妙舒展。忍冬（金银花）凌冬不凋，其波状卷草叶瓣表达了生生不息、坚忍吉庆的生命之德。
                      </span>
                    </div>

                    <div className="p-4 bg-[#fbf6ea] rounded-xl border border-[#b58b4c]/15 hover:shadow-md transition-all">
                      <strong className="block text-sm text-[#8a1c14] font-serif-garamond mb-1">盛唐风范 · 宝相花纹 (Baoxiang Rosette)</strong>
                      <span className="text-xs text-[#5e4125] block">
                        宝相庄严、融和唯美。将莲花、牡丹、菊花等多重花叶的经典局部集腋成裘，形成繁缛富丽、宛如天宫曼陀罗的饱满祥瑞花团。
                      </span>
                    </div>

                    <div className="p-4 bg-[#fbf6ea] rounded-xl border border-[#b58b4c]/15 hover:shadow-md transition-all">
                      <strong className="block text-sm text-[#8a1c14] font-serif-garamond mb-1">明清御苑 · 西番莲纹 (Acanthus / Clematis)</strong>
                      <span className="text-xs text-[#5e4125] block">
                        西洋番草、卷裹连绵。融合了丝绸之路而来的莨苕叶、忍冬与番莲造型，勾金线立体盘错，深受康乾宫廷造物主的倾心。
                      </span>
                    </div>

                    <div className="p-4 bg-[#fbf6ea] rounded-xl border border-[#b58b4c]/15 hover:shadow-md transition-all">
                      <strong className="block text-sm text-[#8a1c14] font-serif-garamond mb-1">传统古典 · 缠枝华纹 (Scrolling Foliage)</strong>
                      <span className="text-xs text-[#5e4125] block">
                        生机永驻，绵长祥瑞。藤萝枝条左右委婉、环向流连，将多蒂莲蕾点缀其间，代表了瓜瓿延绵、生机长青不灭。
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Privacy */}
            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="border-b border-[#b58b4c]/30 pb-3">
                  <h3 className="text-xl md:text-2xl font-extrabold text-[#8a1c14] font-serif-garamond">匠心恪守 · 景泰蓝数字化工坊隐私权及服务条款</h3>
                  <p className="text-[11px] text-[#856543] font-sans-manrope uppercase tracking-widest mt-1">Digital Craft Ethos: Privacy & Data Safeguarding Policy</p>
                </div>

                <div className="text-xs space-y-4 text-[#5e4125] leading-relaxed">
                  <p>
                    景泰蓝工坊极为珍视每一位文化薪火传播人、以及注册非遗传承大师的个人指尖创作及相关敏感数据隐私：
                  </p>

                  <h4 className="font-extrabold text-sm text-[#8a1c14] mb-1">一、数字著作权与所有权归属</h4>
                  <p>
                    您在工坊“模拟胎形”、“自主手绘掐丝痕迹”、“矿物色彩点染配比”以及生成的非遗景泰蓝成器作品，均为您的个人数字文化创意结晶。平台不会对作品在未经您授权的情况下进行任何商用，尊重匠人独立的创作智慧与灵感。
                  </p>

                  <h4 className="font-extrabold text-sm text-[#8a1c14] mb-1">二、匠人属性与大师名录保护</h4>
                  <p>
                    注册大师的称谓、电子邮箱、非遗考级造诣、关注关系等，均存放在安全的主服务器数据库或您的本地离线沙盒存储（Local Storage）中。未经大师本人知会和许可，严禁外泄或提供予第三方推广用途。
                  </p>

                  <h4 className="font-extrabold text-sm text-[#8a1c14] mb-1">三、离线沙盒存储及物理隔离</h4>
                  <p>
                    景泰蓝工坊不设置任何强制性质的数据窃取后台。您在打砂和抛光得到的金币、经验，以及工坊未成器的原胎心血草稿，均仅作为应用程序改善用户体验在前端缓存中使用，充分尊重非侵入式的“纯净用户体验”哲学。
                  </p>

                  <h4 className="font-extrabold text-sm text-[#8a1c14] mb-1">四、非遗普及与研学统计</h4>
                  <p>
                    为了进一步对景泰蓝文化在全国大专院校的科研与教学普及，我们可能会对大众喜爱的“四大经典纹样”的选择频率、点蓝热门配比釉色作脱敏数据普查，以便于非物质文化遗产保护机构发布年度统计研究参考报告。
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-[#b58b4c]/30 bg-[#fbf6ea] text-center mt-6">
                  <p className="text-xs text-[#856543] font-sans-manrope font-extrabold tracking-widest uppercase">
                    🔒 工匠初心 ‧ 终生守护 ‧ 薪火永续
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer imperial signature */}
        <div className="py-2.5 px-6 border-t border-[#b58b4c]/15 bg-[#fbf6ea] flex justify-between items-center text-[10px] text-[#856543] font-sans-manrope">
          <span>云端非遗数字档案馆 · 永久学术级参考</span>
          <span>© 2026 Jingtailan Craft. Academic Certified.</span>
        </div>

      </div>
    </div>
  );
}
