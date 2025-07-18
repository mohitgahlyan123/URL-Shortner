import express from 'express';
import dotenv from 'dotenv';
import urlRouter from './routes/url.route.js';
import URL from './models/url.model.js';
import connectDB from './connect.js';
dotenv.config();

const app = express();
app.use(express.json());

connectDB(process.env.MONGODB_URI).then(() => {
    console.log("Database connected successfully");
}).catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
});

app.use("/url", urlRouter);

// Add error handling and check if entry exists
app.get("/url/:shortId", async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timeStamp: Date.now(),
                    },
                },
            },
            { new: true }
        );
        if (!entry) {
            return res.status(404).json({ error: "Short URL not found" });
        }
        res.redirect(entry.redirectUrl);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Errorrrrr" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
