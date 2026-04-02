import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionWrapper } from '../helpers/SectionWrapper';
import { AnimateOnScroll } from '../helpers/AnimateOnScroll';
import { PaperPlaneRight, Robot, User, ArrowDown } from '@phosphor-icons/react';
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

const GREETING = {
  role: 'assistant',
  content: "Hi! I'm Rovic's portfolio assistant. Ask me anything about his skills, projects, experience, or how to work with him — I'm here to help.",
};

const spring = { type: 'spring', stiffness: 200, damping: 25 };

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-accent-400"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function ChatMessage({ message, isLatest }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs ${
          isUser
            ? 'bg-accent-500/20 text-accent-400'
            : 'bg-white/[0.08] text-text-secondary'
        }`}
      >
        {isUser ? <User size={14} weight="bold" /> : <Robot size={14} weight="bold" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-accent-500/15 text-text-primary rounded-br-md'
            : 'bg-white/[0.06] text-text-secondary border border-white/[0.06] rounded-bl-md'
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}

export function Chatbot() {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMessage = { role: 'user', content: text };
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
          model: 'openrouter/auto',
          messages: apiMessages,
          stream: true,
          max_tokens: 400,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6);
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
          } catch {
            // skip malformed chunks
          }
        }
      }

      if (!assistantContent) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: "Sorry, I couldn't get a response. Try asking again!",
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.content !== ''),
        {
          role: 'assistant',
          content: "Something went wrong on my end. You can reach Rovic directly through the contact form above or his social links.",
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

  return (
    <SectionWrapper id="chatbot" gradient="var(--gradient-contact)">
      <AnimateOnScroll direction="up">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-3 text-center">
          Ask Me Anything
        </h2>
        <p className="text-text-secondary text-center mb-10 max-w-[480px] mx-auto">
          Curious about Rovic's work? Chat with his AI assistant to learn more about his skills, projects, and experience.
        </p>

        {/* Chat container */}
        <div className="max-w-[600px] mx-auto">
          <div className="rounded-2xl border border-white/[0.08] bg-bg-surface/50 backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06]">
              <div className="w-8 h-8 rounded-full bg-accent-500/15 flex items-center justify-center">
                <Robot size={16} weight="duotone" className="text-accent-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Rovic's Assistant</p>
                <p className="text-xs text-text-caption">
                  {isStreaming ? (
                    <span className="text-accent-400">typing...</span>
                  ) : (
                    'Online'
                  )}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[statusPulse_2s_ease-in-out_infinite]" />
                <span className="text-xs text-text-caption">Active</span>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="relative h-[400px] overflow-y-auto p-5 flex flex-col gap-4 scroll-smooth"
              role="log"
              aria-label="Chat messages"
              aria-live="polite"
            >
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <ChatMessage
                    key={i}
                    message={msg}
                    isLatest={i === messages.length - 1}
                  />
                ))}
              </AnimatePresence>

              {isStreaming && messages[messages.length - 1]?.content === '' && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center">
                    <Robot size={14} weight="bold" className="text-text-secondary" />
                  </div>
                  <div className="bg-white/[0.06] border border-white/[0.06] rounded-2xl rounded-bl-md">
                    <TypingIndicator />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-bg-elevated border border-white/[0.1] flex items-center justify-center text-text-caption hover:text-text-primary transition-colors cursor-pointer"
                  aria-label="Scroll to latest message"
                >
                  <ArrowDown size={14} weight="bold" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="border-t border-white/[0.06] p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Rovic's skills, projects, experience..."
                  disabled={isStreaming}
                  className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-caption outline-none focus:border-accent-500/30 transition-colors disabled:opacity-50"
                  aria-label="Type your message"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isStreaming}
                  aria-label="Send message"
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    input.trim() && !isStreaming
                      ? 'bg-accent-500 text-bg-base hover:bg-accent-400'
                      : 'bg-white/[0.06] text-text-caption cursor-not-allowed'
                  }`}
                >
                  <PaperPlaneRight size={16} weight="bold" />
                </button>
              </div>
              <p className="text-[10px] text-text-caption text-center mt-2 opacity-60">
                AI assistant — responses are generated, not written by Rovic directly
              </p>
            </div>
          </div>
        </div>
      </AnimateOnScroll>
    </SectionWrapper>
  );
}
