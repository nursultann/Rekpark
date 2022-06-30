import React from "react";
import { Link, useHistory } from 'react-router-dom';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { getUserChats, getUserMessages, postUserMessage, readMessages, userDetails } from "../api/user";
import { useEffect, useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/user_actions";
import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { setProducts } from "../redux/actions/product_actions";
import * as api from "../api";
import ProductItem from "../components/product/user_product_item";
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
    const { products } = useSelector((state) => state.product);
    const [chats, setChats] = useState();
    const limit = 20;
    const [offset, setOffset] = useState(0);
    const [params, setParams] = useState();
    const [messages, setMessages] = useState();
    const [chat_id, setChatId] = useState();
    const [chat_name, setChatName] = useState();
    const [chat_image, setChatImage] = useState();
    const [message, setMessage] = useState();
    const [loadings, setLoadings] = useState();
    const fetchUserDetails = async () => {
        const user = await userDetails();
        if (user != null) {
            dispatch(setUser(user));
        }
    };

    const UserProducts = async () => {
        let _products = await api.fetchUserProducts({ 'sub': true });
        if (_products != null) {
            dispatch(setProducts(_products));
            setOffset(offset + limit);
        }
    };
    const fetchChats = async () => {
        const userChats = await getUserChats();
        if (userChats != null) {
            setChats(userChats);
        }
    }
    const getUserMessage = async (userid, userName) => {
        history.push("/chat/" + userid + "/" + userName);
    }
    const postMessage = async () => {
        setLoadings(true);
        if (message != "" && message != null) {
            const sendMessage = await postUserMessage({ 'user_id': chat_id, 'message': message });
            getUserMessage(chat_id);
            setMessage("");
            openNotificationWithIcon('success', 'Сообщение отправлено!');
            setLoadings(false);
        } else {
            openNotificationWithIcon('error', 'Заполните поле для сообщения!');
        }
    }
    moment.locale('ru');
    useEffect(() => {
        document.title = "Личный кабинет";
        fetchUserDetails();
        UserProducts();
        fetchChats();
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
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a className="text-primary" href="/"><i class="fa-solid fa-house"></i> Главная страница</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Сообщения</li>
                        </ol>
                    </nav>
                    <div className="row px-3 mb-5">
                        <div className="col-xl-4 bg-light rounded py-3">
                            <div className="col-xl-12 alert text-white" style={{ backgroundColor: "#184d9f" }}>
                                <div className="row">
                                    <div className="col-12">
                                        {user.media?.length ?
                                            <Avatar size={64} icon={<img src={user.media[0].original_url} />} />
                                            :
                                            <Avatar size={42} icon={<UserOutlined />} />
                                        }
                                        <label className="ml-3">{user.name}</label>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-xl-12">
                                    <ul class="list-group">
                                        <li class="list-group-item">+{user.phone}</li>
                                        <li class="list-group-item"><Link to="/wallets">Пополнить</Link>: {user.balance} сом</li>
                                        <li class="list-group-item"><Link to="/profile">Мои объявления</Link></li>
                                        <li class="list-group-item"><Link to="/favorites">Избранные</Link></li>
                                        <li class="list-group-item text-white" style={{ backgroundColor: "#184d9f" }}><Link to="/chats">Сообщения</Link></li>
                                        <li class="list-group-item"><Link to="/settings">Настройки пользователя</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <hr />
                        </div>
                        <div className="col-xl-8 mt-3 mt-md-0">
                            <div className="col-xl-12 px-2 py-2 rounded mb-3" style={{ backgroundColor: "#184d9f" }}>
                                <label className="text-white" style={{ fontSize: 15 }}>Сообщения</label>
                            </div>
                            <div class="container">
                                <div class="content-wrapper">
                                    <div class="row gutters">

                                        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">

                                            <div class="card m-0">
                                                <div class="row no-gutters">
                                                    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                        <div class="users-container">
                                                            <ul class="users">
                                                                {chats != null || chats != undefined || chats?.length > 0 ?
                                                                    <>
                                                                        {chats.map((chat) =>
                                                                            <li class="person" data-chat="person1" onClick={() => getUserMessage(chat.id, chat.name)}>
                                                                                <div class="user">
                                                                                    <img src={chat.image} alt="Retail Admin" />
                                                                                    <span class="status busy"></span>
                                                                                </div>
                                                                                <p class="name-time">
                                                                                    <span class="name">{chat.name}</span>
                                                                                </p>
                                                                            </li>
                                                                        )}
                                                                    </> : <></>
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
                            {/* <Tabs className="border px-2 py-4 rounded" tabPosition="left">
                                {chats != null || chats != undefined || chats?.length > 0  ?
                                <>
                                {chats.map((chat)=>
                                <TabPane tab={
                                    <div className="col-10 col-xl-12">
                                    <div className="row">
                                        <div className="col-3 col-xl-2">
                                        <Avatar size={"100%"} icon={<UserOutlined />} />
                                        </div>
                                        <div className="col-9 col-xl-10">
                                        <div class="about">
                                        <div class="name"><a href="#" onClick={()=>getUserMessage(chat.id)}>{chat.name}</a></div>                                            
                                        </div>
                                        </div>
                                    </div>
                                    <hr className="d-none d-md-block"/>
                                    </div>
                                } key={chat.id}>
                                    <div className="col-xl-12">
                                        <div className="row border rounded py-3" style={{height:"300px",overflowY:"scroll"}}>
                                            {messages != null ?
                                            <>
                                            {
                                            

                                            }
                                            <div className="col-12 text-left">
                                                <label className="bg-light px-4 rounded-pill">
                                                    Text
                                                </label>
                                            </div>
                                            <div className="col-12 text-right">
                                                <label className="bg-light px-4 rounded-pill">
                                                    Text
                                                </label>
                                            </div>
                                           </>
                                           :<></> 
                                            }   
                                        </div>
                                        <div className="row mt-3">
                                        <div className="col-xl-12">
                                        <textarea className="form-control"></textarea>
                                        </div>
                                        <div className="col-xl-12 mt-3 text-right">
                                        <Button type="primary">Отправить</Button>
                                        </div>
                                        </div>    
                                    </div>
                                </TabPane>
                                )}
                                </>:<center>Нет Чатов</center>
                                }
                            </Tabs> */}
                        </div>
                    </div>
                </div>
            </div>
    );
}
export default Chats;