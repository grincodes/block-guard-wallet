"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsModule = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const constants_1 = require("../../shared/constants");
const web3_module_1 = require("../web3/web3.module");
const transaction_entity_1 = require("./schema/transaction.entity");
const transaction_controller_1 = require("./transaction.controller");
const transaction_process_1 = require("./transaction.process");
const transaction_service_1 = require("./transaction.service");
let TransactionsModule = class TransactionsModule {
};
TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([transaction_entity_1.Transaction]),
            bull_1.BullModule.registerQueue({
                name: constants_1.TRANSACTION_QUEUE,
            }),
            web3_module_1.Web3Module,
        ],
        controllers: [transaction_controller_1.TransactionsController],
        providers: [transaction_service_1.TransactionService, transaction_process_1.TransactionProcessor],
        exports: [transaction_service_1.TransactionService],
    })
], TransactionsModule);
exports.TransactionsModule = TransactionsModule;
