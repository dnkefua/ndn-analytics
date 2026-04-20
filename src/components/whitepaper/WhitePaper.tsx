import './WhitePaper.css';

const WhitePaper = () => {
  return (
    <div className="wp-wrapper">
      <iframe
        src="/whitepaper/index.html"
        className="wp-iframe"
        title="NDN IPFS Chain White Paper"
        loading="lazy"
      />
    </div>
  );
};

export default WhitePaper;