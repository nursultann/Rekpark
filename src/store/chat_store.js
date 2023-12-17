import { create } from "zustand";
import { deleteChat, getUserChats, getUserMessages, postUserMessage, readMessages, userDetails } from "../api/user";

export const useChatStore = create((set) => ({
    chats: [],
    selectedChat: null,
    messages: [],
    setSelectedChat: (chat) => set(() => ({ selectedChat: chat, messages: [] })),
    async fetchChats() {
        const response = await getUserChats()
        if (response) set(() => ({ chats: response }))
    },
    async fetchMessages(chatId, productId) {
        const response = await getUserMessages({
            'chat_user_id': chatId,
            'with': 'sender',
            ...(productId && { 'advertisement_id': productId })
        })
        if (response) set((state) => ({ messages: response }))
    },
    async sendMessage(userID, message) {
        const sendMessage = await postUserMessage({ 'user_id': userID, 'message': message });
        if (sendMessage) {
            const response = await getUserMessages(userID)
            if (response) set((state) => ({ messages: response }))
        }
        return sendMessage
    },
    async deleteChat(userID) {
        const response = await deleteChat(userID)
        if (response) set(() => ({ selectedChat: null }))
        return response
    },
}))