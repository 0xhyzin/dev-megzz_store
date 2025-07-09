"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../../dataAccess/repositories/user.repository");
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("../../utils/logger");
class AuthServices {
    constructor() {
        this.CreateTokenToUser = (user) => __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info("create jwt", { sec: process.env.TOKEN_SECRET });
            const secrets = process.env.TOKEN_SECRET;
            const expiresDate = process.env.TOKEN_EXPIRESIN;
            const paylod = {
                id: user.user_id,
                fullName: `${user.first_name} ${user.last_name}`,
                email: user.email,
                Role: yield user_repository_1.userRepository.GetUserRole(user.user_id)
            };
            const option = {
                expiresIn: expiresDate,
            };
            return jsonwebtoken_1.default.sign(paylod, secrets, option);
        });
        this.CreateRefreshToken = () => {
            return crypto_1.default.randomBytes(64).toString("hex");
        };
    }
}
exports.authServices = new AuthServices();
