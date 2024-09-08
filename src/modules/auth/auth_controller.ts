import { BaseController } from '../../../lib/core/infra/BaseController';
import { AuthService } from './auth_service';

export class AuthController extends BaseController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    super();
    this.authService = authService;
  }

  async profile(): Promise<any> {
    return this.ok(this.res, this.req.user);
  }
}
