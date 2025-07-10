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
exports.userController = void 0;
const user_service_1 = require("../../business/services/user.service");
const logger_1 = require("../../utils/logger");
class UserController {
    constructor() {
        this.LoginUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const loginUserDto = {
                email: email,
                password: password
            };
            const servRespons = yield user_service_1.userService.GetUser(loginUserDto);
            if (!servRespons.isSucceed || servRespons.refreshToken === null) {
                logger_1.logger.error("login faild");
                res.status(400).send({ message: servRespons.message });
            }
            res.cookie("refreshTocken", servRespons.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000
            }).status(200).send({ message: servRespons.message, user: servRespons.body });
        });
        this.CreatNewAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password, phone, additionalDetails, apartmentNumber, buildingNameNumber, governorateCity, street } = req.body;
            const createUserDto = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
                phone: phone,
                address: {
                    additional_details: additionalDetails,
                    apartment_number: apartmentNumber,
                    building_name_number: buildingNameNumber,
                    governorate_city: governorateCity,
                    street: street,
                }
            };
            const servRespons = yield user_service_1.userService.addUser(createUserDto);
            if (!servRespons.isSucceed || servRespons.refreshToken === null) {
                logger_1.logger.error("create Account faild");
                res.status(400).send({ message: servRespons.message });
            }
            res.cookie("refreshTocken", servRespons.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000
            }).status(200).send({ message: servRespons.message, user: servRespons.body });
        });
    }
}
exports.userController = new UserController();
