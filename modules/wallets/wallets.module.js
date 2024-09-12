"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_cookie_module_1 = require("../jwt-cookie-access-token/jwt-cookie.module");
const web3_module_1 = require("../web3/web3.module");
const wallet_entity_1 = require("./schema/wallet.entity");
const wallet_controller_1 = require("./wallet.controller");
const wallets_service_1 = require("./wallets.service");
let WalletsModule = class WalletsModule {
};
WalletsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([wallet_entity_1.Wallet]), jwt_cookie_module_1.JwtCookieModule, web3_module_1.Web3Module],
        controllers: [wallet_controller_1.WalletsController],
        providers: [wallets_service_1.WalletService],
        exports: [wallets_service_1.WalletService],
    })
], WalletsModule);
exports.WalletsModule = WalletsModule;
