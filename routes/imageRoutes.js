const express = require('express');
const { uploadCSV, checkStatus } = require('../controllers/imageController');

const router = express.Router();

router.post('/upload', uploadCSV);
router.get('/status/:requestId', checkStatus);

module.exports = router;
