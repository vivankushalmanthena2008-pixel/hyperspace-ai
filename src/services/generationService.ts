import type { ColorSwatch, CreativeBrief, VisualStyle } from '@/types';

type GenerateParams = {
  prompt: string;
  style: VisualStyle;
};

type GenerateResult = CreativeBrief;

interface GenerationService {
  generate(params: GenerateParams): Promise<GenerateResult>;
  isDemoMode(): boolean;
}

const STYLE_PALETTES: Record<VisualStyle, ColorSwatch[]> = {
  minimalist: [
    { name: 'Pure White', hex: '#FFFFFF', usage: 'Backgrounds' },
    { name: 'Obsidian', hex: '#0A0A0A', usage: 'Text, contrast' },
    { name: 'Soft Gray', hex: '#D4D4D8', usage: 'Borders, dividers' },
    { name: 'Accent Blue', hex: '#3B82F6', usage: 'CTAs, links' },
    { name: 'Light Gray', hex: '#F4F4F5', usage: 'Surface fills' },
  ],
  'bold-typographic': [
    { name: 'Ink Black', hex: '#111111', usage: 'Primary text' },
    { name: 'Electric Red', hex: '#EF4444', usage: 'Highlights' },
    { name: 'Off-White', hex: '#FAFAF9', usage: 'Background' },
    { name: 'Mustard', hex: '#EAB308', usage: 'Accents' },
    { name: 'Deep Blue', hex: '#1E3A8A', usage: 'Secondary accents' },
  ],
  'organic-natural': [
    { name: 'Forest Green', hex: '#2D5A3D', usage: 'Primary' },
    { name: 'Warm Sand', hex: '#D4B896', usage: 'Backgrounds' },
    { name: 'Terracotta', hex: '#C66B3D', usage: 'Accents' },
    { name: 'Cream', hex: '#F5F0E8', usage: 'Light surfaces' },
    { name: 'Slate Brown', hex: '#5C4A3A', usage: 'Text' },
  ],
  'futuristic-cyberpunk': [
    { name: 'Neon Cyan', hex: '#22D3EE', usage: 'Primary glow' },
    { name: 'Hot Magenta', hex: '#EC4899', usage: 'Secondary glow' },
    { name: 'Deep Space', hex: '#030014', usage: 'Background' },
    { name: 'Electric Violet', hex: '#8B5CF6', usage: 'Tertiary accents' },
    { name: 'Toxic Green', hex: '#4ADE80', usage: 'Data, highlights' },
  ],
  'retro-vintage': [
    { name: 'Mustard Yellow', hex: '#D4A017', usage: 'Primary' },
    { name: 'Burnt Orange', hex: '#CC5500', usage: 'Accents' },
    { name: 'Cream Paper', hex: '#F0E6D2', usage: 'Background' },
    { name: 'Teal', hex: '#2A7B7B', usage: 'Secondary' },
    { name: 'Dark Brown', hex: '#3E2723', usage: 'Text' },
  ],
  'luxury-editorial': [
    { name: 'Champagne Gold', hex: '#C5A572', usage: 'Primary accent' },
    { name: 'Onyx Black', hex: '#0C0C0C', usage: 'Background, text' },
    { name: 'Ivory', hex: '#FFFFF0', usage: 'Light surfaces' },
    { name: 'Deep Burgundy', hex: '#5C0A20', usage: 'Secondary accent' },
    { name: 'Warm Gray', hex: '#A8A29E', usage: 'Subtle elements' },
  ],
  'playful-vibrant': [
    { name: 'Sunny Yellow', hex: '#FCD34D', usage: 'Primary energy' },
    { name: 'Hot Pink', hex: '#F472B6', usage: 'Secondary' },
    { name: 'Sky Blue', hex: '#38BDF8', usage: 'Tertiary' },
    { name: 'Mint Green', hex: '#34D399', usage: 'Accents' },
    { name: 'Soft Purple', hex: '#A78BFA', usage: 'Highlights' },
  ],
  'dark-moody': [
    { name: 'Charcoal', hex: '#1A1A1A', usage: 'Primary background' },
    { name: 'Blood Red', hex: '#8B0000', usage: 'Dramatic accent' },
    { name: 'Steel Gray', hex: '#4A4A4A', usage: 'Mid-tones' },
    { name: 'Amber Gold', hex: '#B8860B', usage: 'Highlight accent' },
    { name: 'Deep Teal', hex: '#0D3B3B', usage: 'Secondary accent' },
  ],
};

const STYLE_TYPOGRAPHY: Record<VisualStyle, string> = {
  minimalist: 'Inter or Helvetica Neue — single sans-serif, varied weights (300/500/700). Wide letter-spacing for headers.',
  'bold-typographic': 'Space Grotesk or Archia for display, Inter for body. Oversized headlines (72px+), tight leading, uppercase subheads.',
  'organic-natural': 'Cormorant Garamond for display, Nunito Sans for body. Soft serifs paired with rounded sans for warmth.',
  'futuristic-cyberpunk': 'JetBrains Mono or Orbitron for display, Inter for body. Glitch effects on headings, monospace for data labels.',
  'retro-vintage': 'Playfair Display or Abril Fatface for display, Lora for body. Textured overlays, letterpress-style shadows on headings.',
  'luxury-editorial': 'Bodoni Moda or Playfair Display for display, Inter for body. Extra-wide tracking, thin weights for elegance. Gold foil effects on key headings.',
  'playful-vibrant': 'Poppins Bold or Fredoka for display, Nunito for body. Rounded, friendly letterforms. Mix of weights for playful hierarchy.',
  'dark-moody': 'Cormorant Garamond for display, Inter for body. High contrast between thin display serif and solid sans body. Dramatic size shifts.',
};

const STYLE_MOOD: Record<VisualStyle, string[]> = {
  minimalist: ['serene', 'precise', 'uncluttered', 'intentional', 'breathing'],
  'bold-typographic': ['confident', 'loud', 'structured', 'high-impact', 'declarative'],
  'organic-natural': ['grounded', 'warm', 'flowing', 'alive', 'tactile'],
  'futuristic-cyberpunk': ['electric', 'immersive', 'edge', 'kinetic', 'otherworldly'],
  'retro-vintage': ['nostalgic', 'handcrafted', 'warm-toned', 'textured', 'timeless'],
  'luxury-editorial': ['sophisticated', 'exclusive', 'refined', 'aspirational', 'understated'],
  'playful-vibrant': ['energetic', 'joyful', 'approachable', 'dynamic', 'optimistic'],
  'dark-moody': ['mysterious', 'dramatic', 'intense', 'cinematic', 'atmospheric'],
};

const STYLE_DIRECTIONS: Record<VisualStyle, string> = {
  minimalist:
    'Negative space is the primary design tool. Use a single accent color sparingly. Grid-based layout with generous margins. Content hierarchy through size and weight, not color. Every element must earn its place.',
  'bold-typographic':
    'Typography is the hero. Oversized display text commands attention against structured grids. Use color blocks sparingly — let type carry the emotion. High contrast between black and white, with one or two bold accent colors for emphasis.',
  'organic-natural':
    'Flowing, asymmetric layouts inspired by natural forms. Use organic shapes, soft gradients, and subtle textures. Avoid sharp corners. Layered transparency creates depth. Photography should feel warm and natural, not studio-lit.',
  'futuristic-cyberpunk':
    'Deep dark backgrounds with neon accents that glow and pulse. Glitch effects, scan lines, and data overlays. Grid-based with intentional breaks. UI elements feel like they belong in a HUD. Light is additive — elements emit, not reflect.',
  'retro-vintage':
    'Aged textures, halftone patterns, and muted warm tones. Design elements feel printed, not screen-rendered. Use vintage-style illustrations and bold retro typography. Subtle paper grain overlay unifies the aesthetic.',
  'luxury-editorial':
    'Magazine-inspired layouts with dramatic photography. Extremely generous whitespace. Thin gold lines as dividers and accents. Content is presented in editorial columns. Every detail feels considered — from kerning to the texture of backgrounds.',
  'playful-vibrant':
    'Bright, saturated colors used boldly. Rounded shapes and organic blobs. Motion is bouncy and exaggerated. Illustrations over photography. Layouts break the grid intentionally for energy. Nothing takes itself too seriously.',
  'dark-moody':
    'Low-key lighting aesthetic. Heavy shadows with selective highlights. Desaturated palette with one dramatic accent color. Photography is atmospheric and cinematic. Layout creates tension through asymmetry and negative space.',
};

const CONCEPT_TEMPLATES = [
  (prompt: string) =>
    `A creative system for "${prompt}" that blends strategic clarity with visual identity. The concept centers on communicating the core value through layered visual storytelling — each touchpoint builds on the last, creating a cohesive narrative arc that guides the audience from curiosity to conviction.`,
  (prompt: string) =>
    `"${prompt}" reimagined as a sensory experience. The concept treats every interaction as a moment of discovery — from the first impression to the deepest engagement. Visual language is consistent yet adaptive, expanding and contracting to serve context while maintaining a recognizable signature.`,
  (prompt: string) =>
    `An identity ecosystem for "${prompt}" built on a foundation of bold simplicity. The approach strips away excess to reveal the essential, then layers in personality through texture, motion, and intentional detail. The result feels both timeless and distinctly modern.`,
  (prompt: string) =>
    `"${prompt}" expressed as a living visual language. The concept uses dynamic elements that respond to context and user behavior, creating a sense that the brand is alive and attentive. Static moments are punctuated by subtle animation that rewards attention.`,
];

const ASSET_TEMPLATES: Record<VisualStyle, string[]> = {
  minimalist: [
    'Hero image: wide-aspect product photography on pure white, soft shadow',
    'Icon set: 24px line icons, 1.5px stroke, rounded corners',
    'Texture: subtle paper grain at 3% opacity for warmth',
    'Motion: 200ms ease-out transitions on hover, no decorative animation',
  ],
  'bold-typographic': [
    'Display type specimen: custom lettering for hero headline',
    'Color blocks: 4 flat color panels for section dividers',
    'Photography: high-contrast black and white portraits',
    'Print-ready poster: A2 format, CMYK, bleed included',
  ],
  'organic-natural': [
    'Hero image: golden-hour outdoor photography, shallow depth of field',
    'Shape library: hand-drawn organic blobs and flowing dividers (SVG)',
    'Texture pack: linen, stone, and wood grain overlays',
    'Illustration set: botanical line drawings, single-weight strokes',
  ],
  'futuristic-cyberpunk': [
    '3D render: holographic UI panel with emissive materials',
    'Glitch pack: RGB-split and datamosh overlays for video',
    'Icon set: 16px neon-outline icons with glow filters',
    'Background loops: animated particle fields and grid distortions',
  ],
  'retro-vintage': [
    'Texture pack: aged paper, halftone dots, and film grain overlays',
    'Illustration: retro-style badge or emblem for branding',
    'Typography specimen: display font with letterpress shadow effect',
    'Color separations: limited 3-color print palette for authenticity',
  ],
  'luxury-editorial': [
    'Hero photography: dramatic studio lighting, deep shadows, gold accents',
    'Custom monogram: refined letterform logo with gold foil treatment',
    'Pattern: subtle geometric damask for backgrounds at 5% opacity',
    'Print collateral: business card and letterhead template, embossed finish',
  ],
  'playful-vibrant': [
    'Illustration set: 10 flat-style character illustrations in brand colors',
    'Shape pack: organic blobs, confetti bursts, and wavy dividers',
    'Animation: bounce and overshoot keyframes for UI interactions',
    'Sticker pack: 20 expressive emoji-style stickers for social',
  ],
  'dark-moody': [
    'Hero image: low-key cinematic photography, single light source',
    'Texture: smoke and fog overlays for atmospheric depth',
    'Light leaks: selective bloom and glow elements for highlights',
    'Video background: slow-motion atmospheric clip, muted and grainy',
  ],
};

const STEP_TEMPLATES = [
  (prompt: string) => [
    `Define the primary audience for "${prompt}" — write a one-paragraph persona statement.`,
    'Mood board: collect 15-20 visual references that align with the concept and style direction.',
    'Create a style tile: combine the color palette, typography, and 3 key UI elements on a single board.',
    'Draft the hero section copy — headline, subheadline, and primary CTA — in the brand voice.',
    'Prototype the top 3 user flows and test with 5 people before building production assets.',
  ],
  (prompt: string) => [
    `Write a positioning statement for "${prompt}" using the formula: "For [audience] who [need], [product] is a [category] that [benefit]."` ,
    'Build a wireframe of the primary landing experience — focus on information hierarchy before visual design.',
    'Source or commission the hero asset described in the suggested assets list.',
    'Design 2-3 alternative layouts for the hero section and A/B test the strongest two.',
    'Define success metrics: primary conversion action, engagement rate, and time-to-value.',
  ],
  (prompt: string) => [
    `Distill "${prompt}" into 3 core messages — rank them by importance to the audience.`,
    'Create a component library: buttons, cards, inputs, and navigation in the defined visual style.',
    'Develop the motion design language — define timing, easing, and which elements animate.',
    'Write microcopy for all interactive elements — buttons, forms, empty states, and errors.',
    'Plan a soft launch: gather feedback from 20 target users before the full rollout.',
  ],
];

function pickByHash<T>(arr: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return arr[Math.abs(hash) % arr.length];
}

function generateTitle(prompt: string, style: VisualStyle): string {
  const styleLabels: Record<VisualStyle, string[]> = {
    minimalist: ['Essential', 'Pure', 'Stripped'],
    'bold-typographic': ['Bold', 'Amplified', 'Unfiltered'],
    'organic-natural': ['Rooted', 'Organic', 'Living'],
    'futuristic-cyberpunk': ['Neon', 'Future State', 'Hyperlinked'],
    'retro-vintage': ['Heritage', 'Analog', 'Timeless'],
    'luxury-editorial': ['Curated', 'Atelier', 'Signature'],
    'playful-vibrant': ['Playbook', 'Electric', 'Joyride'],
    'dark-moody': ['Shadow', 'Nocturne', 'After Dark'],
  };
  const labels = styleLabels[style];
  const label = pickByHash(labels, prompt);
  const trimmed = prompt.length > 30 ? prompt.slice(0, 30).trim() + '…' : prompt;
  return `${label}: ${trimmed}`;
}

function generateDemoBrief(prompt: string, style: VisualStyle): CreativeBrief {
  const seed = `${prompt}-${style}`;
  const conceptFn = pickByHash(CONCEPT_TEMPLATES, seed);
  const stepsFn = pickByHash(STEP_TEMPLATES, seed + 'steps');
  const assets = ASSET_TEMPLATES[style];

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    prompt,
    style,
    title: generateTitle(prompt, style),
    concept: conceptFn(prompt),
    visualDirection: STYLE_DIRECTIONS[style],
    colorPalette: STYLE_PALETTES[style],
    typography: STYLE_TYPOGRAPHY[style],
    suggestedAssets: assets,
    nextSteps: stepsFn(prompt),
    moodKeywords: STYLE_MOOD[style],
    createdAt: Date.now(),
    isDemo: true,
    demoNote: 'Generated offline in simulation mode.',
  };
}

export const generationService: GenerationService = {
  isDemoMode() {
    return false;
  },

  async generate({ prompt, style }): Promise<GenerateResult> {
    try {
      const response = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });

      if (response.ok) {
        const brief = await response.json();
        return brief;
      }
    } catch (err) {
      console.warn('[GenerationService] Could not reach backend, falling back to local simulation:', err);
    }

    // Client-side fallback if server unreachable
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return generateDemoBrief(prompt, style);
  },
};
