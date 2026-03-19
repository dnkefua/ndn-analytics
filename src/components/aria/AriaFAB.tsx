import { useState } from 'react';
import AriaPanel from './AriaPanel';
import './Aria.css';

export default function AriaFAB() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <AriaPanel onClose={() => setOpen(false)} />}
      <button
        className={`aria-fab${open ? ' aria-fab--open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Open ARIA AI Agent"
      >
        {open ? '✕' : 'A'}
      </button>
    </>
  );
}
