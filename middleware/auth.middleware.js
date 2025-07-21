import e from "express";
import { getUser } from "../service/auth.js";
export async function restrictToLoggedInUserOnly(req, res, next) {
    const userUid = req.cookies.uid;
    if (!userUid) {
        return res.redirect('/login');
    }
    const user = getUser(userUid);
    if (!user) {
        return res.redirect('/login');
    }
    req.user = user;
    next();
}

export async function checkAuth(req, res, next) {
    const userUid = req.cookies?.uid;
    
    const user = getUser(userUid);
   
    req.user = user;
    next();
}

export default {
    restrictToLoggedInUserOnly,
    checkAuth
};