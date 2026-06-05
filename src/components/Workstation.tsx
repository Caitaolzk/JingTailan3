import React, { useState, useEffect, useRef } from 'react';
import { Flame, Check, Play, RotateCcw, AlertCircle, Sparkles, HelpCircle, Hammer, Info, Palette } from 'lucide-react';
import { Artwork } from '../types';

// ✅ 新增CloudBase导入
import { db, auth } from '../utils/cloudbase';

interface WorkstationProps {
  onAddNewArtwork: (newArt: Artwork) => void;
  onNavigateToPortfolio: () => void;
  currentUser: string | null;
}

type VesselShape = 'celestial' | 'gourd' | 'basin';
type MetalMaterial = 'copper' | 'silver' | 'gold';
type WireMaterial = 'gold' | 'silver';
type FiligreePattern = 'lotus' | 'phoenix' | 'dragon' | 'rendong' | 'baoxiang' | 'xifanlian' | 'chanzhi';

// Generate highly detailed filigree sketching paths dynamically based on vessel shape and traditional pattern
const generateSketchFiligree = (shape: VesselShape, pat: FiligreePattern): { x: number; y: number }[][] => {
  const lines: { x: number; y: number }[][] = [];

  const addCurve = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number) => {
    const pts = [];
    const steps = 16;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
      const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
      pts.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
    }
    lines.push(pts);
  };

  const addCircle = (cx: number, cy: number, r: number) => {
    const pts = [];
    const steps = 24;
    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      pts.push({
        x: Math.round((cx + Math.cos(angle) * r) * 100) / 100,
        y: Math.round((cy + Math.sin(angle) * r) * 100) / 100,
      });
    }
    lines.push(pts);
  };

  if (shape === 'celestial') {
    // Large Celestial Belly center at Y:145, X:100. Neck goes up to Y:70. Base runs to Y:200.
    // 1. Core scrolls (Main vine lines)
    addCurve(100, 75, 45, 120, 100, 155); // Left major scrolling vine
    addCurve(100, 155, 155, 185, 100, 195); // Right major scrolling vine
    addCurve(100, 75, 155, 110, 100, 140); // Symmetrical counterpart
    addCurve(100, 140, 45, 175, 100, 195); // Bottom loop back

    // 2. Pattern-specific details
    if (pat === 'lotus' || pat === 'chanzhi' || pat === 'baoxiang') {
      // Symmetrical rosettes/flowers
      addCircle(100, 138, 18);
      addCircle(100, 138, 8);
      // Small decorative flanking swirls
      addCurve(65, 115, 60, 100, 70, 105);
      addCurve(135, 115, 140, 100, 130, 105);
      // Lotus petals on top/bottom neck alignment
      addCurve(100, 38, 90, 48, 100, 58);
      addCurve(100, 38, 110, 48, 100, 58);
    } else if (pat === 'dragon' || pat === 'phoenix') {
      // Stylized imperial coils (Body representing dragon/phoenix wings)
      addCurve(80, 80, 130, 100, 100, 135);
      addCurve(100, 135, 70, 170, 120, 180);
      addCurve(120, 180, 150, 190, 100, 195);
      // Tail feathers or flame ornaments
      addCurve(75, 110, 52, 132, 85, 150);
      addCurve(125, 110, 148, 132, 115, 150);
    } else { // rendong / xifanlian (Classic honeysuckle scrolls)
      // Multiple leaf lobes hooking outwards
      addCurve(70, 115, 50, 95, 68, 100);
      addCurve(68, 100, 80, 120, 85, 130);
      addCurve(130, 115, 150, 95, 132, 100);
      addCurve(132, 100, 120, 120, 115, 130);
      addCurve(85, 160, 60, 180, 82, 185);
      addCurve(115, 160, 140, 180, 118, 185);
    }
  } else if (shape === 'gourd') {
    // Upper bulb (Y: 40 to 105, center at Y:75, X:100)
    // Lower bulb (Y: 105 to 210, center at Y:160, X:100)
    // 1. Scrolling interconnecting lines
    addCurve(100, 45, 70, 68, 100, 90);
    addCurve(100, 45, 130, 68, 100, 90);
    addCurve(100, 112, 58, 142, 100, 192);
    addCurve(100, 112, 142, 142, 100, 192);

    // 2. Pattern elements
    if (pat === 'lotus' || pat === 'chanzhi' || pat === 'baoxiang') {
      addCircle(100, 72, 10);
      addCircle(100, 158, 16);
      addCircle(100, 158, 6);
    } else {
      // Cloud patterns or wavy details
      addCurve(85, 60, 100, 50, 115, 60);
      addCurve(85, 75, 100, 85, 115, 75);
      addCurve(75, 145, 100, 130, 125, 145);
      addCurve(72, 172, 100, 190, 128, 172);
    }
  } else {
    // Basin (Y: 75 to 215, center at Y:165, X:100)
    // Symmetrical broad medallion curves mapping beautifully to a low basin bowl
    addCurve(100, 85, 42, 135, 100, 202);
    addCurve(100, 85, 158, 135, 100, 202);
    addCurve(55, 145, 100, 120, 145, 145);
    addCurve(55, 155, 100, 185, 145, 155);

    if (pat === 'lotus' || pat === 'chanzhi' || pat === 'baoxiang') {
      addCircle(100, 145, 20);
      addCircle(100, 145, 10);
    } else {
      // Inner spiral clouds
      addCurve(75, 135, 65, 155, 88, 155);
      addCurve(125, 135, 135, 155, 112, 155);
    }
  }

  return lines;
};

export default function Workstation({ onAddNewArtwork, onNavigateToPortfolio, currentUser }: WorkstationProps) {
  // Current step state (1 to 5)
  // Step 1: 制胎 | Step 2: 掐丝 | Step 3: 点蓝 | Step 4: 烧制 | Step 5: 磨光
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [highestStepReached, setHighestStepReached] = useState<number>(1);

  // --- Interactive Custom Overlay States for Iframe compatibility ---
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // --- Step 1: 制胎 States ---
  const [vaseShape, setVaseShape] = useState<VesselShape>('celestial');
  const [baseBody, setBaseBody] = useState<MetalMaterial>('copper');
  const [hammerCount, setHammerCount] = useState<number>(0);
  const targetHammers = 6;
  const [isStriking, setIsStriking] = useState<boolean>(false);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; tx: number; ty: number; color: string }[]>([]);

  // --- Step 2: 掐丝 States ---
  const [filigree, setFiligree] = useState<WireMaterial>('gold');
  const [pattern, setPattern] = useState<FiligreePattern>('rendong');
  const [bendCount, setBendCount] = useState<number>(0);
  const targetBends = 5;
  const [drawnLines, setDrawnLines] = useState<{ x: number; y: number }[][]>([]);
  const [currentLine, setCurrentLine] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [showTracePattern, setShowTracePattern] = useState<boolean>(true);
  const [isAutoGenerated, setIsAutoGenerated] = useState<boolean>(false);

  // --- Step 3: 点蓝 States ---
  const [selectedGlaze, setSelectedGlaze] = useState<string>('blue'); // Current brush color
  // Color configuration for 3 distinct design zones (Top, Middle, Bottom)
  const [zoneColors, setZoneColors] = useState<{ top: string; middle: string; bottom: string }>({
    top: '#002570',
    middle: '#0da9ab',
    bottom: '#9d1912',
  });

  // --- Step 4: 烧制 States ---
  const [temperature, setTemperature] = useState<number>(120); // starts at 120 C
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [firingProgress, setFiringProgress] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Step 5: 磨光 States ---
  const [polishLevel, setPolishLevel] = useState<number>(0); // 0 to 100%
  const [createdName, setCreatedName] = useState<string>('');
  const [createdDescription, setCreatedDescription] = useState<string>('');
  const [isDescEdited, setIsDescEdited] = useState<boolean>(false);

  // Auto-generate Chinese风 names based on options
  useEffect(() => {
    const shapeLabels = { celestial: '天球大尊', gourd: '葫芦宝瓶', basin: '福寿尊洗' };
    const materialLabels = { copper: '紫铜胎', silver: '雪银胎', gold: '鎏金胎' };
    const patternLabels = { 
      lotus: '缠枝莲纹', 
      phoenix: '百鸟朝凤', 
      dragon: '双龙戏珠',
      rendong: '忍冬纹',
      baoxiang: '宝相花纹',
      xifanlian: '西番莲纹',
      chanzhi: '缠枝莲花纹'
    };
    const glazeLabels = { '#002570': '霁蓝', '#9d1912': '朱砂', '#0da9ab': '孔雀绿', '#d5ae25': '宝相黄', '#e5e2e1': '砗磲白' };
    
    // Find closest names
    const clr = zoneColors.middle;
    const clrLabel = glazeLabels[clr as keyof typeof glazeLabels] || '珐琅彩';
    setCreatedName(`${materialLabels[baseBody]}${clrLabel}${patternLabels[pattern]}${shapeLabels[vaseShape]}`);
  }, [baseBody, vaseShape, pattern, zoneColors]);

  // Auto-generate elegant cloisonné descriptions based on selections
  useEffect(() => {
    if (isDescEdited) return;

    const baseLabels = {
      copper: '正统紫铜胎',
      silver: '雪白纯银胎',
      gold: '鎏金帝王胎'
    };

    const wireLabels = {
      gold: '精掐金丝',
      silver: '精掐银丝'
    };

    const shapeLabels = {
      celestial: '天球大尊',
      gourd: '葫芦宝瓶',
      basin: '福寿尊洗'
    };

    const matchedGlazes = Object.values(zoneColors).map(color => {
      const match = glazePalette.find(item => item.value === color);
      return match ? match.label : '彩釉';
    });
    const uniqueGlazes = Array.from(new Set(matchedGlazes));

    const patternLabels = {
      lotus: '缠枝莲纹',
      phoenix: '百鸟朝凤',
      dragon: '双龙戏珠',
      rendong: '瑞蔓吉庆之忍冬纹',
      baoxiang: '祥云托顶之宝相花纹',
      xifanlian: '长生富贵之西番莲纹',
      chanzhi: '清雅廉洁之缠枝莲花纹'
    };

    const newDesc = `此景泰蓝精品由匠人纯手工精制而成。器身选用${baseLabels[baseBody]}，器形呈${shapeLabels[vaseShape]}之态。通体以手法细心盘绕${wireLabels[filigree]}，掐制成华美生动的${patternLabels[pattern]}；点蓝工序中，精选${uniqueGlazes.join('、')}等五彩天然矿物色料精细填孔，并经高温炉火熔融结晶、再于磨光台以细木和白炭潜心打磨。整器色泽深厚斑斓，包浆宝光温润，尽显金石皇室雅玩神韵。`;
    setCreatedDescription(newDesc);
  }, [baseBody, vaseShape, filigree, pattern, zoneColors, isDescEdited]);

  // Handler for Hammer Strike (Step 1)
  const handleHammerStrike = () => {
    if (hammerCount < targetHammers) {
      setHammerCount(prev => prev + 1);
      setIsStriking(true);
      setTimeout(() => setIsStriking(false), 80);

      // Create new spark particles flying out radially from center of vessel
      const newSparks = Array.from({ length: 14 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 40 + Math.random() * 85;
        return {
          id: Date.now() + i + Math.random(),
          x: 100 + (Math.random() - 0.5) * 30,
          y: 110 + (Math.random() - 0.5) * 80,
          tx: Math.cos(angle) * velocity,
          ty: Math.sin(angle) * velocity - 25,
          color: ['#ffffff', '#ffd700', '#ff9f43', '#ff5252'][Math.floor(Math.random() * 4)]
        };
      });
      setSparks(newSparks);
      setTimeout(() => setSparks([]), 500);
    }
  };

  // Helper to map client interaction coordinates to 200x240 viewBox
  const getSVGCoordinates = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * 200;
    const y = ((clientY - rect.top) / rect.height) * 240;
    return { x: Math.max(0, Math.min(200, x)), y: Math.max(0, Math.min(240, y)) };
  };

  const handleSVGMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (currentStep !== 2) return;
    const pt = getSVGCoordinates(e);
    if (!pt) return;
    if (isAutoGenerated) {
      setIsAutoGenerated(false);
      setDrawnLines([]);
      setBendCount(0);
    }
    setIsDrawing(true);
    setCurrentLine([pt]);
  };

  const handleSVGMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (currentStep !== 2 || !isDrawing) return;
    const pt = getSVGCoordinates(e);
    if (!pt) return;
    setCurrentLine(prev => [...prev, pt]);
  };

  const handleSVGMouseUp = () => {
    if (currentStep !== 2 || !isDrawing) return;
    setIsDrawing(false);
    if (currentLine.length > 1) {
      setDrawnLines(prev => {
        const next = [...prev, currentLine];
        setBendCount(Math.min(next.length, targetBends));
        return next;
      });
    }
    setCurrentLine([]);
  };

  const handleSVGTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (currentStep !== 2) return;
    const pt = getSVGCoordinates(e);
    if (!pt) return;
    if (isAutoGenerated) {
      setIsAutoGenerated(false);
      setDrawnLines([]);
      setBendCount(0);
    }
    setIsDrawing(true);
    setCurrentLine([pt]);
  };

  const handleSVGTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (currentStep !== 2 || !isDrawing) return;
    const pt = getSVGCoordinates(e);
    if (!pt) return;
    setCurrentLine(prev => [...prev, pt]);
  };

  const handleSVGTouchEnd = () => {
    if (currentStep !== 2 || !isDrawing) return;
    setIsDrawing(false);
    if (currentLine.length > 1) {
      setDrawnLines(prev => {
        const next = [...prev, currentLine];
        setBendCount(Math.min(next.length, targetBends));
        return next;
      });
    }
    setCurrentLine([]);
  };

  // Glaze select palette color matcher
  const glazePalette = [
    { id: 'blue', value: '#002570', label: '青金石蓝', desc: '天然深邃青金宝石釉' },
    { id: 'red', value: '#9d1912', label: '朱砂珊瑚红', desc: '御用纯红矿物珊瑚砂' },
    { id: 'green', value: '#0da9ab', label: '古窑孔雀绿', desc: '莫高窟天然孔雀铜绿' },
    { id: 'yellow', value: '#d5ae25', label: '宣德宝相黄', desc: '宫廷经典温润亮黄' },
    { id: 'white', value: '#e5e2e1', label: '砗磲象牙白', desc: '晶莹润泽天然矿白' },
  ];

  // Map glaze id to full CSS hex code
  const getGlazeHex = (id: string) => {
    const matched = glazePalette.find(item => item.id === id);
    return matched ? matched.value : '#002570';
  };

  // Step Switchers with sequential barrier checks
  const navigateToStep = (targetStep: number) => {
    if (targetStep === 2 && hammerCount < targetHammers) {
      setWarningMessage("请敲击捶打，完成制胎并使胎壁均匀，方可进入掐丝步骤！");
      return;
    }
    if (targetStep === 3 && bendCount < targetBends) {
      setWarningMessage("掐丝细丝未完全粘固。请点击‘盘绕掐丝线条’，完成图样定位！");
      return;
    }
    if (targetStep === 4 && bendCount < targetBends) {
      setWarningMessage("请一步一步，先完成掐丝与点蓝！");
      return;
    }
    if (targetStep === 5 && temperature < 800) {
      setWarningMessage("窑温未达到 800°C 熔融定型。请先开启窑膛烧制！");
      return;
    }

    setCurrentStep(targetStep);
    if (targetStep > highestStepReached) {
      setHighestStepReached(targetStep);
    }
  };

  // Step 4: Firing interval handler
  useEffect(() => {
    if (isFiring) {
      timerRef.current = setInterval(() => {
        setTemperature(prev => {
          if (prev >= 800) {
            clearInterval(timerRef.current!);
            setIsFiring(false);
            setFiringProgress(100);
            return 800;
          }
          const increment = Math.floor(Math.random() * 20) + 15;
          const nextTemp = Math.min(prev + increment, 800);
          setFiringProgress(Math.floor(((nextTemp - 120) / 680) * 100));
          return nextTemp;
        });
      }, 150);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFiring]);

  const startFiringProcess = () => {
    setTemperature(120);
    setFiringProgress(0);
    setIsFiring(true);
  };

  // ✅ 修改完成作品函数，同时保存到CloudBase云端
  const handleFinishArtwork = async () => {
    if (polishLevel < 95) {
      setWarningMessage("尚未打磨抛光。请滑动拖拽砥石，将珐琅彩表面打磨至温润见光！");
      return;
    }

    const baseLabels = {
      copper: '紫铜胎',
      silver: '纯银胎',
      gold: '鎏金胎'
    };

    const wireLabels = {
      gold: '精掐金丝',
      silver: '精掐银丝'
    };

    const shapeLabels = {
      celestial: '天球大尊',
      gourd: '葫芦宝瓶',
      basin: '福寿洗子'
    };

    // Glaze description
    const matchedGlazes = Object.values(zoneColors).map(color => {
      const match = glazePalette.find(item => item.value === color);
      return match ? match.label : '釉彩';
    });

    const newArt: Artwork = {
      id: `custom-${Date.now()}`,
      title: createdName || '手工琢景泰蓝',
      artist: currentUser || '匠人',
      tags: ['手造重器', shapeLabels[vaseShape], baseLabels[baseBody]],
      image: getGlazeImageForShape(vaseShape, zoneColors.middle),
      description: createdDescription || `此景泰蓝精品由非遗匠人纯手工精制，历经制胎（${baseLabels[baseBody]}打磨成器）、手工掐丝（以极细${wireLabels[filigree]}盘作精致图案）、五彩矿物点蓝（采用${matchedGlazes.join('、')}等国宝釉料）、经窑火至最高800摄氏度历练呈色，并最后由椴木细砂磨砺打光，整器体态端秀、包浆莹润。`,
      materials: [baseLabels[baseBody], wireLabels[filigree], ...matchedGlazes],
      status: 'completed',
      likes: 1,
      isFavorite: false,
      isPublished: false,
      vaseShape,
      baseBody,
      filigree,
      pattern,
      zoneColors: { ...zoneColors },
      drawnLines: (drawnLines.length > 0 && !isAutoGenerated) ? drawnLines : undefined
    };

    try {
      // ✅ 保存到CloudBase云端数据库
      const user = auth.currentUser;
      if (user) {
        await db.collection("artworks").add({
          ...newArt,
          uid: user.uid, // 关联当前用户ID
          createdAt: new Date()
        });
      }

      // 同时保留本地保存，确保离线可用
      onAddNewArtwork(newArt);

      // Reset workstation States
      setCurrentStep(1);
      setHighestStepReached(1);
      setHammerCount(0);
      setBendCount(0);
      setTemperature(120);
      setPolishLevel(0);
      setFiringProgress(0);
      setCreatedDescription('');
      setIsDescEdited(false);
      setIsAutoGenerated(false);
      onNavigateToPortfolio();
    } catch (err: any) {
      alert("保存作品失败：" + err.message);
    }
  };

  // Help image mappings to mimic highly polished historical artifacts
  const getGlazeImageForShape = (shape: VesselShape, primaryColor: string) => {
    // 完全保留你原来的图片链接
    if (primaryColor === '#9d1912') {
      return 'https://picsum.photos/id/1025/800/1000';
    }
    if (primaryColor === '#0da9ab') {
      return 'https://picsum.photos/id/1028/800/1000';
    }
    return 'https://picsum.photos/id/1035/800/1000';
  };

  const getPatternUrl = (patOpt: FiligreePattern) => {
    switch (patOpt) {
      case 'lotus': return 'url(#patLotus)';
      case 'phoenix': return 'url(#patPhoenix)';
      case 'dragon': return 'url(#patDragon)';
      case 'rendong': return 'url(#patRendong)';
      case 'baoxiang': return 'url(#patBaoxiang)';
      case 'xifanlian': return 'url(#patXifanlian)';
      case 'chanzhi': return 'url(#patChanzhi)';
      default: return 'url(#patRendong)';
    }
  };

  // Helper color map for vector representation
  const getMetalHexColor = (mat: MetalMaterial) => {
    switch (mat) {
      case 'copper': return '#c87533';
      case 'silver': return '#a6adb5';
      case 'gold': return '#f5c63d';
      default: return '#c87533';
    }
  };

  const getWireHexColor = (wire: WireMaterial) => {
    return wire === 'gold' ? '#ffeaa7' : '#f5f6fa';
  };

  // 100% finished on Step 2+ or if target list completed
  const hf = currentStep > 1 ? 1 : Math.max(0.15, hammerCount / targetHammers);

  // Celestial style coordinates based on current hammering progress
  const celTopL = 100 - (10 + 10 * hf);
  const celTopR = 100 + (10 + 10 * hf);
  const celNeckL = 100 - (12 + 3 * hf);
  const celNeckR = 100 + (12 + 3 * hf);
  const celBulgeOff = 15 + 40 * hf;
  const celBellyR = 100 + celBulgeOff;
  const celBellyL = 100 - celBulgeOff;
  const celBottomR = 100 + (12 + 3 * hf);
  const celBottomL = 100 - (12 + 3 * hf);
  const celFooterR = 100 + 10 * hf;
  const celFooterL = 100 - 10 * hf;

  // Gourd style coordinates based on current hammering progress
  const grdBulbOffTop = 12 + 18 * hf;
  const grdBulbRTop = 100 + grdBulbOffTop;
  const grdBulbLTop = 100 - grdBulbOffTop;
  const grdTopL = 100 - (10 + 5 * hf);
  const grdTopR = 100 + (10 + 5 * hf);
  const grdWaistL = 100 - (10 + 5 * hf);
  const grdWaistR = 100 + (10 + 5 * hf);
  const grdBulbOffBot = 15 + 35 * hf;
  const grdBulbRBot = 100 + grdBulbOffBot;
  const grdBulbLBot = 100 - grdBulbOffBot;
  const grdBottomL = 100 - (10 + 5 * hf);
  const grdBottomR = 100 + (10 + 5 * hf);
  const grdWaistLInner = 100 - (10 + 2 * hf);
  const grdWaistRInner = 100 + (10 + 2 * hf);

  // Basin style coordinates based on current hammering progress
  const bsnRimOff = 20 + 30 * hf;
  const bsnRimR = 100 + bsnRimOff;
  const bsnRimL = 100 - bsnRimOff;
  const bsnRimInR = 100 + (8 + 32 * hf);
  const bsnRimInL = 100 - (8 + 32 * hf);
  const bsnBellyOff = 25 + 45 * hf;
  const bsnMaxR = 100 + bsnBellyOff;
  const bsnMaxL = 100 - bsnBellyOff;
  const bsnInR = 100 + (8 + 34 * hf);
  const bsnInL = 100 - (8 + 34 * hf);
  const bsnBottomR = 100 + (10 + 30 * hf);
  const bsnBottomL = 100 - (10 + 30 * hf);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6 relative z-10 font-serif-literata w-full">
      
      {/* Title Header with Imperial Aesthetics */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2 text-secondary mb-1">
            <span className="text-[10px] uppercase font-sans-manrope tracking-widest bg-secondary/10 border border-secondary/30 px-2 py-0.5 rounded-full font-extrabold">
              非遗数字化工坊
            </span>
          </div>
          <h1 className="font-serif-garamond text-3xl md:text-4xl font-extrabold text-[#e5e2e1] flex items-center gap-2">
            景泰蓝全序手造模拟台
          </h1>
          <p className="text-xs text-on-surface-variant font-sans-manrope uppercase mt-1 tracking-wider leading-relaxed">
            严格遵循宫廷造办处传统：<strong>制胎 → 掐丝 → 点蓝 → 烧制 → 磨光</strong>。每一道指尖琢磨，皆成千载传世之美。
          </p>
        </div>

        {/* Step Navigation Dots for Sequential Process representation */}
        <div className="flex flex-wrap items-center gap-2 bg-surface-container-low p-2 rounded-xl border border-outline-variant/30 font-sans-manrope">
          {[
            { step: 1, label: '制胎' },
            { step: 2, label: '掐丝' },
            { step: 3, label: '点蓝' },
            { step: 4, label: '烧制' },
            { step: 5, label: '磨光' },
          ].map((item) => {
            const isCompleted = item.step < currentStep || (item.step === 1 && hammerCount >= targetHammers) || (item.step === 2 && bendCount >= targetBends) || (item.step === 3 && highestStepReached > 3) || (item.step === 4 && temperature >= 800);
            const isActive = currentStep === item.step;
            const canJump = item.step <= highestStepReached || isCompleted;

            return (
              <button
                key={item.step}
                onClick={() => canJump && navigateToStep(item.step)}
                disabled={!canJump}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border-t border-white/5 ${
                  isActive
                    ? 'bg-secondary text-on-secondary font-extrabold scale-102 shadow-md'
                    : isCompleted
                    ? 'bg-green-950/20 text-green-400 border border-green-500/20'
                    : 'bg-surface-container-high text-on-surface-variant/40 border border-transparent'
                } ${canJump ? 'hover:brightness-110 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
              >
                <span>{item.step}.</span>
                <span>{item.label}</span>
                {isCompleted && <Check className="w-3 h-3 text-green-400" />}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main interactive grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Controls specified per current step (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 soft-shadow flex flex-col justify-between h-full min-h-[460px] relative overflow-hidden">
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Step indicator header */}
              <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20 mb-4">
                <span className="font-sans-manrope text-[10px] text-secondary tracking-widest uppercase font-extrabold">
                  当前工序 · 第一步制胎起
                </span>
                <span className="text-[10px] text-on-surface-variant bg-surface-container px-2.5 py-1 rounded font-sans-manrope font-bold">
                  步骤 [{currentStep}/5]
                </span>
              </div>

              {/* STEP 1 CONTROLS: 制胎 */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-secondary/10 border border-secondary/30">
                      <Hammer className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-serif-garamond text-xl font-bold text-on-surface">选用胎骨与打型</h3>
                      <p className="text-[11px] text-on-surface-variant font-sans-manrope">紫铜延展性极好，最宜用作景泰蓝底骨。</p>
                    </div>
                  </div>

                  {/* Body shape select */}
                  <div className="space-y-2 mt-2">
                    <label className="block text-xs font-sans-manrope font-bold uppercase tracking-wider text-secondary">
                      1. 选择皇家器物形制
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'celestial', label: '天球大瓶', desc: '宏达端丽' },
                        { id: 'gourd', label: '葫芦宝葫', desc: '福禄双全' },
                        { id: 'basin', label: '福寿尊洗', desc: '雅玩宫盘' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setVaseShape(s.id as VesselShape);
                            setHammerCount(0); // hammer needs resetting on shape change
                          }}
                          className={`p-2.5 rounded-lg border text-center transition-all ${
                            vaseShape === s.id
                              ? 'bg-primary-container/30 border-secondary text-secondary font-extrabold'
                              : 'bg-surface hover:bg-surface-container border-transparent text-on-surface/80'
                          }`}
                        >
                          <span className="block text-xs font-bold font-sans-manrope">{s.label}</span>
                          <span className="text-[9px] text-on-surface-variant/70 italic">{s.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body material select */}
                  <div className="space-y-2 mt-2">
                    <label className="block text-xs font-sans-manrope font-bold uppercase tracking-wider text-secondary">
                      2. 定制底胎金属板材
                    </label>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: 'copper', label: '正统紫铜胎 (捶铜金红)', cost: '传统皇家标配' },
                        { id: 'silver', label: '官窑雪银胎 (温润优雅)', cost: '特级非遗特许' },
                        { id: 'gold', label: '鎏金帝王胎 (极尽华贵)', cost: '大内造办室专供' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setBaseBody(m.id as MetalMaterial);
                            setHammerCount(0);
                          }}
                          className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all text-xs font-sans-manrope ${
                            baseBody === m.id
                              ? 'bg-primary-container/30 border-secondary text-secondary font-extrabold'
                              : 'bg-surface hover:bg-surface-container border-transparent'
                          }`}
                        >
                          <span className="font-bold">{m.label}</span>
                          <span className="text-[9px] text-on-surface-variant italic font-normal">{m.cost}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Hammer strike triggers */}
                  <div className="mt-4 p-3 bg-surface border border-outline-variant/30 rounded-xl text-center">
                    <h4 className="text-xs text-on-surface font-sans-manrope font-bold mb-2">3. 振锤击打塑造胎型</h4>
                    <p className="text-[10px] text-on-surface-variant mb-3 leading-relaxed">
                      捶打紫铜板，延展并焊接使其形成致密饱满的胎型。请振锤击打 {targetHammers} 次：
                    </p>

                    <div className="flex gap-2 items-center justify-center mb-3">
                      {[...Array(targetHammers)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                            i < hammerCount
                              ? 'bg-secondary border-secondary scale-110 shadow-sm'
                              : 'bg-surface-container border-outline'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleHammerStrike}
                      disabled={hammerCount >= targetHammers}
                      className="w-full bg-[#e9c349] hover:bg-[#ffd700] text-black font-sans-manrope font-extrabold tracking-widest text-xs py-3 rounded-lg border border-yellow-300/40 hover-lift active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md disabled:bg-surface-container-high disabled:text-on-surface-variant/40 disabled:scale-100 disabled:shadow-none"
                    >
                      <Hammer className="w-4 h-4" />
                      {hammerCount >= targetHammers ? '胎骨锤造完成' : '挥锤捶打 (制胎打形)'}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 CONTROLS: 掐丝 */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-secondary/10 border border-secondary/30">
                      <Sparkles className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-serif-garamond text-xl font-bold text-on-surface">手工自由掐丝</h3>
                      <p className="text-[11px] text-on-surface-variant font-sans-manrope">直接在右侧器物上划动勾勒绘制，编织精贵细丝糊牢于胎身。</p>
                    </div>
                  </div>

                  {/* Wire Choice */}
                  <div className="space-y-2 mt-1">
                    <label className="block text-xs font-sans-manrope font-bold uppercase tracking-wider text-secondary">
                      1. 选择掐丝金属材质
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'gold', label: '金丝勾勒', desc: '金光熠熠' },
                        { id: 'silver', label: '银星嵌线', desc: '亮玉剔透' },
                      ].map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setFiligree(w.id as WireMaterial)}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            filigree === w.id
                              ? 'bg-primary-container/30 border-secondary text-secondary font-extrabold'
                              : 'bg-surface hover:bg-surface-container border-transparent'
                          }`}
                        >
                          <span className="block text-xs font-sans-manrope font-bold">{w.label}</span>
                          <span className="text-[9px] text-on-surface-variant/70 italic">{w.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reference Draft selection for tracing */}
                  <div className="space-y-2 mt-1">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-sans-manrope font-bold uppercase tracking-wider text-[#b58b4c]">
                        2. 描摹底稿参考
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowTracePattern(!showTracePattern)}
                        className={`text-[10px] font-sans-manrope px-2 py-0.5 rounded border font-bold transition-all ${
                          showTracePattern 
                            ? 'bg-secondary/20 border-secondary text-secondary' 
                            : 'bg-surface border-outline-variant/30 text-on-surface-variant'
                        }`}
                      >
                        {showTracePattern ? '隐藏参考衬图' : '显示参考衬图'}
                      </button>
                    </div>

                    {showTracePattern && (
                      <div className="space-y-2">
                        {/* 4 Featured Classic Historic Reference Patterns */}
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { id: 'rendong', label: '魏晋六朝 · 忍冬纹', desc: '蔓草越冬不凋，生生不息之吉祥' },
                            { id: 'baoxiang', label: '大唐盛世 · 宝相花纹', desc: '集莲花牡丹之美，尊贵祥瑞华丽' },
                            { id: 'xifanlian', label: '明清御苑 · 西番莲纹', desc: '番草卷叶相缠，富丽连锦不绝' },
                            { id: 'chanzhi', label: '古典传统 · 缠枝莲花纹', desc: '藤蔓交错缠绕，福禄长寿繁茂' },
                          ].map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setPattern(p.id as FiligreePattern)}
                              className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between ${
                                pattern === p.id
                                  ? 'bg-primary-container/30 border-secondary text-secondary ring-1 ring-secondary/50'
                                  : 'bg-surface hover:bg-surface-container border-outline-variant/30 text-on-surface'
                              }`}
                            >
                              <span className="block text-[11px] font-sans-manrope font-extrabold">{p.label}</span>
                              <span className="text-[9px] text-on-surface-variant mt-0.5 leading-snug">{p.desc}</span>
                            </button>
                          ))}
                        </div>

                        {/* Traditional alternative patterns in a neat row */}
                        <div className="flex items-center gap-1.5 pt-1.5 border-t border-dashed border-outline-variant/30">
                          <span className="text-[9px] text-[#b58b4c] font-sans-manrope font-bold uppercase tracking-wider">其他传统款：</span>
                          {[
                            { id: 'lotus', label: '缠枝莲' },
                            { id: 'phoenix', label: '朝凤纹' },
                            { id: 'dragon', label: '双龙珠' },
                          ].map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setPattern(p.id as FiligreePattern)}
                              className={`px-2 py-0.5 rounded-md border text-[10px] font-sans-manrope transition-all ${
                                pattern === p.id
                                  ? 'bg-primary-container/20 border-secondary text-secondary font-extrabold'
                                  : 'bg-surface hover:bg-surface-container border-outline-variant/20 text-on-surface-variant'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Drawing Instructions & tools info */}
                  <div className="p-3 bg-surface border border-outline-variant/30 rounded-xl space-y-3">
                    <div className="text-center">
                      <h4 className="text-xs text-on-surface font-sans-manrope font-bold mb-1">画笔手写掐丝</h4>
                      <p className="text-[10px] text-on-surface-variant leading-relaxed">
                        请用鼠标或触屏<strong>直接在右侧器尊胎体上勾画</strong>，即可盘出定制金银细丝！
                      </p>
                    </div>

                    <div className="flex gap-2 items-center justify-center">
                      {[...Array(targetBends)].map((_, i) => (
                        <div
                           key={i}
                           className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                             i < bendCount ? 'bg-secondary border-secondary scale-110 shadow-sm' : 'bg-surface-container border-outline'
                           }`}
                        />
                      ))}
                    </div>

                    {/* One-click Draft Generation Button alongside standard Drawing */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setDrawnLines([]);
                          setBendCount(targetBends);
                          setIsAutoGenerated(true);
                        }}
                        className="w-full bg-secondary/15 hover:bg-secondary/25 text-[#ffd700] border border-secondary/40 font-sans-manrope font-extrabold tracking-wider text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover-lift active:scale-98 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-[#ffd700] animate-pulse" />
                        <span>一键按底稿自动生成掐丝</span>
                      </button>
                    </div>

                    {/* Undo / Clear operations */}
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (isAutoGenerated) {
                            setIsAutoGenerated(false);
                            setBendCount(0);
                            return;
                          }
                          setDrawnLines(prev => {
                            const next = prev.slice(0, -1);
                            setBendCount(Math.min(next.length, targetBends));
                            return next;
                          });
                        }}
                        disabled={drawnLines.length === 0 && !isAutoGenerated}
                        className="flex-1 text-[11px] font-sans-manrope font-bold border border-outline-variant/40 hover:bg-surface-container text-on-surface-variant py-2 rounded-lg transition-all disabled:opacity-40"
                      >
                        撤销一笔
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDrawnLines([]);
                          setBendCount(0);
                          setIsAutoGenerated(false);
                        }}
                        disabled={drawnLines.length === 0 && !isAutoGenerated}
                        className="flex-1 text-[11px] font-sans-manrope font-bold border border-red-500/20 hover:bg-red-950/20 text-red-400 py-2 rounded-lg transition-all disabled:opacity-40"
                      >
                        全部清空
                      </button>
                    </div>

                    <div className="text-[10px] text-center text-on-surface-variant italic leading-normal">
                      {isAutoGenerated ? (
                        <>
                          进度：<span className="font-bold text-[#ffd700] font-sans-manrope">已自动按选择的底稿样式1:1精准制作</span>
                          <span className="block text-green-400 font-bold mt-1">✨ 已达标准，可以迈向下一工序！</span>
                        </>
                      ) : (
                        <>
                          进度：已掐制 <span className="font-bold text-secondary font-sans-manrope">{drawnLines.length}</span> 笔细丝。
                          {bendCount >= targetBends ? (
                            <span className="block text-green-400 font-bold mt-1">✨ 已达标准，可以迈向下一工序！</span>
                          ) : (
                            <span className="block text-[#ffd700] font-normal mt-1">💡 请在右侧绘制 {targetBends} 笔完成掐丝。</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 CONTROLS: 点蓝 */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-secondary/10 border border-secondary/30">
                      <Palette className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-serif-garamond text-xl font-bold text-on-surface">五彩矿点蓝釉层</h3>
                      <p className="text-[11px] text-on-surface-variant font-sans-manrope">调制矿物釉粉，手持点蓝羽管、吸染上色填孔。</p>
                    </div>
                  </div>

                  {/* Pick Brush Color */}
                  <div className="space-y-2 mt-1">
                    <label className="block text-xs font-sans-manrope font-bold uppercase tracking-wider text-secondary">
                      1. 点取特研天然釉彩
                    </label>
                    <div className="flex flex-col gap-1.5">
                      {glazePalette.map((gl) => (
                        <button
                          key={gl.id}
                          onClick={() => setSelectedGlaze(gl.id)}
                          className={`flex items-center gap-3 p-2 rounded-lg text-left transition-all border ${
                            selectedGlaze === gl.id
                              ? 'bg-primary-container/30 border-secondary ring-1 ring-secondary text-secondary'
                              : 'bg-surface border-transparent hover:bg-surface-container'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-white/20 shadow-inner flex-shrink-0"
                            style={{ backgroundColor: gl.value }}
                          />
                          <div>
                            <h4 className="text-xs font-sans-manrope font-bold leading-none">{gl.label}</h4>
                            <p className="text-[9px] text-on-surface-variant mt-0.5">{gl.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fill zones instruction */}
                  <div className="p-3 bg-surface border border-outline-variant/30 rounded-xl text-center">
                    <h4 className="text-xs text-on-surface font-sans-manrope font-bold mb-1.5">2. 为器物三阶染区上色</h4>
                    <p className="text-[10px] text-on-surface-variant mb-2.5 leading-normal">
                      点击右侧图形底稿对应的<strong className="text-secondary">【上颈部】、【中胸部】、【下圈部】</strong>区域，即可用点选彩釉完成传统填色！
                    </p>

                    <div className="flex justify-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zoneColors.top }} />
                        <span className="text-[10px] font-sans-manrope font-bold text-on-surface-variant">上: 霁蓝</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zoneColors.middle }} />
                        <span className="text-[10px] font-sans-manrope font-bold text-on-surface-variant">中: 绿釉</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zoneColors.bottom }} />
                        <span className="text-[10px] font-sans-manrope font-bold text-on-surface-variant">下: 朱砂</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4 CONTROLS: 烧制 */}
              {currentStep === 4 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-secondary/10 border border-secondary/30">
                      <Flame className="w-5 h-5 text-secondary animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-serif-garamond text-xl font-bold text-on-surface">窑膛烈火烤烧</h3>
                      <p className="text-[11px] text-on-surface-variant font-sans-manrope">推入密闭碳化窑膛中，重熔釉料晶体以固色结晶。</p>
                    </div>
                  </div>

                  <div className="space-y-3 mt-2">
                    <div className="border border-outline-variant/20 rounded-lg p-3 bg-surface/50 text-xs font-sans-manrope text-on-surface-variant space-y-1.5">
                      <p>🔥 <strong className="text-secondary">烧釉温度知识</strong>：</p>
                      <p className="leading-normal">
                        需控制温度平稳升高致约 <strong className="text-amber-400">800摄氏度</strong>，砂孔才会迅速溢合。若急火过猛则极易炸胎和串色。
                      </p>
                    </div>

                    {/* Heat stats display */}
                    <div className="bg-surface border border-outline-variant/30 rounded-xl p-4 text-center flex flex-col items-center">
                      <div className="text-[10px] font-sans-manrope uppercase tracking-widest text-[#ffd700] font-bold">炭火膛温</div>
                      <div className="font-serif-garamond text-4xl font-extrabold text-secondary tracking-tight my-1">
                        {temperature}°C
                      </div>
                      <div className="text-[10px] text-on-surface-variant font-sans-manrope font-bold uppercase tracking-wider">
                        {temperature >= 800 ? '🎉 重熔结晶定型完成 !' : isFiring ? '🔥 窑炉正在喷吐剧烈红光...' : '💤 窑内已作预热准备'}
                      </div>
                    </div>

                    {/* Progress fire bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-sans-manrope text-on-surface-variant uppercase tracking-wider font-extrabold">
                        <span>前置预热</span>
                        <span className="text-secondary">定型呈色 800°C</span>
                      </div>
                      <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden relative border border-outline-variant/30 shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 via-yellow-500 to-amber-300 transition-all duration-200"
                          style={{ width: `${firingProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Trigger fire action buttons */}
                    {!isFiring && temperature < 800 && (
                      <button
                        onClick={startFiringProcess}
                        className="w-full bg-[#9d1912] hover:bg-red-700 text-white font-sans-manrope font-extrabold tracking-widest text-xs py-3 rounded-lg hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        注入燃料 · 启动窑膛烧制
                      </button>
                    )}

                    {isFiring && (
                      <div className="flex items-center gap-2 justify-center py-2 bg-red-950/40 border border-red-500/20 text-red-400 rounded-lg text-xs font-sans-manrope font-bold animate-pulse">
                        <Flame className="w-4 h-4 animate-bounce" />
                        <span>正在进行 800°C 高温熔烤 约需10秒...</span>
                      </div>
                    )}

                    {temperature >= 800 && (
                      <div className="p-2 text-center bg-green-950/20 border border-green-500/30 text-green-400 rounded-lg text-xs font-sans-manrope font-bold flex items-center gap-1.5 justify-center">
                        <Check className="w-4 h-4" />
                        <span>熔融烤结色相已现！速进磨光。</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5 CONTROLS: 磨光 */}
              {currentStep === 5 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-secondary/10 border border-secondary/30">
                      <Sparkles className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-serif-garamond text-xl font-bold text-on-surface">打磨见光出包浆</h3>
                      <p className="text-[11px] text-on-surface-variant font-sans-manrope">先用金刚砂除炭，再以白炭细石微打，最后用细椴木细推。</p>
                    </div>
                  </div>

                  <div className="space-y-4 mt-2">
                    {/* Vessel naming title */}
                    <div className="border border-outline-variant/30 rounded-lg p-3 bg-surface-container-high/40 space-y-3">
                      <div>
                        <label className="block text-[10px] font-sans-manrope uppercase text-secondary font-bold tracking-widest mb-1.5">
                          御书此重器御名
                        </label>
                        <input
                          type="text"
                          value={createdName}
                          onChange={(e) => setCreatedName(e.target.value)}
                          placeholder="请输入您的金石雅玩雅名"
                          className="w-full bg-surface-container text-xs text-on-surface py-2.5 px-3 rounded border border-outline-variant/30 focus:outline-none focus:border-primary placeholder:text-outline-variant/50"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-sans-manrope uppercase text-secondary font-bold tracking-widest mb-1.5 flex justify-between items-center">
                          <span>撰写重器造办介绍 (作品简介)</span>
                          {isDescEdited && (
                            <button 
                              type="button" 
                              onClick={() => setIsDescEdited(false)} 
                              className="text-[9px] text-[#ffd700] hover:underline font-bold"
                            >
                              重置默认介绍
                            </button>
                          )}
                        </label>
                        <textarea
                          value={createdDescription}
                          onChange={(e) => {
                            setCreatedDescription(e.target.value);
                            setIsDescEdited(true);
                          }}
                          rows={4}
                          placeholder="描述作品的工艺构思与匠心神韵..."
                          className="w-full bg-surface-container text-xs text-on-surface py-2 px-3 rounded border border-outline-variant/30 focus:outline-none focus:border-primary placeholder:text-outline-variant/50 resize-none font-sans-manrope leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Polish Interaction scrub slider */}
                    <div className="p-4 bg-surface border border-outline-variant/30 rounded-xl space-y-3">
                      <div className="flex justify-between items-center text-xs font-sans-manrope">
                        <span className="font-bold text-secondary">磨砂出莹致光进度</span>
                        <span className="font-serif-garamond font-semibold text-sm">{polishLevel}%</span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={polishLevel}
                        onChange={(e) => setPolishLevel(Number(e.target.value))}
                        className="w-full h-2 rounded-lg bg-surface-container-highest cursor-col-resize accent-secondary border border-outline-variant/20"
                      />

                      <p className="text-[9px] text-on-surface-variant leading-relaxed text-center italic">
                        {polishLevel < 30 ? '🪵 首磨粗砂：祛除表壳碳渣与溢孔...' : polishLevel < 75 ? '🪨 次磨碳石：平整蓝面，开始隐透掐丝金属亮光...' : '✨ 细磨椴木：去尘见光，包浆丰润溢放莹莹宝色！'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Back / Next bottom action footer panel */}
            <div className="mt-8 pt-4 border-t border-outline-variant/20 flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex-shrink-0 px-4 py-2.5 border border-outline-variant/50 text-on-surface-variant hover:text-white rounded-lg text-xs font-sans-manrope font-bold hover:bg-surface-container-high transition-all"
                >
                  回退高序
                </button>
              )}

              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="flex-shrink-0 px-3 py-2.5 border border-red-500/20 text-red-400 hover:text-white rounded-lg text-xs font-sans-manrope font-bold hover:bg-[#4a1010]/35 hover:border-red-500/50 transition-all flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  推翻重做
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => navigateToStep(currentStep + 1)}
                  className="flex-grow bg-primary text-on-primary font-sans-manrope font-bold text-xs py-3 rounded-lg shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer border-t border-white/10"
                >
                  <span>迈向下一工序</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishArtwork}
                  disabled={polishLevel < 95}
                  className="flex-grow bg-gradient-to-r from-green-600 to-emerald-600 text-white font-sans-manrope font-extrabold tracking-widest text-xs py-3.5 rounded-lg active:scale-98 shadow-md transition-all flex items-center justify-center gap-1.5 border border-green-400 disabled:from-surface-container-highest disabled:to-surface-container-highest disabled:text-on-surface-variant/30 disabled:border-transparent cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  打磨见光 · 载入珍藏典典章
                </button>
              )}
            </div>

          </div>
        </div>

        {/* CENTER COLUMN: Full Vector Masterpiece Dynamic Preview (Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-surface-container-low rounded-xl p-5 md:p-6 border border-outline-variant/30 soft-shadow flex flex-col justify-between items-center h-full relative overflow-hidden min-h-[460px]">
            
            {/* Visual labels overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 z-20">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getMetalHexColor(baseBody) }} />
              <div className="text-[10px] font-sans-manrope text-secondary tracking-wider uppercase font-bold">
                {baseBody === 'copper' ? '经典紫铜胎' : baseBody === 'silver' ? '雪白纯银胎' : '重器流金胎'}
              </div>
            </div>

            <div className="absolute top-4 right-4 z-20">
              <span className="text-[10px] font-sans-manrope text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded border border-outline-variant/30 font-bold">
                工艺器形: {vaseShape === 'celestial' ? '天球瓶' : vaseShape === 'gourd' ? '大葫芦尊' : '福寿尊洗'}
              </span>
            </div>

            {/* Live Royal Vector Preview built with high fidelity SVG */}
            <div className="w-full h-80 md:h-96 relative flex items-center justify-center mt-6 p-4">
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes sparkAnimation {
                  0% {
                    transform: translate(0px, 0px) scale(1);
                    opacity: 1;
                  }
                  100% {
                    transform: translate(var(--tx), var(--ty)) scale(0.1);
                    opacity: 0;
                  }
                }
                .spark-particle {
                  animation: sparkAnimation 0.45s cubic-bezier(0.1, 0.8, 0.32, 1.28) forwards;
                }
              `}} />
              
              {/* Dynamic SVG Drawing represents the entire customization flow */}
              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox="0 0 200 240"
                className={`w-auto h-full max-h-[360px] drop-shadow-2xl transition-all duration-300 ${currentStep === 2 ? 'cursor-crosshair select-none touch-none' : ''}`}
                onMouseDown={handleSVGMouseDown}
                onMouseMove={handleSVGMouseMove}
                onMouseUp={handleSVGMouseUp}
                onMouseLeave={handleSVGMouseUp}
                onTouchStart={handleSVGTouchStart}
                onTouchMove={handleSVGTouchMove}
                onTouchEnd={handleSVGTouchEnd}
                style={{
                  filter: currentStep === 4 && isFiring
                    ? `saturate(${1.2 + (temperature / 1000)}) brightness(${1.0 + (temperature/1100)})` 
                    : `contrast(1.0) saturate(${0.6 + (polishLevel/100 * 0.5)})`,
                  transform: isStriking ? 'scale(0.96) translateY(4px) skewX(1deg)' : 'scale(1)',
                  transformOrigin: 'bottom center',
                  transition: 'transform 70ms cubic-bezier(0.18, 0.89, 0.32, 1.28)'
                }}
              >
                {/* Metallic shadow plate under vessel */}
                <ellipse cx="100" cy="225" rx="55" ry="10" fill="rgba(0,0,0,0.5)" filter="blur(4px)" />

                {/* DEFINITIONS AND PATTERNS */}
                <defs>
                  {/* Metal shine shader representing Base Making */}
                  <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2c2c2c" />
                    <stop offset="40%" stopColor={getMetalHexColor(baseBody)} />
                    <stop offset="60%" stopColor="#ffffff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1a1a1a" />
                  </linearGradient>

                  {/* Wire glow */}
                  <filter id="wireNeon">
                    <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>

                  {/* Polish Glossy Reflection Glow */}
                  <filter id="polishGlow">
                    <feGaussianBlur stdDeviation="2.5" />
                  </filter>

                  {/* Lotus Wire Pattern */}
                  <pattern id="patLotus" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 20,0 C 25,5 35,5 40,20 C 35,25 25,25 20,40 C 15,25 5,25 0,20 C 5,5 15,5 20,0 Z" 
                      fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.65" />
                  </pattern>

                  {/* Phoenix Pattern */}
                  <pattern id="patPhoenix" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 0,25 Q 12,12 25,25 T 50,25" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.6" />
                    <path d="M 25,0 Q 37,12 50,0" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.6" />
                  </pattern>

                  {/* Dragon Waves pattern */}
                  <pattern id="patDragon" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="15" cy="15" r="8" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.4" />
                    <path d="M 0,15 L 30,15" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.5" />
                  </pattern>

                  {/* Traditional Rendong (Honeysuckle) Pattern - Wavy Scrolls inside */}
                  <pattern id="patRendong" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    {/* Main scrolling vine structure */}
                    <path d="M 0,30 C 15,10 45,10 60,30" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.8" opacity="0.8" />
                    <path d="M 0,30 C 15,50 45,50 60,30" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.4" strokeDasharray="1,1" opacity="0.5" />
                    {/* Left-curl scroll vine with split honeysuckle leaflets */}
                    <path d="M 15,20 C 10,15 12,6 20,5 C 28,4 32,12 28,18 C 24,24 16,22 18,15 C 20,10 25,12 24,16" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.85" />
                    {/* Right-curl scroll vine with leaflets */}
                    <path d="M 45,40 C 50,45 48,54 40,55 C 32,56 28,48 32,42 C 36,36 44,38 42,45 C 40,50 35,48 36,44" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.85" />
                    {/* Detailed multi-lobed honeysuckle leaf (a central 3-foliate split leaflet) */}
                    <path d="M 30,30 C 35,22 30,12 25,15 C 22,22 26,26 30,30 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.75" />
                    <path d="M 30,30 C 40,28 42,18 36,15 C 31,20 32,25 30,30 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.75" />
                    <path d="M 30,30 C 20,32 18,22 24,18 C 28,21 28,26 30,30 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.75" />
                    {/* Tiny auxiliary vine leaves and scrolls */}
                    <path d="M 5,20 Q 8,12 12,15" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.6" />
                    <path d="M 55,40 Q 52,48 48,45" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.6" />
                  </pattern>

                  {/* Traditional Baoxiang Flower Pattern - Symmetrical Rosettes */}
                  <pattern id="patBaoxiang" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                    {/* Symmetrical central rosette (Center at 40, 40) */}
                    <circle cx="40" cy="40" r="6" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.8" opacity="0.9" />
                    <circle cx="40" cy="40" r="14" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" strokeDasharray="1,2" opacity="0.6" />
                    
                    {/* 4 Cardinal Flame-like Petals */}
                    <path d="M 40,18 C 45,26 45,30 40,32 C 35,30 35,26 40,18 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.7" opacity="0.95" />
                    <path d="M 40,22 C 43,26 43,29 40,30 C 37,29 37,26 40,22 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.4" opacity="0.8" />

                    <path d="M 40,62 C 45,54 45,50 40,48 C 35,50 35,54 40,62 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.7" opacity="0.95" />
                    <path d="M 40,58 C 43,54 43,51 40,50 C 37,51 37,54 40,58 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.4" opacity="0.8" />

                    <path d="M 18,40 C 26,45 30,45 32,40 C 30,35 26,35 18,40 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.7" opacity="0.95" />
                    <path d="M 22,40 C 26,43 29,43 30,40 C 29,37 26,37 22,40 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.4" opacity="0.8" />

                    <path d="M 62,40 C 54,45 50,45 48,40 C 50,35 54,35 62,40 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.7" opacity="0.95" />
                    <path d="M 58,40 C 54,43 51,43 50,40 C 51,37 54,37 58,40 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.4" opacity="0.8" />

                    {/* 4 Diagonal Rounded Cloud Petals */}
                    <path d="M 40,40 Q 25,25 22,28 C 18,31 22,37 40,40 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.8" />
                    <path d="M 40,40 Q 55,25 58,28 C 62,31 58,37 40,40 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.8" />
                    <path d="M 40,40 Q 25,55 22,52 C 18,49 22,43 40,40 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.8" />
                    <path d="M 40,40 Q 55,55 58,52 C 62,49 58,43 40,40 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.8" />

                    {/* Exquisite surrounding scrollwork corners (creating the classic Tang dynasty dense layout) */}
                    <path d="M 12,12 C 18,6 24,14 18,18 C 12,22 6,14 12,12 M 14,14 C 18,10 21,15 18,18" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.75" />
                    <path d="M 68,12 C 62,6 56,14 62,18 C 68,22 74,14 68,12 M 66,14 C 62,10 59,15 62,18" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.75" />
                    <path d="M 12,68 C 18,74 24,66 18,62 C 12,58 6,66 12,68 M 14,66 C 18,70 21,65 18,62" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.75" />
                    <path d="M 68,68 C 62,74 56,66 62,62 C 68,58 74,66 68,68 M 66,66 C 62,70 59,65 62,62" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.75" />

                    {/* Symmetrical connecting links */}
                    <path d="M 40,0 L 40,12 M 40,68 L 40,80 M 0,40 L 12,40 M 68,40 L 80,40" stroke={getWireHexColor(filigree)} strokeWidth="0.4" strokeDasharray="3,3" opacity="0.5" />
                  </pattern>

                  {/* Traditional Xifanlian (Passion/Clematis) Pattern */}
                  <pattern id="patXifanlian" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
                    {/* Intricate curly stem framework */}
                    <path d="M 0,35 C 10,25 20,45 35,35 C 50,25 60,45 70,35" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.75" opacity="0.8" />
                    <path d="M 0,35 C 10,45 20,25 35,35 C 50,45 60,25 70,35" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.4" strokeDasharray="1,1" opacity="0.4" />
                    
                    {/* Central intricate Western style Clematis Flower (Center 35, 35) */}
                    <circle cx="35" cy="35" r="4" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.7" opacity="0.9" />
                    <path d="M 35,26 C 38,28 38,32 35,35 C 32,32 32,28 35,26 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.8" />
                    <path d="M 35,44 C 38,42 38,38 35,35 C 32,38 32,42 35,44 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.8" />
                    <path d="M 26,35 C 28,38 32,38 35,35 C 32,32 28,32 26,35 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.8" />
                    <path d="M 44,35 C 42,38 38,38 35,35 C 38,32 42,32 44,35 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.8" />
                    
                    {/* Distinctive deeply lobed acanthus leaves (highly curled tips) */}
                    {/* Top Left Leaf */}
                    <path d="M 23,23 C 18,20 12,24 15,31 C 18,34 23,30 23,23 C 23,17 17,14 13,18" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.85" />
                    <path d="M 18,25 C 16,21 12,21 14,24" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.4" opacity="0.7" />
                    {/* Top Right Leaf */}
                    <path d="M 47,23 C 52,20 58,24 55,31 C 52,34 47,30 47,23 C 47,17 53,14 57,18" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.85" />
                    <path d="M 52,25 C 54,21 58,21 56,24" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.4" opacity="0.7" />
                    {/* Bottom Left Leaf */}
                    <path d="M 23,47 C 18,50 12,46 15,39 C 18,36 23,40 23,47 C 23,53 17,56 13,52" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.85" />
                    <path d="M 18,45 C 16,49 12,49 14,46" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.4" opacity="0.7" />
                    {/* Bottom Right Leaf */}
                    <path d="M 47,47 C 52,50 58,46 55,39 C 52,36 47,40 47,47 C 47,53 53,56 57,52" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.85" />
                    <path d="M 52,45 C 54,49 58,49 56,46" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.4" opacity="0.7" />

                    {/* Nested secondary scrolls for continuous texture */}
                    <path d="M 35,8 C 28,12 25,6 30,3 Q 35,5 35,8" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.7" />
                    <path d="M 35,62 C 42,58 45,64 40,67 Q 35,65 35,62" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.7" />
                  </pattern>

                  {/* Traditional Chanzhi (Scrolling Lotus) Pattern */}
                  <pattern id="patChanzhi" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    {/* Classic undulating scrolling vine */}
                    <path d="M 0,30 C 15,10 45,50 60,30" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.8" opacity="0.85" />
                    <path d="M 0,30 C 15,50 45,10 60,30" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.4" strokeDasharray="1,1" opacity="0.4" />

                    {/* Intricate front-facing lotus blossom (Center 30, 30) */}
                    <circle cx="30" cy="30" r="3" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.9" />
                    {/* Central top petal */}
                    <path d="M 30,17 C 32,23 32,25 30,27 C 28,25 28,23 30,17 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.9" />
                    {/* Symmetrical flanking petals (nested double contours) */}
                    <path d="M 30,27 Q 38,19 41,23 Q 36,29 30,27 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.85" />
                    <path d="M 30,27 Q 42,28 41,33 Q 34,32 30,27 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.85" />
                    <path d="M 30,27 Q 22,19 19,23 Q 24,29 30,27 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.85" />
                    <path d="M 30,27 Q 18,28 19,33 Q 26,32 30,27 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.85" />
                    {/* Base/Lower sepals */}
                    <path d="M 30,27 Q 35,39 28,41 Q 26,35 30,27 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.85" />
                    <path d="M 30,27 Q 25,39 32,41 Q 34,35 30,27 Z" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.6" opacity="0.85" />

                    {/* Scrolling side leaves & whiskers "缠枝" */}
                    <path d="M 12,20 C 15,15 10,10 7,12 C 4,14 8,22 12,20" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.8" />
                    <path d="M 48,40 C 45,45 50,50 53,48 C 56,46 52,38 48,40" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.5" opacity="0.8" />
                    
                    {/* Delicate curly tendrils (whiskers) */}
                    <path d="M 15,14 Q 22,12 18,8" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.4" opacity="0.7" />
                    <path d="M 45,46 Q 38,48 42,52" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.4" opacity="0.7" />
                  </pattern>

                  {/* Vessel Clip Path to restrict all drawings inside the shape boundary */}
                  <clipPath id="vesselClip">
                    {vaseShape === 'celestial' && (
                      <>
                        <path d={`M ${celTopL},30 L ${celTopR},30 L ${celNeckR},70 L ${celNeckL},70 Z`} />
                        <path d={`M ${celNeckL},70 L ${celNeckR},70 Q ${celBellyR},100 ${celBellyR},145 Q ${celBellyR},190 ${celBottomR},200 L ${celBottomL},200 Q ${celBellyL},190 ${celBellyL},145 Q ${celBellyL},100 ${celNeckL},70 Z`} />
                        <path d={`M ${celBottomL},200 L ${celBottomR},200 L ${celFooterR},218 L ${celFooterL},218 Z`} />
                      </>
                    )}
                    {vaseShape === 'gourd' && (
                      <>
                        <path d={`M ${grdTopL},30 L ${grdTopR},30 L ${grdTopR},40 Q ${grdBulbRTop},55 ${grdBulbRTop},75 Q ${grdBulbRTop},95 ${grdWaistR},105 L ${grdWaistL},105 Q ${grdBulbLTop},95 ${grdBulbLTop},75 Q ${grdBulbLTop},55 ${grdTopL},40 Z`} />
                        <path d={`M ${grdWaistLInner},105 L ${grdWaistRInner},105 Q ${grdBulbRBot},120 ${grdBulbRBot},160 Q ${grdBulbRBot},200 ${grdBottomR},210 L ${grdBottomL},210 Q ${grdBulbLBot},200 ${grdBulbLBot},160 Q ${grdBulbLBot},120 ${grdWaistLInner},105 Z`} />
                        <path d={`M ${grdBottomL},210 L ${grdBottomR},210 L ${100 + 10 * hf},222 L ${100 - 10 * hf},222 Z`} />
                      </>
                    )}
                    {vaseShape === 'basin' && (
                      <>
                        <path d={`M ${bsnRimL},45 L ${bsnRimR},45 L ${bsnRimInR},75 L ${bsnRimInL},75 Z`} />
                        <path d={`M ${bsnInL},75 L ${bsnInR},75 Q ${bsnMaxR},115 ${bsnMaxR},165 Q ${bsnMaxR},210 ${bsnBottomR},215 L ${bsnBottomL},215 Q ${bsnMaxL},210 ${bsnMaxL},165 Q ${bsnMaxL},115 ${bsnInL},75 Z`} />
                        <path d={`M ${bsnBottomL},215 L ${bsnBottomR},215 L ${100 + (8 + 24 * hf)},226 L ${100 - (8 + 24 * hf)},226 Z`} />
                      </>
                    )}
                  </clipPath>
                </defs>

                {/* THE CORE VESSEL BASE (Rendered symmetrically using paths) */}
                
                {/* 1. Base metal outline representation for STEP 1 */}
                {vaseShape === 'celestial' && (
                  <g id="celestialVessel">
                    {/* Zones Filled conditionally based on step */}
                    {/* Upper Zone: Neck */}
                    <path
                      d={`M ${celTopL},30 L ${celTopR},30 L ${celNeckR},70 L ${celNeckL},70 Z`}
                      fill={currentStep >= 3 ? zoneColors.top : getMetalHexColor(baseBody)}
                      stroke={currentStep >= 2 ? getWireHexColor(filigree) : 'none'}
                      strokeWidth={currentStep >= 2 ? '1' : '0'}
                      className="cursor-pointer transition-colors duration-300"
                      onClick={() => currentStep === 3 && setZoneColors(prev => ({ ...prev, top: getGlazeHex(selectedGlaze) }))}
                    />

                    {/* Middle Zone: Big Belly */}
                    <path
                      d={`M ${celNeckL},70 L ${celNeckR},70 Q ${celBellyR},100 ${celBellyR},145 Q ${celBellyR},190 ${celBottomR},200 L ${celBottomL},200 Q ${celBellyL},190 ${celBellyL},145 Q ${celBellyL},100 ${celNeckL},70 Z`}
                      fill={currentStep >= 3 ? zoneColors.middle : getMetalHexColor(baseBody)}
                      stroke={currentStep >= 2 ? getWireHexColor(filigree) : 'none'}
                      strokeWidth={currentStep >= 2 ? '1' : '0'}
                      className="cursor-pointer transition-colors duration-300"
                      onClick={() => currentStep === 3 && setZoneColors(prev => ({ ...prev, middle: getGlazeHex(selectedGlaze) }))}
                    />

                    {/* Lower Zone: Ring Base */}
                    <path
                      d={`M ${celBottomL},200 L ${celBottomR},200 L ${celFooterR},218 L ${celFooterL},218 Z`}
                      fill={currentStep >= 3 ? zoneColors.bottom : getMetalHexColor(baseBody)}
                      stroke={currentStep >= 2 ? getWireHexColor(filigree) : 'none'}
                      strokeWidth={currentStep >= 2 ? '1' : '0'}
                      className="cursor-pointer transition-colors duration-300"
                      onClick={() => currentStep === 3 && setZoneColors(prev => ({ ...prev, bottom: getGlazeHex(selectedGlaze) }))}
                    />
                  </g>
                )}

                {/* Gourd Vase Paths */}
                {vaseShape === 'gourd' && (
                  <g id="gourdVessel">
                    {/* Top Neck & Top bulb */}
                    <path
                      d={`M ${grdTopL},30 L ${grdTopR},30 L ${grdTopR},40 Q ${grdBulbRTop},55 ${grdBulbRTop},75 Q ${grdBulbRTop},95 ${grdWaistR},105 L ${grdWaistL},105 Q ${grdBulbLTop},95 ${grdBulbLTop},75 Q ${grdBulbLTop},55 ${grdTopL},40 Z`}
                      fill={currentStep >= 3 ? zoneColors.top : getMetalHexColor(baseBody)}
                      stroke={currentStep >= 2 ? getWireHexColor(filigree) : 'none'}
                      strokeWidth={currentStep >= 2 ? '1' : '0'}
                      className="cursor-pointer transition-colors duration-300"
                      onClick={() => currentStep === 3 && setZoneColors(prev => ({ ...prev, top: getGlazeHex(selectedGlaze) }))}
                    />

                    {/* Low Belly Gourd */}
                    <path
                      d={`M ${grdWaistLInner},105 L ${grdWaistRInner},105 Q ${grdBulbRBot},120 ${grdBulbRBot},160 Q ${grdBulbRBot},200 ${grdBottomR},210 L ${grdBottomL},210 Q ${grdBulbLBot},200 ${grdBulbLBot},160 Q ${grdBulbLBot},120 ${grdWaistLInner},105 Z`}
                      fill={currentStep >= 3 ? zoneColors.middle : getMetalHexColor(baseBody)}
                      stroke={currentStep >= 2 ? getWireHexColor(filigree) : 'none'}
                      strokeWidth={currentStep >= 2 ? '1' : '0'}
                      className="cursor-pointer transition-colors duration-300"
                      onClick={() => currentStep === 3 && setZoneColors(prev => ({ ...prev, middle: getGlazeHex(selectedGlaze) }))}
                    />

                    {/* Lower Ring Base */}
                    <path
                      d={`M ${grdBottomL},210 L ${grdBottomR},210 L ${100 + 10 * hf},222 L ${100 - 10 * hf},222 Z`}
                      fill={currentStep >= 3 ? zoneColors.bottom : getMetalHexColor(baseBody)}
                      stroke={currentStep >= 2 ? getWireHexColor(filigree) : 'none'}
                      strokeWidth={currentStep >= 2 ? '1' : '0'}
                      className="cursor-pointer transition-colors duration-300"
                      onClick={() => currentStep === 3 && setZoneColors(prev => ({ ...prev, bottom: getGlazeHex(selectedGlaze) }))}
                    />
                  </g>
                )}

                {/* Imperial Basin / wash basin shape */}
                {vaseShape === 'basin' && (
                  <g id="basinVessel">
                    {/* Top flared Rim */}
                    <path
                      d={`M ${bsnRimL},45 L ${bsnRimR},45 L ${bsnRimInR},75 L ${bsnRimInL},75 Z`}
                      fill={currentStep >= 3 ? zoneColors.top : getMetalHexColor(baseBody)}
                      stroke={currentStep >= 2 ? getWireHexColor(filigree) : 'none'}
                      strokeWidth={currentStep >= 2 ? '1' : '0'}
                      className="cursor-pointer transition-colors duration-300"
                      onClick={() => currentStep === 3 && setZoneColors(prev => ({ ...prev, top: getGlazeHex(selectedGlaze) }))}
                    />

                    {/* Main rounded basin ring */}
                    <path
                      d={`M ${bsnInL},75 L ${bsnInR},75 Q ${bsnMaxR},115 ${bsnMaxR},165 Q ${bsnMaxR},210 ${bsnBottomR},215 L ${bsnBottomL},215 Q ${bsnMaxL},210 ${bsnMaxL},165 Q ${bsnMaxL},115 ${bsnInL},75 Z`}
                      fill={currentStep >= 3 ? zoneColors.middle : getMetalHexColor(baseBody)}
                      stroke={currentStep >= 2 ? getWireHexColor(filigree) : 'none'}
                      strokeWidth={currentStep >= 2 ? '1' : '0'}
                      className="cursor-pointer transition-colors duration-300"
                      onClick={() => currentStep === 3 && setZoneColors(prev => ({ ...prev, middle: getGlazeHex(selectedGlaze) }))}
                    />

                    {/* Base circle footer */}
                    <path
                      d={`M ${bsnBottomL},215 L ${bsnBottomR},215 L ${100 + (8 + 24 * hf)},226 L ${100 - (8 + 24 * hf)},226 Z`}
                      fill={currentStep >= 3 ? zoneColors.bottom : getMetalHexColor(baseBody)}
                      stroke={currentStep >= 2 ? getWireHexColor(filigree) : 'none'}
                      strokeWidth={currentStep >= 2 ? '1' : '0'}
                      className="cursor-pointer transition-colors duration-300"
                      onClick={() => currentStep === 3 && setZoneColors(prev => ({ ...prev, bottom: getGlazeHex(selectedGlaze) }))}
                    />
                  </g>
                )}

                {/* BACKGROUND DRAFT TRACING REFERENCE UNDERLAY (Translucent background) */}
                {currentStep === 2 && showTracePattern && (
                  <g id="patternTraceReference" pointerEvents="none" clipPath="url(#vesselClip)">
                    {vaseShape === 'celestial' && (
                      <path
                        d="M 85,73 L 115,73 Q 152,100 152,145 Q 152,187 115,197 L 85,197 Q 48,187 48,145 Q 48,100 85,73 Z"
                        fill={getPatternUrl(pattern)}
                        opacity="0.25"
                      />
                    )}

                    {vaseShape === 'gourd' && (
                      <path
                        d="M 88,107 L 112,107 Q 147,120 147,160 Q 147,197 115,207 L 85,207 Q 53,197 53,160 Q 53,120 88,107 Z"
                        fill={getPatternUrl(pattern)}
                        opacity="0.25"
                      />
                    )}

                    {vaseShape === 'basin' && (
                      <path
                        d="M 58,77 L 142,77 Q 167,115 167,165 Q 167,207 140,212 L 60,212 Q 33,207 33,165 Q 33,115 58,77 Z"
                        fill={getPatternUrl(pattern)}
                        opacity="0.25"
                      />
                    )}

                    <g filter="url(#wireNeon)" opacity="0.2">
                      <path d="M 100,50 Q 82,35 68,145 T 100,215" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.8" />
                      <path d="M 100,50 Q 118,35 132,145 T 100,215" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.8" />
                    </g>
                  </g>
                )}

                {/* FILIGREE PATTERNS RENDERED ON TOP (If no drawings exist, render defaults so it is backward compatible) */}
                {drawnLines.length === 0 && currentLine.length === 0 ? (
                  currentStep >= 2 && bendCount > 0 && (
                    <g id="patternOverlay" pointerEvents="none" clipPath="url(#vesselClip)">
                      {vaseShape === 'celestial' && (
                        <path
                          d="M 85,73 L 115,73 Q 152,100 152,145 Q 152,187 115,197 L 85,197 Q 48,187 48,145 Q 48,100 85,73 Z"
                          fill={getPatternUrl(pattern)}
                          opacity={bendCount / targetBends}
                        />
                      )}

                      {vaseShape === 'gourd' && (
                        <path
                          d="M 88,107 L 112,107 Q 147,120 147,160 Q 147,197 115,207 L 85,207 Q 53,197 53,160 Q 53,120 88,107 Z"
                          fill={getPatternUrl(pattern)}
                          opacity={bendCount / targetBends}
                        />
                      )}

                      {vaseShape === 'basin' && (
                        <path
                          d="M 58,77 L 142,77 Q 167,115 167,165 Q 167,207 140,212 L 60,212 Q 33,207 33,165 Q 33,115 58,77 Z"
                          fill={getPatternUrl(pattern)}
                          opacity={bendCount / targetBends}
                        />
                      )}

                      <g filter="url(#wireNeon)" opacity={bendCount / targetBends}>
                        <path d="M 100,50 Q 82,35 68,145 T 100,215" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.8" />
                        <path d="M 100,50 Q 118,35 132,145 T 100,215" fill="none" stroke={getWireHexColor(filigree)} strokeWidth="0.8" />
                      </g>
                    </g>
                  )
                ) : (
                  /* RENDER HAND-DRAWN CUSTOM FILIGREE LINES */
                  <g id="userDrawnFiligree" filter="url(#wireNeon)" opacity="0.95" pointerEvents="none" clipPath="url(#vesselClip)">
                    {/* Render all finished lines */}
                    {drawnLines.map((line, idx) => (
                      <path
                        key={`drawn-${idx}`}
                        d={line.map((pt, pIdx) => `${pIdx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')}
                        fill="none"
                        stroke={getWireHexColor(filigree)}
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                    {/* Render current drawing stroke in real-time */}
                    {currentLine.length > 1 && (
                      <path
                        d={currentLine.map((pt, pIdx) => `${pIdx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')}
                        fill="none"
                        stroke={getWireHexColor(filigree)}
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </g>
                )}

                {/* REFLUX OVERLAY: Kiln heat glow in Step 4 */}
                {currentStep === 4 && isFiring && (
                  <ellipse cx="100" cy="120" rx="90" ry="100" fill="rgba(233,140,30,0.15)" stroke="none" pointerEvents="none" className="animate-pulse" />
                )}

                {/* POLISH REFLECTION OVERLAY: Glossy white glare based on Step 5 polishLevel */}
                {currentStep === 5 && polishLevel > 0 && (
                  <g id="polishReflection" pointerEvents="none">
                    {vaseShape === 'celestial' && (
                      <>
                        {/* Neck contour highlight */}
                        <path
                          d="M 90,33 Q 91,50 92,67"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          opacity={(polishLevel / 100) * 0.48}
                          filter="url(#polishGlow)"
                        />
                        {/* Belly contour highlight following the vase shoulder and belly bulge */}
                        <path
                          d="M 88,78 Q 63,110 63,145 Q 63,180 88,192"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="4.2"
                          strokeLinecap="round"
                          opacity={(polishLevel / 100) * 0.55}
                          filter="url(#polishGlow)"
                        />
                      </>
                    )}

                    {vaseShape === 'gourd' && (
                      <>
                        {/* Top neck highlight */}
                        <path
                          d="M 92,32 L 93,42"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          opacity={(polishLevel / 100) * 0.45}
                          filter="url(#polishGlow)"
                        />
                        {/* Upper bulb contour highlight */}
                        <path
                          d="M 89,43 Q 78,60 78,75 Q 78,90 89,102"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          opacity={(polishLevel / 100) * 0.5}
                          filter="url(#polishGlow)"
                        />
                        {/* Lower bulb contour highlight following the bottom belly sphere */}
                        <path
                          d="M 91,111 Q 67,135 67,160 Q 67,185 88,204"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="4.2"
                          strokeLinecap="round"
                          opacity={(polishLevel / 100) * 0.55}
                          filter="url(#polishGlow)"
                        />
                      </>
                    )}

                    {vaseShape === 'basin' && (
                      <>
                        {/* Upper flared rim highlight */}
                        <path
                          d="M 68,48 L 74,72"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          opacity={(polishLevel / 100) * 0.48}
                          filter="url(#polishGlow)"
                        />
                        {/* Rounded basin side highlight following the wide bottom contour */}
                        <path
                          d="M 72,80 Q 50,115 50,165 Q 50,203 72,212"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                          opacity={(polishLevel / 100) * 0.55}
                          filter="url(#polishGlow)"
                        />
                      </>
                    )}
                  </g>
                )}

                {/* Dynamic Spark Particles */}
                {sparks.map((spark) => (
                  <circle
                    key={spark.id}
                    cx={spark.x}
                    cy={spark.y}
                    r={1.2 + Math.random() * 1.5}
                    fill={spark.color}
                    className="spark-particle pointer-events-none"
                    style={{
                      '--tx': `${spark.tx}px`,
                      '--ty': `${spark.ty}px`,
                    } as React.CSSProperties}
                  />
                ))}
              </svg>

              {/* Dynamic Firing furnace visual effects overlay */}
              {currentStep === 4 && isFiring && (
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 via-yellow-500/25 to-transparent mix-blend-overlay animate-pulse rounded-2xl pointer-events-none" />
              )}
            </div>

            {/* Instruction tooltip overlay bottom */}
            <div className="w-full bg-surface-container-high/40 p-3 rounded-lg border border-outline-variant/20 flex gap-2.5 items-start mt-2">
              <Info className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
              <div className="text-[10px] text-on-surface-variant font-sans-manrope leading-normal">
                {currentStep === 1 && (
                  <span>
                    <strong>匠人提示</strong>: 首先在左侧定义器物形态与胚胎底料。轻敲捶打 <strong>{targetHammers} 次</strong>，听到金属清脆撞击回响后即可成胚。
                  </span>
                )}
                {currentStep === 2 && (
                  <span>
                    <strong>匠人提示</strong>: 选择心仪的金或银细扁丝，按底稿轮廓 <strong>盘绕掐丝 ({bendCount}/{targetBends}) 次</strong>，勾勒出传世之理。
                  </span>
                )}
                {currentStep === 3 && (
                  <span>
                    <strong>点蓝技法</strong>: 从左侧调色盘点选一款极致色彩（例：青金石蓝），然后直接点击右侧壶体上、中、下的 <strong>蓝色填色区间</strong>，完成矿浆平填！
                  </span>
                )}
                {currentStep === 4 && (
                  <span>
                    <strong>入窑一刻</strong>: 烧制控制在 <strong>800℃</strong>，沙孔在火焰中逐渐晶莹熔化。若没有升到高温，矿彩浆体无法呈现晶亮玻璃质感。
                  </span>
                )}
                {currentStep === 5 && (
                  <span>
                    <strong>砥石增光</strong>: 缓缓揉搓拉动上方的 <strong>打磨滑块</strong>。粗打石去渣、细椴木出见包浆，当打满 100% 后，便可冠以传世御名并登记到您的作品集。
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Imperial Progress Scroll & Live Craft History (Span 3) */}
        <div className="lg:col-span-3">
          <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 soft-shadow min-h-[460px] flex flex-col justify-between h-full">
            
            <div className="space-y-4">
              <h2 className="font-serif-garamond text-lg font-bold text-secondary border-b border-outline-variant/20 pb-2">
                当前重器工艺铭牌
              </h2>

              {/* Live spec details list */}
              <div className="space-y-3 font-sans-manrope">
                <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/10 text-[11px] leading-relaxed">
                  <span className="block text-[8px] uppercase tracking-widest text-on-surface-variant font-bold">1. 胎骨规格:</span>
                  <span className="text-on-surface font-semibold font-serif-literata">
                    {baseBody === 'copper' ? '大内紫铜底胎 (正统铜红)' : baseBody === 'silver' ? '雪花大银胎体' : '大内特供鎏金重胎'}
                  </span>
                </div>

                <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/10 text-[11px] leading-relaxed">
                  <span className="block text-[8px] uppercase tracking-widest text-on-surface-variant font-bold">2. 掐丝样式:</span>
                  <span className="text-on-surface font-semibold font-serif-literata">
                    {bendCount >= targetBends ? `已全完 (${filigree === 'gold' ? '精掐金丝' : '精掐银丝'}) Q版盘绘` : '未完成 · 请在掐丝界面操作'}
                  </span>
                </div>

                <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/10 text-[11px] leading-relaxed">
                  <span className="block text-[8px] uppercase tracking-widest text-on-surface-variant font-bold">3. 矿蓝釉彩:</span>
                  <div className="flex gap-2.5 items-center mt-1">
                    <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: zoneColors.top }} title="上颈部釉色" />
                    <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: zoneColors.middle }} title="中部釉色" />
                    <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: zoneColors.bottom }} title="圈底釉色" />
                    <span className="text-[10px] text-on-surface font-serif-literata">填蓝三景</span>
                  </div>
                </div>

                <div className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/10 text-[11px] leading-relaxed">
                  <span className="block text-[8px] uppercase tracking-widest text-on-surface-variant font-bold">4. 物理特性:</span>
                  <div className="space-y-0.5 text-on-surface-variant text-[10px]">
                    <div className="flex justify-between">
                      <span>烧成窑温:</span>
                      <span className="font-serif-garamond text-secondary text-xs font-bold">{temperature}°C / 800°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>反射盈光:</span>
                      <span className="text-green-400 font-bold">{polishLevel}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* --- Custom CSS/HTML Modals for Iframe Safety & Royal Aesthetics --- */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#1c1412] border-2 border-[#b58b4c] max-w-md w-full rounded-xl p-6 shadow-2xl relative flex flex-col gap-5 text-center text-[#ebd8be] animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#4a1515] border border-red-500/30 flex items-center justify-center text-red-400">
                <RotateCcw className="w-6 h-6 animate-spin-slow" />
              </div>
              <h3 className="text-base font-serif-literata text-[#ffd700] font-bold mt-2">
                确定要推翻重做吗？
              </h3>
            </div>
            
            <p className="text-xs text-on-surface-variant font-serif-literata leading-relaxed">
              重打胎底、推翻重做将使当前的“景泰蓝制胎、掐丝、点蓝与烧结”等工艺进度完全归零，原先的胎型和心血将无法挽回。
            </p>

            <div className="flex gap-3 justify-center mt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-[#2a221f] text-[#ebd8be] hover:text-white border border-[#b58b4c]/30 rounded-lg text-xs font-sans-manrope font-bold transition-all cursor-pointer hover:bg-[#3d312c]"
              >
                罢手取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setHighestStepReached(1);
                  setHammerCount(0);
                  setBendCount(0);
                  setDrawnLines([]);
                  setCurrentLine([]);
                  setTemperature(120);
                  setPolishLevel(0);
                  setFiringProgress(0);
                  setIsDescEdited(false);
                  setCreatedDescription('');
                  setShowResetConfirm(false);
                }}
                className="flex-1 px-4 py-2.5 bg-[#a32a2a] text-white hover:bg-[#bd3131] rounded-lg text-xs font-sans-manrope font-bold transition-all shadow-md shadow-red-950/40 cursor-pointer"
              >
                确定推翻重来
              </button>
            </div>
          </div>
        </div>
      )}

      {warningMessage && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#1c1815] border border-[#b58b4c] max-w-sm w-full rounded-xl p-5 shadow-2xl text-center text-[#ebd8be] flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-150">
            <div className="w-10 h-10 rounded-full bg-[#3d2b1a] border border-[#b58b4c]/30 flex items-center justify-center text-[#ffd700]">
              <AlertCircle className="w-5 h-5" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#b58b4c] font-sans-manrope uppercase tracking-widest">非遗工序提示</h4>
              <p className="text-xs font-serif-literata leading-relaxed text-on-surface">
                {warningMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setWarningMessage(null)}
              className="mt-1 px-6 py-2 bg-gradient-to-r from-[#b58b4c] to-[#d4ac6a] hover:from-[#d4ac6a] hover:to-[#ffd700] text-[#1c1815] font-sans-manrope font-bold text-xs rounded-lg shadow-md transition-all active:scale-95 cursor-pointer pb-2"
            >
              吾知晓了
            </button>
          </div>
        </div>
      )}

    </div>
  );
}