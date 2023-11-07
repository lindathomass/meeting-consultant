import React, { useState, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Button from '~app/components/Button'
import PagePanel from '../components/Page'
import { BiExport } from 'react-icons/bi'
import openAI from 'openai'
import * as WavEncoder from 'wav-encoder'
import '../base.scss'
import '../summary.scss'

import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PineconeClient } from '@pinecone-database/pinecone'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch'

const OPENAI_API_KEY = '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'

const client = new PineconeClient()
let pineconeIndex: VectorOperationsApi
;(async () => {
  await client.init({
    apiKey: 'ba33f608-91fe-4b89-b726-a0f2f2a5c3d3',
    environment: 'gcp-starter',
  })
  pineconeIndex = client.Index('demo-gpt')
})()

const CHUNK_SIZE = 30 // seconds of audio per chunk
const MAX_API_SIZE = 25 * 1024 * 1024 // 25 MB (OpenAI API limit)

const openai = new openAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

async function audioBufferToWavFile(audioBuffer: AudioBuffer, i: number): Promise<File> {
  const numChannels = audioBuffer.numberOfChannels
  const length = audioBuffer.length
  const sampleRate = audioBuffer.sampleRate
  const format = {
    sampleRate: sampleRate,
    channelData: [] as Float32Array[],
  }

  for (let channel = 0; channel < numChannels; channel++) {
    format.channelData[channel] = new Float32Array(length)
    format.channelData[channel].set(audioBuffer.getChannelData(channel))
  }

  const wavBuffer = await WavEncoder.encode(format)
  return new File([new Uint8Array(wavBuffer)], `chunk_${i}.wav`, {
    type: 'audio/wav',
  })
}

// Update transcribeChunk to convert the AudioBuffer to a WAV Blob
const transcribeChunk = async (chunk: AudioBuffer, i: number): Promise<string> => {
  const file = await audioBufferToWavFile(chunk, i)

  if (file.size > MAX_API_SIZE) {
    throw new Error(`Chunk ${i} is too large for the API. Consider reducing chunk size.`)
  }

  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: 'whisper-1',
  })

  return transcription.text
}

const transcribeAudioInChunks = async (audioFile: File): Promise<string> => {
  const audioContext = new AudioContext()
  const arrayBuffer = await audioFile.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

  // Split the audio buffer into chunks
  const chunks = splitAudioBuffer(audioBuffer, CHUNK_SIZE, audioContext)

  // Transcribe each chunk using the OpenAI API in parallel
  const transcriptions = await Promise.all(chunks.map((chunk, i) => transcribeChunk(chunk, i)))

  return transcriptions.join(' ')
}

function splitAudioBuffer(audioBuffer: AudioBuffer, chunkDuration: number, audioContext: AudioContext): AudioBuffer[] {
  const numberOfChannels = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const chunkSize = Math.round(sampleRate * chunkDuration)
  const numChunks = Math.ceil(audioBuffer.length / chunkSize)

  const chunks: AudioBuffer[] = []

  for (let i = 0; i < numChunks; i++) {
    const chunkBuffer = audioContext.createBuffer(numberOfChannels, chunkSize, sampleRate)

    for (let channel = 0; channel < numberOfChannels; channel++) {
      const chunkBufferData = chunkBuffer.getChannelData(channel)
      const audioBufferData = audioBuffer.getChannelData(channel)
      chunkBufferData.set(audioBufferData.slice(i * chunkSize, (i + 1) * chunkSize))
    }

    chunks.push(chunkBuffer)
  }
  return chunks
}

function UploadMeetingPage() {
  const [uploading, setUploading] = useState(false)
  const [embedding, setEmbedding] = useState(false)
  const [clientName, setClientName] = useState('')
  const [done, setDone] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    if (!clientName.trim()) {
      toast.error('Please enter a client name before uploading.')
      return
    }
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploading(true)
      let transcription = ''
      if (localStorage.getItem('transcription')) {
        transcription = localStorage.getItem('transcription') || ''
      } else {
        transcription = await transcribeAudioInChunks(file)
        localStorage.setItem('transcription', transcription)
      }
      setUploading(false)

      setEmbedding(true)

      if (localStorage.getItem('embeddings') == 'true') {
        transcription = localStorage.getItem('embeddings') || ''
      } else {
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 500,
        })
        const docs = await textSplitter.createDocuments([transcription], [{ client: clientName }])

        toast.success('docs created')

        await PineconeStore.fromDocuments(
          docs,
          new OpenAIEmbeddings({
            openAIApiKey: OPENAI_API_KEY,
          }),
          {
            pineconeIndex,
          },
        )

        localStorage.setItem('embeddings', 'true')
      }

      setEmbedding(false)

      setDone(true)
      toast.success('Meeting uploaded and transcribed!')
    }
  }

  return (
    <PagePanel title="Upload a Meeting">
      <div className="flex flex-col gap-5 mt-3">
        <div className="flex flex-col gap-2 p-4 bg-white rounded-md shadow-lg w-1/2 mx-auto">
          <label htmlFor="clientName" className="text-lg font-semibold text-gray-700">
            Client Name:
          </label>
          <input
            type="text"
            id="clientName"
            placeholder="Enter client name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:border-indigo-500 w-full"
          />
        </div>
        <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} ref={fileInputRef} />
        <div className="flex justify-center mt-4">
          <Button text="Upload Meeting" icon={<BiExport />} onClick={handleButtonClick} />
        </div>
        {uploading && (
          <div>
            Transcribing
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
        {embedding && (
          <div>
            Creating Embeddings
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
        {done && (
          <div>
            Success! We&apos;ve uploaded your meeting, transcribed it, and created embeddings for it.
            <br />
            <br />
            Check out the meeting summary page to see the results, or chat with the bot to ask questions about it.
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </PagePanel>
  )
}

export default UploadMeetingPage
