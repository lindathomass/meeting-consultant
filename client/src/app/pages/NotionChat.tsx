import { useChat } from '~app/hooks/use-chat'
import ConversationPanel from '../components/Chat/ConversationPanel'
import { PromptTemplate } from 'langchain/prompts'

function useFAISSChat() {
  const chat = useChat('chatgpt')

  async function sendMessageWithVectorQuery(input: string) {
    const size = 3
    const response = await fetch(`http://localhost:3000/search?query=${input}&size=${size}`)

    const jsonres = await response.json()
    const results = jsonres.results

    let resultStr = ''
    for (const result in results) {
      resultStr += results[result].pageContent + '\n'
    }

    // This is where we can promptTemplate
    const prompt = PromptTemplate.fromTemplate(
      `
      Here is some context from the Blendle Employee Handbook:

      Context: {context}

      Keep it short and simple using the context.

      If the context is irrelevant to the question, please type just say 'Sorry, I don't know ... 😔." Don't try to make up an answer.

      Question: {question}
      `,
    )

    const templated = await prompt.format({
      context: resultStr,
      question: input,
    })

    chat.sendMessage(input, templated)
  }

  return {
    ...chat,
    sendMessage: sendMessageWithVectorQuery,
  }
}

function NotionChat() {
  const chat = useFAISSChat()

  return (
    <div className="overflow-hidden h-full">
      <ConversationPanel
        botId={'chatgpt'}
        bot={chat.bot}
        messages={chat.messages}
        onUserSendMessage={chat.sendMessage}
        generating={chat.generating}
        stopGenerating={chat.stopGenerating}
        resetConversation={chat.resetConversation}
      />
    </div>
  )
}

export default NotionChat
