import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Button from '~app/components/Button'
import PagePanel from '../components/Page'
import '../base.scss'
import '../summary.scss'

function UploadNotionPage() {
  const [embedding] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [clientName, setClientName] = useState('')
  const [done, setDone] = useState(false)

  const handleButtonClick = async () => {
    if (!clientName.trim()) {
      toast.error('Please enter a Notion Database to chat with.')
      return
    }
    await handleGrabNotion()
  }

  const handleGrabNotion = async () => {
    setFetching(true)
    const response = await fetch(`http://localhost:3000/loadNotionData?directoryPath=${clientName}`)
    if (response.status != 200) {
      toast.error('Error fetching Notion database.')
      setFetching(false)
      return
    }
    setFetching(false)

    setDone(true)
    toast.success('Meeting uploaded and transcribed!')
  }

  return (
    <PagePanel title="Upload Documents For Search">
      <div className="flex flex-col gap-5 mt-3">
        <div className="flex flex-col gap-2 p-4 bg-white rounded-md shadow-lg w-1/2 mx-auto">
          <label htmlFor="notionName" className="text-lg font-semibold text-gray-700">
            Notion DB:
          </label>
          <input
            type="text"
            id="notionName"
            placeholder="Notion Database Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:border-indigo-500 w-full"
          />
        </div>
        <div className="flex justify-center mt-4">
          <Button text="Fetch Documents" onClick={handleButtonClick} />
        </div>
        {fetching && (
          <div>
            Fetching from Notion and Loading into FAISS DB
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
        {embedding && (
          <div>
            Creating FAISS DB
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
        {done && (
          <div>
            Success! We&apos;ve uploaded your documents and created a FAISS DB for them. Now you can chat with your
            Notion database!
            <br />
            <br />
            Check out the Notion chat page to chat with the bot to ask questions about it.
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </PagePanel>
  )
}

export default UploadNotionPage
