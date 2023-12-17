import { create } from "zustand";
import { deleteChat, getUserChats, getUserMessages, postUserMessage, readMessages, userDetails } from "../api/user";

export const useChatStore = create((set) => ({
    chats: [],
    selectedChat: null,
    setSelectedChat: (chat) => set(() => ({ selectedChat: chat })),
    async fetchChats() {
        const response = await getUserChats()
        if (response) set(() => ({ chats: response }))
    },
    async fetchMessages(chatId) {
        const response = await getUserMessages(chatId)
        if (response) set((state) => ({ selectedChat: { ...state.selectedChat, messages: response } }))
    },
    async sendMessage(userID, message) {
        const sendMessage = await postUserMessage({ 'user_id': userID, 'message': message });
        if (sendMessage) {
            const response = await getUserMessages(userID)
            if (response) set((state) => ({ selectedChat: { ...state.selectedChat, messages: response } }))
        }
        return sendMessage
    },
    async deleteChat(userID) {
        const response = await deleteChat(userID)
        if (response) set(() => ({ selectedChat: null }))
        return response
    },
}))