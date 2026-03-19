import type { AriaMessage as AriaMsg } from '../../types';
import './Aria.css';

interface Props { message: AriaMsg; }

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

export default function AriaMessage({ message }: Props) {
  return (
    <div className={`aria-msg aria-msg--${message.role}`}>
      {message.role === 'aria' && (
        <div className="aria-msg-avatar">A</div>
      )}
      <div
        className="aria-msg-bubble"
        dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
      />
    </div>
  );
}
