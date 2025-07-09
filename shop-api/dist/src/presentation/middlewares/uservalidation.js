"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationLoginUser = void 0;
const express_validator_1 = require("express-validator");
const ValidationLoginUser = (req, res, next) => {
    (0, express_validator_1.body)("email")
        .notEmpty()
        .isEmail()
        .withMessage("email is required");
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password is required")
        .withMessage("Password must be at least 6 characters");
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.ValidationLoginUser = ValidationLoginUser;
