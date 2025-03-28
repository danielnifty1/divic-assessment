import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(email: string, password: string): Promise<{
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
    login(email: string, password: string): Promise<{
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
    biometricLogin(biometricKey: string): Promise<{
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
    setBiometricKey(userId: string, biometricKey: string): Promise<{
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
    generateToken(user: any): string;
}
