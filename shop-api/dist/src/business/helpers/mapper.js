"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToUserDto = void 0;
const ToUserDto = (user, token) => {
    var _a, _b, _c, _d, _e;
    return {
        fullName: `${user.first_name} ${user.last_name}`,
        email: user.email,
        address: {
            governorate_city: (_a = user.address) === null || _a === void 0 ? void 0 : _a.governorate_city,
            street: (_b = user.address) === null || _b === void 0 ? void 0 : _b.street,
            apartment_number: (_c = user.address) === null || _c === void 0 ? void 0 : _c.apartment_number,
            building_name_number: (_d = user.address) === null || _d === void 0 ? void 0 : _d.building_name_number,
            additional_details: (_e = user.address) === null || _e === void 0 ? void 0 : _e.additional_details
        },
        phones: user.phone.map(p => p.phone),
        token: token,
    };
};
exports.ToUserDto = ToUserDto;
