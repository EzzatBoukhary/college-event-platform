// server.js - Express server using ES Modules syntax
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';

// ES Modules replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Serve static files from your frontend build
app.use(express.static(path.join(__dirname, 'dist'))); // For Vite

// Handle SPA routing - serve index.html for any route not found
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html')); // For Vite
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
