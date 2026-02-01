import { INestApplication } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginUserDTO } from 'src/auth/dto/login-user.dto';
import request, { Response } from 'supertest';
import { App } from 'supertest/types';

const getTypedResponse = (response: Response) =>
  response.body as { access_token: string };

export type AuthorizationHeader = {
  Authorization: string;
};

type TokenWithHeader = {
  access_token: string;
  header: AuthorizationHeader;
};

const generateResponseWithHeader = (token: string): TokenWithHeader => ({
  access_token: token,
  header: {
    Authorization: `Bearer ${token}`,
  },
});

export const authenticateHelper = (app: INestApplication<App>) => {
  const login = async (
    loginUserDto: LoginUserDTO,
  ): Promise<TokenWithHeader> => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginUserDto)
      .expect(200);

    return generateResponseWithHeader(getTypedResponse(response).access_token);
  };

  const signUp = async (
    createUserDto: CreateUserDto,
  ): Promise<TokenWithHeader> => {
    const response = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(createUserDto)
      .expect(201);

    return generateResponseWithHeader(getTypedResponse(response).access_token);
  };

  return { login, signUp };
};
