import { ENV } from "@/config/env"
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

class Storage {
   private readonly client: S3Client
   private readonly bucket: string
   private readonly endpoint: string

   constructor() {
      this.bucket = ENV.S3_BUCKET!
      this.endpoint = ENV.S3_ENDPOINT!

      this.client = new S3Client({
         endpoint: ENV.S3_ENDPOINT!,
         region: ENV.S3_REGION!,
         forcePathStyle: true,
         credentials: {
            accessKeyId: ENV.S3_ACCESS_KEY_ID!,
            secretAccessKey: ENV.S3_SECRET_ACCESS_KEY!,
         },
      })
   }

   async upload(key: string, body: Buffer | Uint8Array | string, contentType?: string) {
      return this.client.send(
         new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: body,
            ContentType: contentType,
         }),
      )
   }

   async delete(key: string) {
      return this.client.send(
         new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
         }),
      )
   }

   async get(key: string) {
      return this.client.send(
         new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
         }),
      )
   }

   async getSignedUploadUrl(key: string, contentType?: string, expiresIn = 60) {
      const command = new PutObjectCommand({
         Bucket: this.bucket,
         Key: key,
         ContentType: contentType,
      })

      return getSignedUrl(this.client, command, {
         expiresIn,
      })
   }

   getPublicUrl(key: string) {
      return `${this.endpoint}/${this.bucket}/${key}`
   }


   async getSignedDownloadUrl(key: string, expiresIn = 3600) {
      const command = new GetObjectCommand({
         Bucket: this.bucket,
         Key: key,
      })

      return getSignedUrl(this.client, command, {
         expiresIn,
      })
   }
}

export const storage = new Storage()