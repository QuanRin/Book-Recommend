import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database';
import { PayloadDto } from '../dto/payload.dto';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dbContext: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const body = request.body;

    const token = body.refreshToken;

    try {
      const payload = this.jwtService.decode(token) as PayloadDto;

      if (!payload?.user) {
        throw new UnauthorizedException('Your refresh token is invalid');
      }

      const existedUser = await this.dbContext.user.findUnique({
        where: {
          id: payload.user.id,
        },
        select: {
          tokens: true,
        },
      });

      const existedToken = existedUser.tokens.find(
        (existedToken) => existedToken.deviceId === body.deviceId,
      );

      if (!existedToken) {
        throw new UnauthorizedException('You give me the wrong refresh token');
      }

      const isRightRefreshToken = await bcrypt.compare(
        token,
        existedToken.refreshToken,
      );

      if (!isRightRefreshToken) {
        throw new UnauthorizedException('You give me the wrong refresh token');
      }

      request.user = payload.user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }
}