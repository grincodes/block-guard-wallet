"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletsController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const jwt_cookie_service_1 = require("../jwt-cookie-access-token/jwt-cookie.service");
const register_dto_1 = require("./dto/register.dto");
const wallets_service_1 = require("./wallets.service");
let WalletsController = class WalletsController {
    walletService;
    jwtCookieService;
    configService;
    constructor(walletService, jwtCookieService, configService) {
        this.walletService = walletService;
        this.jwtCookieService = jwtCookieService;
        this.configService = configService;
    }
    async setupWallet(req, walletDto) {
        const wallet = await this.walletService.setupExisitingWallet(walletDto);
        console.log(wallet);
        //Auto Login
        const accessTokenCookie = this.jwtCookieService.getCookieWithJwtAccessToken(wallet.walletAddress);
        const { cookie: refreshTokenCookie, token: refreshToken } = this.jwtCookieService.getCookieWithJwtRefreshToken(wallet.walletAddress);
        await this.walletService.setCurrentRefreshToken(refreshToken, wallet.walletAddress);
        return {
            msg: 'copy and save passphrase in a secure place',
            wallet,
        };
    }
    async createNewWallet(req) {
        const wallet = await this.walletService.createNewWallet();
        console.log(wallet);
        //Auto Login
        req.user = wallet;
        const accessTokenCookie = this.jwtCookieService.getCookieWithJwtAccessToken(wallet.walletAddress);
        const { cookie: refreshTokenCookie, token: refreshToken } = this.jwtCookieService.getCookieWithJwtRefreshToken(wallet.walletAddress);
        await this.walletService.setCurrentRefreshToken(refreshToken, wallet.walletAddress);
        return {
            msg: 'copy and save passphrase in a secure place',
            wallet,
        };
    }
};
__decorate([
    (0, common_1.Post)('setup-existing-wallet'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, register_dto_1.RegisterExisitngWalletDto]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "setupWallet", null);
__decorate([
    (0, common_1.Post)('create-new-wallet'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "createNewWallet", null);
WalletsController = __decorate([
    (0, swagger_1.ApiTags)('Wallets'),
    (0, common_1.Controller)('wallets'),
    __metadata("design:paramtypes", [wallets_service_1.WalletService,
        jwt_cookie_service_1.JwtCookieService,
        config_1.ConfigService])
], WalletsController);
exports.WalletsController = WalletsController;
