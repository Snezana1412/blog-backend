import User from "../models/users.model.js";
import { createError } from "../utils/helper.js";
import { verifyToken } from "../utils/jwt.js";

export const protect = async(req, res, next) => {
    try {
        // extract token from req.cookies
        const {token} = req.cookies;
        if(!token){
            res.status(400).json({
                status: 'failure',
                msg: 'cookie not exist'
            })
        }

        // verify token
        const token_payload = await verifyToken(token, process.env.JWT_SECRET);

        // verify the payload
        const user = await User.findById(token_payload.userid)
        if(!user){
            throw createError('User already deleted!', 401);
        }

        req.token_payload = token_payload;

        next()
    } catch (error) {
        next(error);
    }
}