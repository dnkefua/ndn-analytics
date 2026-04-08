const functions = require('firebase-functions');
const express = require('express');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

const app = express();

const DIST_PATH = __dirname;
const INDEX_HTML = path.join(DIST_PATH, 'index.html');
const SSR_ENTRY = path.join(DIST_PATH, 'entry-ssr.js');

let template;
let render;

async function init() {
  try {
    template = fs.readFileSync(INDEX_HTML, 'utf-8');
    const ssrUrl = pathToFileURL(SSR_ENTRY).href;
    const mod = await import(ssrUrl);
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

exports.ssr = functions.https.onRequest(app);