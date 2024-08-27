import {body} from 'express-validator';
import User from '../models/users.model.js';
import { createError } from '../utils/helper.js';

async function isDuplicate (email) {
    const user = await User.findOne({email});
    if(user){
        throw createError('This email already in use!')
    }
}

export const register_validation = [
    body('fullname')
        .escape()
        .trim()
        .notEmpty().withMessage('Fullname is required')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Invalid fullname')
        .isLength({min: 3, max: 100}).withMessage('Invalid fullname length'),
    
    body('email')
        .escape()
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address')
        .custom(isDuplicate),


    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({min: 5})

];


export const login_validation = [
    body('email')
        .escape()
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({min: 5})

]