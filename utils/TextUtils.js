"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextUtils = void 0;
const crypto_1 = __importDefault(require("crypto"));
class TextUtils {
    static createRandomNumericString(numberDigits) {
        const chars = '0123456789';
        let value = '';
        for (let i = numberDigits; i > 0; --i) {
            value += chars[Math.round(Math.random() * (chars.length - 1))];
        }
        return value;
    }
    static generateRandomString(num_string) {
        const hex = crypto_1.default.randomBytes(num_string).toString('hex');
        return hex;
    }
}
exports.TextUtils = TextUtils;
