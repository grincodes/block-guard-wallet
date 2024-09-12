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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const constants_1 = require("../../shared/constants");
const PassPhrase_1 = require("../../utils/PassPhrase");
const web3_1 = __importDefault(require("web3"));
let Web3Service = class Web3Service {
    configService;
    eventEmitter;
    web3;
    constructor(configService, eventEmitter) {
        this.configService = configService;
        this.eventEmitter = eventEmitter;
        //https://goerli.infura.io/v3/d6c01732bb894268971127d08ca8500c
        // INFURA WEBSCOKET HTTP PROVIDER
        const httpProvider = new web3_1.default.providers.HttpProvider(`https://${this.configService.get('ETHEREUM_NETWORK')}.infura.io/v3/${this.configService.get('INFURA_PROJECT_ID')}`);
        // const httpProvider = new Web3.providers.HttpProvider(
        //   'https://goerli.infura.io/v3/d6c01732bb894268971127d08ca8500c',
        // );
        this.web3 = new web3_1.default(httpProvider);
    }
    convertWeiToEth(amountInWei) {
        const amount = this.web3.utils.fromWei(amountInWei.toString(), 'ether');
        return Number(amount);
    }
    convertEthToWei(amountInEth) {
        const amount = this.web3.utils.toWei(amountInEth, 'ether');
        return Number(amount);
    }
    convertWeiToGwei(amountInWei) {
        const amountInGwei = this.web3.utils.fromWei(amountInWei.toString(), 'Gwei');
        return Number(amountInGwei);
    }
    convertGWeiToEth(amountInGwei) {
        const amountInWei = this.web3.utils.toWei(amountInGwei.toString(), 'Gwei');
        const amountInEth = this.convertWeiToEth(amountInWei);
        return Number(amountInEth);
    }
    async createNewEthWallet() {
        try {
            // Create Random Entropy
            const entropy = await this.web3.utils.randomHex(32);
            // Random Entropy as parameter
            const account = await this.web3.eth.accounts.create(entropy);
            await this.web3.eth.accounts.wallet.add(account);
            return await this.encryptAccount(account);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async createExistingEthWallet(privateKey) {
        try {
            const account = await this.web3.eth.accounts.privateKeyToAccount(privateKey);
            await this.web3.eth.accounts.wallet.add(account);
            return await this.encryptAccount(account);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async encryptAccount(account) {
        // Create passphrase
        const { phrase } = PassPhrase_1.PassPhraseGenerator.createPassPhrase();
        const encryptedPrivateKey = await account.encrypt(phrase);
        return {
            walletAddress: account.address,
            encryptedPrivateKey,
            passPhrase: phrase,
        };
    }
    async decryptAccount(encryptedPrivateKey, passPhrase) {
        try {
            const account = await this.web3.eth.accounts.decrypt(encryptedPrivateKey, passPhrase);
            return account;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getEthBalance(address) {
        try {
            const balance = await this.web3.eth.getBalance(address);
            return this.convertWeiToEth(balance);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async getEthTransactionCount(address) {
        // Gets the number of transactions sent from this address
        const nounce = await this.web3.eth.getTransactionCount(address);
        return nounce;
    }
    async estimateEthTransactionGasFee({ source_address, destination_address, value, }) {
        // Get gas units for transaction
        const units = await this.web3.eth.estimateGas({
            from: source_address,
            to: destination_address,
            value: this.convertEthToWei(value),
        });
        // Get current gas price from node
        const gasPrice = await this.web3.eth.getGasPrice();
        const gasPriceInGwei = Math.floor(this.convertWeiToGwei(gasPrice));
        // Pre london upgrade gas price calculation (gas units * gas price)
        // const totalGasFeeInGwei = units * gasPriceInGwei;
        // Post london update gas price calculation (gas units * (base gas price + tip))
        const tip = Math.floor(gasPriceInGwei / 6);
        const totalGasFeeInGwei = units * (gasPriceInGwei + tip);
        const gasFeeInEth = this.convertGWeiToEth(totalGasFeeInGwei);
        return gasFeeInEth.toFixed(6);
    }
    async isTransactionValid({ sender_address, value }) {
        // Check if sender eth balance is sufficient
        const balance = await this.getEthBalance(sender_address);
        if (balance < value) {
            throw new common_1.BadRequestException('ETH balance not sufficient for transaction.');
        }
        return true;
    }
    async isValidPrivateKey(privateKey) {
        // // // Check if the private key is a valid hex string
        // if (!this.web3.utils.isHexStrict(privateKey)) {
        //   throw new BadRequestException('Invalid private key');
        // }
        // Convert the private key to an Ethereum account object
        const account = await this.web3.eth.accounts.privateKeyToAccount(privateKey);
        // Check if the resulting account object is valid
        if (!account || !account.address) {
            throw new common_1.BadRequestException('Invalid private key');
        }
        return true;
    }
    async sendEthTransactionWithPkeyEncryption({ sender_address, encryptedPrivateKey, passPhrase, destination_address, value, }) {
        // Check if sender eth balance is sufficient
        const balance = await this.getEthBalance(sender_address);
        if (balance < value) {
            throw new Error('ETH balance not sufficient for transaction.');
        }
        // Get transaction count (nouce)
        /**
         * The nouce specification is used to keep track of number of transactions
         * sent from an address. Needed for security purposes and to prevent Replay attacks.
         * getTransactionCount is used to get the number of transactions from an address.
         */
        const nounce = await this.getEthTransactionCount(sender_address);
        // Construct the transaction object
        const transaction = {
            from: sender_address,
            to: destination_address,
            value: this.convertEthToWei(value),
            gas: 30000,
            nounce,
        };
        // decrypt account
        const account = await this.decryptAccount(encryptedPrivateKey, passPhrase);
        // Sign transaction with sender's private key
        const signedTx = await this.web3.eth.accounts.signTransaction(transaction, account.privateKey);
        // Send signed transaction
        this.web3.eth
            .sendSignedTransaction(signedTx.rawTransaction)
            .on('receipt', function (receipt) {
            this.eventEmitter.emit(constants_1.Events.TransactionCompleted, receipt);
        })
            .on('error', function (error) {
            console.log('error', error);
            this.eventEmitter.emit(constants_1.Events.TransactionFailed, error);
        });
        return 'Transaction in progress';
    }
    async sendEthTransaction({ sender_address, destination_address, privateKey, value, }) {
        // Get transaction count (nouce)
        /**
         * The nouce specification is used to keep track of number of transactions
         * sent from an address. Needed for security purposes and to prevent Replay attacks.
         * getTransactionCount is used to get the number of transactions from an address.
         */
        const nounce = await this.getEthTransactionCount(sender_address);
        // Construct the transaction object
        const transaction = {
            from: sender_address,
            to: destination_address,
            value: this.convertEthToWei(value),
            gas: 30000,
            nounce,
        };
        // Sign transaction with sender's private key
        const signedTx = await this.web3.eth.accounts.signTransaction(transaction, privateKey);
        // Send signed transaction
        this.web3.eth
            .sendSignedTransaction(signedTx.rawTransaction)
            .on('receipt', (receipt) => {
            this.eventEmitter.emit(constants_1.Events.TransactionCompleted, receipt);
        })
            .on('error', function (error) {
            console.log('error', error);
            this.eventEmitter.emit(constants_1.Events.TransactionFailed, error);
        });
        return 'Transaction in progress';
    }
};
Web3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        event_emitter_1.EventEmitter2])
], Web3Service);
exports.Web3Service = Web3Service;
