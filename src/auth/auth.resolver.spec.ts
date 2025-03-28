import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { RegisterInput, LoginInput, BiometricLoginInput, SetBiometricKeyInput } from './dto/auth.input';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedpassword',
    biometricKey: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthResponse = {
    user: mockUser,
    token: 'mock-token',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            biometricLogin: jest.fn(),
            setBiometricKey: jest.fn().mockResolvedValue(mockAuthResponse),
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerInput: RegisterInput = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(authService, 'register').mockResolvedValue(mockAuthResponse);

      const result = await resolver.register(registerInput);

      expect(authService.register).toHaveBeenCalledWith(
        registerInput.email,
        registerInput.password,
      );
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const loginInput: LoginInput = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(mockAuthResponse);

      const result = await resolver.login(loginInput);

      expect(authService.login).toHaveBeenCalledWith(
        loginInput.email,
        loginInput.password,
      );
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('biometricLogin', () => {
    it('should login with biometric key', async () => {
      const biometricInput: BiometricLoginInput = {
        biometricKey: 'valid-key',
      };

      jest.spyOn(authService, 'biometricLogin').mockResolvedValue(mockAuthResponse);

      const result = await resolver.biometricLogin(biometricInput);

      expect(authService.biometricLogin).toHaveBeenCalledWith(
        biometricInput.biometricKey,
      );
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('setBiometricKey', () => {
    it('should set biometric key for authenticated user', async () => {
      const biometricInput = {
        biometricKey: 'new-key',
      };
      const user = { id: '1' };

      const result = await resolver.setBiometricKey(biometricInput, user);

      expect(authService.setBiometricKey).toHaveBeenCalledWith(
        user.id,
        biometricInput.biometricKey,
      );
      expect(result).toEqual(mockAuthResponse);
    });
  });
}); 