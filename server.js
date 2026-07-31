import 'dotenv/config';
import express from 'express';
import { createServerAnalyzeClient } from './src/api/client.js';

const app = express();

// Enable CORS for Expo web / cross-origin requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json({ limit: '10mb' }));

const client = createServerAnalyzeClient();
const hasRealAI = !!process.env.AI_STUDIO_API_KEY;

console.log(`[server] AI mode: ${hasRealAI ? 'Google AI Studio (real)' : 'mock'}`);
console.log(`[server] Model: ${process.env.AI_MODEL || 'gemma-4-31b-it'}`);

// Health check
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'ok',
    ai: hasRealAI ? 'real' : 'mock',
    model: process.env.AI_MODEL || 'gemma-4-31b-it',
    timestamp: new Date().toISOString(),
  });
});

// Analyze endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const input = req.body;
    if (!input || !input.kind) {
      return res.status(400).json({ error: 'Invalid input: missing kind' });
    }

    const result = await client.analyze(input);
    res.json(result);
  } catch (error) {
    console.error('[server] Analyze error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] API server running on port ${PORT}`);
  console.log(`[server] POST http://localhost:${PORT}/api/analyze`);
});
