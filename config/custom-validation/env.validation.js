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
exports.validate = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var Environment;
(function (Environment) {
    Environment["Development"] = "development";
    Environment["Production"] = "production";
    Environment["Staging"] = "staging";
    Environment["Test"] = "test";
    Environment["Provision"] = "provision";
})(Environment || (Environment = {}));
class EnvironmentVariables {
    NODE_ENV;
    T_DB_USER;
    T_DB_PASS;
    T_DB_HOST;
}
__decorate([
    (0, class_validator_1.IsEnum)(Environment),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "NODE_ENV", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "T_DB_USER", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "T_DB_PASS", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "T_DB_HOST", void 0);
class DevEnv {
    T_DB_DEV_DB_NAME;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DevEnv.prototype, "T_DB_DEV_DB_NAME", void 0);
class StagingEnv {
    T_DB_STG_DB_NAME;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StagingEnv.prototype, "T_DB_STG_DB_NAME", void 0);
class Web3Env {
    ETHEREUM_NETWORK;
    INFURA_PROJECT_ID;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Web3Env.prototype, "ETHEREUM_NETWORK", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Web3Env.prototype, "INFURA_PROJECT_ID", void 0);
function validate(config) {
    const validatedConfig = (0, class_transformer_1.plainToInstance)(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    const errors = (0, class_validator_1.validateSync)(validatedConfig, {
        skipMissingProperties: false,
    });
    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    if (config.NODE_ENV == 'development') {
        const devConfig = (0, class_transformer_1.plainToInstance)(DevEnv, config, {
            enableImplicitConversion: true,
        });
        const errors = (0, class_validator_1.validateSync)(devConfig, {
            skipMissingProperties: false,
        });
        if (errors.length > 0) {
            throw new Error(errors.toString());
        }
    }
    if (config.NODE_ENV == 'staging') {
        const stagingConfig = (0, class_transformer_1.plainToInstance)(StagingEnv, config, {
            enableImplicitConversion: true,
        });
        const errors = (0, class_validator_1.validateSync)(stagingConfig, {
            skipMissingProperties: false,
        });
        if (errors.length > 0) {
            throw new Error(errors.toString());
        }
    }
    // web3Env
    const web3EnvConfig = (0, class_transformer_1.plainToInstance)(Web3Env, config, {
        enableImplicitConversion: true,
    });
    const web3EnvErrors = (0, class_validator_1.validateSync)(web3EnvConfig, {
        skipMissingProperties: false,
    });
    if (web3EnvErrors.length > 0) {
        throw new Error(web3EnvErrors.toString());
    }
    return validatedConfig;
}
exports.validate = validate;
