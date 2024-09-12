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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_wallet_decorator_1 = require("../authentication/current-wallet.decorator");
const jwt_authentication_guard_1 = __importDefault(require("../authentication/jwt-authentication.guard"));
const wallet_entity_1 = require("../wallets/schema/wallet.entity");
const send_transaction_with_pkey_encryption_dto_1 = require("./dto/send-transaction-with-pkey-encryption.dto");
const send_transaction_dto_1 = require("./dto/send-transaction.dto");
const transaction_service_1 = require("./transaction.service");
let TransactionsController = class TransactionsController {
    transactionService;
    constructor(transactionService) {
        this.transactionService = transactionService;
    }
    async sendTransaction(sendTransactionDto) {
        return await this.transactionService.sendTransaction(sendTransactionDto);
    }
    async sendTransactionWithPkeyEncryption(wallet, sendTransWithPkeyEncryptionDto) {
        return await this.transactionService.sendTransactionWithPkeyEncryption(sendTransWithPkeyEncryptionDto, wallet);
    }
    async test() {
        return await this.transactionService.testJob();
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_transaction_dto_1.SendTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "sendTransaction", null);
__decorate([
    (0, common_1.UseGuards)(jwt_authentication_guard_1.default),
    (0, common_1.Post)('with-private-key-encryption'),
    __param(0, (0, current_wallet_decorator_1.CurrentWallet)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wallet_entity_1.Wallet,
        send_transaction_with_pkey_encryption_dto_1.SendTransactionWithPkeyEncryptionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "sendTransactionWithPkeyEncryption", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "test", null);
TransactionsController = __decorate([
    (0, swagger_1.ApiTags)('Transactions'),
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService])
], TransactionsController);
exports.TransactionsController = TransactionsController;
