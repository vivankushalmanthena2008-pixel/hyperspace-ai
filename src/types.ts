export type VisualStyle =
  | 'minimalist'
  | 'bold-typographic'
  | 'organic-natural'
  | 'futuristic-cyberpunk'
  | 'retro-vintage'
  | 'luxury-editorial'
  | 'playful-vibrant'
  | 'dark-moody';

export interface ColorSwatch {
  name: string;
  hex: string;
  usage: string;
}

export interface CreativeBrief {
  id: string;
  prompt: string;
  style: VisualStyle;
  title: string;
  concept: string;
  visualDirection: string;
  colorPalette: ColorSwatch[];
  typography: string;
  suggestedAssets: string[];
  nextSteps: string[];
  moodKeywords: string[];
  createdAt: number;
  isDemo: boolean;
  demoNote?: string;
}

export interface StyleOption {
  value: VisualStyle;
  label: string;
  description: string;
  icon: string;
}

export const STYLE_OPTIONS: StyleOption[] = [
  {
    value: 'minimalist',
    label: 'Minimalist',
    description: 'Clean, spacious, essential',
    icon: 'Circle',
  },
  {
    value: 'bold-typographic',
    label: 'Bold Typographic',
    description: 'Type-driven, high contrast',
    icon: 'Type',
  },
  {
    value: 'organic-natural',
    label: 'Organic & Natural',
    description: 'Earthy, flowing, warm',
    icon: 'Leaf',
  },
  {
    value: 'futuristic-cyberpunk',
    label: 'Futuristic / Cyberpunk',
    description: 'Neon, glitch, high-tech',
    icon: 'Cpu',
  },
  {
    value: 'retro-vintage',
    label: 'Retro / Vintage',
    description: 'Nostalgic, textured, analog',
    icon: 'Clock',
  },
  {
    value: 'luxury-editorial',
    label: 'Luxury Editorial',
    description: 'Refined, premium, elegant',
    icon: 'Crown',
  },
  {
    value: 'playful-vibrant',
    label: 'Playful & Vibrant',
    description: 'Colorful, energetic, fun',
    icon: 'Palette',
  },
  {
    value: 'dark-moody',
    label: 'Dark & Moody',
    description: 'Atmospheric, dramatic, shadowed',
    icon: 'Moon',
  },
];
