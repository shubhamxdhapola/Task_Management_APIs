import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {

    @ApiProperty({ example: 'alexbhatia@gmail.com' })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'alex@1234' })
    @IsNotEmpty()
    password: string;
}
