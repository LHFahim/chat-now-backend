import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from 'src/config/config.service';
import { MessageModule } from 'src/message/message.module';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [MessageModule],
  providers: [SocketGateway, SocketService, JwtService, ConfigService],
})
export class SocketModule {}
