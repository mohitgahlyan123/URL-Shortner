import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import connectDB from './connect.js';
import URL from './models/url.model.js';
import urlRouter from './routes/url.route.js';
import staticRouter from './routes/static.route.js';
import userRouter from './routes/user.route.js';
import { restrictToLoggedInUserOnly, checkAuth } from './middleware/auth.middleware.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

connectDB(process.env.MONGODB_URI).then(() => {
    console.log("Database connected successfully");
}).catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
});

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
// app.get('/', async (req, res) => {
//     const allurls = await URL.find({});
//     res.render('home', { id: req.query.id, urls: allurls });
// })

app.use("/url", restrictToLoggedInUserOnly, urlRouter);
app.use('/user', userRouter);
app.use("/", checkAuth, staticRouter);


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
