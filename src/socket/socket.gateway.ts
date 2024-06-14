import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from 'src/config/config.service';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';
import { SocketService } from './socket.service';

@WebSocketGateway({
  // serveClient: false,
  cors: {
    origin: ['*'],

    // preflightContinue: true,
    // credentials: true,
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly socketService: SocketService,
    private readonly messagesService: MessageService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  async handleConnection(client: Socket) {
    // console.log(`Socket Client connected: ${client.id}`);

    const authToken = client.handshake.headers.authorization;

    if (!authToken) {
      client.disconnect();
      throw new WsException('Authentication token missing');
    }

    const token = authToken.split(' ')[1];

    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.JWT_SECRET,
      });
      console.log('🚀 ~ handleConnection ~ payload:', payload);

      // client['user'] = payload;
    } catch (error) {
      console.log(`Client connection error: ${client.id}`);
      // client.disconnect();
    }

    console.log('🚀 ~ handleConnection ~ token:', token);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: CreateMessageDto & {
      message: string;
      conversationId: string;
      sentBy: string;
    },
  ) {
    console.log('payload', payload);
    // Store the message in the database
    // const newMessage = await this.messagesService.addMessage(
    //   payload.sentBy,
    //   payload.conversationId,
    //   { message: payload.message, type: payload.type },
    // );
    // Broadcast the message to the conversation participants
    // this.server.to(payload.conversationId).emit('receiveMessage', newMessage);
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(client: Socket, conversationId: string) {
    client.join(conversationId);
    console.log(`Client ${client.id} joined conversation ${conversationId}`);
  }
}
