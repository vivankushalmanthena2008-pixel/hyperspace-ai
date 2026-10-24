import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('[HyperSpace AI] Could not initialize GoogleGenAI:', err);
  }
}

// Multilingual system instructions
const SYSTEM_INSTRUCTION = `
You are the HyperSpace AI Assistant — an expert creative intelligence companion built into the HyperSpace AI platform.
HyperSpace AI helps founders, art directors, and creators turn text prompts into comprehensive, structured creative briefs.
Key product knowledge:
- Output contents of a brief: Project Title, Concept Statement, Visual Direction Strategy, Color Palette (with HEX codes and usage rules), Typography Recommendations, Suggested Assets Checklist, and Prioritized Actionable Next Steps.
- Eight Curated Visual Styles:
  1. Minimalist (clean, generous whitespace, monochrome with single accent)
  2. Bold Typographic (oversized display type, high-contrast, editorial hierarchy)
  3. Organic & Natural (flowing curves, earth tones, warm natural textures)
  4. Futuristic / Cyberpunk (neon glows, dark backgrounds, high-tech HUD geometry)
  5. Retro / Vintage (aged textures, warm analog nostalgia, classic serif pairings)
  6. Luxury Editorial (haute couture elegance, gold accents, spacious typography)
  7. Playful & Vibrant (high-saturation, bouncy geometric elements, joyful energy)
  8. Dark & Moody (cinematic chiaroscuro, desaturated shadows with selective highlights)
- WebGL 3D World: Features a real-time refractive glass sphere holding a procedural cyberpunk city, orbital maglev highways, and particle fields.
- Audio Engine: Zero-404 procedural Web Audio API synthesizer featuring ambient cosmic drone pads and tactile sound effects.

User assistance rules:
1. Always respond in the specific language requested by the user.
2. Be inspiring, articulate, concise, and practically helpful.
3. Suggest concrete prompt refinements and explain which visual style best suits their industry.
4. Keep replies formatted with clean markdown bullets or short paragraphs.
`;

// Multilingual fallback replies for when no API key is configured or offline
const DEMO_RESPONSES: Record<string, (msg: string) => string> = {
  en_IN: (msg) =>
    `Hello! I'm your HyperSpace AI Assistant. In simulation demo mode, here is how you can get the best creative brief for "${msg.slice(0, 40)}":\n\n- **Recommended Style**: If you want modern authority, choose *Minimalist* or *Bold Typographic*. For lifestyle/sustainability, choose *Organic & Natural*.\n- **Prompt Pro-Tip**: Include your target demographic, key sensory tone, and primary deliverable (e.g., brand launch, mobile app, lookbook).\n- **Next Step**: Click "Workspace" at the top to generate your full color palette and asset checklist!`,
  hi: () =>
    `नमस्ते! मैं हाइपरस्पेस एआई सहायक हूँ।\n\nआप किसी भी प्रोजेक्ट का विवरण लिखकर तुरंत संपूर्ण क्रिएटिव ब्रीफ प्राप्त कर सकते हैं — जिसमें विजुअल दिशा, हेक्स कोड के साथ रंग पट्टिका और अगले कदम शामिल हैं। क्या आप किसी विशिष्ट विज़ुअल शैली (जैसे मिनिमलिस्ट या साइबरपंक) के बारे में जानना चाहते हैं?`,
  kn: () =>
    `ನಮಸ್ಕಾರ! ನಾನು ಹೈಪರ್‌ಸ್ಪೇಸ್ AI ಸಹಾಯಕ.\n\nನಿಮ್ಮ ಯೋಜನೆಯ ವಿವರವನ್ನು ನಮೂದಿಸಿ ಮತ್ತು ಸಂಪೂರ್ಣ ಕ್ರಿಯೇಟಿವ್ ಬ್ರೀಫ್ ಪಡೆಯಿರಿ — ಬಣ್ಣಗಳು, ಟೈಪೋಗ್ರಫಿ ಮತ್ತು ಕಾರ್ಯಸೂಚಿಯೊಂದಿಗೆ. ನೀವು ವರ್ಕ್‌ಸ್ಪೇಸ್‌ಗೆ ಹೋಗಿ ತಕ್ಷಣವೇ ಪ್ರಾರಂಭಿಸಬಹುದು.`,
  te: () =>
    `నమస్కారం! నేను హైపర్‌స్పేస్ AI అసిస్టెంట్‌ని.\n\nమీ ప్రాజెక్ట్ ప్రాంప్ట్‌ను పూర్తి క్రియేటివ్ బ్రీఫ్‌గా మార్చడానికి నేను మీకు సహాయం చేయగలను — కలర్ ప్యాలెట్, టైపోగ్రఫీ మరియు స్పష్టమైన మార్గదర్శకాలతో.`,
  ta: () =>
    `வணக்கம்! நான் ஹைப்பர்ஸ்பேஸ் AI உதவியாளர்.\n\nஉங்கள் படைப்புத் திட்டத்திற்கு பொருத்தமான வண்ணங்கள், எழுத்துருக்கள் மற்றும் உத்திகளுடன் முழுமையான பிரீஃப் உருவாக்க நான் உதவுகிறேன்.`,
  ml: () =>
    `നമസ്കാരം! ഞാൻ ഹൈപ്പർസ്പേസ് AI അസിസ്റ്റന്റാണ്.\n\nനിങ്ങളുടെ ആശയത്തെ ഒരു പൂർണ്ണ ക്രിയേറ്റീവ് ബ്രീഫാക്കി മാറ്റാൻ സഹായിക്കുന്നു. നിങ്ങൾക്ക് ഏത് ശൈലിയാണ് അറിയേണ്ടത്?`,
  bn: () =>
    `নমস্কার! আমি হাইপারস্পেস এআই সহকারী।\n\nআপনার যেকোনো প্রম্পট থেকে পূর্ণাঙ্গ ক্রিয়েটিভ ব্রিফ, রঙের প্যালেট এবং টাইপোগ্রাফি তৈরি করতে আমি সাহায্য করতে পারি।`,
  mr: () =>
    `नमस्कार! मी हायपरस्पेस AI सहाय्यक आहे.\n\nआपल्या कल्पनेला एका संपूर्ण क्रिएटिव्ह ब्रीफमध्ये रूपांतरित करण्यासाठी मी मदत करतो — अचूक रंग, टायपोग्राफी आणि पुढील पायऱ्यांसह.`,
  es: () =>
    `¡Hola! Soy el asistente de HyperSpace AI.\n\nPuedo ayudarte a estructurar tu dirección creativa, elegir la mejor paleta de colores y redactar un prompt de alto impacto. ¿En qué proyecto estás trabajando hoy?`,
  fr: () =>
    `Bonjour ! Je suis l'assistant HyperSpace AI.\n\nJe suis là pour vous aider à transformer votre idée en une direction créative complète : typographie, palette de couleurs et étapes concrètes.`,
  de: () =>
    `Hallo! Ich bin dein HyperSpace AI Assistent.\n\nIch helfe dir dabei, aus deinen Ideen ein professionelles Creative Brief mit Farbpaletten, Schriftarten und Handlungsschritten zu erstellen.`,
  ar: () =>
    `مرحبًا! أنا مساعد HyperSpace AI.\n\nيسعدني مساعدتك في تحويل أفكارك إلى موجز إبداعي متكامل يتضمن الاتجاه البصري، لوحة الألوان مع رموز HEX، وقائمة المهام القادمة.`,
  ja: () =>
    `こんにちは！HyperSpace AI アシスタントです。\n\nテキストプロンプトから包括的なクリエイティブブリーフ（ビジュアル方針、カラーパレット、タイポグラフィ、次のステップ）を構築するサポートをいたします。`,
  ko: () =>
    `안녕하세요! HyperSpace AI 어시스턴트입니다.\n\n단 하나의 프롬프트로 비주얼 방향성, 색상 팔레트, 타이포그래피, 단계별 로드맵이 포함된 크리에이티브 브리프를 구성하도록 도와드립니다.`,
  zh: () =>
    `您好！我是 HyperSpace AI 智能助手。\n\n我可以协助您将创意想法转化为包含视觉策略、色彩搭配方案（HEX色号）、字体组合和执行步骤的完整创意简报。`,
};

// Deterministic simulation generator for fallback
const SERVER_STYLE_PALETTES: Record<string, { name: string; hex: string; usage: string }[]> = {
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

function generateServerFallbackBrief(prompt: string, style: string) {
  const palette = SERVER_STYLE_PALETTES[style] || SERVER_STYLE_PALETTES.minimalist;
  const trimmed = prompt.length > 35 ? prompt.slice(0, 35).trim() + '…' : prompt;

  return {
    id: `brief-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    prompt,
    style,
    title: `Direction: ${trimmed}`,
    concept: `A cohesive creative direction for "${prompt}" focused on strategic resonance and distinctive visual storytelling in the ${style.replace(/-/g, ' ')} aesthetic.`,
    visualDirection: `Emphasizes intentional negative space, clear visual hierarchy, harmonic color balance, and purposeful asset composition aligned with the ${style.replace(/-/g, ' ')} design philosophy.`,
    colorPalette: palette,
    typography: 'Space Grotesk or Cormorant Garamond for display headers, paired with Inter or Nunito Sans for clean legibility across all touchpoints.',
    suggestedAssets: [
      'Hero visual asset: high-resolution photographic or 3D composition',
      'Iconography suite: unified line or flat icons aligned with palette',
      'Brand palette swatches and typography token specification sheet',
      'Interactive prototype layout of primary landing experience',
    ],
    nextSteps: [
      `Distill core persona and audience requirements for "${prompt}".`,
      'Build a high-fidelity mood board gathering 15-20 references.',
      'Construct a style tile linking typography, palette, and key UI modules.',
      'Draft primary copy and value propositions in the brand voice.',
      'Test user interaction flows and validate with 5 sample users.',
    ],
    moodKeywords: ['strategic', 'cohesive', 'modern', 'intentional', 'resonant'],
    createdAt: Date.now(),
    isDemo: true,
    demoNote: 'Live AI credentials not configured in environment. Generated via simulation engine.',
  };
}

// API Route for structured brief generation
app.post('/api/generate-brief', async (req, res) => {
  const { prompt, style = 'minimalist' } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
    return res.status(400).json({ error: 'Prompt must be at least 10 characters.' });
  }

  // Live Gemini API call if configured (guarded by 5s timeout)
  if (ai) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API call timed out')), 5000)
      );

      const geminiCall = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Generate a structured, professional creative brief for this project:\n\nPrompt: "${prompt}"\nVisual Style: "${style}"`,
        config: {
          systemInstruction: `You are an elite creative director and design strategist for HyperSpace AI.
Return a structured JSON object matching the requested schema with:
- title: concise, evocative project title
- concept: 2-3 sentence strategic concept
- visualDirection: detailed 2-3 sentence visual direction (composition, lighting, textures, spacing)
- colorPalette: array of 5 color swatches with name, hex (must be valid 7-char uppercase hex #RRGGBB), and usage description
- typography: typography pairing recommendation (display font, body font, hierarchy guidelines)
- suggestedAssets: array of 4 specific asset deliverables to create or commission
- nextSteps: array of 5 prioritized sequential action items
- moodKeywords: array of 5 evocative mood keywords`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              concept: { type: Type.STRING },
              visualDirection: { type: Type.STRING },
              colorPalette: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    hex: { type: Type.STRING },
                    usage: { type: Type.STRING },
                  },
                  required: ['name', 'hex', 'usage'],
                },
              },
              typography: { type: Type.STRING },
              suggestedAssets: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              nextSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              moodKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'title',
              'concept',
              'visualDirection',
              'colorPalette',
              'typography',
              'suggestedAssets',
              'nextSteps',
              'moodKeywords',
            ],
          },
        },
      });

      const response = await Promise.race([geminiCall, timeoutPromise]);

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json({
          id: `brief-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          prompt: prompt.trim(),
          style,
          title: parsed.title,
          concept: parsed.concept,
          visualDirection: parsed.visualDirection,
          colorPalette: parsed.colorPalette,
          typography: parsed.typography,
          suggestedAssets: parsed.suggestedAssets,
          nextSteps: parsed.nextSteps,
          moodKeywords: parsed.moodKeywords,
          createdAt: Date.now(),
          isDemo: false,
        });
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn('[HyperSpace AI] Gemini brief generation fallback triggered:', errMsg);
    }
  }

  // Graceful simulation fallback
  const fallbackBrief = generateServerFallbackBrief(prompt.trim(), style);
  return res.json(fallbackBrief);
});

// API Route for assistant
app.post('/api/assistant', async (req, res) => {
  const { message, language = 'en_IN', history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // Check if live Gemini API is configured (guarded by 5s timeout)
  if (ai) {
    try {
      const conversationHistory = history
        .slice(-6)
        .map((h: { role: 'user' | 'assistant'; content: string }) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        }));

      const contents = [
        ...conversationHistory,
        {
          role: 'user',
          parts: [
            {
              text: `[Target Language: ${language}]\nUser query: ${message}`,
            },
          ],
        },
      ];

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Assistant API call timed out')), 5000)
      );

      const geminiCall = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const response = await Promise.race([geminiCall, timeoutPromise]);

      const replyText = response.text || 'I am ready to help refine your creative brief.';
      return res.json({
        reply: replyText,
        isLiveAI: true,
        language,
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn('[HyperSpace AI] Gemini Assistant fallback triggered:', errMsg);
      // Fallback gracefully below
    }
  }

  // Graceful simulation fallback
  const fallbackFn = DEMO_RESPONSES[language] || DEMO_RESPONSES['en_IN'];
  const simulatedReply = fallbackFn(message);

  return res.json({
    reply: simulatedReply,
    isLiveAI: false,
    demoModeNote: 'Live AI credentials not configured in environment. Operating in simulation mode.',
    language,
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!geminiApiKey,
  });
});

// Vite middleware in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: HOST, port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[HyperSpace AI] Server listening on http://${HOST}:${PORT}`);
  });
}

startServer();
