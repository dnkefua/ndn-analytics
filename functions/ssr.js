import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const DIST_PATH = path.join(process.cwd(), 'dist');
const INDEX_HTML = path.join(DIST_PATH, 'index.html');
const SSR_ENTRY = path.join(DIST_PATH, 'entry-ssr.js');

let template;
let render;

async function init() {
  try {
    template = fs.readFileSync(INDEX_HTML, 'utf-8');
    const mod = await import(SSR_ENTRY);
    render = mod.render;
    console.log('SSR initialized successfully');
  } catch (err) {
    console.error('SSR init error:', err);
  }
}

init();

app.use(express.static(DIST_PATH, {
  maxAge: '1y',
  immutable: true,
}));

app.get('*', async (req, res) => {
  try {
    if (!render) {
      await init();
    }
    const url = req.originalUrl;
    const result = await render(url);
    const appHtml = result.html;
    
    let html = template.replace('<!--ssr-outlet-->', appHtml);
    
    res.set('Content-Type', 'text/html').send(html);
  } catch (err) {
    console.error('SSR Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

export default app;