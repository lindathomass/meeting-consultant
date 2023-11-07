import { ChatGPTBot } from './chatgpt'
export type BotId = 'chatgpt'

export function createBotInstance(botId: BotId) {
  const ApiKey = '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'
  switch (botId) {
    case 'chatgpt':
      return new ChatGPTBot(ApiKey)
  }
}

export type BotInstance = ReturnType<typeof createBotInstance>
