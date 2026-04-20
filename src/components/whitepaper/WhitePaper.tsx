import { useEffect, useRef } from 'react';
import './WhitePaper.css';

const WhitePaper = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.src = '/whitepaper/index.html';
      iframe.className = 'wp-iframe';
      iframe.title = 'NDN IPFS Chain White Paper';
      iframe.style.cssText = 'width:100%;height:100vh;border:none;background:#020814;';
      containerRef.current.appendChild(iframe);
    }
  }, []);

  return <div ref={containerRef} className="wp-wrapper" />;
};

export default WhitePaper;