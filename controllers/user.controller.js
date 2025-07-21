import { v4 as uuidv4 } from 'uuid';
import User from "../models/user.model.js";
import {setUser, getUser} from '../service/auth.js';

async function handleUserSignup(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already registered" });
        }
        await User.create({ username, email, password });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to register user" });
    }
}

async function handleLoginUser(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const sessionId = uuidv4();
        setUser(sessionId, user);
        res.cookie("uid", sessionId);
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to log in user" });
    }
}

export default {
    handleUserSignup,
    handleLoginUser
};
