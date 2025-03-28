import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(email: string, password: string) {

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      email,
      password: hashedPassword,
    };

    const user = await this.prisma.user.create({
      data: data,
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async biometricLogin(biometricKey: string) {
    const user = await this.prisma.user.findUnique({ where: { biometricKey } });

    if (!user) {
      throw new UnauthorizedException("Invalid biometric key");
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async setBiometricKey(userId: string, biometricKey: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { biometricKey },
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  generateToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
