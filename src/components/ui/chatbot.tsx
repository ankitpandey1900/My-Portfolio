'use client';

import * as React from 'react';
import { useChat, UIMessage } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, RefreshCw, Sparkles, Terminal, Briefcase } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Chatbot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const { messages, setMessages, sendMessage, status, error } = useChat();
  const isLoading = status === 'streaming' || status === 'submitted';
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    { text: "Tell me about Ankit's projects", icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
    { text: "What is his tech stack?", icon: <Terminal className="w-4 h-4 text-emerald-400" /> },
    { text: "Is he available for freelance?", icon: <Briefcase className="w-4 h-4 text-emerald-400" /> }
  ];

  const handleChipClick = (question: string) => {
    // @ts-ignore
    sendMessage({ role: 'user', content: question });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    // @ts-ignore - The backend strictly expects 'content', bypassing SDK frontend types
    sendMessage({ role: 'user', content: input });
    setInput('');
  };

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-5 md:right-8 w-[90vw] max-w-[380px] h-[500px] max-h-[70vh] bg-[#0A0A0A] border border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden flex flex-col z-[100]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <h3 className="text-sm font-sans font-semibold tracking-wide text-white">
                  Ask me anything
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={() => setMessages([])}
                    className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                    title="Clear chat"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              className="flex-1 overflow-y-auto p-5 space-y-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style>{`
                .flex-1::-webkit-scrollbar { display: none; }
              `}</style>
              {messages.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 pb-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2">
                    <Bot className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="space-y-2 max-w-[280px]">
                    <h3 className="text-sm font-sans font-medium text-white">Ankit's AI Assistant</h3>
                    <p className="text-xs font-sans text-white/40 leading-relaxed">
                      I know his tech stack, his projects, and his secrets. What do you want to know?
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-[280px] pt-2">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q.text}
                        onClick={() => handleChipClick(q.text)}
                        className="flex items-center gap-3 px-4 py-3 text-xs font-sans text-white/70 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.06] hover:text-white hover:border-white/10 transition-all text-left"
                      >
                        <span className="text-base">{q.icon}</span>
                        <span>{q.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {error && (
                <div className="text-center text-red-500 text-xs font-sans mt-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  Something went wrong: {error.message || 'Failed to get a response.'}
                </div>
              )}
              {messages.map((m: UIMessage) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-emerald-500" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-sans leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-white text-black rounded-tr-sm'
                        : 'bg-white/[0.05] text-white/90 border border-white/[0.05] rounded-tl-sm'
                    }`}
                  >
                    {/* @ts-ignore - Fallback to content if parts is missing for user messages */}
                    {(m as any).content ? (
                      <div className={`prose prose-sm max-w-none ${m.role === 'user' ? 'prose-invert text-black' : 'prose-invert text-white/90'}`}>
                        {m.role === 'user' ? (
                          <p className="m-0">{(m as any).content}</p>
                        ) : (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {(m as any).content}
                          </ReactMarkdown>
                        )}
                      </div>
                    ) : (
                      <div className="prose prose-sm prose-invert max-w-none text-white/90">
                        {m.parts?.map((part, i) => (
                          part.type === 'text' ? (
                            <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>
                              {part.text}
                            </ReactMarkdown>
                          ) : null
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl px-4 py-4 bg-white/[0.05] border border-white/[0.05] rounded-tl-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              
              {!isLoading && messages.length > 0 && messages[messages.length - 1]?.role !== 'user' && (
                <div className="flex flex-wrap gap-2 pt-2 justify-start pl-11">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q.text}
                      onClick={() => handleChipClick(q.text)}
                      className="px-3 py-1.5 text-[11px] font-sans text-white/50 bg-white/[0.02] border border-white/[0.05] rounded-full hover:bg-white/[0.08] hover:text-white transition-colors"
                    >
                      {q.text}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/[0.02] border-t border-white/[0.08]">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-full pl-5 pr-12 py-3 text-sm text-white focus:outline-none focus:border-white/20 focus:bg-white/[0.08] transition-all"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-2 rounded-full bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-5 md:right-8 z-50 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-110 transition-all duration-300"
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            )}
          </svg>
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
          )}
        </div>
      </button>
    </>
  );
}
