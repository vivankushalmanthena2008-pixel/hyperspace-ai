import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  Loader2,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Wand2,
} from 'lucide-react';
import { audioService } from '@/services/audioService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isLiveAI?: boolean;
  demoNote?: string;
  timestamp: number;
}

type SupportedLanguage =
  | 'en_IN'
  | 'hi'
  | 'kn'
  | 'te'
  | 'ta'
  | 'ml'
  | 'bn'
  | 'mr'
  | 'es'
  | 'fr'
  | 'de'
  | 'ar'
  | 'ja'
  | 'ko'
  | 'zh';

interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  native: string;
  isRtl?: boolean;
}

const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en_IN', name: 'English (India)', native: 'English (India)' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'ar', name: 'Arabic', native: 'العربية', isRtl: true },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'zh', name: 'Mandarin Chinese', native: '中文' },
];

const UI_TRANSLATIONS: Record<
  string,
  {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    clear: string;
    starterPrompt: string;
    starterStyle: string;
  }
> = {
  en_IN: {
    title: 'HyperSpace Assistant',
    subtitle: 'Creative brief advisor & prompt engineer',
    placeholder: 'Ask about visual styles, prompt ideas, or brief structure...',
    send: 'Send',
    clear: 'Clear Chat',
    starterPrompt: 'How can I refine my brief prompt?',
    starterStyle: 'Explain the 8 visual styles',
  },
  hi: {
    title: 'हाइपरस्पेस सहायक',
    subtitle: 'क्रिएटिव ब्रीफ और प्रॉम्प्ट सलाहकार',
    placeholder: 'विज़ुअल शैलियों, प्रॉम्प्ट या ब्रीफ के बारे में पूछें...',
    send: 'भेजें',
    clear: 'चैट साफ़ करें',
    starterPrompt: 'मैं अपना प्रॉम्प्ट कैसे बेहतर बनाऊं?',
    starterStyle: '8 विज़ुअल शैलियों को समझाएं',
  },
  ar: {
    title: 'مساعد HyperSpace',
    subtitle: 'مستشار الموجز الإبداعي وهندسة الأوامر',
    placeholder: 'اسأل عن الأنماط البصرية، أفكار الأوامر، أو تفاصيل الموجز...',
    send: 'إرسال',
    clear: 'مسح المحادثة',
    starterPrompt: 'كيف يمكنني تحسين نص أمري الإبداعي؟',
    starterStyle: 'اشرح لي الأنماط البصرية الثمانية',
  },
  es: {
    title: 'Asistente HyperSpace',
    subtitle: 'Asesor de briefs creativos y prompts',
    placeholder: 'Pregunta sobre estilos visuales, ideas de prompts...',
    send: 'Enviar',
    clear: 'Limpiar chat',
    starterPrompt: '¿Cómo puedo mejorar mi prompt?',
    starterStyle: 'Explica los 8 estilos visuales',
  },
  fr: {
    title: 'Assistant HyperSpace',
    subtitle: 'Conseiller en briefs créatifs & prompts',
    placeholder: 'Posez une question sur les styles ou prompts...',
    send: 'Envoyer',
    clear: 'Effacer le chat',
    starterPrompt: 'Comment améliorer mon prompt ?',
    starterStyle: 'Expliquer les 8 styles visuels',
  },
  de: {
    title: 'HyperSpace Assistent',
    subtitle: 'Creative Brief & Prompt Berater',
    placeholder: 'Frage nach visuellen Stilen oder Prompts...',
    send: 'Senden',
    clear: 'Chat löschen',
    starterPrompt: 'Wie kann ich mein Prompt verfeinern?',
    starterStyle: 'Erkläre die 8 visuellen Stile',
  },
  ja: {
    title: 'HyperSpace アシスタント',
    subtitle: 'クリエイティブブリーフ＆プロンプト相談',
    placeholder: 'スタイルやプロンプトの改善について質問...',
    send: '送信',
    clear: 'チャット履歴消去',
    starterPrompt: 'プロンプトを洗練するには？',
    starterStyle: '8つのビジュアルスタイルを解説して',
  },
  zh: {
    title: 'HyperSpace 智能助理',
    subtitle: '创意简报顾问与提示词工程专家',
    placeholder: '询问视觉风格、提示词构思或简报结构...',
    send: '发送',
    clear: '清空聊天',
    starterPrompt: '如何优化我的创意提示词？',
    starterStyle: '介绍 8 种精选视觉风格',
  },
};

export function AssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('en_IN');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Welcome to HyperSpace AI! I am your multilingual creative brief advisor. Ask me how to frame your prompt, compare our 8 visual styles, or structure your brand direction.',
      timestamp: Date.now(),
      isLiveAI: false,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const isRtl = !!currentLangObj.isRtl;

  const labels = UI_TRANSLATIONS[language] || UI_TRANSLATIONS['en_IN'];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setError(null);
    setInput('');
    audioService.playSelectSound();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      audioService.playNavSound();

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        isLiveAI: !!data.isLiveAI,
        demoNote: data.demoModeNote,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      console.error('[Assistant] Request failed:', err);
      setError('Could not reach the assistant service. Click retry to try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    audioService.playToggleSound();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          'Chat history cleared. How can I help you refine your creative direction today?',
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="mb-3 w-[92vw] sm:w-[420px] max-h-[78vh] flex flex-col rounded-2xl bg-base-900/95 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/[0.08] bg-base-950/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-glow via-indigo-glow to-violet-glow flex items-center justify-center shadow-lg shadow-cyan-glow/20">
                  <Bot className="w-5 h-5 text-base-950" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-base-900" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-white flex items-center gap-1.5">
                    {labels.title}
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/30 font-mono">
                      AI
                    </span>
                  </h3>
                  <p className="text-[11px] text-white/40">{labels.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Language dropdown */}
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => {
                      audioService.playToggleSound();
                      setLanguage(e.target.value as SupportedLanguage);
                    }}
                    className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white/80 focus:outline-none focus:border-cyan-glow cursor-pointer"
                    title="Select Assistant Language"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code} className="bg-base-900 text-white">
                        {l.native} ({l.name})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    audioService.playToggleSound();
                    setIsOpen(false);
                  }}
                  className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors ml-1"
                  aria-label="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick starter prompts */}
            <div className="px-4 py-2 border-b border-white/[0.04] bg-white/[0.01] flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
              <button
                onClick={() => handleSendMessage(labels.starterPrompt)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-white/70 whitespace-nowrap transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-cyan-glow" />
                {labels.starterPrompt}
              </button>
              <button
                onClick={() => handleSendMessage(labels.starterStyle)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-white/70 whitespace-nowrap transition-colors flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3 text-violet-glow" />
                {labels.starterStyle}
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[380px]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-glow to-teal-400 text-base-950 font-medium rounded-br-sm'
                        : 'bg-white/[0.04] border border-white/[0.08] text-white/85 rounded-bl-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>

                    {m.demoNote && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-amber-300/80 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{m.demoNote}</span>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-white/30 font-mono mt-1 px-1">
                    {m.role === 'assistant' && (
                      <span className="text-cyan-glow mr-1.5">
                        {m.isLiveAI ? '● Gemini Live' : '● Simulation'}
                      </span>
                    )}
                    {new Date(m.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-cyan-glow p-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Consulting creative intelligence...</span>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center justify-between">
                  <span>{error}</span>
                  <button
                    onClick={() => handleSendMessage()}
                    className="ml-2 px-2 py-1 bg-red-500/20 rounded font-medium hover:bg-red-500/30 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input footer */}
            <div className="p-3 border-t border-white/[0.08] bg-base-950/70">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={labels.placeholder}
                  disabled={isLoading}
                  className="flex-1 bg-base-800/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-glow/50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-glow to-indigo-glow text-base-950 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_-3px_rgba(34,211,238,0.5)] transition-all flex-shrink-0"
                  aria-label={labels.send}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>

              <div className="mt-2 flex items-center justify-between text-[10px] text-white/30 px-1">
                <span>Multi-language: {currentLangObj.name}</span>
                <button
                  onClick={handleClear}
                  className="hover:text-white/60 transition-colors"
                >
                  {labels.clear}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          audioService.playToggleSound();
          setIsOpen(!isOpen);
        }}
        className="relative group p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-glow via-teal-300 to-indigo-glow text-base-950 shadow-[0_0_30px_0px_rgba(34,211,238,0.45)] hover:shadow-[0_0_40px_2px_rgba(34,211,238,0.7)] transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Toggle HyperSpace AI Assistant"
      >
        <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Bot className="w-6 h-6 text-base-950 relative z-10" />

        {/* Ambient indicator badge */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border border-base-950" />
        </span>
      </motion.button>
    </div>
  );
}
