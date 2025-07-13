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
exports.productController = void 0;
const logger_1 = require("../../utils/logger");
const product_service_1 = require("../../business/services/product.service");
class ProductController {
    constructor() {
        this.AddBrandType = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            const image = req.file;
            const addBrandTypeDto = {
                name: name,
                image: image,
                slug: "",
            };
            const servRespons = yield product_service_1.productServices.AddBrandType(addBrandTypeDto);
            if (!servRespons.isSucceed) {
                logger_1.logger.error("login faild");
                res.status(400).send({ message: servRespons.message });
            }
            res.status(200).send(servRespons.body);
        });
        this.UpdateBrandType = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { name } = req.body;
            const image = req.file;
            const updateBrandTypeDto = {
                name: name,
                image: image,
                slug: "",
            };
            const servRespons = yield product_service_1.productServices.UpdateBrandType(id, updateBrandTypeDto);
            if (!servRespons.isSucceed) {
                logger_1.logger.error("login faild");
                res.status(400).send({ message: servRespons.message });
            }
            res.status(200).send(servRespons.body);
        });
        this.DeleteBrandType = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const servRespons = yield product_service_1.productServices.DeleteBrandType(id);
            if (!servRespons.isSucceed) {
                logger_1.logger.error("login faild");
                res.status(400).send({ message: servRespons.message });
            }
            res.status(200).send({ isSuccssfuly: servRespons.isSucceed, message: servRespons.message });
        });
        this.GetBrandType = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const servRespons = yield product_service_1.productServices.GetAllBrandType();
            if (!servRespons.isSucceed) {
                logger_1.logger.error("login faild");
                res.status(400).send({ message: servRespons.message });
            }
            res.status(200).send(servRespons.body);
        });
        this.GetBrandTypeById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const servRespons = yield product_service_1.productServices.GetBrandTypeById(id);
            if (!servRespons.isSucceed) {
                logger_1.logger.error("login faild");
                res.status(400).send({ message: servRespons.message });
            }
            res.status(200).send(servRespons.body);
        });
    }
}
exports.productController = new ProductController();
