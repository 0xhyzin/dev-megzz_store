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
exports.productRepository = void 0;
const logger_1 = require("../../utils/logger");
const data_1 = require("../database/data");
const RepositoiesHandler_1 = require("../RepositoiesHandler");
class ProductRepository {
    constructor() {
        this.AddBrandTypeToDatabase = (newBrand) => __awaiter(this, void 0, void 0, function* () {
            let repoHandler = new RepositoiesHandler_1.RepositoiesHandler();
            try {
                const brand = yield data_1.prisma.brandtype.create({
                    data: {
                        name: newBrand.name,
                        slug: newBrand.slug,
                        image_url: newBrand.image_url
                    }
                });
                if (brand === null) {
                    throw Error("Can't add brand");
                }
                repoHandler = {
                    isSucceed: true,
                    body: brand,
                    message: "Brand add Succssfuly"
                };
            }
            catch (er) {
                logger_1.logger.error("error when add Brand in database", { error: er });
                repoHandler = {
                    isSucceed: false,
                    body: null,
                    message: "Can't add brand try again"
                };
            }
            return repoHandler;
        });
        this.GetBrandById = (brandId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const brand = yield data_1.prisma.brandtype.findUnique({
                    where: {
                        brandtype_id: brandId
                    }
                });
                if (brand === null) {
                    throw Error("Can't add brand");
                }
                return brand;
            }
            catch (er) {
                logger_1.logger.error("error when add Brand in database", { error: er });
            }
            return null;
        });
        this.UpdateBrandTypeToDatabase = (updateBrand) => __awaiter(this, void 0, void 0, function* () {
            let repoHandler = new RepositoiesHandler_1.RepositoiesHandler();
            try {
                const brand = yield data_1.prisma.brandtype.update({
                    where: {
                        brandtype_id: updateBrand.brandtype_id
                    },
                    data: {
                        name: updateBrand.name,
                        slug: updateBrand.slug,
                        image_url: updateBrand.image_url
                    }
                });
                if (brand === null) {
                    throw Error("Can't Update brand");
                }
                repoHandler = {
                    isSucceed: true,
                    body: brand,
                    message: "Brand Update Succssfuly"
                };
            }
            catch (er) {
                logger_1.logger.error("error when Update Brand in database", { error: er });
                repoHandler = {
                    isSucceed: false,
                    body: null,
                    message: "Can't Update brand try again"
                };
            }
            return repoHandler;
        });
        this.DeleteBrandTypeFromDatabase = (brandId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const brand = yield data_1.prisma.brandtype.delete({
                    where: {
                        brandtype_id: brandId
                    }
                });
                if (brand === null) {
                    throw Error("Can't Delete brand");
                }
                return true;
            }
            catch (er) {
                logger_1.logger.error("error when Delete Brand From database", { error: er });
            }
            return false;
        });
        this.GetBrandTypes = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const brands = yield data_1.prisma.brandtype.findMany();
                if (brands === null) {
                    throw Error("Can't Delete brand");
                }
                return brands;
            }
            catch (er) {
                logger_1.logger.error("error when Delete Brand From database", { error: er });
            }
            return null;
        });
    }
}
exports.productRepository = new ProductRepository();
