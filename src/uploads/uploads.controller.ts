import { BadRequestException, Controller, Delete, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { cloudinaryStorage } from '../libs/cloudinary.storage.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service.js';
import { AuthenticateGuard, type AuthenticatedRequest } from '../auth/guards/authenticate/authenticate.guard.js';

@Controller('api/image')
export class UploadsController {

    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: cloudinaryStorage,
            limits: {
                fileSize: 5 * 1024 * 1024
            }
        })
    )
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException("Please upload a image")
        }
        return {
            message: "Image uploaded successfully",
            imageUrl: file.path,
            publicId: file.filename
        }
    }

    @UseGuards(AuthenticateGuard)
    @Delete()
    async deleteImage(
        @Req() req: AuthenticatedRequest,
        @Query('publicId') publicId: string
    ) {
        return await this.cloudinaryService.deleteImage(
            req?.user?.id, publicId
        )
    }

}
