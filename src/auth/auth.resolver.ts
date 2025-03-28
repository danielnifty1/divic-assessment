import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterInput, LoginInput, BiometricLoginInput, SetBiometricKeyInput } from './dto/auth.input';
import { AuthResponse } from './dto/auth.type';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  
  @Mutation(() => AuthResponse)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input.email, input.password);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput) {
    return this.authService.login(input.email, input.password);
  }

  @Mutation(() => AuthResponse)
  async biometricLogin(@Args('input') input: BiometricLoginInput) {
    return this.authService.biometricLogin(input.biometricKey);
  }

  @Mutation(() => AuthResponse)
  @UseGuards(JwtAuthGuard)
  async setBiometricKey(
    @Args('input') input: SetBiometricKeyInput,
    @CurrentUser() user: any,
  ) {
    return this.authService.setBiometricKey(user.id, input.biometricKey);
  }
} 