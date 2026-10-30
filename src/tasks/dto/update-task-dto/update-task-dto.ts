import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Status } from "../../../generated/prisma/enums.js";

export class UpdateTaskDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    taskName?: string;

    @IsOptional()
    @IsEnum(Status)
    @IsNotEmpty()
    status?: Status
}
