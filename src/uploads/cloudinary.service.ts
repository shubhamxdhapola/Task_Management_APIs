import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CloudinaryService {

    constructor(private readonly prismaService: PrismaService) { }

    async deleteImage(userId: string, publicId: string) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId }
        })
        if (!user) {
            throw new NotFoundException("User not found")
        }

        if (user?.imagePublicId !== publicId) {
            throw new UnauthorizedException("This image does not belogs to you")
        }

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'image',
            invalidate: true,
        })

        if (result.result !== 'ok' && result.result !== 'not found') {
            throw new Error(`Cloudinary deletion failed: ${result.result}`);
        }
        await this.prismaService.user.update({
            where: { id: userId }, data: {
                imageUrl: null,
                imagePublicId: null
            }
        })
        return { message: "Profile image deleted successfully" };
    }
}