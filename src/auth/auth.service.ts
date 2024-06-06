import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SerializeService } from 'libraries/serializer/serialize';
import { UserDto } from 'src/user/dto/user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import {
  AuthResponseDto,
  LoginDto,
  RefreshTokenDto,
  RegisterByEmailDto,
  UserProfileDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService extends SerializeService<UserEntity> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super(UserEntity);
  }

  async login(body: LoginDto, request: any) {
    const user = await this.userService.findUserByEmail(request.user.email);

    return this.getAuthResponse(user);
  }

  async registerByEmail(body: RegisterByEmailDto): Promise<AuthResponseDto> {
    const userExists = await this.userService.findUserByEmail(body.email);
    if (userExists)
      throw new BadRequestException(`User ${body.email} already exists`);

    body.password = await this.getHashedPassword(body.password);

    const user = await this.userService.createUser({
      ...body,
    });

    return this.getAuthResponse(user);
  }

  async refreshJwtToken(body: RefreshTokenDto) {
    const refreshTokenData = await this.jwtService.verifyAsync(
      body.refresh_token,
    );

    if (refreshTokenData.type !== 'refresh_token')
      throw new BadRequestException('Invalid refresh token');

    const user = await this.userService.findUserById(refreshTokenData.id);
    if (!user) throw new NotFoundException('User not found');

    return this.getAuthResponse(user);
  }

  async getAuthResponse(user: UserDto): Promise<AuthResponseDto> {
    const access_token = await this.jwtService.signAsync(
      { id: user._id, type: 'access_token' },
      { expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN') },
    );
    const refresh_token = await this.jwtService.signAsync(
      { id: user._id, type: 'refresh_token' },
      { expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN') },
    );

    return {
      access_token,
      refresh_token,
      user: this.toJSON(user, UserProfileDto),
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);

    if (await bcrypt.compare(password, user.password)) {
      return { email: user.email, id: user.id };
    }
    return null;
  }

  public async getHashedPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
