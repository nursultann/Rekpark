import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import { notification } from 'antd';
import moment from "moment-timezone";
import { Helmet } from "react-helmet";
import { useEffectOnce } from "react-use";
import classNames from "classnames";
import { deleteChat, postUserMessage } from "../../../api/user";
import { useUserStore } from "../../../store/user_store";
import { useChatStore } from "../../../store/chat_store";
import { 
  MessageCircle, 
  Send, 
  User, 
  Trash2, 
  Search, 
  MoreVertical, 
  Clock, 
  Check, 
  AlertCircle,
  Info
} from "lucide-react";

const openNotification = (type, message, description = "") => {
  notification[type]({
    message,
    description,
    placement: "bottomRight",
  });
};

const ChatListPage = () => {
  const { user } = useUserStore();
  const { 
    chats, 
    selectedChat, 
    fetchChats, 
    setSelectedChat, 
    messages, 
    fetchMessages, 
    sendMessage,
    deleteChat 
  } = useChatStore();

  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const getPartner = (chat) => {
    return chat?.partner?.id === user?.id ? chat?.user : chat?.partner;
  };

  const partner = selectedChat ? getPartner(selectedChat) : null;

  const handleSendMessage = async (message) => {
    if (!message.trim()) {
      openNotification("warning", "Пустое сообщение", "Пожалуйста, введите текст сообщения");
      return;
    }

    setLoading(true);
    try {
      await sendMessage(partner.id, message);
      openNotification("success", "Сообщение отправлено");
    } catch (error) {
      openNotification("error", "Ошибка отправки", "Не удалось отправить сообщение");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);
      openNotification("success", "Чат удален");
      
      // If the deleted chat was selected, clear selection
      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
      }
      
      // Refresh chat list
      fetchChats();
      
    } catch (error) {
      openNotification("error", "Ошибка удаления", "Не удалось удалить чат");
    }
    setDeleteConfirmId(null);
  };

  const selectChat = (chat) => {
    setSelectedChat(chat);
    if (windowWidth < 768) {
      setShowMobileChat(true);
    }
  };

  const filteredChats = chats.filter(chat => {
    const chatPartner = getPartner(chat);
    return chatPartner?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      
      // Reset mobile view on larger screens
      if (width >= 768) {
        setShowMobileChat(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedChat && partner?.id) {
      fetchMessages(partner.id);
    }
  }, [selectedChat]);

  useEffectOnce(() => {
    moment.locale('ru');
    fetchChats();

    return () => {
      setSelectedChat(null);
    };
  });

  // Mobile back button
  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  return (
    <>
      <Helmet>
        <title>Сообщения | RekPark</title>
      </Helmet>

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Сообщения</h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="flex h-[600px] md:h-[700px]">
            {/* Chat List Panel - Hide on mobile when chat is open */}
            <div className={classNames(
              "w-full md:w-2/5 lg:w-1/3 border-r border-gray-200",
              { "hidden": windowWidth < 768 && showMobileChat }
            )}>
              {/* Search Box */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Поиск контактов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 pl-9 pr-4 py-2 text-sm focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Chat List */}
              <div className="h-[calc(100%-61px)] overflow-y-auto">
                {filteredChats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
                    <MessageCircle className="w-12 h-12 mb-3 opacity-30" />
                    {searchQuery ? (
                      <p className="text-center">Не найдено контактов по запросу "{searchQuery}"</p>
                    ) : (
                      <p className="text-center">У вас пока нет сообщений</p>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredChats.map((chat) => (
                      <ChatListItem
                        key={chat.id}
                        chat={chat}
                        isSelected={selectedChat?.id === chat.id}
                        userId={user?.id}
                        onClick={() => selectChat(chat)}
                        onDelete={() => setDeleteConfirmId(chat.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat View Panel - Show on mobile only when chat is open */}
            <div className={classNames(
              "w-full md:w-3/5 lg:w-2/3 flex flex-col",
              { "hidden": windowWidth < 768 && !showMobileChat }
            )}>
              {selectedChat ? (
                <ChatView
                  partner={partner}
                  messages={messages}
                  loading={loading}
                  onSendMessage={handleSendMessage}
                  onBack={handleBackToList}
                  isMobile={windowWidth < 768}
                />
              ) : (
                <EmptyChatState />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-3">Удалить чат</h3>
            <p className="text-gray-600 mb-6">
              Вы уверены, что хотите удалить этот чат? Это действие нельзя отменить.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => setDeleteConfirmId(null)}
              >
                Отмена
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                onClick={() => handleDeleteChat(deleteConfirmId)}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ChatListItem = ({ chat, isSelected, userId, onClick, onDelete }) => {
  const partner = chat.partner?.id === userId ? chat.user : chat.partner;
  const lastMessage = chat.lastMessage?.message || 'Нет сообщений';
  const timeSince = chat.lastMessage?.created_at 
    ? moment(chat.lastMessage.created_at).fromNow() 
    : '';

  return (
    <div
      className={classNames(
        "flex items-center px-4 py-3 cursor-pointer transition-colors",
        {
          "bg-primary bg-opacity-10": isSelected,
          "hover:bg-gray-50": !isSelected
        }
      )}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mr-3">
        {partner?.image ? (
          <img
            src={partner.image}
            alt={partner.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <User className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium truncate">
            {partner?.name || "Неизвестный пользователь"}
          </h3>
          <span className="text-xs text-gray-500 flex-shrink-0">{timeSince}</span>
        </div>
        <p className="text-xs text-gray-500 truncate">{lastMessage}</p>
      </div>

      {/* Delete Button */}
      <button
        className="ml-2 p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

const ChatView = ({ partner, messages, loading, onSendMessage, onBack, isMobile }) => {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          {isMobile && (
            <button
              className="mr-3 text-gray-500 hover:text-gray-700"
              onClick={onBack}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}
          <div className="flex items-center">
            {partner?.image ? (
              <img
                src={partner.image}
                alt={partner.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                <User className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900">
                {partner?.name || "Неизвестный пользователь"}
              </h3>
              <p className="text-xs text-gray-500">
                {partner?.online ? "В сети" : "Не в сети"}
              </p>
            </div>
          </div>
        </div>
        <div>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-12 h-12 mb-3 opacity-30" />
            <p>Начните общение с {partner?.name}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id || index}
                message={message}
                isOwnMessage={message.sender?.id !== partner?.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение..."
            className="flex-1 px-4 py-2 bg-transparent border-none focus:ring-0 resize-none max-h-24 min-h-[42px]"
            rows={1}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!messageText.trim() || loading}
            className="p-2 mr-2 text-white bg-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};

const MessageBubble = ({ message, isOwnMessage }) => {
  const time = message.created_at ? moment(message.created_at).format('HH:mm') : '';
  
  return (
    <div className={classNames(
      "flex",
      isOwnMessage ? "justify-end" : "justify-start"
    )}>
      <div className={classNames(
        "max-w-[75%] rounded-lg px-4 py-2 relative group",
        isOwnMessage 
          ? "bg-primary text-white rounded-br-none" 
          : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
      )}>
        <p className="break-words">{message.message}</p>
        <div className={classNames(
          "flex items-center mt-1",
          isOwnMessage ? "justify-end" : "justify-start"
        )}>
          <span className="text-xs opacity-70 flex items-center">
            {time}
            {isOwnMessage && (
              <Check className="w-3 h-3 ml-1" />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

const EmptyChatState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <MessageCircle className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 mb-2">Выберите чат</h3>
      <p className="text-sm text-center max-w-md">
        Выберите контакт из списка слева, чтобы начать общение
      </p>
    </div>
  );
};

export default ChatListPage;