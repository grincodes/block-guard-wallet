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
exports.TransactionProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const constants_1 = require("../../shared/constants");
const web3_service_1 = require("../web3/web3.service");
let TransactionProcessor = class TransactionProcessor {
    web3Service;
    constructor(web3Service) {
        this.web3Service = web3Service;
    }
    async sendTransaction(job) {
        const { from, to, value, privateKey } = job.data;
        await this.web3Service.sendEthTransaction({
            sender_address: from,
            destination_address: to,
            privateKey,
            value,
        });
    }
    async sendEncryptedTransaction(job) {
        const { from, to, value, encryptedPrivateKey, passPhrase } = job.data;
        await this.web3Service.sendEthTransactionWithPkeyEncryption({
            sender_address: from,
            encryptedPrivateKey,
            passPhrase,
            destination_address: to,
            value,
        });
    }
    async testJob(job) {
        console.log(job);
    }
    onActive(job) {
        console.log(` job ${job.id} completed ...`);
    }
};
__decorate([
    (0, bull_1.Process)(constants_1.TRANSACTION_JOB),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionProcessor.prototype, "sendTransaction", null);
__decorate([
    (0, bull_1.Process)(constants_1.ENCRYPTED_TRANSACTION_JOB),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionProcessor.prototype, "sendEncryptedTransaction", null);
__decorate([
    (0, bull_1.Process)('test-job'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionProcessor.prototype, "testJob", null);
__decorate([
    (0, bull_1.OnQueueCompleted)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TransactionProcessor.prototype, "onActive", null);
TransactionProcessor = __decorate([
    (0, bull_1.Processor)(constants_1.TRANSACTION_QUEUE),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [web3_service_1.Web3Service])
], TransactionProcessor);
exports.TransactionProcessor = TransactionProcessor;
