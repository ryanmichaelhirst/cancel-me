import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { APIEvent, json } from 'solid-start/api'
import { BUCKET_NAME, s3 } from '~/lib/s3'

type Action = 'mount' | 'search' | 'upload'

const getObject = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  return await s3.send(command)
}

const uploadObject = async ({ blob, key }: { blob: Blob; key: string }) => {
  const arrayBuffer = await blob.arrayBuffer()
  const unit8Array = new Uint8Array(arrayBuffer)

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Body: unit8Array,
    Key: key,
    ContentType: 'image/png',
    ContentLength: blob.size,
  })

  return await s3.send(command)
}

export async function POST({ request }: APIEvent) {
  const formData = await request.formData()
  const blob = formData.get('image') as Blob
  const action = formData.get('action')?.toString() as Action
  const screenname = formData.get('screenname')?.toString()
  const objectKey = `${screenname}/twitter_card.png`
  console.log('the blob', blob.size, blob.name)
  console.log('objectKey', objectKey, action)

  let objectImg
  try {
    const resp = await getObject(objectKey)
    objectImg = resp.Body
  } catch (err) {
    console.log('s3 file not found')
  }

  // do not over write existing image if we are just loading the dashboard or searching
  if (objectImg && action === 'mount') return json({ success: true })
  if (objectImg && action === 'search') return json({ success: true })

  // always upload image to s3 if user uploaded their twitter data archive
  try {
    await uploadObject({ blob, key: objectKey })

    return json({ success: true })
  } catch (error) {
    console.log('error occurred', error)

    return json({ error })
  }
}
