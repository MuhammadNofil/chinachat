import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body('email') email: string) {
    return this.authService.login(email);
  }
  @Post('verify-signup')
  veriFySignUp(@Body('email') email: string, @Body('code') code: number) {
    if (!email || !code)
      throw new BadRequestException('please provide code or email');
    return this.authService.veriFySignUp(email, code);
  }
  @Post('verifyLogin')
  verifyLogin(@Body('email') email: string, @Body('code') code: number) {
    if (!email || !code)
      throw new BadRequestException('please provide code or email');
    return this.authService.verifyLogin(email, code);
  }
  @Post('resend-otp')
  resendOtp(@Body('email') email: string) {
    if (!email) throw new BadRequestException('please provide email');
    return this.authService.resendOtp(email);
  }
}
