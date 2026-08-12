import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), 'public');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.pdf': 'application/pdf', '.svg': 'image/svg+xml' };
const fileFor = (url) => {
  const requested = decodeURIComponent((url || '/').split('?')[0]).replace(/^\/+/, '') || 'index.html';
  const file = resolve(root, requested);
  return file.startsWith(root) ? file : null;
};

createServer(async (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, name: 'cotizacion-plataforma-aprendizaje' }));
    return;
  }
  const file = fileFor(req.url);
  if (!file) { res.writeHead(403); res.end('Forbidden'); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'public, max-age=300' });
    res.end(body);
  } catch {
    try {
      const body = await readFile(join(root, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(body);
    } catch { res.writeHead(404); res.end('Not found'); }
  }
}).listen(Number(process.env.PORT || 3000), process.env.HOST || '0.0.0.0');
