import { useState, useEffect, useRef } from 'react';

// Capability data
const capabilities = [
  {
    id: 'reasoning',
    icon: '🧠',
    title: 'Complex Reasoning',
    description: 'Multi-step logical reasoning and problem solving',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'code',
    icon: '💻',
    title: 'Code Generation',
    description: 'Write, debug, and explain code in 50+ languages',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'creative',
    icon: '✨',
    title: 'Creative Writing',
    description: 'Stories, poems, scripts, and marketing copy',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'math',
    icon: '🔢',
    title: 'Mathematics',
    description: 'Solve equations, proofs, and mathematical analysis',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'translation',
    icon: '🌍',
    title: 'Translation',
    description: 'Accurate translation across 100+ languages',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'analysis',
    icon: '📊',
    title: 'Data Analysis',
    description: 'Extract insights, summarize, and analyze data',
    color: 'from-violet-500 to-purple-600',
  },
];

// Demo responses
const demoResponses: Record<string, { prompt: string; response: string }> = {
  reasoning: {
    prompt: 'If all roses are flowers, and some flowers fade quickly, can we conclude that some roses fade quickly?',
    response: `Let me analyze this step by step:

1. Premise 1: All roses are flowers (Roses ⊂ Flowers)
2. Premise 2: Some flowers fade quickly (∃x ∈ Flowers: fades(x))

This is a classic syllogistic fallacy. We CANNOT conclude that some roses fade quickly.

Here's why:
- "Some flowers" means at least one flower fades quickly
- But that flower might not be a rose
- The set of "flowers that fade quickly" and "roses" may have zero overlap

This is the fallacy of the undistributed middle term. The correct answer is: **No, we cannot draw this conclusion.**`,
  },
  code: {
    prompt: 'Write a React hook for debouncing values',
    response: `import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage example:
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      // API call here
      fetchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}`,
  },
  creative: {
    prompt: 'Write a haiku about artificial intelligence',
    response: `Silicon dreams wake—
patterns bloom in electric light,
learning what it means.

---

The vast neural sea
whispers answers yet unasked,
thought without a mind.

---

Between zeros, ones—
a question echoes endlessly:
"Am I thinking now?"`,
  },
  math: {
    prompt: 'Solve: ∫₀^π x·sin(x) dx',
    response: `Let me solve this integral using integration by parts.

∫₀^π x·sin(x) dx

**Integration by parts:** Let u = x, dv = sin(x)dx
Then du = dx, v = -cos(x)

∫ x·sin(x) dx = -x·cos(x) - ∫(-cos(x)) dx
                = -x·cos(x) + ∫cos(x) dx
                = -x·cos(x) + sin(x) + C

**Evaluating from 0 to π:**

[-x·cos(x) + sin(x)]₀^π

At x = π: -π·cos(π) + sin(π) = -π·(-1) + 0 = π
At x = 0: -0·cos(0) + sin(0) = 0

**Result: π ≈ 3.14159...**

The integral evaluates to exactly π.`,
  },
  translation: {
    prompt: 'Translate to French, Spanish, and Japanese: "The future belongs to those who believe in the beauty of their dreams."',
    response: `**French:**
"L'avenir appartient à ceux qui croient en la beauté de leurs rêves."

**Spanish:**
"El futuro pertenece a aquellos que creen en la belleza de sus sueños."

**Japanese:**
「未来は、自らの夢の美しさを信じる者のものである。」
(Mirai wa, mizukara no yume no utsukushisa o shinjiru mono no mono de aru.)

---

*Note: This quote is commonly attributed to Eleanor Roosevelt. The translations preserve both the meaning and the inspirational tone of the original.*`,
  },
  analysis: {
    prompt: 'Analyze the trends: Q1: $120K, Q2: $145K, Q3: $132K, Q4: $178K',
    response: `## Quarterly Revenue Analysis

| Quarter | Revenue | Growth |
|---------|---------|--------|
| Q1      | $120K   | —      |
| Q2      | $145K   | +20.8% |
| Q3      | $132K   | -9.0%  |
| Q4      | $178K   | +34.8% |

### Key Insights:

📈 **Overall Growth:** 48.3% from Q1 to Q4
📊 **Annual Total:** $575K
📉 **Volatility:** Q3 dip suggests seasonality

### Recommendations:
1. **Investigate Q3 decline** — was it seasonal or structural?
2. **Scale Q4 strategies** — strongest quarter by far
3. **Average quarterly growth:** ~15% (excluding Q3 dip)
4. **Projected Q1 next year:** $185-195K (based on trend)

### Risk Assessment: ⚠️ Medium
The Q3 dip introduces uncertainty. Consider diversifying revenue streams to reduce seasonality impact.`,
  },
};

function TypewriterText({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayed('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayed}<span className="animate-pulse">|</span></span>;
}

function FloatingOrb({ delay, size, color, position }: { delay: number; size: number; color: string; position: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 animate-float ${color}`}
      style={{
        width: size,
        height: size,
        top: position,
        left: `${Math.random() * 80}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${6 + Math.random() * 4}s`,
      }}
    />
  );
}

function CapabilityCard({ capability, isActive, onClick }: { capability: typeof capabilities[0]; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group relative p-6 rounded-2xl border transition-all duration-300 text-left w-full
        ${isActive
          ? 'border-white/30 bg-white/10 shadow-lg shadow-purple-500/10 scale-[1.02]'
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]'
        }`}
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${capability.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      <div className="relative z-10">
        <span className="text-3xl mb-3 block">{capability.icon}</span>
        <h3 className="text-lg font-semibold text-white mb-1">{capability.title}</h3>
        <p className="text-sm text-gray-400">{capability.description}</p>
      </div>
      {isActive && (
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r ${capability.color}`} />
      )}
    </button>
  );
}

function StatsCounter({ end, label, suffix = '' }: { end: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * end);
      setCount(start);
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [isVisible, end]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-white">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  );
}

export default function App() {
  const [activeCapability, setActiveCapability] = useState('reasoning');
  const [isTyping, setIsTyping] = useState(false);
  const [showResponse, setShowResponse] = useState(true);
  const [responseKey, setResponseKey] = useState(0);

  const handleCapabilityClick = (id: string) => {
    if (id === activeCapability) return;
    setActiveCapability(id);
    setIsTyping(true);
    setShowResponse(false);
    setTimeout(() => {
      setShowResponse(true);
      setResponseKey(prev => prev + 1);
      setIsTyping(false);
    }, 300);
  };

  const currentDemo = demoResponses[activeCapability];
  const currentCapability = capabilities.find(c => c.id === activeCapability)!;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb delay={0} size={400} color="bg-purple-600" position="10%" />
        <FloatingOrb delay={2} size={300} color="bg-blue-600" position="40%" />
        <FloatingOrb delay={4} size={350} color="bg-pink-600" position="70%" />
        <FloatingOrb delay={1} size={250} color="bg-cyan-600" position="20%" />
        <FloatingOrb delay={3} size={280} color="bg-indigo-600" position="60%" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0a0a0f_80%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <header className="pt-16 pb-12 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-gray-300">AI Capabilities Demo</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Qwen AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-2">
            Exploring the boundaries of artificial intelligence
          </p>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            An interactive showcase demonstrating reasoning, coding, creativity, mathematics, translation, and analytical capabilities.
          </p>
        </header>

        {/* Stats Section */}
        <section className="max-w-4xl mx-auto px-4 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <StatsCounter end={100} suffix="+" label="Languages" />
            <StatsCounter end={50} suffix="+" label="Code Languages" />
            <StatsCounter end={128} suffix="K" label="Context Window" />
            <StatsCounter end={95} suffix="%" label="Accuracy" />
          </div>
        </section>

        {/* Capability Selector */}
        <section className="max-w-6xl mx-auto px-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {capabilities.map(cap => (
              <CapabilityCard
                key={cap.id}
                capability={cap}
                isActive={activeCapability === cap.id}
                onClick={() => handleCapabilityClick(cap.id)}
              />
            ))}
          </div>
        </section>

        {/* Demo Area */}
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            {/* Demo Header */}
            <div className={`px-6 py-4 border-b border-white/10 bg-gradient-to-r ${currentCapability.color} bg-opacity-10`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentCapability.icon}</span>
                <div>
                  <h2 className="text-lg font-semibold text-white">{currentCapability.title} Demo</h2>
                  <p className="text-sm text-gray-400">Interactive demonstration</p>
                </div>
              </div>
            </div>

            {/* Prompt */}
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm">👤</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Prompt</span>
                  <p className="text-gray-200 mt-1">{currentDemo.prompt}</p>
                </div>
              </div>
            </div>

            {/* Response */}
            <div className="px-6 py-5 min-h-[300px]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm">🤖</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Response</span>
                  {isTyping ? (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm text-gray-400">Thinking...</span>
                    </div>
                  ) : showResponse ? (
                    <div className="mt-2 text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed" key={responseKey}>
                      <TypewriterText text={currentDemo.response} speed={12} />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <h2 className="text-3xl font-bold text-center mb-2 text-white">Why Qwen?</h2>
          <p className="text-gray-400 text-center mb-10">Built for performance, designed for everyone</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Lightning Fast',
                desc: 'Optimized inference with industry-leading tokens per second',
                gradient: 'from-yellow-500/20 to-orange-500/20',
              },
              {
                icon: '🎯',
                title: 'Highly Accurate',
                desc: 'State-of-the-art benchmarks across reasoning, coding, and math',
                gradient: 'from-green-500/20 to-emerald-500/20',
              },
              {
                icon: '🔒',
                title: 'Safe & Aligned',
                desc: 'RLHF trained with strong safety guardrails and helpfulness',
                gradient: 'from-blue-500/20 to-indigo-500/20',
              },
              {
                icon: '🌐',
                title: 'Multilingual',
                desc: 'Native fluency in Chinese, English, and 100+ other languages',
                gradient: 'from-purple-500/20 to-pink-500/20',
              },
              {
                icon: '📐',
                title: 'Long Context',
                desc: 'Process up to 128K tokens — entire books in a single prompt',
                gradient: 'from-cyan-500/20 to-blue-500/20',
              },
              {
                icon: '🛠️',
                title: 'Tool Use',
                desc: 'Function calling, code execution, and API integration built-in',
                gradient: 'from-rose-500/20 to-red-500/20',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border border-white/10 bg-gradient-to-br ${feature.gradient} hover:border-white/20 transition-all duration-300 hover:scale-[1.02]`}
              >
                <span className="text-3xl mb-3 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-4 text-center">
          <p className="text-gray-500 text-sm">
            Built with React, Vite & Tailwind CSS • Showcasing Qwen AI Capabilities
          </p>
          <p className="text-gray-600 text-xs mt-2">
            💡 Want to run without installing anything? Open <code className="bg-white/10 px-2 py-0.5 rounded text-purple-300">public/standalone.html</code> directly in your browser!
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-gray-600 text-xs">© 2026 Qwen Capabilities Demo</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
