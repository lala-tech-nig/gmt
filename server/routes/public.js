const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { registerCitizen } = require('../controllers/publicController');

// POST /api/public/register
// Accepts multipart/form-data for file upload OR JSON with base64
router.post('/register', upload.single('imageFile'), registerCitizen);

module.exports = router;
