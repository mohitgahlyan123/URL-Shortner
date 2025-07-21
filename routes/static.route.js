import express from 'express';
import URL from '../models/url.model.js';

const router = express.Router();

router.get('/', async (req, res) =>{
    if(!req.user) {
        return res.redirect('/login');
    }
    const allurls= await URL.find({createdBy: req.user._id});
    return res.render('home', { id: req.query.id, urls: allurls });
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
});

export default router;