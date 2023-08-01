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

const invalidTokenError = new Error('invalid token');

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

  afterEach(() => {
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
    expect(authServiceVerifyToken).toBeCalledWith(
      socket.handshake.headers.authorization,
    );
    expect(connectedUsersSet).toBeCalledTimes(1);
    expect(connectedUsersSet).toBeCalledWith(verifiedToken.sub, socket.id);
    expect(connectedUsers.size).toBe(1);
    expect(connectedUsers.get(verifiedToken.sub)).toBe(socket.id);
  });

  it('should throw an error when token is invalid while trying to add connected user to connectedUsers', async () => {
    const authServiceVerifyToken = jest
      .spyOn(authService, 'verifyToken')
      .mockRejectedValue(invalidTokenError);

    const connectedUsersSet = jest.spyOn(
      connectionHandlerGateway.connectedUsers,
      'set',
    );

    await connectionHandlerGateway.handleConnection(socket);

    const connectedUsers = connectionHandlerGateway.connectedUsers;

    expect(authServiceVerifyToken).toBeCalledTimes(1);
    expect(authServiceVerifyToken).toBeCalledWith(
      socket.handshake.headers.authorization,
    );
    expect(connectedUsersSet).toBeCalledTimes(0);
    expect(connectedUsers.size).toBe(0);
  });

  it('should remove disconnected user from connectedUsers', async () => {
    const authServiceVerifyToken = jest
      .spyOn(authService, 'verifyToken')
      .mockResolvedValue(verifiedToken);

    const connectedUsersDelete = jest.spyOn(
      connectionHandlerGateway.connectedUsers,
      'delete',
    );

    connectionHandlerGateway.connectedUsers.set(verifiedToken.sub, socket.id);

    await connectionHandlerGateway.handleDisconnect(socket);

    const connectedUsers = connectionHandlerGateway.connectedUsers;

    expect(authServiceVerifyToken).toBeCalledTimes(1);
    expect(authServiceVerifyToken).toBeCalledWith(
      socket.handshake.headers.authorization,
    );
    expect(connectedUsersDelete).toBeCalledTimes(1);
    expect(connectedUsersDelete).toBeCalledWith(verifiedToken.sub);
    expect(connectedUsers.size).toBe(0);
  });

  it('should throw an error when token is invalid while trying to delete disconnected user from connectedUsers', async () => {
    const authServiceVerifyToken = jest
      .spyOn(authService, 'verifyToken')
      .mockRejectedValue(invalidTokenError);

    const connectedUsersDelete = jest.spyOn(
      connectionHandlerGateway.connectedUsers,
      'delete',
    );

    connectionHandlerGateway.connectedUsers.set(verifiedToken.sub, socket.id);

    await connectionHandlerGateway.handleDisconnect(socket);

    const connectedUsers = connectionHandlerGateway.connectedUsers;

    expect(authServiceVerifyToken).toBeCalledTimes(1);
    expect(authServiceVerifyToken).toBeCalledWith(
      socket.handshake.headers.authorization,
    );
    expect(connectedUsersDelete).toBeCalledTimes(0);
    expect(connectedUsers.size).toBe(1);
  });
});
