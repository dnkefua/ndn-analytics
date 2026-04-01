interface Window {
  gtag: (...args: unknown[]) => void;
  dataLayer: unknown[];
  Calendly: {
    initPopupWidget: (config: { url: string }) => void;
  };
}

declare const gtag: (...args: unknown[]) => void;
declare const Calendly: {
  initPopupWidget: (config: { url: string }) => void;
};
