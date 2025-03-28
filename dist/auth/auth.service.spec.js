"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
jest.mock('bcrypt', () => ({
    compare: jest.fn().mockResolvedValue(true),
    hash: jest.fn().mockResolvedValue('hashed_password'),
}));
describe('AuthService', () => {
    let service;
    let prismaService;
    let jwtService;
    const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: '$2b$10$somehashedpassword',
        biometricKey: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: {
                        user: {
                            create: jest.fn(),
                            findUnique: jest.fn(),
                            update: jest.fn(),
                        },
                    },
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mock-token'),
                    },
                },
                {
                    provide: config_1.ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('mock-secret'),
                    },
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        prismaService = module.get(prisma_service_1.PrismaService);
        jwtService = module.get(jwt_1.JwtService);
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
            await expect(service.register('test@example.com', 'password123')).rejects.toThrow();
        });
    });
    describe('login', () => {
        it('should login successfully with correct credentials', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValueOnce(true);
            const result = await service.login('test@example.com', 'password123');
            expect(result).toHaveProperty('token');
            expect(result.user).toEqual(mockUser);
        });
        it('should throw UnauthorizedException with invalid email', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
            await expect(service.login('wrong@example.com', 'password123')).rejects.toThrow(common_1.UnauthorizedException);
        });
        it('should throw UnauthorizedException with invalid password', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValueOnce(false);
            await expect(service.login('test@example.com', 'wrongpassword')).rejects.toThrow(common_1.UnauthorizedException);
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
            await expect(service.biometricLogin('invalid-key')).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map