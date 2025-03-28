export declare class User {
    id: string;
    email: string;
    biometricKey?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AuthResponse {
    user: User;
    token: string;
}
