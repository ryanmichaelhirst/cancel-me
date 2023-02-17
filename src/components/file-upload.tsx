import pick from 'lodash.pick'
import { createRouteAction } from 'solid-start'
import { LoadingSpinner } from '~/components/loading-spinner'
import { HistoricalTweet } from '~/types'

interface FileUploadProps {
  onUpload: (tweets: HistoricalTweet[]) => void
  onClose: () => void
}

export const FileUpload = (props: FileUploadProps) => {
  const [uploading, { Form }] = createRouteAction(async (formData: FormData) => {
    // deprecated: vercel serverless functions have a 4.5MB limit
    // const resp = await (
    //   await fetch(`/api/v1/user/upload`, {
    //     body: formData,
    //     method: 'POST',
    //   })
    // ).json()

    const reader = new FileReader()
    reader.onload = async function () {
      // vercel serverless functions have a limit of 4.5MB, so we need to reduce the size of the payload
      const contents = reader.result as string
      const safeContents = contents.replace('window.YTD.tweets.part0 = ', '')
      const historicalTweets: HistoricalTweet[] = JSON.parse(safeContents)
      const tweets = historicalTweets.map((ht, idx) => {
        const { tweet } = ht
        const condensedTweet = pick(tweet, ['full_text', 'created_at', 'id', 'id_str'])

        return { tweet: condensedTweet }
      })

      props.onUpload(tweets)
    }

    const fileUpload = formData.get('file-upload') as File
    if (fileUpload.size === 0) throw new Error('File must be selected')

    reader.readAsText(fileUpload)
  })

  return (
    <Form
      class='flex flex-col'
      action='/api/v1/user/upload'
      enctype='multipart/form-data'
      method='post'
    >
      <label for='file-upload' class='mb-4 hover:cursor-pointer'>
        In your archive zip file, upload data/tweets.js
      </label>
      <input type='file' name='file-upload' class='mb-2 hover:cursor-pointer' />
      <div class='h-[24px] text-red-500'>{uploading.error && <p>Please select a file</p>}</div>
      <div class='mt-8 flex space-x-10'>
        <button
          type='submit'
          class={
            'flex-1 rounded bg-blue-500 py-1 px-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50'
          }
          disabled={uploading.pending}
        >
          Upload file
        </button>
        <button
          onClick={props.onClose}
          class='flex-1 rounded bg-slate-300 py-1 px-2 text-slate-900 hover:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-50'
          disabled={uploading.pending}
        >
          Cancel
        </button>
      </div>

      {uploading.pending && (
        <div class='mt-10 flex flex-col items-center justify-center'>
          <p>Upload your archive...</p>
          <LoadingSpinner />
        </div>
      )}
    </Form>
  )
}
