import { PutObjectCommand } from '@aws-sdk/client-s3'
import { APIEvent, json } from 'solid-start/api'
import { BUCKET_NAME, s3 } from '~/lib/s3'

export async function POST({ request }: APIEvent) {
  console.log('uploading img')
  const formData = await request.formData()
  const blob = formData.get('image') as Blob
  console.log('the blob', blob.size, blob.name)

  try {
    const arrayBuffer = await blob.arrayBuffer()
    const unit8Array = new Uint8Array(arrayBuffer)

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Body: unit8Array,
      Key: blob.name,
      ContentType: 'image/png',
      ContentLength: blob.size,
    })
    await s3.send(command)

    return json({ success: true })
  } catch (error) {
    console.log('error occurred', error)

    return json({ error })
  }
}
