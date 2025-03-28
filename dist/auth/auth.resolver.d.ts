import { AuthService } from './auth.service';
import { RegisterInput, LoginInput, BiometricLoginInput, SetBiometricKeyInput } from './dto/auth.input';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    sayHello(): string;
    register(input: RegisterInput): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            biometricKey: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    login(input: LoginInput): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            biometricKey: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    biometricLogin(input: BiometricLoginInput): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            biometricKey: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    setBiometricKey(input: SetBiometricKeyInput, user: any): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            biometricKey: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
}
