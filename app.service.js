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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const web3_service_1 = require("./modules/web3/web3.service");
let AppService = class AppService {
    web3Service;
    constructor(web3Service) {
        this.web3Service = web3Service;
    }
    getHello() {
        return 'Hello World!';
    }
    async getBalance(walletAddress) {
        try {
            const balance = await this.web3Service.getEthBalance(walletAddress);
            return {
                status: 'success',
                balance,
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.BadRequestException({
                message: err,
            });
        }
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [web3_service_1.Web3Service])
], AppService);
exports.AppService = AppService;
