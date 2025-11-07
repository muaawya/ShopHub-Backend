// server_min.js  — temporary minimal server to get Render to pass deploy
import express from 'express';
const app = express();

app.get('/', (_req, res) => res.send('ShopHub backend - temporary health check OK'));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Temp server listening on ${PORT}`));