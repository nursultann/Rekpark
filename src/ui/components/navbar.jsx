import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Drawer, Button, Menu } from 'antd';
import {
  FileAddOutlined,
  UserAddOutlined,
  DesktopOutlined,
  SettingOutlined,
  LogoutOutlined,
  StarOutlined,
  MessageOutlined,
  PlusOutlined,
  CommentOutlined,
  UserOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useDispatch } from "react-redux";
import eventBus from "../../helpers/event_bus";
import { unreadMessages } from "../../api/user";
import { subscriptions } from "../../api/product";
import { setProductPlans } from "../../redux/actions/productPlans_actions";
import logo from "../../dist/img/logo.png";
import { useUserStore } from "../../store/user_store";

const Navbar = () => {
  const history = useNavigate();
  const [visible, setVisible] = useState(false);
  const [countMessage, setCountMessage] = useState(0);
  const dispatch = useDispatch();
  const userState = useUserStore();
  const isAuth = userState.isAuthenticated;
  const fetchUnreadMessages = async () => {
    const fetchChats = await unreadMessages();
    if (fetchChats != null) {
      setCountMessage(fetchChats.count);
    }
  }
  const fetchPlans = async () => {
    const plans = await subscriptions();
    if (plans != null) {
      dispatch(setProductPlans(plans));
    }
  }

  const showDrawer = () => {
    setVisible(true);
  }

  const hide = () => {
    setVisible(false);
  }
  const navigateTo = (page) => {
    history(page);
  };

  const logOut = () => {
    localStorage.removeItem('token');
    userState.signOut();
    navigateTo('/');
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
    <div className="pr-0">

      <div className="d-block d-lg-none">
        <div className="flex flex-row mt-4 mx-1 align-items-center justify-content-between md:px-[75px] xs:px-[15px]">
          <div className='flex-none'>
            <Link
              className="navbar-brand d-flex align-items-center justify-content-center"
              to="/">
              <img src={logo} className='w-[200px] xs:w-[160px]' />
            </Link>
          </div>
          <div className="flex flex-row gap-4 xs:gap-2">
            <Link
              to="/products/create"
              className="flex flex-row justify-content-center align-items-center gap-2  px-3 xs:px-1 xs:gap-0 py-2 rounded-2xl border border-zinc-100"
            >
              <PlusOutlined />
              <div className="d-none d-md-block">
                Разместить объявление
              </div>
            </Link>
            <div className="w-10 h-10 p-2.5 rounded-[15px] border border-zinc-100 justify-center items-center  inline-flex">
              <UserOutlined />
            </div>
            <div className="w-10 h-10 p-2.5 rounded-[15px] border border-zinc-100 justify-center items-center inline-flex">
              <MenuOutlined />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-zinc-100 border-b row  d-lg-flex d-md-none d-sm-none d-xs-none xs:hidden">
        <div className="col-1-5 "></div>
        <div className="col-lg-9 col-md-12">
          <header className="blog-header py-3">
            <div className="row flex-nowrap justify-content-between align-items-center">
              <div className="col-8 col-lg-6">

                <div
                  className="flex flex-row justify-content-start align-items-center gap-4"
                >
                  <a className="" href="/" >Главная</a>
                  <a className="" href="/">Для бизнеса</a>
                  <a className="" href="/articles">Cтатьи</a>
                  <a className="" href="/">Помощь</a>
                  <a className="" href="/about">О нас</a>
                </div>
              </div>

              <div className="col-4 col-lg-6 d-lg-flex justify-content-end align-items-center">
                {!isAuth ?
                  <>
                    <div className="flex flex-row gap-2">
                      <div className="flex flex-row gap-2 align-items-center">
                        <a className="" href="/login">Войти</a>
                        <span className="">/</span>
                        <a className="" href="/register">Регистрация</a>
                      </div>
                      <Link
                        to="/login"
                        className="flex flex-row justify-content-center align-items-center gap-2 rounded-pill border-0 px-3 py-2"
                      >
                        <PlusOutlined /> Разместить объявление
                      </Link>
                    </div>
                    <div className="d-xs-block d-lg-none text-right">
                      <Button className="rounded-lg" onClick={showDrawer}>
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
                      <Button style={{ borderRadius: '12px' }} onClick={showDrawer}>
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
                            <Menu.Item onClick={() => navigateTo('/products/create')} key="1" icon={<FileAddOutlined />}>
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
                      <div className="flex flex-row gap-2 align-items-center">
                        <div
                          className="flex flex-row gap-3 align-items-center  justify-center"
                          style={{
                            fontSize: 22,
                          }}
                        >
                          <Link
                            to="/profile/chats"
                            className="m-0 p-0 flex justify-center items-center"
                          >
                            <CommentOutlined size={50} />
                          </Link>
                          <Link
                            to="/profile"
                            className="m-0 p-0 flex justify-center items-center"
                          >
                            <UserOutlined size={50} />
                          </Link>
                          <Link
                            className="m-0 p-0 flex justify-center items-center"
                          >
                            <LogoutOutlined onClick={logOut} size={50} />
                          </Link>
                        </div>
                        <Link
                          to="/products/create"
                          className="flex flex-row justify-content-center align-items-center gap-2 rounded-pill border-0 px-3 py-2"
                        >
                          <PlusOutlined /> Разместить объявление
                        </Link>
                      </div>
                    </div>
                  </>
                }
              </div>
            </div>
          </header>
        </div>
        <div className="col-1-5 "></div>
      </div>
    </div>
  );
}

export default Navbar;