import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/user/interface/user.interface';
import { Model } from 'mongoose';
import { generateSixDigitRandomNumber } from 'src/utils/utils.helper';
import { EmailService } from 'src/utils/utils.emailService';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly User: Model<IUser>,
    private readonly emailService: EmailService,
  ) {}

  async signToken(user: any) {
    const token = await jwt.sign(
      { _id: user?._id },
      'V3ryC0mpl3xJWT$ecret!W1thL0tsOfR@nd0mCharsAndNumb3rsAndSp3ci@lChar$^&*#@!',
    );
    return { user, token };
  }
  async create(createAuthDto: CreateUserDto) {
    const { email } = createAuthDto;

    const emailCheck = await this.User.findOne({ email });

    if (emailCheck) throw new BadRequestException('user already exist');

    const data = await this.User.create(createAuthDto);

    const otp = generateSixDigitRandomNumber();
    await this.User.updateOne({ _id: data?._id }, { otp });
    await this.emailService
      .confirmSignup(
        {
          email: email,
        },
        'sdsadasdasd',
        {
          otp: otp,
        },
      )
      .catch((e) => console.log(e));

    return { message: 'verification code has been sent to your email' };
  }

  async veriFySignUp(email: string, code: number) {
    const user = await this.User.findOne({ email });

    if (!user) throw new BadRequestException('No user found');

    if (code !== user.otp) throw new BadRequestException('Wrong otp code ');

    return await this.signToken(user);
  }

  async login(email: string) {
    if (!email) throw new BadRequestException('please provide email');

    const user = await this.User.findOne({ email });

    if (!user) throw new BadRequestException('No user found');

    const otp = generateSixDigitRandomNumber();
    await this.User.updateOne({ email }, { otp });
    await this.emailService
      .confirmSignup(
        {
          email: email,
        },
        'sdsadasdasd',
        {
          otp: otp,
        },
      )
      .catch((e) => console.log(e));

    return { message: 'verification code has been sent to your email' };
  }

  async verifyLogin(email: string, code: number) {
    const user = await this.User.findOne({ email });

    if (!user) throw new BadRequestException('No user found');

    if (code !== user.otp) throw new BadRequestException('Wrong otp code ');

    return await this.signToken(user);
  }

  async resendOtp(email: string) {
    const user = await this.User.findOne({ email });

    if (!user) throw new BadRequestException('No user found');

    const otp = generateSixDigitRandomNumber();
    await this.User.updateOne({ email }, { otp });
    await this.emailService
      .confirmSignup(
        {
          email: email,
        },
        'sdsadasdasd',
        {
          otp: otp,
        },
      )
      .catch((e) => console.log(e));

    return { message: 'verification code has been sent to your email' };
  }
}
