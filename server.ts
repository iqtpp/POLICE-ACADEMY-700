import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), 'data_store.json');

app.use(express.json({ limit: '25mb' }));

// Helper to get stored data
function getStoreData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading data_store.json:', err);
  }
  return null;
}

// Helper to save data
function saveStoreData(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving data_store.json:', err);
    return false;
  }
}

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/data', (_req, res) => {
  const data = getStoreData() || {};
  // Applications are private Supabase data and must never be exposed by this public API.
  const { applications: _privateApplications, ...publicData } = data;
  res.json({ success: true, data: publicData });
});

app.post('/api/data', (req, res) => {
  // Keep academy applications out of the public server-side JSON store.
  const { applications: _privateApplications, ...publicPayload } = req.body || {};
  const success = saveStoreData(publicPayload);
  res.json({ success });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
