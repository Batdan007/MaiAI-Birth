'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Zap, ChevronRight, Brain, Palette, Infinity } from 'lucide-react';
import { getPresets, birthAgent } from '@/lib/api';
import { useAuthStore, useAgentStore } from '@/lib/store';
import LogoBirth from '../components/LogoBirth';

const QUIZ_QUESTIONS = [
  {
    id: 'approach',
    question: 'When facing a problem, you usually...',
    options: [
      { value: 'analyst', text: 'Research and analyze data', icon: <Brain size={20} /> },
      { value: 'creator', text: 'Brainstorm creative solutions', icon: <Palette size={20} /> },
      { value: 'hybrid', text: 'Mix of both', icon: <Infinity size={20} /> }
    ]
  },
  {
    id: 'content',
    question: 'You prefer content that is...',
    options: [
      { value: 'analyst', text: 'Factual and well-sourced', icon: <Brain size={20} /> },
      { value: 'creator', text: 'Imaginative and inspiring', icon: <Palette size={20} /> },
      { value: 'hybrid', text: 'Depends on the situation', icon: <Infinity size={20} /> }
    ]
  },
  {
    id: 'help',
    question: 'You mostly need help with...',
    options: [
      { value: 'analyst', text: 'Research and understanding', icon: <Brain size={20} /> },
      { value: 'creator', text: 'Creating and expressing ideas', icon: <Palette size={20} /> },
      { value: 'hybrid', text: 'A variety of tasks', icon: <Infinity size={20} /> }
    ]
  },
  {
    id: 'style',
    question: 'Your ideal AI assistant is...',
    options: [
      { value: 'analyst', text: 'Precise and thorough', icon: <Brain size={20} /> },
      { value: 'creator', text: 'Playful and imaginative', icon: <Palette size={20} /> },
      { value: 'hybrid', text: 'Adaptable to my needs', icon: <Infinity size={20} /> }
    ]
  }
];

const ARCHETYPES = {
  analyst: { name: 'The Analyst', personality: 'scholar', color: 'text-blue-400' },
  creator: { name: 'The Creator', personality: 'creative', color: 'text-purple-400' },
  hybrid: { name: 'The Hybrid', personality: 'alfred', color: 'text-accent' }
};

export default function BirthPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const addAgent = useAgentStore((s) => s.addAgent);

  const [step, setStep] = useState<'intro' | 'quiz' | 'keys' | 'name' | 'birthing'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBirthAnimation, setShowBirthAnimation] = useState(false);
  const [birthingAgent, setBirthingAgent] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const calculateArchetype = () => {
    const counts: Record<string, number> = { analyst: 0, creator: 0, hybrid: 0 };
    Object.values(answers).forEach(val => { counts[val]++; });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [QUIZ_QUESTIONS[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('keys');
    }
  };

  const handleBirth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !name.trim()) return;

    setLoading(true);
    setError('');

    const archetype = calculateArchetype();
    const personality = ARCHETYPES[archetype as keyof typeof ARCHETYPES].personality;

    try {
      const agent = await birthAgent(token, {
        name: name.trim(),
        personality,
        custom_traits: [archetype]
      });
      setBirthingAgent(agent);
      addAgent(agent);
      setShowBirthAnimation(true);
      setStep('birthing');
    } catch (err: any) {
      setError(err.message || 'Failed to birth agent');
      setLoading(false);
    }
  };

  if (!token) return null;
  if (showBirthAnimation) return <LogoBirth onComplete={() => router.push(`/chat/${birthingAgent.id}`)} />;

  return (
    <div className="min-h-screen safe-top safe-bottom flex flex-col">
      <header className="p-4 flex items-center justify-between">
        <Link href="/dashboard" className="p-2 text-gray-400 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        <div className="h-1 flex-1 mx-4 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{
              width: step === 'intro' ? '5%' :
                step === 'quiz' ? `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 60 + 5}%` :
                  step === 'keys' ? '80%' : '100%'
            }}
          />
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-8 flex flex-col justify-center">
        {step === 'intro' && (
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-6xl mb-4 text-accent">🧬</div>
            <h1 className="text-3xl font-bold gradient-text">Birth Your Companion</h1>
            <p className="text-gray-400">Answer 4 quick questions to help us tailor your AI's DNA to your unique personality.</p>
            <button onClick={() => setStep('quiz')} className="btn-gradient w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2">
              Start The Process <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === 'quiz' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-accent text-sm font-bold uppercase tracking-wider">Question {currentQuestion + 1} of 4</span>
              <h2 className="text-2xl font-bold">{QUIZ_QUESTIONS[currentQuestion].question}</h2>
            </div>
            <div className="grid gap-4">
              {QUIZ_QUESTIONS[currentQuestion].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className="p-5 rounded-2xl border border-white/10 bg-card hover:border-accent hover:bg-accent/5 transition-all text-left flex items-center gap-4 group"
                >
                  <div className="p-3 rounded-xl bg-white/5 text-gray-400 group-hover:text-accent transition-colors">
                    {opt.icon}
                  </div>
                  <span className="font-medium">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'keys' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-4 text-accent">🔑</div>
              <h2 className="text-2xl font-bold">Connect Your Brain</h2>
              <p className="text-gray-400 text-sm">Add your API keys to bring your agent to life. Your keys are stored securely.</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-gray-400 font-medium">Anthropic API Key</label>
                  <a href="https://console.anthropic.com/" target="_blank" className="text-xs text-accent hover:underline flex items-center gap-1">
                    Get Key <ChevronRight size={10} />
                  </a>
                </div>
                <input
                  type="password"
                  value={keys.anthropic || ''}
                  onChange={(e) => setKeys({ ...keys, anthropic: e.target.value })}
                  className="w-full p-3 bg-card border border-white/10 rounded-lg focus:border-accent focus:outline-none"
                  placeholder="sk-ant-..."
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-gray-400 font-medium">OpenAI API Key</label>
                  <a href="https://platform.openai.com/api-keys" target="_blank" className="text-xs text-accent hover:underline flex items-center gap-1">
                    Get Key <ChevronRight size={10} />
                  </a>
                </div>
                <input
                  type="password"
                  value={keys.openai || ''}
                  onChange={(e) => setKeys({ ...keys, openai: e.target.value })}
                  className="w-full p-3 bg-card border border-white/10 rounded-lg focus:border-accent focus:outline-none"
                  placeholder="sk-..."
                />
              </div>

              <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-tighter">
                  <Zap size={14} /> ENVIRONMENTAL STABILITY & OFFLINE MODE
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed">
                  Your Brain (the "Hat") works <strong>completely offline</strong> via private Ollama models. Use <code>/offline</code> to sustain your learning environment without internet.
                </p>
              </div>

              <button
                onClick={() => setStep('name')}
                className="btn-gradient w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 group"
              >
                Continue to Birth <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 'name' && (
          <form onSubmit={handleBirth} className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-4">
              <div className="text-5xl mb-4 text-accent">✨</div>
              <h2 className="text-2xl font-bold">The Final Step</h2>
              <p className="text-gray-400">What should we call your new AI companion?</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name your agent (Jarvis, Friday...)"
                className="w-full p-4 bg-card border border-white/20 rounded-xl focus:border-accent focus:outline-none text-xl text-center"
              />
              {error && <p className="text-red-400 text-sm text-center bg-red-400/10 p-3 rounded-lg">{error}</p>}
              <button disabled={loading || !name.trim()} className="btn-gradient w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? 'Invoking Lightning...' : 'Complete Birth'} <Zap size={20} className={loading ? 'animate-pulse' : ''} />
              </button>
            </div>
          </form>
        )}
      </main>

      <footer className="p-6 text-center text-xs text-gray-500">
        <p>Born under Joe Dogs Rule - Pledging to protect all life</p>
      </footer>
    </div>
  );
}
