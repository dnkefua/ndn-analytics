import { useState, useRef, useEffect } from 'react';
import type { AriaMessage } from '../../types';
import AriaMessageComp from './AriaMessage';
import { getAriaResponse, SUGGESTIONS } from './ariaKnowledge';
import { askAria, HAS_ANTHROPIC_KEY, isHighIntent, extractProductInterests, type ChatMessage } from './ariaApi';
import { createLead, addEngagement, attributeAnonymousEngagements, getSessionId } from '../../lib/leads';
import './Aria.css';

interface Props {
  onClose: () => void;
}

const WELCOME: AriaMessage = {
  id: '0',
  role: 'aria',
  content: "Hello! I'm ARIA, NDN Analytics' AI intelligence agent. Ask me anything about our 10 products, technology stack, or how to get started.",
  timestamp: new Date(),
};

export default function AriaPanel({ onClose }: Props) {
  const [messages, setMessages] = useState<AriaMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(1);
  const sessionId = useRef(getSessionId());

  // Claude API message history (excludes the welcome message)
  const apiHistory = useRef<ChatMessage[]>([]);
  const emailCaptureShown = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, showEmailCapture]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    messageIdCounter.current += 1;
    const userMsg: AriaMessage = {
      id: messageIdCounter.current.toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    let response: string;

    if (HAS_ANTHROPIC_KEY) {
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

    // Check for high intent and show email capture (only once per session)
    if (!emailCaptureShown.current && !emailSubmitted && isHighIntent(apiHistory.current)) {
      emailCaptureShown.current = true;
      setTimeout(() => {
        setShowEmailCapture(true);
        // Add system message prompting email
        setMessages(prev => [...prev, {
          id: (Date.now() + 2).toString(),
          role: 'aria',
          content: "I can have our solutions team prepare a personalized analysis for your use case. What's the best email to reach you?",
          timestamp: new Date(),
        }]);
      }, 1500);
    }

    // Track engagement if we have a lead
    if (leadId) {
      await addEngagement(leadId, 'aria_conversation', {
        messageCount: apiHistory.current.length,
        sessionId: sessionId.current,
      });
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const productInterests = extractProductInterests(apiHistory.current);

    try {
      const lead = await createLead({
        email: emailInput,
        source: 'aria_chat',
        productInterests,
        tags: ['aria_qualified', 'high_intent'],
      });

      if (lead?.id) {
        setLeadId(lead.id);
        await attributeAnonymousEngagements(lead.id);
        await addEngagement(lead.id, 'aria_conversation', {
          messageCount: apiHistory.current.length,
          sessionId: sessionId.current,
          conversationSummary: apiHistory.current.slice(-4).map(m => `${m.role}: ${m.content.slice(0, 100)}`).join(' | '),
        });
      }

      setEmailSubmitted(true);
      setShowEmailCapture(false);

      // Confirmation message
      setMessages(prev => [...prev, {
        id: (Date.now() + 3).toString(),
        role: 'aria',
        content: `Perfect! Our team will reach out to ${emailInput} within 24 hours with a tailored analysis. In the meantime, feel free to ask me anything else about NDN Analytics.`,
        timestamp: new Date(),
      }]);
    } catch (err) {
      console.error('Failed to capture lead:', err);
    }

    setEmailInput('');
  };

  const dismissEmailCapture = () => {
    setShowEmailCapture(false);
    setMessages(prev => [...prev, {
      id: (Date.now() + 4).toString(),
      role: 'aria',
      content: "No problem! Feel free to continue exploring, and let me know if you'd like to connect with our team later.",
      timestamp: new Date(),
    }]);
  };

  const statusLabel = HAS_ANTHROPIC_KEY ? 'Claude AI · Online' : 'Online';

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
            {statusLabel}
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

        {/* Email capture inline card */}
        {showEmailCapture && (
          <div className="aria-email-capture">
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 180,
                  padding: '10px 14px',
                  background: 'rgba(6,182,212,0.08)',
                  border: '1px solid rgba(6,182,212,0.3)',
                  borderRadius: 8,
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                autoFocus
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '10px 16px', fontSize: '0.85rem' }}
              >
                Send
              </button>
              <button
                type="button"
                onClick={dismissEmailCapture}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                Not now
              </button>
            </form>
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
