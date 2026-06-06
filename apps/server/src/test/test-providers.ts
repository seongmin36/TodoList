import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

export function createMockRepository() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    softDelete: jest.fn(),
    softRemove: jest.fn(),
    restore: jest.fn(),
  };
}

export function mockRepositoryProvider(entity: EntityClassOrSchema): Provider {
  return {
    provide: getRepositoryToken(entity),
    useValue: createMockRepository(),
  };
}

export function mockPinoLoggerProvider(context: string): Provider {
  return {
    provide: `PinoLogger:${context}`,
    useValue: {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      trace: jest.fn(),
      fatal: jest.fn(),
    },
  };
}

export const mockJwtServiceProvider: Provider = {
  provide: JwtService,
  useValue: {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  },
};
