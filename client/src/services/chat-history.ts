import { zip } from "lodash-es";
import { BotId } from "~app/bots";
import { ChatMessageModel } from "~types";

interface Conversation {
  id: string;
  createdAt: number;
}

type ConversationWithMessages = Conversation & { messages: ChatMessageModel[] };

function loadHistoryConversations(botId: BotId): Conversation[] {
  const key = `conversations:${botId}`;
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : [];
}

function deleteHistoryConversation(botId: BotId, cid: string) {
  const conversations = loadHistoryConversations(botId);
  const newConversations = conversations.filter((c) => c.id !== cid);
  localStorage.setItem(
    `conversations:${botId}`,
    JSON.stringify(newConversations)
  );
}

function loadConversationMessages(
  botId: BotId,
  cid: string
): ChatMessageModel[] {
  const key = `conversation:${botId}:${cid}:messages`;
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : [];
}

export function setConversationMessages(
  botId: BotId,
  cid: string,
  messages: ChatMessageModel[]
) {
  const conversations = loadHistoryConversations(botId);
  if (!conversations.some((c) => c.id === cid)) {
    conversations.unshift({ id: cid, createdAt: Date.now() });
    localStorage.setItem(
      `conversations:${botId}`,
      JSON.stringify(conversations)
    );
  }
  const key = `conversation:${botId}:${cid}:messages`;
  localStorage.setItem(key, JSON.stringify(messages));
}

export function loadHistoryMessages(botId: BotId): ConversationWithMessages[] {
  const conversations = loadHistoryConversations(botId);
  const messagesList = conversations.map((c) =>
    loadConversationMessages(botId, c.id)
  );
  return zip(conversations, messagesList).map(([c, messages]) => ({
    id: c!.id,
    createdAt: c!.createdAt,
    messages: messages!,
  }));
}

export function deleteHistoryMessage(
  botId: BotId,
  conversationId: string,
  messageId: string
) {
  const messages = loadConversationMessages(botId, conversationId);
  const newMessages = messages.filter((m) => m.id !== messageId);
  setConversationMessages(botId, conversationId, newMessages);
  if (!newMessages.length) {
    deleteHistoryConversation(botId, conversationId);
  }
}

export function clearHistoryMessages(botId: BotId) {
  const conversations = loadHistoryConversations(botId);
  conversations.forEach((c) => {
    localStorage.removeItem(`conversation:${botId}:${c.id}:messages`);
  });
  localStorage.removeItem(`conversations:${botId}`);
}
