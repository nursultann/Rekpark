import { create } from "zustand";
import { deleteChat, getUserChats, getUserMessages, postUserMessage, readMessages, userDetails } from "../api/user";
import SocketHelper from "../helpers/socket";

export const useChatStore = create((set) => ({
    chats: [],
    selectedChat: null,
    messages: [],
    lastMessage: null,
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
        if (response) set((state) => ({ messages: response?.reverse() }))
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
    async listenMessages() {
        const user = await userDetails();
        const messages = SocketHelper.getInstance().subscribeTo(`chat.${user?.id}`)
        for await (let msg of messages) {
            let event = JSON.parse(msg);
            if (event['event'] === 'message-event') {
                const data = event['data'];
                let message = data['message'];


                const chat = message['room_id'];
                const sender = data['senderId'];

                set((state) => {
                    const chat = state.chats.find((chat) => chat.id == message['room_id']);
                    const chats = state.chats.filter((chat) => chat.id != message['room_id']);

                    console.log('chat', message['room_id'], chat.id);

                    if (chat) {
                        chat['lastMessage'] = {
                            ...message,
                            senderName: data['senderName'],
                            senderImage: data['senderImage']
                        }

                        const messages = state.messages;
                        if (state.selectedChat && state.selectedChat.id == message['room_id']) {
                            messages.push({
                                ...message,
                                senderName: data['senderName'],
                                senderImage: data['senderImage']
                            })
                        }

                        return {
                            chats: [chat, ...chats],
                            lastMessage: {
                                ...message,
                                senderName: data['senderName'],
                                senderImage: data['senderImage']
                            },
                            messages: messages
                        }
                    } else {
                        return {
                            lastMessage: {
                                ...message,
                                senderName: data['senderName'],
                                senderImage: data['senderImage']
                            }
                        }
                    }
                })
            }
        }
    }
}))