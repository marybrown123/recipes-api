import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { AuthService } from '../../../auth/auth.service';
import { LoggedUserPayload } from '../../../common/interfaces/logged-user-payload.interface';
import { ConnectionHandlerGateway } from '../../../websocket/connection.handler.gateway';
import { Socket } from 'socket.io-client';
import { GatewayModule } from '../../../websocket/gateway.module';

const verifiedToken: LoggedUserPayload = {
  name: 'testName',
  sub: 1,
};

const socket: Socket = {
  id: 'testSocketId',
  handshake: {
    headers: {
      authorization: 'testToken',
    },
  },
};

describe('Connection Handler Gateway', () => {
  let connectionHandlerGateway: ConnectionHandlerGateway;
  let authService: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, GatewayModule],
    }).compile();
    await module.createNestApplication().init();

    connectionHandlerGateway = module.get<ConnectionHandlerGateway>(
      ConnectionHandlerGateway,
    );
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    connectionHandlerGateway.connectedUsers.clear();
  });

  it('should add connected user to connectedUsers', async () => {
    const authServiceVerifyToken = jest
      .spyOn(authService, 'verifyToken')
      .mockResolvedValue(verifiedToken);

    const connectedUsersSet = jest.spyOn(
      connectionHandlerGateway.connectedUsers,
      'set',
    );

    await connectionHandlerGateway.handleConnection(socket);

    const connectedUsers = connectionHandlerGateway.connectedUsers;

    expect(authServiceVerifyToken).toBeCalledTimes(1);
    expect(connectedUsersSet).toBeCalledTimes(1);
    expect(connectedUsers.size).toBe(1);
    expect(connectedUsers.get(verifiedToken.sub)).toBe(socket.id);
  });

  it('should remove disconnected user from connectedUsers', async () => {
    const authServiceVerifyToken = jest
      .spyOn(authService, 'verifyToken')
      .mockResolvedValue(verifiedToken);

    const connectedUsersDelete = jest.spyOn(
      connectionHandlerGateway.connectedUsers,
      'delete',
    );

    await connectionHandlerGateway.handleDisconnect(socket);

    const connectedUsers = connectionHandlerGateway.connectedUsers;

    expect(authServiceVerifyToken).toBeCalledTimes(1);
    expect(connectedUsersDelete).toBeCalledTimes(1);
    expect(connectedUsers.size).toBe(0);
  });
});
