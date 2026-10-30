import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class RegisterDto {
    @ApiProperty({ example: 'Alex Bhatia' })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    name: string;
    @ApiProperty({ example: 'alexbhatia@gmail.com' })

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email: string;

    @ApiProperty({ example: "abc@123" })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(16)
    password: string;

    @IsOptional()
    @IsString()
    imageUrl: string;

    @IsOptional()
    @IsString()
    imagePublicId: string;
}
