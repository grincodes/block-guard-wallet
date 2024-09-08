import { AuthController } from './auth_controller';
import { AuthService } from './auth_service';

const authService = new AuthService();
const authController = new AuthController(authService);

export { authService, authController };
