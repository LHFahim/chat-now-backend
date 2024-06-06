import { Module } from '@nestjs/common';

import { TypegooseModule } from 'nestjs-typegoose';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule,
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.MONGODB_URL,
      }),
      inject: [ConfigService],
    }),

    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
