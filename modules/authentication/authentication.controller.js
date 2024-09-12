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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
const common_1 = require("@nestjs/common");
const authentication_service_1 = require("./authentication.service");
const localAuthentication_guard_1 = require("./localAuthentication.guard");
const jwt_authentication_guard_1 = __importDefault(require("./jwt-authentication.guard"));
const jwt_refresh_guard_1 = __importDefault(require("./jwt-refresh.guard"));
const swagger_1 = require("@nestjs/swagger");
const logIn_dto_1 = __importDefault(require("../wallets/dto/logIn.dto"));
const wallets_service_1 = require("../wallets/wallets.service");
const jwt_cookie_service_1 = require("../jwt-cookie-access-token/jwt-cookie.service");
let AuthenticationController = class AuthenticationController {
    authenticationService;
    jwtCookieService;
    walletService;
    constructor(authenticationService, jwtCookieService, walletService) {
        this.authenticationService = authenticationService;
        this.jwtCookieService = jwtCookieService;
        this.walletService = walletService;
    }
    async logIn(request) {
        console.log('req', request);
        const { user } = request;
        const wallet = user;
        const accessTokenCookie = this.jwtCookieService.getCookieWithJwtAccessToken(wallet.walletAddress);
        const { cookie: refreshTokenCookie, token: refreshToken } = this.jwtCookieService.getCookieWithJwtRefreshToken(wallet.walletAddress);
        await this.walletService.setCurrentRefreshToken(refreshToken, wallet.walletAddress);
        request.res.setHeader('Set-Cookie', [
            accessTokenCookie,
            refreshTokenCookie,
        ]);
        return wallet;
    }
    async logOut(request) {
        await this.walletService.removeRefreshToken(request.user.walletAddress);
        request.res.setHeader('Set-Cookie', this.jwtCookieService.getCookiesForLogOut());
    }
    authenticate(request) {
        return request.user;
    }
    refresh(request) {
        const accessTokenCookie = this.jwtCookieService.getCookieWithJwtAccessToken(request.user.walletAddress);
        request.res.setHeader('Set-Cookie', accessTokenCookie);
        return request.user;
    }
};
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(localAuthentication_guard_1.LocalAuthenticationGuard),
    (0, common_1.Post)('log-in'),
    (0, swagger_1.ApiBody)({ type: logIn_dto_1.default }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "logIn", null);
__decorate([
    (0, common_1.UseGuards)(jwt_authentication_guard_1.default),
    (0, common_1.Post)('log-out'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "logOut", null);
__decorate([
    (0, common_1.UseGuards)(jwt_authentication_guard_1.default),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthenticationController.prototype, "authenticate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_refresh_guard_1.default),
    (0, common_1.Get)('refresh'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthenticationController.prototype, "refresh", null);
AuthenticationController = __decorate([
    (0, common_1.Controller)('authentication'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService,
        jwt_cookie_service_1.JwtCookieService,
        wallets_service_1.WalletService])
], AuthenticationController);
exports.AuthenticationController = AuthenticationController;
