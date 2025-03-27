// routes/api.js - API routes using ES Modules syntax
import express from 'express';
const router = express.Router();

// Example route
router.get('/test', (req, res) => {
  res.json({ msg: 'API route works!' });
});

// Add your other API routes here

export default router;
