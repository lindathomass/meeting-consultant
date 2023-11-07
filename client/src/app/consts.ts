// THIS IS WHERE I COULD CHANGE THE LOGO OF THE CHATBOT
import chatgptLogo from '~/assets/chatgpt-logo.svg'
import { BotId } from './bots'

export const CHATBOTS: Record<BotId, { name: string; avatar: any }> = {
  chatgpt: {
    name: 'ChatGPT',
    avatar: chatgptLogo,
  },
}

export const CHATGPT_HOME_URL = 'https://chat.openai.com'
export const CHATGPT_API_MODELS = ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-4', 'gpt-4-32k'] as const
export const ALL_IN_ONE_PAGE_ID = 'all'

export const DEFAULT_CHATGPT_SYSTEM_MESSAGE =
  "You are a senior management consultant helping a  analyst after they had a meeting with a client. Answer them in consulting jargon. To give more context to you, they are a younger analyst who has just had a meeting with a client and are looking for guidance of how to go about it. If the context doesn't help you with your answer, then ignore it. Answer as concisely as possible. Knowledge cutoff: 2021-09-01. Current date: {current_date}"

export type Layout = 2 | 3 | 4 | 'imageInput' | 'twoVertical' | 'sixGrid' // twoVertical is deprecated
