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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const data_1 = require("../database/data");
const logger_1 = require("../../utils/logger");
const RepositoiesHandler_1 = require("../RepositoiesHandler");
class UserRepository {
    constructor() {
        this.FindUserByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            let user;
            const repoHandler = new RepositoiesHandler_1.RepositoiesHandler();
            try {
                logger_1.logger.info("try Find User By Email ", { email: email, file: "UserRepo" });
                user = yield data_1.prisma.user.findUnique({
                    where: {
                        email: email
                    }
                });
                if (user === null) {
                    throw Error("There is no user with this email");
                }
            }
            catch (er) {
                logger_1.logger.error("There is no user with this email", { email: email, errorMessege: er });
                repoHandler.message = "Log in first";
                repoHandler.isSucceed = false;
                repoHandler.body = null;
                return repoHandler;
            }
            logger_1.logger.info("User Found Succssfuly", { email: user.email, name: `${user.first_name} ${user.last_name}` });
            repoHandler.message = "welcome back";
            repoHandler.isSucceed = true;
            repoHandler.body = user;
            return repoHandler;
        });
        this.AddPhoneNumberToUser = (userId, userPhones) => __awaiter(this, void 0, void 0, function* () {
        });
        this.AddAddressToUser = (userId, userAddress) => __awaiter(this, void 0, void 0, function* () {
        });
        this.AddNewUser = (newUser) => __awaiter(this, void 0, void 0, function* () {
            const repoHandler = new RepositoiesHandler_1.RepositoiesHandler();
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
            let user;
            try {
                logger_1.logger.info("add User To database");
                user = yield data_1.prisma.user.create({
                    data: {
                        first_name: newUser.first_name,
                        last_name: newUser.last_name,
                        email: newUser.email,
                        hash_password: newUser.hash_password,
                        role: {
                            connect: {
                                roletype_id: process.env.USER_ROLE || "non"
                            }
                        }
                    },
                });
                if (user === null) {
                    throw Error("some thing Wrong when add user in database");
                }
                logger_1.logger.info("try add Deffult Role To User", { Role: "User" });
                const userRole = yield data_1.prisma.role.create({
                    data: {
                        roletype_id: process.env.USER_ROLE || "non",
                        user_id: user.user_id,
                    }
                });
                if (userRole === null) {
                    logger_1.logger.error("Role can't add To user check env");
                    throw Error("You can't Add User");
                }
                //Add phone Number to Database 
                yield this.AddPhoneNumberToUser(user.user_id);
                //Add Address to databases
            }
            catch (er) {
                logger_1.logger.error("you can't add user to database", { errorMessege: er });
                repoHandler.message = "some thing Wrong";
                repoHandler.isSucceed = false;
                repoHandler.body = null;
                return repoHandler;
            }
            logger_1.logger.info("User Added Succssfuly");
            repoHandler.message = "welcome";
            repoHandler.isSucceed = true;
            repoHandler.body = user.user_id;
            return repoHandler;
        });
        this.FindUserById = (userId) => __awaiter(this, void 0, void 0, function* () {
            const repoHandler = new RepositoiesHandler_1.RepositoiesHandler();
            let user;
            try {
                logger_1.logger.info("try get user By Id", { userId: userId });
                user = yield data_1.prisma.user.findUnique({
                    where: {
                        user_id: userId
                    }
                });
                if (user === null) {
                    throw Error("no User Found");
                }
            }
            catch (er) {
                logger_1.logger.error("No User Found Have this id", { userId: userId, errorMessege: er });
                repoHandler.isSucceed = false;
                repoHandler.message = "User Not found";
                repoHandler.body = null;
                return repoHandler;
            }
            logger_1.logger.info("User Find Succssfuly", { email: user.email, name: `${user.first_name} ${user.last_name}` });
            repoHandler.message = "welcome ";
            repoHandler.isSucceed = true;
            repoHandler.body = user;
            return repoHandler;
        });
        this.GetUserRole = (userId) => __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info("try Get User Roles", { userId: userId });
            let roles;
            try {
                roles = yield data_1.prisma.role.findMany({
                    where: { user_id: userId },
                    include: {
                        roletype: {
                            select: {
                                rolename: true,
                            }
                        }
                    }
                });
                if (roles === null) {
                    throw Error("some thing Wrong");
                }
            }
            catch (er) {
                logger_1.logger.error("NO Roles Find", { userId: userId });
                return null;
            }
            return roles.map(role => { var _a; return (_a = role.roletype) === null || _a === void 0 ? void 0 : _a.rolename; });
        });
    }
}
exports.userRepository = new UserRepository();
