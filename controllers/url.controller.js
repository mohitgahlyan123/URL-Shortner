import { nanoid } from 'nanoid'; 
import URL from '../models/url.model.js';

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ error: "URL is required" });
    }
    const shortID = nanoid(8);
    try {
        await URL.create({
            shortId: shortID,
            redirectUrl: body.url,
            visitHistory: [],
            createdBy: req.user._id,
        });
        return res.redirect('/?id=' + shortID);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function handleGetAnalytics(req, res) {
    try {
        const shortId = req.params.shortId;
        const result = await URL.findOne({ shortId });
        if (!result) {
            return res.status(404).json({ error: "Short URL not found" });
        }
        return res.json({ totalClicks: result.visitHistory.length, analytics: result.visitHistory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export default {
    handleGenerateNewShortURL,
    handleGetAnalytics
};