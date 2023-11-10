import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import { Drawer, Button, Dropdown, Menu, Space, Divider, Badge, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
  FileAddOutlined,
  UserAddOutlined,
  DesktopOutlined,
  SettingOutlined,
  LogoutOutlined,
  StarOutlined,
  MessageOutlined
} from '@ant-design/icons';
import eventBus from "../helpers/event_bus";
import { unreadMessages } from "../api/user";
import { subscriptions } from "../api/product";
import { useDispatch } from "react-redux";
import { setProductPlans } from "../redux/actions/productPlans_actions";
import logo from "../../src/img/logo.png";
const { SubMenu } = Menu;

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [collapse, setCollapse] = useState(true);
  const [countMessage, setCountMessage] = useState(0);
  const dispatch = useDispatch();
  const fetchUnreadMessages = async () => {
    const fetchChats = await unreadMessages();
    if (fetchChats != null) {
      setCountMessage(fetchChats.count);
      // console.log(fetchChats.count);
    }
  }
  const fetchPlans = async () => {
    const plans = await subscriptions();
    if (plans != null) {
      dispatch(setProductPlans(plans));
    }
  }
  const show = () => {
    setVisible(true);
  }

  const hide = () => {
    setVisible(false);
  }

  const history = useHistory();

  const navigateTo = (page) => {
    history.push(page);
  };

  const token = localStorage.getItem('token');
  const logOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  useEffect(() => {
    fetchUnreadMessages();
    fetchPlans();
    eventBus.on('chat-message', (data) => {
      console.log("Data", data);
    })
    return () => {
      eventBus.remove('chat-message')
    }

  }, [])

  const menu = (
    <Menu onClick={(menu) => {
      switch (menu.key) {
        case 'settings':
          navigateTo('/settings');
          break;
        case 'logout':
          logOut();
          break;
        case 'chats':
          navigateTo('/chats');
          break;
        case 'favorites':
          navigateTo('/favorites');
          break;
        default:
      }
    }}>
      <Menu.Item key="settings">
        Настройки
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="favorites">
        Избранные
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="chats">
        Сообщения
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        Выйти
      </Menu.Item>
    </Menu>
  );
  return (
    <div>
      <div className="container-fluid">
        <div>
          <header className="blog-header py-3">
            <div className="row flex-nowrap justify-content-between align-items-center">
              <div className="col-8 col-lg-6 d-none d-lg-block">
                <a className="text-dark" href="/" >Главная</a>
                <a className="text-dark ml-2" href="/">Для бизнеса</a>
                <a className="text-dark ml-2" href="/articles">Cтатьи</a>
                <a className="text-dark ml-2" href="/">Помощь</a>
                <a className="text-dark ml-2" href="/about">О нас</a>
              </div>
              <div className="col-6 d-block d-md-none">
                <a className="navbar-brand" href="/" ><img src={logo} style={{ width: "100%" }} /></a>
              </div>
              {/* <div className='col-2 px-0 d-block d-md-none'>
                       
              </div>  */}
              <div className="col-6 col-lg-6 d-lg-flex justify-content-end align-items-center">
                {token == null ?
                  <>
                    <div className="d-none d-lg-block">
                      {/* <Button onClick={() => navigateTo('/register')} className="mr-2 rounded-pill" style={{ backgroundColor: 'rgb(9, 72, 130)', color: "#fff" }}>Регистрация</Button>
                      <Button onClick={() => navigateTo('/login')} className="mr-2 rounded-pill" style={{ borderColor: 'rgb(9, 72, 130)', color: 'rgb(9, 72, 130)' }}>Войти</Button> */}
                      <a className="text-dark" href="/login">Войти</a>
                      <span className="text-dark mx-1">/</span>
                      <a className="text-dark" href="/register">Регистрация</a>
                      <button onClick={() => navigateTo('/login')} className="btn btn-light p-1 ml-3"><i class="fa-solid fa-plus"></i> Разместить объявление</button>
                    </div>
                    <div className="d-xs-block d-lg-none text-right">
                      <Button className="rounded-lg" onClick={show}>
                        <i className="fas fa-bars"></i>
                      </Button>
                      <Drawer
                        title=""
                        placement="left"
                        closable={true}
                        onClose={hide}
                        visible={visible}
                      >
                        <div style={{ width: "100%" }}>
                          <Menu
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                            theme="light"
                          >
                            <Menu.Item onClick={() => navigateTo('/register')} key="1" icon={<UserAddOutlined />}>
                              Регистрация
                            </Menu.Item>
                            <Menu.Item onClick={() => navigateTo('/login')} key="2" icon={<UserOutlined />}>
                              Войти
                            </Menu.Item>
                          </Menu>
                        </div>
                      </Drawer>
                    </div>
                  </>
                  :
                  <>
                    <div className="d-xs-block d-lg-none text-right">
                      <Button className="mr-2" style={{ borderRadius: '12px' }} onClick={() => navigateTo('/products/create')}>
                        <i class="fa-solid fa-plus"></i>
                      </Button>
                      <Button className="mr-2" style={{ borderRadius: '12px' }} onClick={() => navigateTo('/profile')}>
                        <i class="fa-regular fa-user"></i>
                      </Button>
                      <Button style={{ borderRadius: '12px' }} onClick={show}>
                        <i className="fas fa-bars"></i>
                      </Button>
                      <Drawer
                        title=""
                        placement="left"
                        closable={true}
                        onClose={hide}
                        visible={visible}
                      >
                        <div style={{ width: "100%" }}>
                          <Menu
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                            theme="light"
                          >
                            <Menu.Item onClick={() => navigateTo('/create')} key="1" icon={<FileAddOutlined />}>
                              + Подать объявление
                            </Menu.Item>
                            <Menu.Item onClick={() => navigateTo('/profile')} key="2" icon={<DesktopOutlined />}>
                              Личный кабинет
                            </Menu.Item>
                            <Menu.Item onClick={() => navigateTo('/favorites')} key="2" icon={<StarOutlined />}>
                              Избранные
                            </Menu.Item>
                            <Menu.Item onClick={() => navigateTo('/chats')} key="2" icon={<MessageOutlined />}>
                              Сообщения
                            </Menu.Item>
                            <Menu.Item onClick={() => navigateTo('/settings')} key="3" icon={<SettingOutlined />}>
                              Настройки
                            </Menu.Item>
                            <Menu.Item onClick={logOut} key="4" icon={<LogoutOutlined />}>
                              Выйти из профиля
                            </Menu.Item>

                          </Menu>
                        </div>
                      </Drawer>
                    </div>
                    <div className="d-none d-lg-block">
                      <Space>
                        <span className="avatar-item mr-2">
                          <Badge count={countMessage}>
                            <a href="/chats"><i style={{ fontSize: 20 }} className="fa-solid fa-comments text-dark"></i></a>
                          </Badge>
                        </span>
                        {/* <Dropdown.Button className="" overlay={menu}>
                          <Link to="/profile">Личный кабинет</Link>
                        </Dropdown.Button> */}
                        <Badge>
                          <Link to="/profile">
                            <i style={{ fontSize: 20 }} className="fa-regular fa-user text-dark mr-2"></i>
                          </Link>
                        </Badge>
                        <Badge>
                          <i style={{ fontSize: 20 }} onClick={() => logOut()} className="fa-solid fa-arrow-right-from-bracket text-dark"></i>
                        </Badge>
                        {/* <Button
                          className="rounded-pill text-white border-0"
                          type=''
                          onClick={() => navigateTo('/products/create')}
                          style={{ backgroundColor: 'rgb(9, 72, 130)' }}
                        >
                          + Подать объявление
                        </Button> */}
                        <button onClick={() => navigateTo('/products/create')} className="btn p-1 ml-3">
                          <i class="fa-solid fa-plus"></i> Разместить объявление</button>
                      </Space>
                    </div>
                  </>
                }
              </div>
            </div>
          </header>
        </div>
      </div>
    </div>
  );
}

export default Navbar;