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
exports.productServices = void 0;
const slugify_1 = __importDefault(require("slugify"));
const logger_1 = require("../../utils/logger");
const supperbase_connection_1 = require("../helpers/supperbase.connection");
const ServicesHandler_1 = require("../ServicesHandler");
const product_repository_1 = require("../../dataAccess/repositories/product.repository");
class ProductServices {
    constructor() {
        this.AddBrandType = (newBrand) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            let servHandler = new ServicesHandler_1.ServicesHandler();
            logger_1.logger.info("Try add Brand type in product services");
            logger_1.logger.info("change slug name");
            newBrand.slug = (0, slugify_1.default)(newBrand.name, { lower: true });
            const image = newBrand.image;
            const fileName = `${Date.now()}_${image.originalname}`;
            const bucket = 'brandimages';
            logger_1.logger.info("Add image To supabase and Return imageUrl To Add It in database");
            const { reuslt, imageUrl } = yield (0, supperbase_connection_1.SaveImageInSupabase)(newBrand.image, fileName, bucket);
            if (reuslt.error) {
                logger_1.logger.error("You Can't Add this image", { error: reuslt.error });
                servHandler = {
                    body: null,
                    isSucceed: false,
                    message: "Failed to upload image",
                    refreshToken: null
                };
                return servHandler;
            }
            logger_1.logger.info("image add in supabase succssfuly", { data: reuslt.data, imageUrl: imageUrl });
            const image_input = {
                name: newBrand.name,
                slug: newBrand.slug,
                image_url: imageUrl
            };
            logger_1.logger.info("add Brand To database", { image: image_input });
            const repoRespons = yield product_repository_1.productRepository.AddBrandTypeToDatabase(image_input);
            if (!repoRespons.isSucceed) {
                logger_1.logger.error("brand Cann't Add In database", { message: repoRespons.message });
                servHandler.body = null;
                servHandler.isSucceed = false;
                servHandler.message = "There is an error, try again.";
                return servHandler;
            }
            logger_1.logger.info("brand add to database succssfuly");
            const brandType = {
                brandId: (_a = repoRespons.body) === null || _a === void 0 ? void 0 : _a.brandtype_id,
                name: (_b = repoRespons.body) === null || _b === void 0 ? void 0 : _b.name,
                slug: (_c = repoRespons.body) === null || _c === void 0 ? void 0 : _c.slug,
                image: (_d = repoRespons.body) === null || _d === void 0 ? void 0 : _d.image_url
            };
            servHandler.body = brandType;
            servHandler.isSucceed = true;
            servHandler.message = repoRespons.message;
            return servHandler;
        });
        this.UpdateBrandType = (id, updateBrand) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            let servHandler = new ServicesHandler_1.ServicesHandler();
            logger_1.logger.info("Try Update Brand type in product services");
            logger_1.logger.info("get Brand By Id", { BrandId: id });
            const brand = yield product_repository_1.productRepository.GetBrandById(id);
            if (brand === null) {
                logger_1.logger.error("brand Cann't Add In database", { message: "Brand Not Found" });
                servHandler.body = null;
                servHandler.isSucceed = false;
                servHandler.message = "Brand Not Found";
                return servHandler;
            }
            if (updateBrand.image !== null) {
                const reuslt = yield (0, supperbase_connection_1.DeleteImageInSupabase)(brand.image_url, process.env.BRAND_BUCKET);
                if (reuslt.error) {
                    logger_1.logger.error("You Can't Delete This Image", { error: reuslt.error });
                    servHandler = {
                        body: null,
                        isSucceed: false,
                        message: "Failed to Update image",
                        refreshToken: null
                    };
                    return servHandler;
                }
            }
            logger_1.logger.info("Add New Brand Info");
            const image = updateBrand.image;
            const fileName = `${Date.now()}_${image.originalname}`;
            const bucket = process.env.BRAND_BUCKET;
            updateBrand.slug = (0, slugify_1.default)(updateBrand.name, { lower: true });
            logger_1.logger.info("Add image To supabase and Return imageUrl To Add It in database");
            const { reuslt, imageUrl } = yield (0, supperbase_connection_1.SaveImageInSupabase)(image, fileName, bucket);
            if (reuslt.error) {
                logger_1.logger.error("You Can't Add this image", { error: reuslt.error });
                servHandler = {
                    body: null,
                    isSucceed: false,
                    message: "Failed to upload image",
                    refreshToken: null
                };
                return servHandler;
            }
            logger_1.logger.info("image add in supabase succssfuly", { data: reuslt.data, imageUrl: imageUrl });
            const image_input = {
                brandtype_id: brand.brandtype_id,
                name: (updateBrand === null) ? brand.name : updateBrand.name,
                slug: updateBrand.slug,
                image_url: imageUrl
            };
            logger_1.logger.info("add Brand To database", { image: image_input });
            const repoRespons = yield product_repository_1.productRepository.UpdateBrandTypeToDatabase(image_input);
            if (!repoRespons.isSucceed) {
                logger_1.logger.error("brand Cann't Update In database", { message: repoRespons.message });
                servHandler.body = null;
                servHandler.isSucceed = false;
                servHandler.message = "There is an error, try again.";
                return servHandler;
            }
            logger_1.logger.info("brand Update succssfuly");
            const brandType = {
                brandId: (_a = repoRespons.body) === null || _a === void 0 ? void 0 : _a.brandtype_id,
                name: (_b = repoRespons.body) === null || _b === void 0 ? void 0 : _b.name,
                slug: (_c = repoRespons.body) === null || _c === void 0 ? void 0 : _c.slug,
                image: (_d = repoRespons.body) === null || _d === void 0 ? void 0 : _d.image_url
            };
            servHandler.body = brandType;
            servHandler.isSucceed = true;
            servHandler.message = repoRespons.message;
            return servHandler;
        });
        this.DeleteBrandType = (id) => __awaiter(this, void 0, void 0, function* () {
            let servHandler = new ServicesHandler_1.ServicesHandler();
            logger_1.logger.info("Try Delete Brand type in product services");
            logger_1.logger.info("get Brand By Id", { BrandId: id });
            const brand = yield product_repository_1.productRepository.GetBrandById(id);
            if (brand === null) {
                logger_1.logger.error("brand Cann't Add In database", { message: "Brand Not Found" });
                servHandler.body = null;
                servHandler.isSucceed = false;
                servHandler.message = "Brand Not Found";
                return servHandler;
            }
            const reuslt = yield (0, supperbase_connection_1.DeleteImageInSupabase)(brand.image_url, process.env.BRAND_BUCKET);
            if (reuslt.error) {
                logger_1.logger.error("You Can't Delete This Image", { error: reuslt.error });
                servHandler = {
                    body: null,
                    isSucceed: false,
                    message: "Failed to Delete image",
                    refreshToken: null
                };
                return servHandler;
            }
            logger_1.logger.info("delete image From database");
            const isDeleted = yield product_repository_1.productRepository.DeleteBrandTypeFromDatabase(id);
            if (!isDeleted) {
                logger_1.logger.error("You Can't Delete This Image", { error: reuslt.error });
                servHandler = {
                    body: null,
                    isSucceed: false,
                    message: "Failed to Delete image",
                    refreshToken: null
                };
                return servHandler;
            }
            servHandler.body = null;
            servHandler.isSucceed = true;
            servHandler.message = "Brand Delete Succssfuly";
            return servHandler;
        });
        this.GetAllBrandType = () => __awaiter(this, void 0, void 0, function* () {
            let servHandler = new ServicesHandler_1.ServicesHandler();
            logger_1.logger.info("Try Get All Brand type in product services");
            logger_1.logger.info("get All brand Types");
            const brands = yield product_repository_1.productRepository.GetBrandTypes();
            if (brands === null) {
                logger_1.logger.error("brand Cann't Add In database", { message: "Brand Not Found" });
                servHandler.body = null;
                servHandler.isSucceed = false;
                servHandler.message = "Brand Not Found";
                return servHandler;
            }
            const brandTypes = brands.map(p => ({
                brandId: p.brandtype_id,
                name: p.name,
                slug: p.slug,
                image: p.image_url
            }));
            servHandler.body = brandTypes;
            servHandler.isSucceed = true;
            servHandler.message = "Brand types found Succssfuly";
            return servHandler;
        });
        this.GetBrandTypeById = (id) => __awaiter(this, void 0, void 0, function* () {
            let servHandler = new ServicesHandler_1.ServicesHandler();
            logger_1.logger.info("Try Get Brand type by Id in product services");
            logger_1.logger.info("get Brand By Id", { BrandId: id });
            const brand = yield product_repository_1.productRepository.GetBrandById(id);
            if (brand === null) {
                logger_1.logger.error("brand Cann't Add In database", { message: "Brand Not Found" });
                servHandler.body = null;
                servHandler.isSucceed = false;
                servHandler.message = "Brand Not Found";
                return servHandler;
            }
            const brandType = {
                brandId: brand.brandtype_id,
                name: brand.name,
                slug: brand.slug,
                image: brand.image_url
            };
            servHandler.body = brandType;
            servHandler.isSucceed = true;
            servHandler.message = "Brand Delete Succssfuly";
            return servHandler;
        });
    }
}
exports.productServices = new ProductServices();
