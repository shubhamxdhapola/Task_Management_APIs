import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateTaskDto {
    @ApiProperty({example : "Complete NestJS and Prisma"})
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    taskName: string;
}
