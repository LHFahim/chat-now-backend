import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';

import { InjectModel } from 'nestjs-typegoose';
import { Server, Socket } from 'socket.io';

import { JwtService } from '@nestjs/jwt';
import { ReturnModelType } from '@typegoose/typegoose';
import { ConfigService } from 'src/config/config.service';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';
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
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
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

    const decodedData = await this.jwtService.verifyAsync(token, {
      secret: jwtSecret,
    });
    if (!decodedData) throw new WsException('Authentication token missing');

    client.join(decodedData.id);

    // client['user'] = payload;
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: CreateMessageDto & {
      conversationId: string;
      sentBy: string;
    },
  ) {
    // Store the message in the database
    const newMessage = await this.messageService.addMessage(
      payload.sentBy,
      payload.conversationId,
      { message: payload.message, type: payload.type },
    );

    // Broadcast the message to the conversation participants
    this.server.to(payload.conversationId).emit('receiveMessage', newMessage);
  }

  handleDisconnect(client: Socket) {
    console.log(`Socket client disconnected: ${client.id}`);
  }
}
