import express from 'express';

const router = express.Router();

router.get('/', async (req, res) =>{
    const allurls= await URL.find({});
    return res.render('home', { urls: allurls });
})


export default router;