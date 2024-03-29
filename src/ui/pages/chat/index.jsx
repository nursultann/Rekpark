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
    const { chats, selectedChat, fetchChats, setSelectedChat, messages, fetchMessages, lastMessage } = useChatStore();

    //const [selectedChat, setSelectedChat] = useState();

    const [innerWidth, setInnerWidth] = useState(window.innerWidth);

    const partner = selectedChat?.partner?.id == user.id ? selectedChat?.user : selectedChat?.partner;

    const removeChat = async (id) => {
        const remove = await deleteChat(id);
        console.log(remove);
        if (remove != null) {
            openNotificationWithIcon('success', 'Чат успешно удалён!');
        }else{
            openNotificationWithIcon('error', 'Что-то пошло не так!');
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

    const postMessage = async (message) => {
        if (message != "" && message != null) {
            const sendMessage = await postUserMessage({ 'user_id': partner?.id, 'message': message });
            console.log('send message', sendMessage);
            if (sendMessage != null) {
                fetchMessages(partner.id);
            }
            openNotificationWithIcon('success', 'Сообщение отправлено!');
        } else {
            openNotificationWithIcon('error', 'Заполните поле для сообщения!');
        }
    }

    useEffect(() => {
        if (selectedChat) {
            console.log('selected chat', partner?.id);

            fetchMessages(partner?.id);
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
    const [message, setMessage] = useState('');
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
                    <></>
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
                                userId={user?.id}
                            />
                        </div>
                    )
                })}

            </div>

            <div className="w-[60%] flex flex-col gap-2 bg-zinc-100 rounded-2xl">
                {selectedChat && (
                    <div className="flex flex-col gap-2 h-full w-full">
                        <div className="flex-1 overflow-y-scroll">
                            <div
                                ref={scrollRef}
                                className="flex flex-col gap-2 expand  px-3 pt-1 "
                            >
                                <div className="pt-1" />

                                {messages?.map((item, index) => {
                                    const isMe = item.sender?.id == user?.id;

                                    return (
                                        <div
                                            key={index}
                                            className={classNames(
                                                "flex flex-row gap-2 items-center w-full animate__animated animate__fadeIn",
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
                                <div className="flex flex-row gap-2 items-center justify-center w-full bg-neutral-200 p-1 rounded-[20px]">
                                    <input
                                        className="w-full h-[40px] border-2 border-none focus:outline-none focus:border-primary-500 px-3 bg-transparent"
                                        placeholder="Сообщение"
                                        value={message}
                                        onChange={(e) => {
                                            setMessage(e.target.value);
                                        }}
                                        onKeyPress={async (e) => {
                                            if (e.key == 'Enter') {
                                                await onSendMessage(message);
                                                setMessage('');
                                            }
                                        }}
                                    />
                                    <button
                                        className="w-[40px] h-[40px] rounded-[15px] p-3 bg-primary text-white flex items-center justify-center"
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

function ChatListItem({ item, isSelected = false, userId, onClick }) {
    const textColor = isSelected ? 'text-white' : 'text-neutral-800';

    const partner = item.partner?.id == userId ? item.user : item.partner;
    const image = partner?.image;

    return (
        <div
            className={classNames(
                "h-[66px] flex flex-row gap-2  rounded-[25px] p-[8px] cursor-pointer animate__animated animate__fadeIn",
                'chat-' + item.id,
                { 'bg-neutral-800': isSelected, 'bg-zinc-100': !isSelected },
            )}
            onClick={onClick}
        >
            <span
                className={classNames(
                    "bg-zinc-400 rounded-[25px] justify-center items-center flex-shrink-0",
                    { 'bg-zinc-400': image },
                    { 'bg-neutral-800 p-[15px]': !image }
                )}
                style={{
                    width: '50px',
                    height: '50px',
                }}
            >
                {image && (
                    <img
                        src={image}
                        alt="person"
                        style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                        }}
                    />
                )}
            </span>

            <div className="flex-col justify-start items-start gap-[5px] inline-flex w-full overflow-hidden">
                <Link
                    className={classNames(
                        "text-sm font-medium font-['SF UI Display']",
                        textColor,
                    )}
                    to={`/chat/${item.id}/${partner?.id}`}
                >
                    {partner?.name}
                </Link>
                <div
                    className={classNames(
                        "h-[17px] text-[15px] font-normal w-full",
                        textColor,
                    )}
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {item.lastMessage?.message || 'Здравствуйте! Сколько просите и есть торг'}
                </div>
            </div>
        </div >
    );
}

export default ChatListPage;