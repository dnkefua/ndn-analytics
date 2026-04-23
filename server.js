import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SEO_BLOCK_PATTERN = /<!-- Primary Meta Tags -->[\s\S]*?<!-- Google Analytics: initialized at runtime from VITE_GA_ID -->/

function splitRenderedHead(appHtml) {
  const bodyStart = appHtml.indexOf('<nav')
  if (bodyStart === -1) {
    return { head: '', body: appHtml }
  }

  return {
    head: appHtml.slice(0, bodyStart),
    body: appHtml.slice(bodyStart),
  }
}

function injectRenderedHtml(template, appHtml, helmet) {
  const { head, body } = splitRenderedHead(appHtml)
  let html = template.replace('<!--ssr-outlet-->', body)

  const headTags = head || [
    helmet?.title?.toString?.(),
    helmet?.priority?.toString?.(),
    helmet?.meta?.toString?.(),
    helmet?.link?.toString?.(),
    helmet?.script?.toString?.(),
  ].filter(Boolean).join('\n')

  if (!headTags) {
    return html
  }

  return html.replace(
    SEO_BLOCK_PATTERN,
    `<!-- Primary Meta Tags -->\n${headTags}\n\n    <!-- Google Analytics: initialized at runtime from VITE_GA_ID -->`
  )
}

async function createServer() {
  const app = express()

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  app.use(vite.ssrFixStacktrace)
  app.use(vite.middlewares)

  app.use((req, res, next) => {
    try {
      const url = req.url.split('?')[0]
      if (/\.(js|css|png|jpg|jpeg|svg|webp|avif|woff2|woff)$/.test(url)) {
        if (process.env.NODE_ENV === 'production') {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        } else {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        }
      }
    } catch {
      // Ignore header errors in development.
    }
    next()
  })

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
      template = await vite.transformIndexHtml(url, template)

      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
      const { html: appHtml, helmet } = await render(url)

      const html = injectRenderedHtml(template, appHtml, helmet)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (error) {
      vite.ssrFixStacktrace(error)
      next(error)
    }
  })

  app.listen(5173, () => {
    console.log('Server running at http://localhost:5173')
  })
}

createServer()
