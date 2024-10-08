import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import JwtRefreshGuard from './jwt-refresh.guard';
import { ApiBody } from '@nestjs/swagger';
import LogInDto from '../wallets/dto/logIn.dto';
import { WalletService } from '../wallets/wallets.service';
import RequestWithWallet from './requestWithWallet.interface';
import { JwtCookieService } from '../jwt-cookie-access-token/jwt-cookie.service';
import { Response } from 'express';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly jwtCookieService: JwtCookieService,
    private readonly walletService: WalletService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  @ApiBody({ type: LogInDto })
  async logIn(@Req() request: RequestWithWallet, @Res() response: Response) {
    console.log('req', request);

    const { user } = request;
    const wallet = user;

    const accessTokenCookie = this.jwtCookieService.getCookieWithJwtAccessToken(
      wallet.walletAddress,
    );
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.jwtCookieService.getCookieWithJwtRefreshToken(wallet.walletAddress);

    await this.walletService.setCurrentRefreshToken(
      refreshToken,
      wallet.walletAddress,
    );

    response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    response.send({ wallet, accessTokenCookie, refreshTokenCookie });
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithWallet, @Res() response: Response) {
    await this.walletService.removeRefreshToken(request.user.walletAddress);

    response.setHeader(
      'Set-Cookie',
      this.jwtCookieService.getCookiesForLogOut(),
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithWallet) {
    return request.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithWallet, @Res() response: Response) {
    const accessTokenCookie = this.jwtCookieService.getCookieWithJwtAccessToken(
      request.user.walletAddress,
    );

    response.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
