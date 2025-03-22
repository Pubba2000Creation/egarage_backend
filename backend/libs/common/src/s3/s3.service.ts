import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client; // AWS S3 Client
  private readonly bucketName: string; // S3 bucket name

  constructor(private readonly configService: ConfigService) {
    // Initialize the S3 client with credentials and region from environment variables
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
      },
    });

    // Retrieve the bucket name from environment variables
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME')!;

    // Validate that the bucket name is configured
    if (!this.bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME is not configured in the environment variables');
    }
  }

  /**
   * Uploads a file to the configured AWS S3 bucket.
   * @param file - The file to be uploaded (must be of type Express.Multer.File)
   * @returns A promise that resolves to the URL of the uploaded file.
   * @throws InternalServerErrorException if the upload fails.
   */
  async uploadOneFile(file: Express.Multer.File): Promise<{ document: string; message: string }> {
    if (!file || !file.buffer) {
      throw new Error('Invalid file provided for upload'); // Validation for missing or invalid file
    }

    // Define S3 upload parameters
    const params: PutObjectCommandInput = {
      Bucket: this.bucketName, // Target bucket
      Key: `${Date.now()}-${file.originalname}`, // Unique key for the file (timestamp + original name)
      Body: file.buffer, // File content
      ContentType: file.mimetype, // File MIME type
      // ACL: 'public-read', // Set the object to be publicly readable
    };

    try {
      // Upload the file to S3
      await this.s3Client.send(new PutObjectCommand(params));

      // Return the file's accessible URL
      const fileUrl = `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${params.Key}`;
      return {
        document: fileUrl,
        message: 'File uploaded successfully!',
      };
    } catch (error) {
      console.error('Error uploading file to S3:', error); // Log the error for debugging
      throw new InternalServerErrorException('Failed to upload file to S3. Please try again later.');
    }
  }

  /**
   * Uploads multiple files to the configured AWS S3 bucket.
   * @param files - An array of files to be uploaded (must be of type Express.Multer.File[])
   * @returns A promise that resolves to an array of URLs for the uploaded files.
   * @throws InternalServerErrorException if any upload fails.
   */
  async uploadFiles(files: Express.Multer.File[]): Promise<{ documents: string[]; message: string }> {
    if (!files || files.length === 0) {
      throw new Error('No files provided for upload'); // Validation for missing files
    }

    try {
      // Upload each file to S3 and collect their URLs
      const uploadResults = await Promise.all(
        
        files.map((file) => this.uploadOneFile(file)), 
        // Reuse the existing uploadOneFile method
      );

      // Extract URLs from the upload results
      const documentUrls = uploadResults.map((result) => result.document);

      return {
        documents: documentUrls, 

        // Array of uploaded file URLs
        message: 'All files uploaded successfully!',
      };
    } catch (error) {
      console.error('Error uploading files to S3:', error); 
        // Log the error for debugging
      throw new InternalServerErrorException('Failed to upload files to S3. Please try again later.');
    }
  }
}
