import { Global, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { MessageModule } from 'src/message/message.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { SocketGateway } from './socket.gateway';

@Global()
@Module({
  imports: [
    TypegooseModule.forFeature([UserEntity]),
    AuthModule,
    MessageModule,
  ],
  providers: [SocketGateway, JwtService],
  exports: [SocketGateway],
})
export class SocketModule {}
