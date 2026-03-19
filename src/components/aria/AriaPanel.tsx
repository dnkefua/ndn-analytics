import { useState, useRef, useEffect } from 'react';
import type { AriaMessage } from '../../types';
import AriaMessageComp from './AriaMessage';
import { getAriaResponse, SUGGESTIONS } from './ariaKnowledge';
import { askAria, type ChatMessage } from './ariaApi';
import './Aria.css';

interface Props {
  onClose: () => void;
}

const WELCOME: AriaMessage = {
  id: '0',
  role: 'aria',
  content: "Hello! I'm ARIA, NDN Analytics' AI intelligence agent — powered by Claude. Ask me anything about our 10 products, technology stack, or how to get started.",
  timestamp: new Date(),
};

const HAS_API_KEY = Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY);

export default function AriaPanel({ onClose }: Props) {
  const [messages, setMessages] = useState<AriaMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Claude API message history (excludes the welcome message)
  const apiHistory = useRef<ChatMessage[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: AriaMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    let response: string;

    if (HAS_API_KEY) {
      // ── Claude API path ──────────────────────────────────────────────────
      apiHistory.current = [...apiHistory.current, { role: 'user', content: text }];
      try {
        response = await askAria(apiHistory.current);
        apiHistory.current = [...apiHistory.current, { role: 'assistant', content: response }];
      } catch {
        // Fallback to regex if API call fails
        response = getAriaResponse(text);
      }
    } else {
      // ── Regex fallback (no API key) ──────────────────────────────────────
      await new Promise(r => setTimeout(r, 700 + Math.random() * 400));
      response = getAriaResponse(text);
    }

    setTyping(false);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'aria',
      content: response,
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="aria-panel">
      <div className="aria-panel-header">
        <div className="aria-avatar-ring">
          <div className="aria-avatar-core">A</div>
        </div>
        <div>
          <div className="aria-panel-title">ARIA</div>
          <div className="aria-panel-status">
            <span className="aria-status-dot" />
            {HAS_API_KEY ? 'Claude AI · Online' : 'Online'}
          </div>
        </div>
        <button className="aria-close-btn" onClick={onClose} aria-label="Close ARIA">✕</button>
      </div>

      <div className="aria-messages">
        {messages.map(m => <AriaMessageComp key={m.id} message={m} />)}
        {typing && (
          <div className="aria-msg aria-msg--aria">
            <div className="aria-msg-avatar">A</div>
            <div className="aria-typing"><span /><span /><span /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="aria-suggestions">
        {SUGGESTIONS.slice(0, 3).map(s => (
          <button key={s} className="aria-chip" onClick={() => sendMessage(s)}>{s}</button>
        ))}
      </div>

      <form className="aria-input-row" onSubmit={e => { e.preventDefault(); sendMessage(input); }}>
        <input
          className="aria-input"
          placeholder="Ask ARIA anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
        />
        <button type="submit" className="aria-send-btn" disabled={!input.trim() || typing}>→</button>
      </form>
    </div>
  );
}
