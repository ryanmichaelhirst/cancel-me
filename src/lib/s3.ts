import { GetObjectCommand, GetObjectCommandInput, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl as awsRequestPresigner } from '@aws-sdk/s3-request-presigner'

export const BUCKET_NAME = 'cancel-me'

const accessKeyId = process.env.AWS_ACCESS_KEY_ID ?? ''
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY ?? ''

export const s3 = new S3Client({
  region: 'us-east-1',
  useAccelerateEndpoint: true,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

export const getSignedUrl = async ({
  Key,
  expiresIn,
}: GetObjectCommandInput & { expiresIn: number }) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key,
  })

  return await awsRequestPresigner(s3, command, { expiresIn })
}
