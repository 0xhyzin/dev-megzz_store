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
exports.userService = void 0;
const user_repository_1 = require("../../dataAccess/repositories/user.repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = require("../../utils/logger");
const auth_service_1 = require("./auth.service");
const mapper_1 = require("../helpers/mapper");
const ServicesHandler_1 = require("../ServicesHandler");
class UserService {
    constructor() {
        this.GetUser = (loginUserDto) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            let servHandler = new ServicesHandler_1.ServicesHandler();
            logger_1.logger.info("Get User By Email", { fileName: "User Service" });
            const repoRespons = yield user_repository_1.userRepository.FindUserByEmail(loginUserDto.email);
            if (repoRespons.isSucceed === false || repoRespons.body === null) {
                logger_1.logger.error("User not fount must create Account First");
                servHandler.body = null;
                servHandler.isSucceed = false;
                servHandler.message = repoRespons.message;
                return servHandler;
            }
            logger_1.logger.info("check user Password", { fileName: "User Service" });
            const hashPassword = (_a = repoRespons.body) === null || _a === void 0 ? void 0 : _a.hash_password;
            const isPasswordCorrect = yield bcrypt_1.default.compare(loginUserDto.password, hashPassword);
            if (!isPasswordCorrect) {
                logger_1.logger.error("Password Not Match try again");
                servHandler.body = null;
                servHandler.isSucceed = false;
                servHandler.message = "There is an error, try again.";
                return servHandler;
            }
            logger_1.logger.info("Get JWT Token To User", { email: (_b = repoRespons.body) === null || _b === void 0 ? void 0 : _b.email });
            const jwtToken = yield auth_service_1.authServices.CreateTokenToUser(repoRespons.body);
            logger_1.logger.info("Get Refresh Token To User", { email: (_c = repoRespons.body) === null || _c === void 0 ? void 0 : _c.email });
            const refreshToken = auth_service_1.authServices.CreateRefreshToken();
            if (jwtToken === null || refreshToken === null) {
                logger_1.logger.error("Error When create Jwt or RefreshToken");
                servHandler.body = null;
                servHandler.isSucceed = false;
                servHandler.message = "There is an error, try again.";
                return servHandler;
            }
            logger_1.logger.info("Login successfuly Welcom");
            servHandler.isSucceed = true;
            servHandler.message = repoRespons.message;
            servHandler.body = (0, mapper_1.ToUserDto)(repoRespons.body, jwtToken);
            servHandler.refreshToken = refreshToken;
            return servHandler;
        });
        this.addUser = (newUser) => __awaiter(this, void 0, void 0, function* () {
            let servHandler = new ServicesHandler_1.ServicesHandler();
            logger_1.logger.info("try add user and hash password", { fileName: "userServices" });
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
            const user = {
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                phone: newUser.phone,
                hash_password: yield bcrypt_1.default.hash(newUser.password, saltRounds)
            };
            logger_1.logger.info("Go to User Repo To Add User To Database");
            const repoRespons = yield user_repository_1.userRepository.AddNewUser(user);
            if (!repoRespons.isSucceed) {
                logger_1.logger.error("User Cann't Add In database", { message: repoRespons.message });
                servHandler.body = null;
                servHandler.isSucceed = false;
                servHandler.message = "There is an error, try again.";
                return servHandler;
            }
            logger_1.logger.info("Get JWT Token To User", { email: repoRespons.body.email });
            const jwtToken = yield auth_service_1.authServices.CreateTokenToUser(repoRespons.body);
            logger_1.logger.info("Get Refresh Token To User", { email: repoRespons.body.email });
            const refreshToken = auth_service_1.authServices.CreateRefreshToken();
            if (jwtToken === null || refreshToken === null) {
                logger_1.logger.error("Error When create Jwt or RefreshToken");
                servHandler.body = null;
                servHandler.isSucceed = false;
                servHandler.message = "There is an error, try again.";
                return servHandler;
            }
            logger_1.logger.info("Convert User With Address And Phone to User Dto", { fileName: "User Service" });
            const userDto = (0, mapper_1.ToUserDto)(repoRespons.body, jwtToken);
            logger_1.logger.info("user add successfuly Welcom");
            servHandler.isSucceed = true;
            servHandler.message = "user add successfuly.";
            servHandler.body = userDto;
            servHandler.refreshToken = refreshToken;
            return servHandler;
        });
    }
}
exports.userService = new UserService();
