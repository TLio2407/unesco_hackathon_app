import express from 'express';
import { createAnalyzeClient } from './src/api/client.js';
import { safeParseAnalyzeOutput } from './src/api/contract.js';

const app = express();
app.use(express.json({ limit: '10mb' }));

const client = createAnalyzeClient();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
    console.error('Analyze error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on port ${PORT}`);
});
