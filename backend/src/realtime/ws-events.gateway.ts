import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

type WsJwtPayload = {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
};

@WebSocketGateway({
  namespace: '/ws/connection',
  cors: {
    origin: true,
    credentials: true,
  },
})

export class WsEventsGateway implements OnGatewayInit {
  @WebSocketServer()
  private server!: Server;

  private readonly logger = new Logger(WsEventsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  afterInit(server: Server) {
    server.use(async (client, next) => {
      try {
        const token = this.extractToken(client);

        if (!token) {
          return next(new Error('Unauthorized'));
        }

        client.data.user = await this.jwtService.verifyAsync<WsJwtPayload>(token);
        next();
      } catch {
        next(new Error('Unauthorized'));
      }
    });
  }

  handleConnection(client: Socket) {
    const user = this.getUser(client);

    client.join(this.userRoom(user.sub));

    this.logger.debug(`Socket connected: ${client.id}, userId: ${user.sub}`);

    // this.emitToUser(user.sub, {
    //   test: 123,
    // }, 'test');
  }

  // @SubscribeMessage('reports.subscribe')
  // subscribe(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() _body: Record<string, never>,
  // ) {
  //   return {
  //     event: 'reports.subscribed',
  //     data: {
  //       connectionId: client.id,
  //       userId: this.getUser(client).sub,
  //     },
  //   };
  // }

  emitToUser(userId: number, payload: unknown, eventName: string) {
    this.server.to(this.userRoom(userId)).emit(eventName, payload);
  }

  emitToAll(payload: unknown, eventName: string) {
    this.server.emit(eventName, payload);
  }

  private getUser(client: Socket): WsJwtPayload {
    return client.data.user as WsJwtPayload;
  }

  private extractToken(client: Socket): string | undefined {
    const authToken = client.handshake.auth?.token;

    if (typeof authToken === 'string' && authToken.length > 0) {
      return authToken;
    }

    const authorization = client.handshake.headers.authorization;
    const [type, token] = authorization?.split(' ') ?? [];

    if (type === 'Bearer') {
      return token;
    }

    return undefined;
  }

  private userRoom(userId: number): string {
    return `user:${userId}`;
  }
}
