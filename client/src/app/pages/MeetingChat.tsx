import { useChat } from '~app/hooks/use-chat'
import ConversationPanel from '../components/Chat/ConversationPanel'
import { PineconeClient } from '@pinecone-database/pinecone'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { PromptTemplate } from 'langchain/prompts'

const OPENAI_API_KEY = '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'

const client = new PineconeClient()
let vectorStore: PineconeStore
;(async () => {
  await client.init({
    apiKey: 'ba33f608-91fe-4b89-b726-a0f2f2a5c3d3',
    environment: 'gcp-starter',
  })
  const pineconeIndex = client.Index('demo-gpt')

  vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({
      openAIApiKey: OPENAI_API_KEY,
    }),
    { pineconeIndex },
  )
})()

function usePinconeVectorStore(vectorStore: PineconeStore) {
  const chat = useChat('chatgpt')

  async function sendMessageWithVectorQuery(input: string) {
    /* Search the vector DB independently with meta filters */
    const results = await vectorStore.similaritySearch('pinecone', 2, {
      client: '<client>',
    })

    // This is where we can promptTemplate
    const prompt = PromptTemplate.fromTemplate(
      `
      I know the client's name is hidden for right now, but just use it as if it was an actual name.

      Replace any mention of the client's name with "<client>".

      Company Name: {company_name}

      Context From The Meeting: {context}

      {question}
      `,
    )

    const templated = await prompt.format({
      company_name: '<client>',
      context: results[0].pageContent,
      question: input,
    })

    chat.sendMessage(input, templated)
  }

  return {
    ...chat,
    sendMessage: sendMessageWithVectorQuery,
  }
}

function MeetingChat() {
  const chat = usePinconeVectorStore(vectorStore)

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

export default MeetingChat
