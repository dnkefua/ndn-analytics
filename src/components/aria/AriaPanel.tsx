import { useState, useRef, useEffect } from 'react';
import type { AriaMessage } from '../../types';
import AriaMessageComp from './AriaMessage';
import { getAriaResponse, SUGGESTIONS } from './ariaKnowledge';
import './Aria.css';

interface Props {
  onClose: () => void;
}

const WELCOME: AriaMessage = {
  id: '0',
  role: 'aria',
  content: "Hello! I'm ARIA, NDN Analytics' AI agent. Ask me anything about our products, technology, or how to get started.",
  timestamp: new Date(),
};

export default function AriaPanel({ onClose }: Props) {
  const [messages, setMessages] = useState<AriaMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: AriaMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response = getAriaResponse(text);
      setTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'aria',
        content: response,
        timestamp: new Date(),
      }]);
    }, 800 + Math.random() * 400);
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
            <span className="aria-status-dot" /> Online
          </div>
        </div>
        <button className="aria-close-btn" onClick={onClose} aria-label="Close ARIA">✕</button>
      </div>

      <div className="aria-messages">
        {messages.map(m => <AriaMessageComp key={m.id} message={m} />)}
        {typing && (
          <div className="aria-msg aria-msg--aria">
            <div className="aria-msg-avatar">A</div>
            <div className="aria-typing"><span/><span/><span/></div>
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
        <button type="submit" className="aria-send-btn" disabled={!input.trim()}>→</button>
      </form>
    </div>
  );
}
