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
exports.TransactionService = void 0;
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_1 = require("@nestjs/typeorm");
const ioredis_1 = __importDefault(require("ioredis"));
const constants_1 = require("../../shared/constants");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("./schema/transaction.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const web3_service_1 = require("../web3/web3.service");
let TransactionService = class TransactionService {
    transactionRepo;
    redisClient;
    transactionQueue;
    web3Service;
    constructor(transactionRepo, redisClient, transactionQueue, web3Service) {
        this.transactionRepo = transactionRepo;
        this.redisClient = redisClient;
        this.transactionQueue = transactionQueue;
        this.web3Service = web3Service;
    }
    async sendTransactionWithPkeyEncryption(sendTransWithPkeyEncryptionDto, wallet) {
        const passPhrase = this.redisClient.get(wallet.walletAddress);
        await this.web3Service.isTransactionValid({
            sender_address: sendTransWithPkeyEncryptionDto.from,
            value: sendTransWithPkeyEncryptionDto.value,
        });
        await this.transactionQueue.add(constants_1.ENCRYPTED_TRANSACTION_JOB, {
            from: wallet.walletAddress,
            to: sendTransWithPkeyEncryptionDto.to,
            value: sendTransWithPkeyEncryptionDto.value,
            encryptedPrivateKey: wallet.encryptedPrivateKey,
            passPhrase,
        });
        const transaction = await this.transactionRepo.create({
            ...sendTransWithPkeyEncryptionDto,
            status: 'pending',
        });
        await this.transactionRepo.save(transaction);
        return {
            message: 'Transaction in progress',
        };
    }
    async sendTransaction(sendTransactionDto) {
        try {
            await this.web3Service.isTransactionValid({
                sender_address: sendTransactionDto.from,
                value: sendTransactionDto.value,
            });
            await this.web3Service.isValidPrivateKey(sendTransactionDto.privateKey);
            //   const res = await this.web3Service.sendEthTransaction({
            //     sender_address: sendTransactionDto.from,
            //     destination_address: sendTransactionDto.to,
            //     privateKey: sendTransactionDto.privateKey,
            //     value: sendTransactionDto.value,
            //   });
            //   const transaction = await this.transactionRepo.create({
            //     ...sendTransactionDto,
            //     status: 'pending',
            //   });
            //   await this.transactionRepo.save(transaction);
            //   return res;
            await this.transactionQueue.add(constants_1.TRANSACTION_JOB, {
                from: sendTransactionDto.from,
                to: sendTransactionDto.to,
                value: sendTransactionDto.value,
                privateKey: sendTransactionDto.privateKey,
            });
            const transaction = await this.transactionRepo.create({
                ...sendTransactionDto,
                status: 'pending',
            });
            await this.transactionRepo.save(transaction);
            return {
                message: 'Transaction in progress',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException({
                message: error,
            });
        }
        // await this.transactionQueue.add(TRANSACTION_JOB, {
        //   from: sendTransactionDto.from,
        //   to: sendTransactionDto.to,
        //   value: sendTransactionDto.value,
        //   privateKey: sendTransactionDto.privateKey,
        // });
        // return {
        //   message: 'Transaction in progress',
        // };
    }
    async getAllAcounts() {
        return await this.transactionRepo.find({
            select: ['from'],
        });
    }
    async paginateGetAllAccounts(options) {
        const queryBuilder = this.transactionRepo.createQueryBuilder('transaction');
        queryBuilder.select('transaction.from');
        return (0, nestjs_typeorm_paginate_1.paginate)(queryBuilder, options);
    }
    async testJob() {
        await this.transactionQueue.add('test-job', {
            data: 'hello',
        });
        return 'done';
    }
    async updateTransactionStatus(reciept) {
        console.log('event receipt', reciept);
        console.log(reciept.from);
        await this.transactionRepo.update({ from: reciept.from }, { transactionHash: reciept.transactionHash, status: reciept.status });
    }
    async transactionFailed(reciept) {
        await this.transactionRepo.update({ from: reciept.from }, { transactionHash: reciept.transactionHash, status: reciept.status });
        // notify user
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)(constants_1.Events.TransactionCompleted),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionService.prototype, "updateTransactionStatus", null);
__decorate([
    (0, event_emitter_1.OnEvent)(constants_1.Events.TransactionFailed),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionService.prototype, "transactionFailed", null);
TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(1, (0, nestjs_redis_1.InjectRedis)()),
    __param(2, (0, bull_1.InjectQueue)(constants_1.TRANSACTION_QUEUE)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        ioredis_1.default, Object, web3_service_1.Web3Service])
], TransactionService);
exports.TransactionService = TransactionService;
