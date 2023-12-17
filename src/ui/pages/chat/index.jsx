import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Tabs, notification } from 'antd';
import moment from "moment-timezone";
import { Helmet } from "react-helmet";
import { useEffectOnce } from "react-use";
import classNames from "classnames";
import { deleteChat, getUserChats, getUserMessages, postUserMessage, readMessages, userDetails } from "../../../api/user";
import * as api from "../../../api";
import { ChatBubble, ChatBubbleOutlined, ChatOutlined, MessageOutlined, PersonOutline } from "@mui/icons-material";
import personOutline from '../../../dist/icons/person-outline.svg';
import { useUserStore } from "../../../store/user_store";
import { useChatStore } from "../../../store/chat_store";

const openNotificationWithIcon = (type, info) => {
    notification[type]({
        message: info,
    });
};

const ChatListPage = () => {
    const user = useUserStore().user;
    const { chats, selectedChat, fetchChats, setSelectedChat, messages, fetchMessages } = useChatStore();

    //const [selectedChat, setSelectedChat] = useState();

    const [innerWidth, setInnerWidth] = useState(window.innerWidth);

    const removeChat = async (id) => {
        console.log('id chat', id);
        const remove = await deleteChat(id);
        console.log(remove);
        if (remove != null) {
            openNotificationWithIcon('success', 'Чат успешно удалён!');
        }
    }

    useEffect(() => {
        const resizeListener = async () => {
            setInnerWidth(window.innerWidth);
        };

        window.addEventListener('resize', resizeListener);

        return () => {
            window.removeEventListener('resize', resizeListener);
        }
    }, []);

    // const fetchMessages = async (userID) => {
    //     const userMessages = await getUserMessages({
    //         'chat_user_id': userID,
    //         'with': 'sender'
    //     });

    //     if (userMessages != null) {
    //         setMessages(userMessages.reverse());
    //     }
    // }

    const postMessage = async (message) => {
        if (message != "" && message != null) {
            const sendMessage = await postUserMessage({ 'user_id': selectedChat?.partner?.id, 'message': message });
            console.log('send message', sendMessage);
            if (sendMessage != null) {
                fetchMessages(selectedChat.partner.id);
            }
            openNotificationWithIcon('success', 'Сообщение отправлено!');
        } else {
            openNotificationWithIcon('error', 'Заполните поле для сообщения!');
        }
    }

    useEffect(() => {
        if (selectedChat) {
            console.log('selected chat', selectedChat?.partner?.id);
            fetchMessages(selectedChat?.partner?.id);
        }
    }, [selectedChat]);


    useEffectOnce(() => {
        moment.locale('ru')
        fetchChats()

        return () => {
            setSelectedChat(null);
        }
    });

    return (
        <>
            <Helmet>
                <title>Сообщение пользователя</title>
            </Helmet>

            <Contents
                chats={chats}
                user={user}
                messages={messages}
                selectedChat={selectedChat}
                onSelectedChatChange={(chat) => {
                    setSelectedChat(null);
                    setTimeout(() => {
                        setSelectedChat(chat);
                    }, 100);
                }}
                onSendMessage={postMessage}
            />

            <div className="h-[50px]" />
        </>
    );
}

function Contents({ chats, user, messages, selectedChat, onSelectedChatChange, onSendMessage, onRemoveChat }) {
    const [message, setMessage] = useState();
    const scrollRef = React.useRef();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="h-[750px] w-full bg-[#587fb3] rounded-2xl flex flex-row gap-3 p-3">
            <div className="w-[40%] flex flex-col gap-2">
                {chats?.length == 0 && (
                    <>  </>
                )}

                {chats?.map((item, i) => {
                    return (
                        <div key={i}>
                            <ChatListItem
                                item={item}
                                isSelected={selectedChat?.id == item.id}
                                onClick={() => {
                                    onSelectedChatChange(item);
                                }}
                            />
                        </div>
                    )
                })}

            </div>

            <div className="w-[60%] flex flex-col gap-2 bg-zinc-100 rounded-2xl">
                {selectedChat && (
                    <div className="flex flex-col gap-2 h-full w-full">
                        <div ref={scrollRef} className="flex-1 overflow-y-scroll">
                            <div
                                className="flex flex-col gap-2 expand  px-3 pt-1 "
                            >
                                <div className="pt-1" />

                                {messages?.map((item) => {
                                    const isMe = item.sender?.id == user?.id;

                                    return (
                                        <div
                                            key={item.id}
                                            className={classNames(
                                                "flex flex-row gap-2 items-center w-full",
                                                { 'justify-end': isMe, 'justify-start': !isMe },
                                            )}
                                        >
                                            <div
                                                className={classNames(
                                                    "flex flex-row gap-2 items-center p-[13px] bg-slate-500 rounded-[10px] max-w-[50%]",
                                                    { 'justify-end': isMe, 'justify-start': !isMe },
                                                )}
                                            >
                                                <div
                                                    className="text-white text-xs font-normal w-full break-words"
                                                >
                                                    {item.message}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="flex-none w-full mb-3 px-3">
                            <div className="flex flex-row gap-2 items-center justify-center w-full">
                                <div className="flex flex-row gap-2 items-center justify-center w-full">
                                    <input
                                        className="w-full h-[40px] rounded-[10px] border-2 border-neutral-200 focus:outline-none focus:border-primary-500 px-3"
                                        placeholder="Сообщение"
                                        value={message}
                                        onChange={(e) => {
                                            setMessage(e.target.value);
                                        }}
                                    />
                                    <button
                                        className="w-[40px] h-[40px] rounded-[10px] bg-primary text-white flex items-center justify-center"
                                        onClick={async () => {
                                            await onSendMessage(message);
                                            setMessage('');
                                        }}
                                    >
                                        <ChatBubbleOutlined />
                                    </button>

                                </div>
                            </div>
                        </div>


                    </div>
                ) || (
                        <div className="flex flex-col gap-2 items-center justify-center h-100">
                            <div className="flex flex-row gap-2 items-center justify-center ">
                                <div className="bg-zinc-400 rounded-[25px] justify-center items-center p-[10px]">
                                    <ChatBubbleOutlined style={{ fontSize: '30px', color: '#fff' }} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="text-sm font-medium font-['SF UI Display']">
                                        Выберите чат
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}

function ChatListItem({ item, isSelected = false, onClick }) {
    const image = item.partner?.image;
    const textColor = isSelected ? 'text-white' : 'text-neutral-800';

    return (
        <div
            className={classNames(
                "h-[66px] flex flex-row gap-2  rounded-[25px] p-[8px] cursor-pointer animate__animated animate__fadeIn",
                { 'bg-neutral-800': isSelected, 'bg-zinc-100': !isSelected },
            )}
            onClick={onClick}
        >
            <span
                className={classNames(
                    "bg-zinc-400 rounded-[25px] justify-center items-center",
                    { 'bg-zinc-400': image },
                    { 'bg-neutral-800 p-[15px]': !image }
                )}
                style={{
                    width: '56px',
                    height: '50px',
                }}
            >
                {image && (
                    <img
                        src={image}
                        alt="person"
                        style={{
                            width: '56px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                        }}
                    />
                )}
            </span>

            <div className="flex-col justify-start items-start gap-[5px] inline-flex">
                <Link
                    className={classNames(
                        "text-sm font-medium font-['SF UI Display']",
                        textColor,
                    )}
                    to={`/chat/${item.id}/${item.partner?.id}`}
                >
                    {item.partner?.name}
                </Link>
                <div
                    className={classNames(
                        "h-[17px] text-[15px] font-normal font-['SF UI Display']",
                        textColor,
                    )}
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {item.lastMessageText || 'Здравствуйте! Сколько просите и есть торг'}
                </div>
            </div>
        </div >
    );
}

export default ChatListPage;