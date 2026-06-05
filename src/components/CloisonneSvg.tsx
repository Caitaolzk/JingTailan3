import React from 'react';
import { Artwork } from '../types';

interface CloisonneSvgProps {
  art: Artwork;
  className?: string;
}

export default function CloisonneSvg({ art, className = "w-full h-full" }: CloisonneSvgProps) {
  const { id, vaseShape = 'celestial', baseBody = 'copper', filigree = 'gold', pattern = 'lotus', zoneColors } = art;

  // Local defaults in case they're somehow missing
  const activeZoneColors = zoneColors || {
    top: '#002570',
    middle: '#0da9ab',
    bottom: '#9d1912',
  };

  const getMetalHexColor = (mat: 'copper' | 'silver' | 'gold') => {
    switch (mat) {
      case 'copper': return '#c87533';
      case 'silver': return '#a6adb5';
      case 'gold': return '#f5c63d';
      default: return '#c87533';
    }
  };

  const getWireHexColor = (wire: 'gold' | 'silver') => {
    return wire === 'gold' ? '#ffeaa7' : '#f5f6fa';
  };

  // Generate unique IDs for SVG definitions to prevent interference in grid views
  const metalGradId = `metalGrad-${id}`;
  const wireNeonId = `wireNeon-${id}`;
  const patLotusId = `patLotus-${id}`;
  const patPhoenixId = `patPhoenix-${id}`;
  const patDragonId = `patDragon-${id}`;
  const patRendongId = `patRendong-${id}`;
  const patBaoxiangId = `patBaoxiang-${id}`;
  const patXifanlianId = `patXifanlian-${id}`;
  const patChanzhiId = `patChanzhi-${id}`;
  const polishGlowId = `polishGlow-${id}`;
  const vesselClipId = `vesselClip-${id}`;

  const currentPatternUrl = (() => {
    switch (pattern) {
      case 'lotus': return `url(#${patLotusId})`;
      case 'phoenix': return `url(#${patPhoenixId})`;
      case 'dragon': return `url(#${patDragonId})`;
      case 'rendong': return `url(#${patRendongId})`;
      case 'baoxiang': return `url(#${patBaoxiangId})`;
      case 'xifanlian': return `url(#${patXifanlianId})`;
      case 'chanzhi': return `url(#${patChanzhiId})`;
      default: return `url(#${patRendongId})`;
    }
  })();

  const metalColor = getMetalHexColor(baseBody);
  const wireColor = getWireHexColor(filigree);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 240"
        className="w-auto h-full max-h-[360px] drop-shadow-xl transition-all duration-300"
        style={{ filter: "contrast(1.05) saturate(1.15)" }}
      >
        {/* Metallic shadow plate under vessel */}
        <ellipse cx="100" cy="225" rx="55" ry="10" fill="rgba(0,0,0,0.4)" filter="blur(3px)" />

        {/* DEFINITIONS AND PATTERNS */}
        <defs>
          {/* Metal shine shader */}
          <linearGradient id={metalGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c2c2c" />
            <stop offset="40%" stopColor={metalColor} />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>

          {/* Wire glow */}
          <filter id={wireNeonId}>
            <feGaussianBlur stdDeviation="0.4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Polish Glossy Reflection Glow */}
          <filter id={polishGlowId}>
            <feGaussianBlur stdDeviation="2.5" />
          </filter>

          {/* Lotus Wire Pattern */}
          <pattern id={patLotusId} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 20,0 C 25,5 35,5 40,20 C 35,25 25,25 20,40 C 15,25 5,25 0,20 C 5,5 15,5 20,0 Z" 
              fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.65" />
          </pattern>

          {/* Phoenix Pattern */}
          <pattern id={patPhoenixId} x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 0,25 Q 12,12 25,25 T 50,25" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.6" />
            <path d="M 25,0 Q 37,12 50,0" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.6" />
          </pattern>

          {/* Dragon Waves pattern */}
          <pattern id={patDragonId} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="8" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.4" />
            <path d="M 0,15 L 30,15" stroke={wireColor} strokeWidth="0.5" opacity="0.5" />
          </pattern>

          {/* Traditional Rendong (Honeysuckle) Pattern - Wavy Scrolls inside */}
          <pattern id={patRendongId} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 0,30 C 15,10 45,10 60,30" fill="none" stroke={wireColor} strokeWidth="0.8" opacity="0.8" />
            <path d="M 0,30 C 15,50 45,50 60,30" fill="none" stroke={wireColor} strokeWidth="0.4" strokeDasharray="1,1" opacity="0.5" />
            <path d="M 15,20 C 10,15 12,6 20,5 C 28,4 32,12 28,18 C 24,24 16,22 18,15 C 20,10 25,12 24,16" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.85" />
            <path d="M 45,40 C 50,45 48,54 40,55 C 32,56 28,48 32,42 C 36,36 44,38 42,45 C 40,50 35,48 36,44" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.85" />
            <path d="M 30,30 C 35,22 30,12 25,15 C 22,22 26,26 30,30 Z" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.75" />
            <path d="M 30,30 C 40,28 42,18 36,15 C 31,20 32,25 30,30 Z" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.75" />
            <path d="M 30,30 C 20,32 18,22 24,18 C 28,21 28,26 30,30 Z" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.75" />
            <path d="M 5,20 Q 8,12 12,15" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.6" />
            <path d="M 55,40 Q 52,48 48,45" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.6" />
          </pattern>

          {/* Traditional Baoxiang Flower Pattern - Symmetrical Rosettes */}
          <pattern id={patBaoxiangId} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="6" fill="none" stroke={wireColor} strokeWidth="0.8" opacity="0.9" />
            <circle cx="40" cy="40" r="14" fill="none" stroke={wireColor} strokeWidth="0.5" strokeDasharray="1,2" opacity="0.6" />
            
            <path d="M 40,18 C 45,26 45,30 40,32 C 35,30 35,26 40,18 Z" fill="none" stroke={wireColor} strokeWidth="0.7" opacity="0.95" />
            <path d="M 40,22 C 43,26 43,29 40,30 C 37,29 37,26 40,22 Z" fill="none" stroke={wireColor} strokeWidth="0.4" opacity="0.8" />

            <path d="M 40,62 C 45,54 45,50 40,48 C 35,50 35,54 40,62 Z" fill="none" stroke={wireColor} strokeWidth="0.7" opacity="0.95" />
            <path d="M 40,58 C 43,54 43,51 40,50 C 37,51 37,54 40,58 Z" fill="none" stroke={wireColor} strokeWidth="0.4" opacity="0.8" />

            <path d="M 18,40 C 26,45 30,45 32,40 C 30,35 26,35 18,40 Z" fill="none" stroke={wireColor} strokeWidth="0.7" opacity="0.95" />
            <path d="M 22,40 C 26,43 29,43 30,40 C 29,37 26,37 22,40 Z" fill="none" stroke={wireColor} strokeWidth="0.4" opacity="0.8" />

            <path d="M 62,40 C 54,45 50,45 48,40 C 50,35 54,35 62,40 Z" fill="none" stroke={wireColor} strokeWidth="0.7" opacity="0.95" />
            <path d="M 58,40 C 54,43 51,43 50,40 C 51,37 54,37 58,40 Z" fill="none" stroke={wireColor} strokeWidth="0.4" opacity="0.8" />

            <path d="M 40,40 Q 25,25 22,28 C 18,31 22,37 40,40 Z" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.8" />
            <path d="M 40,40 Q 55,25 58,28 C 62,31 58,37 40,40 Z" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.8" />
            <path d="M 40,40 Q 25,55 22,52 C 18,49 22,43 40,40 Z" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.8" />
            <path d="M 40,40 Q 55,55 58,52 C 62,49 58,43 40,40 Z" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.8" />

            <path d="M 12,12 C 18,6 24,14 18,18 C 12,22 6,14 12,12 M 14,14 C 18,10 21,15 18,18" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.75" />
            <path d="M 68,12 C 62,6 56,14 62,18 C 68,22 74,14 68,12 M 66,14 C 62,10 59,15 62,18" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.75" />
            <path d="M 12,68 C 18,74 24,66 18,62 C 12,58 6,66 12,68 M 14,66 C 18,70 21,65 18,62" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.75" />
            <path d="M 68,68 C 62,74 56,66 62,62 C 68,58 74,66 68,68 M 66,66 C 62,70 59,65 62,62" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.75" />

            <path d="M 40,0 L 40,12 M 40,68 L 40,80 M 0,40 L 12,40 M 68,40 L 80,40" stroke={wireColor} strokeWidth="0.4" strokeDasharray="3,3" opacity="0.5" />
          </pattern>

          {/* Traditional Xifanlian (Passion/Clematis) Pattern */}
          <pattern id={patXifanlianId} x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
            <path d="M 0,35 C 10,25 20,45 35,35 C 50,25 60,45 70,35" fill="none" stroke={wireColor} strokeWidth="0.75" opacity="0.8" />
            <path d="M 0,35 C 10,45 20,25 35,35 C 50,45 60,25 70,35" fill="none" stroke={wireColor} strokeWidth="0.4" strokeDasharray="1,1" opacity="0.4" />
            
            <circle cx="35" cy="35" r="4" fill="none" stroke={wireColor} strokeWidth="0.7" opacity="0.9" />
            <path d="M 35,26 C 38,28 38,32 35,35 C 32,32 32,28 35,26 Z" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.8" />
            <path d="M 35,44 C 38,42 38,38 35,35 C 32,38 32,42 35,44 Z" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.8" />
            <path d="M 26,35 C 28,38 32,38 35,35 C 32,32 28,32 26,35 Z" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.8" />
            <path d="M 44,35 C 42,38 38,38 35,35 C 38,32 42,32 44,35 Z" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.8" />
            
            <path d="M 23,23 C 18,20 12,24 15,31 C 18,34 23,30 23,23 C 23,17 17,14 13,18" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.85" />
            <path d="M 18,25 C 16,21 12,21 14,24" fill="none" stroke={wireColor} strokeWidth="0.4" opacity="0.7" />
            <path d="M 47,23 C 52,20 58,24 55,31 C 52,34 47,30 47,23 C 47,17 53,14 57,18" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.85" />
            <path d="M 52,25 Q 54,21 58,21 T 56,24" fill="none" stroke={wireColor} strokeWidth="0.4" opacity="0.7" />
            <path d="M 23,47 C 18,50 12,46 15,39 C 18,36 23,40 23,47 C 23,53 17,56 13,52" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.85" />
            <path d="M 18,45 C 16,49 12,49 14,46" fill="none" stroke={wireColor} strokeWidth="0.4" opacity="0.7" />
            <path d="M 47,47 C 52,50 58,46 55,39 C 52,36 47,40 47,47 C 47,53 53,56 57,52" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.85" />
            <path d="M 52,45 C 54,49 58,49 56,46" fill="none" stroke={wireColor} strokeWidth="0.4" opacity="0.7" />

            <path d="M 35,8 C 28,12 25,6 30,3 Q 35,5 35,8" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.7" />
            <path d="M 35,62 C 42,58 45,64 40,67 Q 35,65 35,62" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.7" />
          </pattern>

          {/* Traditional Chanzhi (Scrolling Lotus) Pattern */}
          <pattern id={patChanzhiId} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 0,30 C 15,10 45,50 60,30" fill="none" stroke={wireColor} strokeWidth="0.8" opacity="0.85" />
            <path d="M 0,30 C 15,50 45,10 60,30" fill="none" stroke={wireColor} strokeWidth="0.4" strokeDasharray="1,1" opacity="0.4" />

            <circle cx="30" cy="30" r="3" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.9" />
            <path d="M 30,17 C 32,23 32,25 30,27 C 28,25 28,23 30,17 Z" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.9" />
            <path d="M 30,27 Q 38,19 41,23 Q 36,29 30,27 Z" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.85" />
            <path d="M 30,27 Q 42,28 41,33 Q 34,32 30,27 Z" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.85" />
            <path d="M 30,27 Q 22,19 19,23 Q 24,29 30,27 Z" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.85" />
            <path d="M 30,27 Q 18,28 19,33 Q 26,32 30,27 Z" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.85" />
            <path d="M 30,27 Q 35,39 28,41 Q 26,35 30,27 Z" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.85" />
            <path d="M 30,27 Q 25,39 32,41 Q 34,35 30,27 Z" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.85" />

            <path d="M 12,20 C 15,15 10,10 7,12 C 4,14 8,22 12,20" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.8" />
            <path d="M 48,40 C 45,45 50,50 53,48 C 56,46 52,38 48,40" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.8" />
            
            <path d="M 15,14 Q 22,12 18,8" fill="none" stroke={wireColor} strokeWidth="0.4" opacity="0.7" />
            <path d="M 45,46 Q 38,48 42,52" fill="none" stroke={wireColor} strokeWidth="0.4" opacity="0.7" />
          </pattern>

          {/* Vessel Clip Path to restrict drawings and fill patterns perfectly inside the vase boundaries */}
          <clipPath id={vesselClipId}>
            {vaseShape === 'celestial' && (
              <>
                <path d="M 80,30 L 120,30 L 115,70 L 85,70 Z" />
                <path d="M 85,70 L 115,70 Q 155,100 155,145 Q 155,190 115,200 L 85,200 Q 45,190 45,145 Q 45,100 85,70 Z" />
                <path d="M 85,200 L 115,200 L 110,218 L 90,218 Z" />
              </>
            )}
            {vaseShape === 'gourd' && (
              <>
                <path d="M 85,30 L 115,30 L 115,40 Q 130,55 130,75 Q 130,95 115,105 L 85,105 Q 70,95 70,75 Q 70,55 85,40 Z" />
                <path d="M 88,105 L 112,105 Q 150,120 150,160 Q 150,200 115,210 L 85,210 Q 50,200 50,160 Q 50,120 88,105 Z" />
                <path d="M 85,210 L 115,210 L 110,222 L 90,222 Z" />
              </>
            )}
            {vaseShape === 'basin' && (
              <>
                <path d="M 50,45 L 150,45 L 140,75 L 60,75 Z" />
                <path d="M 58,75 L 142,75 Q 170,115 170,165 Q 170,210 140,215 L 60,215 Q 30,210 30,165 Q 30,115 58,75 Z" />
                <path d="M 60,215 L 140,215 L 132,226 L 68,226 Z" />
              </>
            )}
          </clipPath>
        </defs>

        {/* THE CORE VESSEL BASE */}
        
        {/* Celestial Vase Paths */}
        {vaseShape === 'celestial' && (
          <g>
            {/* Neck Zone (Top) */}
            <path
              d="M 80,30 L 120,30 L 115,70 L 85,70 Z"
              fill={activeZoneColors.top}
              stroke={wireColor}
              strokeWidth="1"
            />
            {/* Upper Rim golden line */}
            <path d="M 80,30 L 120,30" stroke={wireColor} strokeWidth="1.5" />

            {/* Belly Zone (Middle) */}
            <path
              d="M 85,70 L 115,70 Q 155,100 155,145 Q 155,190 115,200 L 85,200 Q 45,190 45,145 Q 45,100 85,70 Z"
              fill={activeZoneColors.middle}
              stroke={wireColor}
              strokeWidth="1"
            />

            {/* Ring Base (Bottom) */}
            <path
              d="M 85,200 L 115,200 L 110,218 L 90,218 Z"
              fill={activeZoneColors.bottom}
              stroke={wireColor}
              strokeWidth="1"
            />
            <path d="M 90,218 L 110,218" stroke={wireColor} strokeWidth="1.5" />
          </g>
        )}

        {/* Gourd Vase Paths */}
        {vaseShape === 'gourd' && (
          <g>
            {/* Top Neck & Top bulb */}
            <path
              d="M 85,30 L 115,30 L 115,40 Q 130,55 130,75 Q 130,95 115,105 L 85,105 Q 70,95 70,75 Q 70,55 85,40 Z"
              fill={activeZoneColors.top}
              stroke={wireColor}
              strokeWidth="1"
            />
            <path d="M 85,30 L 115,30" stroke={wireColor} strokeWidth="1.5" />

            {/* Low Belly Gourd */}
            <path
              d="M 88,105 L 112,105 Q 150,120 150,160 Q 150,200 115,210 L 85,210 Q 50,200 50,160 Q 50,120 88,105 Z"
              fill={activeZoneColors.middle}
              stroke={wireColor}
              strokeWidth="1"
            />

            {/* Lower Ring Base */}
            <path
              d="M 85,210 L 115,210 L 110,222 L 90,222 Z"
              fill={activeZoneColors.bottom}
              stroke={wireColor}
              strokeWidth="1"
            />
            <path d="M 90,222 L 110,222" stroke={wireColor} strokeWidth="1.5" />
          </g>
        )}

        {/* Imperial Basin / wash basin shape */}
        {vaseShape === 'basin' && (
          <g>
            {/* Top flared Rim */}
            <path
              d="M 50,45 L 150,45 L 140,75 L 60,75 Z"
              fill={activeZoneColors.top}
              stroke={wireColor}
              strokeWidth="1"
            />
            <path d="M 50,45 L 150,45" stroke={wireColor} strokeWidth="1.5" />

            {/* Main rounded basin ring */}
            <path
              d="M 58,75 L 142,75 Q 170,115 170,165 Q 170,210 140,215 L 60,215 Q 30,210 30,165 Q 30,115 58,75 Z"
              fill={activeZoneColors.middle}
              stroke={wireColor}
              strokeWidth="1"
            />

            {/* Base circle footer */}
            <path
              d="M 60,215 L 140,215 L 132,226 L 68,226 Z"
              fill={activeZoneColors.bottom}
              stroke={wireColor}
              strokeWidth="1"
            />
            <path d="M 68,226 L 132,226" stroke={wireColor} strokeWidth="1.5" />
          </g>
        )}

        {/* FILIGREE PATTERNS OVERLAY */}
        <g pointerEvents="none" clipPath={`url(#${vesselClipId})`}>
          {(!art.drawnLines || art.drawnLines.length === 0) ? (
            <>
              {/* Masked pattern representation wrapping within belly bounds */}
              {vaseShape === 'celestial' && (
                <path
                  d="M 85,73 L 115,73 Q 152,100 152,145 Q 152,187 115,197 L 85,197 Q 48,187 48,145 Q 48,100 85,73 Z"
                  fill={currentPatternUrl}
                  opacity="0.85"
                />
              )}

              {vaseShape === 'gourd' && (
                <path
                  d="M 88,107 L 112,107 Q 147,120 147,160 Q 147,197 115,207 L 85,207 Q 53,197 53,160 Q 53,120 88,107 Z"
                  fill={currentPatternUrl}
                  opacity="0.85"
                />
              )}

              {vaseShape === 'basin' && (
                <path
                  d="M 58,77 L 142,77 Q 167,115 167,165 Q 167,207 140,212 L 60,212 Q 33,207 33,165 Q 33,115 58,77 Z"
                  fill={currentPatternUrl}
                  opacity="0.85"
                />
              )}

              {/* Symmetrical wire highlights for royal craftsman feeling */}
              <g filter={`url(#${wireNeonId})`} opacity="0.9">
                <path d="M 100,50 Q 82,35 68,145 T 100,215" fill="none" stroke={wireColor} strokeWidth="0.8" />
                <path d="M 100,50 Q 118,35 132,145 T 100,215" fill="none" stroke={wireColor} strokeWidth="0.8" />
              </g>
            </>
          ) : (
            <g id={`customUserFiligree-${id}`} filter={`url(#${wireNeonId})`}>
              {art.drawnLines.map((line, idx) => (
                <path
                  key={idx}
                  d={line.map((p, pIdx) => `${pIdx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                  fill="none"
                  stroke={wireColor}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </g>
          )}
        </g>

        {/* POLISH REFLECTION OVERLAY: Full glossy highlight representing 100% polish */}
        <g id={`polishReflection-${id}`} pointerEvents="none">
          {vaseShape === 'celestial' && (
            <>
              {/* Neck contour highlight */}
              <path
                d="M 90,33 Q 91,50 92,67"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.48"
                filter={`url(#${polishGlowId})`}
              />
              {/* Belly contour highlight following the vase shoulder and belly bulge */}
              <path
                d="M 88,78 Q 63,110 63,145 Q 63,180 88,192"
                fill="none"
                stroke="#ffffff"
                strokeWidth="4.2"
                strokeLinecap="round"
                opacity="0.55"
                filter={`url(#${polishGlowId})`}
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
                opacity="0.45"
                filter={`url(#${polishGlowId})`}
              />
              {/* Upper bulb contour highlight */}
              <path
                d="M 89,43 Q 78,60 78,75 Q 78,90 89,102"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.5"
                filter={`url(#${polishGlowId})`}
              />
              {/* Lower bulb contour highlight following the bottom belly sphere */}
              <path
                d="M 91,111 Q 67,135 67,160 Q 67,185 88,204"
                fill="none"
                stroke="#ffffff"
                strokeWidth="4.2"
                strokeLinecap="round"
                opacity="0.55"
                filter={`url(#${polishGlowId})`}
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
                opacity="0.48"
                filter={`url(#${polishGlowId})`}
              />
              {/* Rounded basin side highlight following the wide bottom contour */}
              <path
                d="M 72,80 Q 50,115 50,165 Q 50,203 72,212"
                fill="none"
                stroke="#ffffff"
                strokeWidth="4.5"
                strokeLinecap="round"
                opacity="0.55"
                filter={`url(#${polishGlowId})`}
              />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
