import { getUserConfig } from '~/services/user-config'
import * as agent from '~services/agent'
import { ChatError, ErrorCode } from '~utils/errors'
import { AsyncAbstractBot, MessageParams } from '../abstract-bot'
import { ChatGPTApiBot } from '../chatgpt-api'

export class ChatGPTBot extends AsyncAbstractBot {
  async initializeBot(ApiKey: string) {
    let openAiApiKey = ''
    const { ...config } = await getUserConfig()
    if (ApiKey) {
      openAiApiKey = ApiKey
    } else {
      openAiApiKey = config.openaiApiKey
      if (!config.openaiApiKey) {
        throw new ChatError('OpenAI API key not set', ErrorCode.API_KEY_NOT_SET)
      }
    }
    return new ChatGPTApiBot({
      openaiApiKey: openAiApiKey,
      openaiApiHost: config.openaiApiHost,
      chatgptApiModel: config.chatgptApiModel,
      chatgptApiTemperature: config.chatgptApiTemperature,
      chatgptApiSystemMessage: config.chatgptApiSystemMessage,
    })
  }

  async sendMessage(params: MessageParams) {
    const { chatgptWebAccess } = await getUserConfig()
    if (chatgptWebAccess) {
      return agent.execute(params.prompt, (prompt) => this.doSendMessageGenerator({ ...params, prompt }), params.signal)
    }
    return this.doSendMessageGenerator(params)
  }
}
