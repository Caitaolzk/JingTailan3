export type AppScreen = 'login' | 'register' | 'forgot_password' | 'workstation' | 'community' | 'portfolio' | 'upload';

export interface UserProfile {
  nickname: string;
  email: string;
  title?: string;
  avatar?: string;
  levelFiligree: number;
  levelEnamel: number;
  completedCount: number;
  followersCount: number;
}

export type ArtworkStatus = 'completed' | 'firing' | 'filigree' | 'draft';

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  tags: string[];
  image: string;
  description: string;
  materials: string[];
  status: ArtworkStatus;
  likes: number;
  isFavorite: boolean;
  isPublished?: boolean; // Add this
  progressPercent?: number; // for active progress
  progressMaxLabel?: string;
  progressMinLabel?: string;
  firingTemp?: number;
  vaseShape?: 'celestial' | 'gourd' | 'basin';
  baseBody?: 'copper' | 'silver' | 'gold';
  filigree?: 'gold' | 'silver';
  pattern?: 'lotus' | 'phoenix' | 'dragon' | 'rendong' | 'baoxiang' | 'xifanlian' | 'chanzhi';
  zoneColors?: { top: string; middle: string; bottom: string };
  drawnLines?: { x: number; y: number }[][];
}
