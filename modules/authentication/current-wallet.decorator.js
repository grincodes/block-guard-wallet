"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentWallet = exports.getCurrentWalletByContext = void 0;
const common_1 = require("@nestjs/common");
const getCurrentWalletByContext = (context) => {
    if (context.getType() === 'http') {
        return context.switchToHttp().getRequest().user;
    }
};
exports.getCurrentWalletByContext = getCurrentWalletByContext;
exports.CurrentWallet = (0, common_1.createParamDecorator)((_data, context) => (0, exports.getCurrentWalletByContext)(context));
