import { NextFunction, Request, Response } from "express";
import { body, cookie, validationResult } from "express-validator";

export const ValidationLoginUser = (req: Request, res: Response, next: NextFunction) => {

    body("email")
        .notEmpty()
        .isEmail()
        .withMessage("email is required")
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password is required")
        .withMessage("Password must be at least 6 characters");

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    next();
}