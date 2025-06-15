// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import * as streamifier from 'streamifier'; // <--- Change this line

@Injectable()
export class CloudinaryService {
  constructor() {
    // Configure Cloudinary with credentials from environment variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Uploads a file (from Multer's buffer) to Cloudinary.
   * @param file The file object from Multer (Express.Multer.File).
   * @param folder The folder in Cloudinary where the file should be stored (e.g., 'portafolios/silabos').
   * @param resourceType The type of resource ('image', 'video', 'raw'). For documents, 'raw' is usually best.
   * @returns A promise that resolves with the Cloudinary response.
   */
  uploadFile(
    file: Express.Multer.File,
    folder: string,
    resourceType: 'image' | 'video' | 'raw' = 'raw',
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: resourceType,
          // You can add more options here, e.g., unique_filename: true, etc.
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        },
      );

      // Create a readable stream from the file buffer and pipe it to Cloudinary
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
