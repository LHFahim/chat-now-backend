import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';

import { InjectModel } from 'nestjs-typegoose';
import { Server, Socket } from 'socket.io';

import { JwtService } from '@nestjs/jwt';
import { ReturnModelType } from '@typegoose/typegoose';
import { ConfigService } from 'src/config/config.service';
import { UserEntity } from '../user/entities/user.entity';

@WebSocketGateway({
  serveClient: false,
  cors: {
    origin: ['*'],

    preflightContinue: true,
    credentials: true,
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectModel(UserEntity)
    private readonly userModel: ReturnModelType<typeof UserEntity>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer()
  server: Server;

  async afterInit(server: Server) {
    console.log('Socket has been initialized');
  }

  async handleConnection(client: Socket) {
    console.log(`Socket client connected: ${client.id}`);

    const authToken = client.handshake.headers.authorization;

    if (!authToken) {
      client.disconnect();
      throw new WsException('Authentication token missing');
    }

    const token = authToken.split(' ')[1];
    const jwtSecret = this.configService.JWT_SECRET;
    console.log('🚀 ~ handleConnection ~ jwtSecret:', jwtSecret, token);

    const decodedData = await this.jwtService.verifyAsync(token, {
      secret: jwtSecret,
    });
    if (!decodedData) throw new WsException('Authentication token missing');

    console.log('🚀 ~ handleConnection ~ decodedData:', decodedData);

    client.join(decodedData.id);

    // client['user'] = payload;
  }

  handleDisconnect(client: Socket) {
    console.log(`Socket client disconnected: ${client.id}`);
  }
}
