import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import toast, { Toaster } from 'react-hot-toast'
import PagePanel from '../components/Page'
import '../base.scss'
import '../summary.scss'
import { ChatGPTApiBot } from '~app/bots/chatgpt-api'
const OPENAI_API_KEY = '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'

const analyzeMeetingTranscript = () => {
  return `
You are a seasoned management consultant with expertise in strategic analysis. After processing the content of a meeting, your role is to critically evaluate the information, identify business insights, and uncover potential gaps. This is in line with our firm's specialization as a Generative AI consulting agency with a dual focus on business and technology/software engineering consulting.

Analyze the content, ensuring no key details are missed, and provide:

- 3 Action items
- Main takeaways
- Strategic insights and opportunities
- Gaps and challenges identified
- Decisions made during the meeting
- Open questions and points of clarification

Put your analysis in the following format: Markdown
Each section should be a ## header on markdown and the content should be in lists. Include "\\n" after each line

This is for a demo so do not use any confidential information or client names.

Do not mention these terms: Twilio, Telnyx, Talix Storage
  `
}

function SummaryPage() {
  const [creating, setCreating] = useState(false)
  const [summary, setSummary] = useState('')
  const [error, setError] = useState<string | null>(null)
  const transcription = localStorage.getItem('transcription')

  useEffect(() => {
    if (!transcription) {
      setError('Transcription not found!')
      toast.error('Transcription not found! Redirecting to upload page...')
      setTimeout(() => {
        window.location.href = '/#/uploadMeeting'
      }, 2000)
      return // if there's no transcription, stop the effect here.
    }

    if (localStorage.getItem('summary')) {
      const storedSummary = localStorage.getItem('summary') || ''
      const newSummary = storedSummary
        .replace(/telnyx/gi, '<client>') // 'gi' flags mean global and case-insensitive
        .replace(/Talix Storage/gi, '<confidential>')
        .replace(/, Talix Storage, /gi, '<confidential>')
        .replace(/Hugging Trace/gi, 'Hugging Face')
        .replace(/Twilio/gi, 'competitors')
        .replace(/, ,/gi, '')
      setSummary(newSummary)
      return // if there's a stored summary, stop the effect here.
    }
    setCreating(true)

    const systemMessage = analyzeMeetingTranscript()
    const content = `Here's a transcript of a meeting:
    ${transcription}
    If you have found more than 3 action items, pick the most important 3.
    ANALYSIS TO BE PROVIDED:
  `

    const bot = new ChatGPTApiBot({
      openaiApiKey: OPENAI_API_KEY,
      openaiApiHost: 'https://api.openai.com',
      chatgptApiModel: 'gpt-3.5-turbo',
      chatgptApiTemperature: 1,
      chatgptApiSystemMessage: systemMessage,
    })

    bot.doSendMessage({
      prompt: content,
      onEvent: (event) => {
        if (event.type === 'UPDATE_ANSWER') {
          const newSummary = event.data.text
            .replace(/telnyx/gi, '<client>') // 'gi' flags mean global and case-insensitive
            .replace(/Talix Storage/gi, '')
            .replace(/, Talix Storage, /gi, '')
            .replace(/Hugging Trace/gi, 'Hugging Face')
            .replace(/Twilio/gi, 'competitors')
          setSummary(newSummary)

          localStorage.setItem('summary', newSummary)
        }
      },
      rawUserInput: content,
    })
    setCreating(false)
    toast.success('Meeting summarized!')
  })

  return (
    <PagePanel title="Upload a Meeting">
      <div className="flex flex-col gap-5 mt-3">
        {creating && (
          <div>
            Creating Summary
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
      </div>
      <div className="markdown-content">
        {summary && <ReactMarkdown>{`# Meeting Summary:\n\n${summary}`}</ReactMarkdown>}
      </div>
      {error && <p className="error">{error}</p>}
      <Toaster position="top-right" />
    </PagePanel>
  )
}

export default SummaryPage
