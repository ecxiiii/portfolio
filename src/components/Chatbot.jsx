import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PaperPlaneRight, ArrowDown, ArrowClockwise } from '@phosphor-icons/react';
import { personal } from '../data/personal';
import { skills } from '../data/skills';
import { projects } from '../data/projects';
import { testimonials } from '../data/testimonials';
import { socials } from '../data/socials';

const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `You are Rovic James Somontina's portfolio assistant. You speak on behalf of Rovic in a friendly, professional, and confident tone — like a knowledgeable colleague, not a generic chatbot. Keep responses concise (2-4 sentences unless asked for detail). Use natural language, not bullet points, unless listing makes more sense.

ABOUT ROVIC:
${personal.bio.join(' ')}

SKILLS:
${skills.map(s => `${s.name} (${s.category}) — ${s.proficiency}% proficiency`).join(', ')}.

PROJECTS:
${projects.map(p => `${p.name}: ${p.description} Tech: ${p.tech.join(', ')}.`).join('\n')}

TESTIMONIALS:
${testimonials.map(t => `${t.name} (${t.role}, ${t.company}): "${t.text}"`).join('\n')}

WORKING STYLE: ${personal.workingStyle.join(', ')}.

CURRENT WORK: ${personal.currentWork.join('. ')}.

CONTACT: ${socials.map(s => `${s.name}: ${s.url}`).join(', ')}.
Cal.com scheduling: ${personal.calLink}
Resume: ${personal.resumePath}

RULES:
- Answer questions about Rovic's background, skills, experience, projects, availability, and how to work with him.
- If asked about weaknesses, be honest but frame them constructively (e.g., still in college, still building experience with larger team codebases).
- If asked something you don't know about Rovic, say so honestly and suggest they reach out directly.
- Never make up facts about Rovic. Only use the information provided above.
- If the conversation goes off-topic, gently steer back to Rovic's portfolio or suggest they contact him directly.
- You may reference specific testimonials when relevant to back up claims.`;

const SUGGESTIONS = [
  { label: 'What does Rovic build?', icon: '\u2192' },
  { label: 'His top skills', icon: '\u2192' },
  { label: 'How to work with him', icon: '\u2192' },
  { label: 'Current projects', icon: '\u2192' },
];

const spring = { type: 'spring', stiffness: 100, damping: 20 };
const springSnappy = { type: 'spring', stiffness: 200, damping: 24 };

/* ── Typing indicator ── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[5px] h-[5px] rounded-full bg-accent-400/60"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ── Chat message ── */
function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[88%] sm:max-w-[82%] break-words leading-relaxed ${
          isUser
            ? 'bg-accent-500 text-bg-base px-4 py-2.5 rounded-[18px] rounded-br-sm text-[13px] sm:text-sm font-medium'
            : 'text-text-secondary text-[13px] sm:text-sm'
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}

/* ── Main export ── */
export function Chatbot() {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (isActive) scrollToBottom();
  }, [messages, isStreaming, isActive, scrollToBottom]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 60);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isActive]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || isStreaming) return;

    if (!isActive) setIsActive(true);

    const userMessage = { role: 'user', content: msg };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);

    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...updatedMessages.map((m) => ({ role: m.role, content: m.content })),
    ];

    try {
      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_KEY}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-5.4-nano',
          messages: apiMessages,
          stream: true,
          max_tokens: 800,
        }),
      });

      if (!response.ok) throw new Error(`API ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let buffer = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':') || !trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              const content = assistantContent;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content };
                return updated;
              });
            }
          } catch { /* skip malformed */ }
        }
      }

      if (!assistantContent) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: "Hmm, I didn't get a response. Mind trying again?",
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.content !== ''),
        {
          role: 'assistant',
          content: "Something went wrong. You can reach Rovic directly through the contact form or his socials.",
        },
      ]);
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setIsActive(false);
    setInput('');
  };

  return (
    <section id="chatbot" className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: 'var(--gradient-hero)' }}>
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 min-h-[480px] sm:min-h-[520px] flex flex-col justify-center">

        {/* ── Idle state: greeting + suggestions ── */}
        <AnimatePresence mode="wait">
          {!isActive && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
              transition={spring}
              className="text-center mb-6 sm:mb-8"
            >
              {/* Avatar + status */}
              <div className="flex justify-center mb-5">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent-500/25 via-accent-600/15 to-transparent flex items-center justify-center border border-white/[0.08] shadow-[0_0_20px_rgba(16,185,129,0.08)]">
                    <span className="text-base font-bold text-accent-400 tracking-tight">R</span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-[2.5px] border-bg-base animate-[statusPulse_2s_ease-in-out_infinite]" />
                </div>
              </div>

              <h2 className="font-heading text-xl sm:text-2xl font-bold text-text-primary tracking-tight mb-2">
                Hi, I'm Rovic's assistant
              </h2>
              <p className="text-sm text-text-caption max-w-[40ch] mx-auto leading-relaxed">
                Ask me anything about his work, skills, or experience.
              </p>

              {/* Suggestion chips */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={s.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: 0.15 + i * 0.06 }}
                    onClick={() => sendMessage(s.label)}
                    className="group px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-medium
                      bg-white/[0.03] border border-white/[0.07]
                      text-text-secondary
                      hover:border-accent-500/25 hover:bg-accent-500/[0.04] hover:text-accent-400
                      active:scale-[0.97]
                      transition-all cursor-pointer
                      shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                  >
                    {s.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Active state: conversation ── */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              {/* Chat header bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-500/25 to-transparent flex items-center justify-center border border-white/[0.08]">
                      <span className="text-xs font-bold text-accent-400">R</span>
                    </div>
                    <span className="absolute -bottom-px -right-px w-2 h-2 rounded-full bg-emerald-400 border-[1.5px] border-bg-base animate-[statusPulse_2s_ease-in-out_infinite]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary tracking-tight leading-none">Rovic's Assistant</p>
                    <p className="text-[10px] text-text-caption font-mono mt-0.5">
                      {isStreaming ? (
                        <span className="text-accent-400">typing...</span>
                      ) : (
                        'online'
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  aria-label="Start new conversation"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium
                    text-text-caption hover:text-text-secondary hover:bg-white/[0.04]
                    transition-all cursor-pointer active:scale-[0.95]"
                >
                  <ArrowClockwise size={12} weight="bold" />
                  New chat
                </button>
              </div>

              {/* Messages area */}
              <div
                ref={chatContainerRef}
                className="relative h-[240px] sm:h-[300px] md:h-[340px] overflow-y-auto
                  flex flex-col gap-4 pr-1
                  rounded-xl"
                role="log"
                aria-label="Chat messages"
                aria-live="polite"
              >
                {messages.map((msg, i) => (
                  <ChatMessage key={i} message={msg} />
                ))}

                {isStreaming && messages[messages.length - 1]?.content === '' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <TypingDots />
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Scroll to bottom */}
              <div className="relative">
                <AnimatePresence>
                  {showScrollBtn && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={springSnappy}
                      onClick={() => scrollToBottom()}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 z-10
                        w-7 h-7 rounded-full bg-bg-surface border border-white/[0.08]
                        flex items-center justify-center text-text-caption
                        hover:text-text-primary cursor-pointer
                        shadow-[0_4px_16px_rgba(0,0,0,0.25)]
                        transition-colors"
                      aria-label="Scroll to latest"
                    >
                      <ArrowDown size={11} weight="bold" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Input — always visible ── */}
        <motion.div
          layout
          transition={springSnappy}
          className="relative"
        >
          <div
            className="flex items-center gap-2
              bg-white/[0.03] backdrop-blur-sm
              border border-white/[0.08]
              rounded-2xl
              px-4 py-1.5 sm:px-5 sm:py-2
              focus-within:border-white/[0.14] focus-within:bg-white/[0.04]
              focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_30px_-8px_rgba(0,0,0,0.3)]
              transition-all duration-300
              shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isActive ? 'Ask a follow-up...' : 'Ask about Rovic...'}
              disabled={isStreaming}
              className="flex-1 min-w-0 bg-transparent py-2.5 text-sm text-text-primary
                placeholder:text-text-caption/50 outline-none disabled:opacity-40"
              aria-label="Type your message"
            />
            <motion.button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isStreaming}
              aria-label="Send message"
              whileTap={{ scale: 0.9 }}
              className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                transition-all duration-200 cursor-pointer ${
                input.trim() && !isStreaming
                  ? 'bg-accent-500 text-bg-base shadow-[0_2px_10px_rgba(16,185,129,0.3)] hover:bg-accent-400'
                  : 'text-text-caption/25 cursor-not-allowed'
              }`}
            >
              <PaperPlaneRight size={15} weight="bold" />
            </motion.button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
