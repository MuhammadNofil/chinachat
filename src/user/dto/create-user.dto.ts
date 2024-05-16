import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'please provide email' })
  @IsEmail()
  email: string;
}
