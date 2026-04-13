interface Window {
  gtag: (...args: unknown[]) => void;
  dataLayer: unknown[];
}

declare const gtag: (...args: unknown[]) => void;
