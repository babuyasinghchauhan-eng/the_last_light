export type GenerationMode =
  | 'remembrance'
  | 'letter'
  | 'ghost_story'
  | 'poem'
  | 'family_history';

export type GenerationTone =
  | 'tender'
  | 'nostalgic'
  | 'hopeful'
  | 'mysterious'
  | 'poetic';

export interface GeneratedWriting {
  id: string;
  memoryId?: string;
  mode: GenerationMode;
  tone: GenerationTone;
  prompt: string;
  content: string;
  createdAt: string;
  modelUsed: string;
  isEdited?: boolean;
}

export interface Memory {
  id: string;
  personName: string;
  relationship?: string;
  birthDate?: string;
  remembranceDate?: string;
  title: string;
  story: string;
  favoriteFood?: string;
  favoriteSong?: string;
  favoritePlace?: string;
  sayings?: string;
  photoUrl?: string; // base64 data URL or local SVG portrait key
  tags: string[];
  isFavorite?: boolean;
  isArchived?: boolean;
  onAltar: boolean;
  altarDedication?: string;
  altarCandleType?: 'tall' | 'tea' | 'glass';
  isFictionalSample?: boolean;
  writings: GeneratedWriting[];
  createdAt: string;
  updatedAt: string;
}

export interface AltarItem {
  id: string;
  memoryId?: string;
  type: 'photo' | 'candle' | 'marigold' | 'bread' | 'dedication';
  tier: 1 | 2 | 3; // 3-tier ofrenda structure
  posX: number; // percentage 0 - 100 on tier shelf
  isLit?: boolean;
  customText?: string;
  photoUrl?: string;
  personName?: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  vramRequiredMB: number;
  downloadSizeApprox: string;
  license: string;
  licenseUrl: string;
  isRecommended?: boolean;
  isLowResource?: boolean;
}

export interface ModelProgressReport {
  text: string;
  progress: number; // 0 to 1
  timeElapsed?: number;
}

export type ModelState =
  | 'unloaded'
  | 'checking'
  | 'downloading'
  | 'ready'
  | 'generating'
  | 'error'
  | 'unsupported';

export interface UserSettings {
  selectedModelId: string;
  hasConsentedModelDownload: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
  showAmbientParticles: boolean;
  fontSize: 'standard' | 'large';
  autoSaveDrafts: boolean;
}

export interface BackupData {
  version: number;
  appName: string;
  exportedAt: string;
  memories: Memory[];
  altarItems: AltarItem[];
  settings: Partial<UserSettings>;
}
