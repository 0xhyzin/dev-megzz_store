import { NextFunction, Request, Response } from "express";
import { body, cookie, validationResult } from "express-validator";

export const ValidationLoginUser = [
    body("email")
        .notEmpty()
        .isEmail()
        .withMessage("email is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password is required")
        .withMessage("Password must be at least 6 characters")
];
export const createUserValidation = [
    body('firstName')
        .notEmpty().withMessage('First name is required'),

    body('lastName')
        .notEmpty().withMessage('Last name is required'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character'),

    body('phone')
        .notEmpty().withMessage('Phone is required'),
];
