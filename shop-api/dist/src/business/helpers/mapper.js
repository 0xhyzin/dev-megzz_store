"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToUserDto = void 0;
const ToUserDto = (user, token) => {
    return {
        fullName: `${user.first_name} ${user.last_name}`,
        email: user.email,
        token: token
    };
};
exports.ToUserDto = ToUserDto;
