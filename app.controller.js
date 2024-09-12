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
exports.AppController = void 0;
/* eslint-disable @typescript-eslint/no-inferrable-types */
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const transaction_service_1 = require("./modules/transactions/transaction.service");
let AppController = class AppController {
    appService;
    transactionService;
    constructor(appService, transactionService) {
        this.appService = appService;
        this.transactionService = transactionService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async getBalance(account) {
        return await this.appService.getBalance(account);
    }
    async getAccountsPagination(page = 1, limit = 10) {
        limit = limit > 100 ? 100 : limit;
        return await this.transactionService.paginateGetAllAccounts({
            page,
            limit,
        });
    }
    async getAccounts() {
        return await this.transactionService.getAllAcounts();
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('balance/:account'),
    __param(0, (0, common_1.Param)('account')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Get)('accounts-pagination'),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAccountsPagination", null);
__decorate([
    (0, common_1.Get)('accounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAccounts", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        transaction_service_1.TransactionService])
], AppController);
exports.AppController = AppController;
