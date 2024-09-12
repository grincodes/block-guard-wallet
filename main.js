"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const helmet_1 = __importDefault(require("helmet"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .addBearerAuth({ type: 'http' }, 'access-token')
        .setTitle('Kitana Pay')
        .setDescription('kitana-pay-api')
        .setVersion('1.0')
        .build();
    const options = {
        operationIdFactory: (controllerKey, methodKey) => methodKey,
    };
    const document = swagger_1.SwaggerModule.createDocument(app, config, options);
    swagger_1.SwaggerModule.setup('api/v1/', app, document);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        prefix: 'api/v',
        defaultVersion: [common_1.VERSION_NEUTRAL, '1'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    // app.disable('x-powered-by');
    app.enableCors();
    app.use((0, helmet_1.default)());
    app.use(helmet_1.default.noSniff());
    app.use(helmet_1.default.hidePoweredBy());
    app.use(helmet_1.default.contentSecurityPolicy());
    app.use((0, cookie_parser_1.default)());
    app.use(passport_1.default.initialize());
    await app.listen(port);
}
bootstrap();
