import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true), // Mock successful password comparison
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: '$2b$10$somehashedpassword',
    biometricKey: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const createUserSpy = jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValue(mockUser);

      const result = await service.register('test@example.com', 'password123');

      expect(createUserSpy).toHaveBeenCalled();
      expect(result).toHaveProperty('token');
      expect(result.user).toEqual(mockUser);
    });

    it('should throw an error if email already exists', async () => {
      jest.spyOn(prismaService.user, 'create').mockRejectedValue(new Error());

      await expect(
        service.register('test@example.com', 'password123'),
      ).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      
      // Mock bcrypt.compare to return true for this test
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.login('test@example.com', 'password123');

      expect(result).toHaveProperty('token');
      expect(result.user).toEqual(mockUser);
    });

    it('should throw UnauthorizedException with invalid email', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.login('wrong@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false); // Mock failed password comparison

      await expect(
        service.login('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('biometricLogin', () => {
    it('should login successfully with valid biometric key', async () => {
      const userWithBiometric = { ...mockUser, biometricKey: 'valid-key' };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(userWithBiometric);

      const result = await service.biometricLogin('valid-key');

      expect(result).toHaveProperty('token');
      expect(result.user).toEqual(userWithBiometric);
    });

    it('should throw UnauthorizedException with invalid biometric key', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.biometricLogin('invalid-key'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
}); 