const requiredEnvVars = [
  'VITE_EMAILJS_SERVICE_ID',
  'VITE_EMAILJS_TEMPLATE_ID',
  'VITE_EMAILJS_PUBLIC_KEY',
];

const missing = requiredEnvVars.filter(v => !import.meta.env[v]);

if (missing.length > 0) {
  console.warn(
    '%c[NDN Analytics] Missing environment variables:',
    'color: #F59E0B; font-weight: bold;',
    missing.join(', ')
  );
}

export {};
