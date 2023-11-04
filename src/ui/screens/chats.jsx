import React from "react";
import { useHistory } from 'react-router-dom';
import Navbar from "../components/navbar";
import { deleteChat, getUserChats, getUserMessages, postUserMessage, readMessages, userDetails } from "../../api/user";
import { useEffect, useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/actions/user_actions";
import { Image } from 'antd';
import * as api from "../../api";
import { Tabs, notification } from 'antd';
import moment from "moment-timezone";

const openNotificationWithIcon = (type, info) => {
    notification[type]({
        message: info,
    });
};

const { TabPane } = Tabs;

const Chats = () => {
    // console.log(localStorage.getItem('token'));
    if (!localStorage.getItem('token')) {
        window.location.href = '/';
    }
    const history = useHistory();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [chats, setChats] = useState();
    const [chat_id, setChatId] = useState();
    const [message, setMessage] = useState();
    const [loadings, setLoadings] = useState();
    const [user_id, setUserId] = useState();
    const fetchUserDetails = async () => {
        const user = await userDetails();
        if (user != null) {
            dispatch(setUser(user));
            setUserId(user.id);
        }
    };
    const removeChat = async (id) => {
        console.log('id chat', id);
        const remove = await deleteChat(id);
        console.log(remove);
        if (remove != null) {
            openNotificationWithIcon('success', 'Чат успешно удалён!');
        }
    }
    const fetchChats = async () => {
        const userChats = await getUserChats();
        if (userChats != null) {
            setChats(userChats);
            console.log('chats',userChats);
        }
    }
    // const setUserMessage = (id, userName, partner_id) => {
    //     console.log('id', id , 'userName', userName);
    //     // history.push("/chat/" + id + "/" + userName);
    //     // setChatId(id);
    //     // setAdvertisement_id(userName)
    //     getUserMessages(id,userName);
    // }
    // const postMessage = async () => {
    //     setLoadings(true);
    //     if (message != "" && message != null) {
    //         const sendMessage = await postUserMessage({ 'user_id': chat_id, 'message': message });
    //         getUserMessage(chat_id);
    //         setMessage("");
    //         openNotificationWithIcon('success', 'Сообщение отправлено!');
    //         setLoadings(false);
    //     } else {
    //         openNotificationWithIcon('error', 'Заполните поле для сообщения!');
    //     }
    // }
    moment.locale('ru');
    useEffect(() => {
        document.title = "Сообщения";
        fetchUserDetails();
        fetchChats();
    }, []);
    //single chat 
    const [messages, setMessages] = useState(null);
    const [chat_name, setChatName] = useState();
    const [chat_image, setChatImage] = useState();
    const [postId, setPostId] = useState();
    const [product, setProduct] = useState(null);
    // const [userID,setUserID] = useState();
    const [advertisement_id,setAdvertisement_id] = useState();
    // const fetchUserDetails = async () => {
    //     const user = await userDetails();
    //     if (user != null) {
    //         dispatch(setUser(user));
    //     }
    // };
    const getUserMessage = async (userID,ad_id) => {
        console.log(ad_id);
        setChatId(userID);
        setAdvertisement_id(ad_id);
        // setChatName(userName);
        const userMessages = await getUserMessages({ 'chat_user_id': userID, 'advertisement_id': ad_id, 'with': 'sender' });
        if (userMessages != null) {
            setMessages(userMessages.reverse());
            setPostId(messages[0].advertisement_id);
            console.log('messages', messages);
            productDetails(postId,userID);
        }
    }
    const postMessage = async () => {
        setLoadings(true);
        if (message != "" && message != null) {
            const sendMessage = await postUserMessage({ 'user_id': chat_id, 'message': message, 'advertisement_id': advertisement_id });
            getUserMessage(chat_id);
            setMessage("");
            openNotificationWithIcon('success', 'Сообщение отправлено!');
            setLoadings(false);
        } else {
            openNotificationWithIcon('error', 'Заполните поле для сообщения!');
        }
    }
    const productDetails = async (id,userid) => {
                const _product = await api.fetchProduct(id);
                const readMessage = await readMessages({ 'partner_id': userid });
                setProduct(_product);
                console.log("read", readMessage);
    }
    moment.locale('ru');
    useEffect(() => {
        document.title = "Сообщение пользователя";
    }, []);
    return (
        user === null || user === undefined || user === ""
            ? <div className="col-md-12 mt-3">
                <Skeleton variant="rectangular" width={'100%'} height={200} />
                <div className="row mt-3">
                    <div className="col-md-4">
                        <Skeleton variant="text" />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" width={210} height={118} />
                    </div>
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-12 mb-2">
                                <Skeleton variant="rectangular" width={'100%'} height={50} />
                            </div>
                            <div className="col-md-4">
                                <Skeleton variant="rectangular" width={'100%'} height={100} />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </div>
                            <div className="col-md-4">
                                <Skeleton variant="rectangular" width={'100%'} height={100} />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </div>
                            <div className="col-md-4">
                                <Skeleton variant="rectangular" width={'100%'} height={100} />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            :
            <div>
                <Navbar />
                <div className="col-xl-12 mt-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a style={{ color: "rgb(9, 72, 130)" }} href="/"><i className="fa-solid fa-house"></i> Главная страница</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Сообщения</li>
                        </ol>
                    </nav>
                    <div className="col-12 px-0 px-xl-5">
                        <div className="col-12 px-0 pb-3 px-xl-5">
                            <div className="nav d-flex justify-content-around nav-pills border rounded-lg py-2" id="v-pills-tab" role="tablist">
                                <a className="nav-link px-4 rounded-pill" id="v-pills-home-tab" href="/profile" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">Профиль</a>
                                <a className="nav-link px-4 rounded-pill" id="v-pills-profile-tab" href="/myads" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">Мои объявления</a>
                                <a className="nav-link px-4 rounded-pill" id="v-pills-messages-tab" href="/favorites" type="button" role="tab" aria-controls="v-pills-messages" aria-selected="false">Избранные</a>
                                <a className="nav-link active px-4 rounded-pill" id="v-pills-settings-tab" href="/chats" type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false">Сообщения</a>
                                <a className="nav-link px-4 rounded-pill" id="v-pills-settings-tab" href="/wallets" type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false">Пополнить баланс</a>
                            </div>
                            <div className="tab-content bg-light rounded mt-3" id="v-pills-tabContent">
                                <div className="tab-pane fade show active" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">
                                    <div className="row">
                                        <div className="col-xl-5 mt-3 mt-md-0">
                                            <div className="col-xl-12 px-2 py-2 rounded mb-3" style={{ backgroundColor: "#184d9f" }}>
                                                <label className="text-white" style={{ fontSize: 15 }}>Сообщения</label>
                                            </div>
                                            <div className="container">
                                                <div className="content-wrapper">
                                                    <div className="row gutters">

                                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">

                                                            <div className="card m-0">
                                                                <div className="row no-gutters">
                                                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                                        <div className="users-container">
                                                                            <ul className="users">
                                                                                {chats?.length > 0 ?
                                                                                    <>
                                                                                        {chats.map((chat) =>
                                                                                            <li className="person" data-chat="person1">
                                                                                                <div className="user" onClick={() => getUserMessage(chat.user_1_id != user_id ? chat.user_1_id : chat.user_2_id, chat.advertisement_id)}>
                                                                                                    {chat.advertisement.image != null ?
                                                                                                        <>
                                                                                                            <img src={chat.advertisement.image} />
                                                                                                            <span className="status busy"></span>
                                                                                                        </>
                                                                                                        :
                                                                                                        <>
                                                                                                            <Image />
                                                                                                        </>
                                                                                                    }
                                                                                                </div>
                                                                                                <p className="name-time" onClick={() => getUserMessage(chat.user_1_id != user_id ? chat.user_1_id : chat.user_2_id, chat.advertisement_id)}>
                                                                                                    <span className="name">{chat.advertisement.title}</span>
                                                                                                </p>
                                                                                                <div className="float-right">
                                                                                                    <span><i className="fa-solid fa-trash-can text-primary" onClick={() => removeChat(chat.id)}></i></span>
                                                                                                </div>
                                                                                            </li>
                                                                                        )}
                                                                                    </> :
                                                                                    <div className="col-12 text-center">
                                                                                        Пока нет сообщений
                                                                                    </div>
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="col-xl-7 mt-3 mt-md-0">
                                            <div className="content-wrapper">
                                                <div className="row gutters">
                                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 px-0">
                                                        <div className="card m-0">
                                                            <div className="row no-gutters">
                                                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                                    <div className="selected-user">
                                                                        <span>Сообщения от <span className="name">{chat_name}</span></span>
                                                                    </div>
                                                                    <div className="col-12 alert alert-primary">
                                                                        {product != null ?
                                                                            <>
                                                                                <img src={product.image} width="50px" />
                                                                                <a href={"/products/" + product.id}><span className="ml-2">{product.title}</span></a>
                                                                            </>
                                                                            :
                                                                            <>

                                                                            </>
                                                                        }
                                                                    </div>
                                                                    <div className="chat-container">
                                                                        <ul className="chat-box chatContainerScroll">
                                                                            {
                                                                                messages?.length > 0 ?
                                                                                    <>
                                                                                        {
                                                                                            messages.map((item) =>
                                                                                                <>
                                                                                                    {item.sender_id == chat_id ?
                                                                                                        <li className="chat-left">
                                                                                                            <div className="chat-avatar">
                                                                                                                <img src={item.sender.image} alt="Retail Admin" />
                                                                                                                <div className="chat-name">{item.sender.name}</div>
                                                                                                            </div>
                                                                                                            <div className="chat-text">
                                                                                                                {item.message}
                                                                                                            </div>
                                                                                                            {/* <div className="chat-hour">{moment(item.created_at, 'YYYYMMDD, h:mm:ss a').tz('Asia/Almaty').format('LLLL')}</div> */}
                                                                                                        </li>
                                                                                                        :
                                                                                                        <li className="chat-right">
                                                                                                            {/* <div className="chat-hour">{moment(item.created_at, 'YYYYMMDD, h:mm:ss a').tz('Asia/Almaty').format('LLLL')}
                                                                                                                {item.sender.read_at != null ? <span className="fa fa-check-circle"></span> : <></>}
                                                                                                            </div> */
                                                                                                            }
                                                                                                            <div className="chat-text">
                                                                                                                {item.message}
                                                                                                            </div>
                                                                                                            <div className="chat-avatar">
                                                                                                                <img src={item.sender.image} alt="Retail Admin" />
                                                                                                                <div className="chat-name">{item.sender.name}</div>
                                                                                                            </div>
                                                                                                        </li>
                                                                                                    }
                                                                                                </>
                                                                                            )}
                                                                                    </> : <></>
                                                                            }
                                                                        </ul>
                                                                    </div>
                                                                    {chat_id ?
                                                                        <div className="form-group text-right py-2 px-3 mt-3 mb-0">
                                                                            <textarea className="form-control" rows="3" placeholder="Напишите ваше сообщение..."
                                                                                onChange={(e) => { setMessage(e.target.value) }} value={message}></textarea>
                                                                            <button style={{ backgroundColor: "#184d9f" }} className="btn btn-primary mt-3 mb-2" type="primary" loading={loadings} onClick={()=>postMessage()}>
                                                                                Отправить
                                                                            </button>
                                                                        </div>
                                                                        : <></>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}
export default Chats;