import { createRouteAction } from 'solid-start'
import { ProfanityMetrics, Tweet as TweetRecord } from '~/types'

interface FileUploadProps {
  onUpload: (resp: { tweets: TweetRecord[]; metrics: ProfanityMetrics }) => void
}

export const FileUpload = (props: FileUploadProps) => {
  const [_, { Form }] = createRouteAction(async (formData: FormData) => {
    // const fileUpload = formData.get('file-upload') as File
    const resp = await (
      await fetch(`/api/v1/user/upload`, {
        body: formData,
        method: 'POST',
      })
    ).json()

    props.onUpload(resp)
  })

  return (
    <Form
      class='flex flex-col'
      action='/api/v1/user/upload'
      enctype='multipart/form-data'
      method='post'
    >
      <label for='file-upload' class='mb-4'>
        In your archive, upload data/tweets.js
      </label>
      <input type='file' name='file-upload' class='mb-10' />
      <button type='submit' class='rounded bg-blue-500 py-1 px-2 text-white hover:bg-blue-600'>
        Upload file
      </button>
    </Form>
  )
}
