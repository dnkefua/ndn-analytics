import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // Create Vite server in middleware mode and configure the app type as 'custom'
  // This disables Vite's own HTML serving logic so parent server can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // Use vite's connect instance as middleware
  app.use(vite.ssrFixStacktrace)
  app.use(vite.middlewares)

  // Simple caching headers for static assets — friendly defaults for prod vs dev
  app.use((req, res, next) => {
    try {
      const url = req.url.split('?')[0];
      if (/\.(js|css|png|jpg|jpeg|svg|webp|avif|woff2|woff)$/.test(url)) {
        if (process.env.NODE_ENV === 'production') {
          // long-lived immutable cache for fingerprinted assets
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          // avoid aggressive caching in dev
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
      }
    } catch (e) {
      // ignore header errors
    }
    next();
  })

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      // 1. Read index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      )

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
      //    also applies HTML transforms from Vite plugins, e.g. global
      //    preambles from @vitejs/plugin-react
      template = await vite.transformIndexHtml(url, template)

      // 3. Load the server entry. ssrLoadModule automatically transforms
      //    ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')

      // 4. render the app HTML. This assumes entry-server.js's exported
      //     `render` function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      const { html: appHtml, helmet } = await render(url)

      // 5. Inject the app-rendered HTML into the template.
      const html = template
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace('<title>NDN Analytics — Enterprise AI & Blockchain Intelligence</title>', helmet.title.toString() || '<title>NDN Analytics — Enterprise AI & Blockchain Intelligence</title>')
        .replace(/<meta name="description"[^>]*>/, helmet.meta.toString() || '<meta name="description" content="NDN Analytics delivers enterprise AI and blockchain intelligence platforms. Google Cloud AI meets Ethereum for demand forecasting, healthcare AI, supply chain traceability, and smart contract solutions." />')

      // 6. Send the rendered HTML back.
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  app.listen(5173, () => {
    console.log('Server running at http://localhost:5173')
  })
}

createServer()