import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config'

const configService = new ConfigService();

cloudinary.config({
    cloud_name: configService.getOrThrow<string>(
        'CLOUDINARY_CLOUD_NAME',
    ),
    api_key: configService.getOrThrow<string>(
        'CLOUDINARY_API_KEY',
    ),
    api_secret: configService.getOrThrow<string>(
        'CLOUDINARY_API_SECRET',
    ),
    secure: true,
});

export const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
        folder: 'tasks/images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    }),
});