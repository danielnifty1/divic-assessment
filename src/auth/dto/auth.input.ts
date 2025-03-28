import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;
}

@InputType()
export class BiometricLoginInput {
  @Field()
  @IsString()
  biometricKey: string;
}

@InputType()
export class SetBiometricKeyInput {
  @Field()
  @IsString()
  biometricKey: string;
} 