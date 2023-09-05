import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { AuthenticatedUserPayload } from '../../../common/interfaces/authenticated-user-payload.interface';
import { ConnectionHandlerGateway } from '../../../websocket/connection.handler.gateway';
import { Socket } from 'socket.io-client';
import { GatewayModule } from '../../../websocket/gateway.module';
import { TokenService } from '../../../token/token.service';

const verifiedToken: AuthenticatedUserPayload = {
  email: 'testEmail',
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

const socketWithoutToken: Socket = {
  id: 'testSocketId',
  handshake: {
    headers: {
      authorization: '',
    },
  },
};

describe('Connection Handler Gateway', () => {
  let connectionHandlerGateway: ConnectionHandlerGateway;
  let tokenService: TokenService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, GatewayModule],
    }).compile();
    await module.createNestApplication().init();

    connectionHandlerGateway = module.get<ConnectionHandlerGateway>(
      ConnectionHandlerGateway,
    );
    tokenService = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    connectionHandlerGateway.connectedUsers.clear();
  });

  it('should connect current user', async () => {
    const authServiceVerifyToken = jest
      .spyOn(tokenService, 'verifyAuthenticationToken')
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

  it('should not connect current user when provided token is invalid', async () => {
    const authServiceVerifyToken = jest.spyOn(
      tokenService,
      'verifyAuthenticationToken',
    );

    socket.disconnect = jest.fn();

    const connectedUsersSet = jest.spyOn(
      connectionHandlerGateway.connectedUsers,
      'set',
    );

    const result = await connectionHandlerGateway.handleConnection(socket);

    const connectedUsers = connectionHandlerGateway.connectedUsers;

    expect(authServiceVerifyToken).toBeCalledTimes(1);
    expect(authServiceVerifyToken).toBeCalledWith(
      socket.handshake.headers.authorization,
    );
    expect(result.message).toBe('Unauthorized');
    expect(connectedUsersSet).toBeCalledTimes(0);
    expect(connectedUsers.size).toBe(0);
    expect(socket.disconnect).toBeCalledTimes(1);
  });

  it('should not connect current user when token is not provided', async () => {
    const authServiceVerifyToken = jest.spyOn(
      tokenService,
      'verifyAuthenticationToken',
    );

    socketWithoutToken.disconnect = jest.fn();

    const connectedUsersSet = jest.spyOn(
      connectionHandlerGateway.connectedUsers,
      'set',
    );

    const result = await connectionHandlerGateway.handleConnection(
      socketWithoutToken,
    );

    const connectedUsers = connectionHandlerGateway.connectedUsers;

    expect(authServiceVerifyToken).toBeCalledTimes(1);
    expect(authServiceVerifyToken).toBeCalledWith(
      socketWithoutToken.handshake.headers.authorization,
    );
    expect(result.message).toBe('Unauthorized');
    expect(connectedUsersSet).toBeCalledTimes(0);
    expect(connectedUsers.size).toBe(0);
    expect(socketWithoutToken.disconnect).toBeCalledTimes(1);
  });

  it('should disconect current user', async () => {
    const authServiceVerifyToken = jest
      .spyOn(tokenService, 'verifyAuthenticationToken')
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

  it('should not disconnect current user when provided token is invalid', async () => {
    const authServiceVerifyToken = jest.spyOn(
      tokenService,
      'verifyAuthenticationToken',
    );

    socket.disconnect = jest.fn();

    const connectedUsersDelete = jest.spyOn(
      connectionHandlerGateway.connectedUsers,
      'delete',
    );

    connectionHandlerGateway.connectedUsers.set(verifiedToken.sub, socket.id);

    const result = await connectionHandlerGateway.handleDisconnect(socket);

    const connectedUsers = connectionHandlerGateway.connectedUsers;

    expect(authServiceVerifyToken).toBeCalledTimes(1);
    expect(authServiceVerifyToken).toBeCalledWith(
      socket.handshake.headers.authorization,
    );
    expect(result.message).toBe('Unauthorized');
    expect(connectedUsersDelete).toBeCalledTimes(0);
    expect(connectedUsers.size).toBe(1);
    expect(socket.disconnect).toBeCalledTimes(1);
  });

  it('should not disconnect current user when token is not provided', async () => {
    const authServiceVerifyToken = jest.spyOn(
      tokenService,
      'verifyAuthenticationToken',
    );

    socketWithoutToken.disconnect = jest.fn();

    const connectedUsersDelete = jest.spyOn(
      connectionHandlerGateway.connectedUsers,
      'delete',
    );

    connectionHandlerGateway.connectedUsers.set(verifiedToken.sub, socket.id);

    const result = await connectionHandlerGateway.handleDisconnect(
      socketWithoutToken,
    );

    const connectedUsers = connectionHandlerGateway.connectedUsers;

    expect(authServiceVerifyToken).toBeCalledTimes(1);
    expect(authServiceVerifyToken).toBeCalledWith(
      socketWithoutToken.handshake.headers.authorization,
    );
    expect(result.message).toBe('Unauthorized');
    expect(connectedUsersDelete).toBeCalledTimes(0);
    expect(connectedUsers.size).toBe(1);
    expect(socketWithoutToken.disconnect).toBeCalledTimes(1);
  });
});
