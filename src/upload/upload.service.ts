import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
          folder: 'ryko-images',
          resource_type: 'image',
          transformation: [
            { width: 800, height: 600, crop: 'limit' }, // Resize if it is very large
            { quality: 'auto' }, // Optimization automatically
          ],
        },
      );

      return result.secure_url;
    } catch (error) {
      throw new Error(`Error uploading image to Cloudinary: ${error.message}`);
    }
  }

  async uploadImageFromBuffer(
    buffer: Buffer,
    mimetype: string,
  ): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(
        `data:${mimetype};base64,${buffer.toString('base64')}`,
        {
          folder: 'ryko-images',
          resource_type: 'image',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' },
          ],
        },
      );

      return result.secure_url;
    } catch (error) {
      throw new Error(`Error uploading image to Cloudinary: ${error.message}`);
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(`Error deleting image from Cloudinary: ${error.message}`);
    }
  }
}
