"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_2 = __importDefault(require("./config/config"));
const env_validation_1 = require("./config/custom-validation/env.validation");
const authentication_module_1 = require("./modules/authentication/authentication.module");
const wallets_module_1 = require("./modules/wallets/wallets.module");
const web3_module_1 = require("./modules/web3/web3.module");
const bull_1 = require("@nestjs/bull");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const event_emitter_1 = require("@nestjs/event-emitter");
const transaction_module_1 = require("./modules/transactions/transaction.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [config_2.default],
                validate: env_validation_1.validate,
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    ...config.get('database'),
                    synchronize: true,
                    autoLoadEntities: true,
                }),
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            nestjs_redis_1.RedisModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: async (config) => {
                    return {
                        config: {
                            ...config.get('redis'),
                        },
                    };
                },
            }),
            bull_1.BullModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    redis: config.get('redis'),
                }),
            }),
            authentication_module_1.AuthenticationModule,
            web3_module_1.Web3Module,
            wallets_module_1.WalletsModule,
            transaction_module_1.TransactionsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
