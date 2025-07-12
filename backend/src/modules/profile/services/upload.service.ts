import { Injectable } from '@nestjs/common';
import { cloudinary } from 'src/config/cloudinary.config';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'avatars' },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          if (!result)
            return reject(new Error('Upload failed with no result.'));
          resolve(result);
        },
      );
      stream.end(file.buffer);
    });
  }
}
