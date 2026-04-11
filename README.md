# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Local development & preview

Set environment variables in a local `.env` file (copy from `.env.example`) to enable analytics and other public runtime config:

```
VITE_GA_ID=G-XXXXXXXXXX
```

Start the dev server:

```powershell
cd "c:\Users\A2Z\OneDrive\Documents\NDN Analytics\NDN Analytic website\ndn-analytics"
npm install
npm run dev
```

If `5173` is in use, Vite will choose another port (e.g. `5174`). Open the `Local` URL printed by Vite.

## Caching & Hosting recommendations

- Serve static assets (JS/CSS/images/fonts) with far-future `Cache-Control` when files are fingerprinted.
- Use `Cache-Control: public, max-age=31536000, immutable` for production fingerprinted assets.
- Use short caching or `no-cache` for HTML responses so clients pick up new content quickly.

Example Express middleware (already added to `server.js`) that sets appropriate headers:

```js
app.use((req, res, next) => {
  const url = req.url.split('?')[0];
  if (/\.(js|css|png|jpg|jpeg|svg|webp|avif|woff2|woff)$/.test(url)) {
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
  next();
});
```

Hosting notes:
- Vercel/Netlify: they automatically set appropriate caching; configure `_headers` or server settings for custom rules.
- Firebase Hosting: add `headers` in `firebase.json` to set `Cache-Control` for assets.
- Cloudflare: enable caching and Brotli/HTTP/2 for best performance.

