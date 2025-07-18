import express from 'express';
import urlController from '../controllers/url.controller.js';

const router = express.Router();

router.post('/', urlController.handleGenerateNewShortURL);
router.get('/analytics/:shortId', urlController.handleGetAnalytics);

export default router;
