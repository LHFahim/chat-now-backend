import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    const dbUser = this.configService.get<string>('SECRET_KEY');

    return 'Hello World, ' + dbUser;
  }
}
