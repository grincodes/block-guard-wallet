"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSACTION_QUEUE = exports.ENCRYPTED_TRANSACTION_JOB = exports.TRANSACTION_JOB = exports.Events = exports.PostgresErrorCode = exports.WEB3_MODULE_TOKEN = void 0;
exports.WEB3_MODULE_TOKEN = 'web3.token';
var PostgresErrorCode;
(function (PostgresErrorCode) {
    PostgresErrorCode["UniqueViolation"] = "23505";
})(PostgresErrorCode = exports.PostgresErrorCode || (exports.PostgresErrorCode = {}));
var Events;
(function (Events) {
    Events["TransactionCompleted"] = "transaction-completed";
    Events["TransactionFailed"] = "transaction-failed";
})(Events = exports.Events || (exports.Events = {}));
exports.TRANSACTION_JOB = 'transaction-job';
exports.ENCRYPTED_TRANSACTION_JOB = 'encrypted-transaction-job';
exports.TRANSACTION_QUEUE = 'transaction-queue';
