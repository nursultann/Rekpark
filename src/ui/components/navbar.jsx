import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Drawer, Button, Menu } from "antd";
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
  MenuOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import logo from "../../dist/img/logo.png";
import { useUserStore } from "../../store/user_store";

const Navbar = () => {
  const history = useNavigate();
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const userState = useUserStore();
  const isAuth = userState.isAuthenticated;
  const showDrawer = () => setVisible(true);
  const hideDrawer = () => setVisible(false);
  const navigateTo = (page) => history(page);
  const logOut = () => {
    localStorage.removeItem("token");
    userState.signOut();
    navigateTo("/");
  };
  return (
    <div>
      {/* Mobile Navbar */}
      <div className="d-lg-none">
        <div className="flex flex-row mt-4 mx-1 align-items-center justify-content-between">
          <div>
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="Logo" className="w-[200px]" />
            </Link>
          </div>
          <div className="flex gap-4">
            <Link
              to="/products/create"
              className="flex items-center px-3 py-2 border rounded-2xl"
            >
              <PlusOutlined />
              <span className="d-none d-md-block">Разместить объявление</span>
            </Link>
            <Button
              className="p-2 rounded-lg border"
              icon={<MenuOutlined />}
              onClick={showDrawer}
            />
          </div>
        </div>
        {/* Drawer for Mobile */}
        <Drawer
          title="Меню"
          placement="right"
          closable
          onClose={hideDrawer}
          visible={visible}
        >
          <Menu
            mode="inline"
            onClick={({ key }) => {
              hideDrawer();
              if (key === "logout") logOut();
              else navigateTo(key);
            }}
          >
            {!isAuth ? (
              <>
                <Menu.Item key="/register" icon={<UserAddOutlined />}>
                  Регистрация
                </Menu.Item>
                <Menu.Item key="/login" icon={<UserOutlined />}>
                  Войти
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item key="/products/create" icon={<FileAddOutlined />}>
                  + Подать объявление
                </Menu.Item>
                <Menu.Item key="/profile" icon={<DesktopOutlined />}>
                  Личный кабинет
                </Menu.Item>
                <Menu.Item key="/favorites" icon={<StarOutlined />}>
                  Избранные
                </Menu.Item>
                <Menu.Item key="/chats" icon={<MessageOutlined />}>
                  Сообщения
                </Menu.Item>
                <Menu.Item key="/settings" icon={<SettingOutlined />}>
                  Настройки
                </Menu.Item>
                <Menu.Item key="logout" icon={<LogoutOutlined />}>
                  Выйти из профиля
                </Menu.Item>
              </>
            )}
          </Menu>
        </Drawer>
      </div>
      {/* Desktop Navbar */}
      <div className="d-none d-lg-flex bg-zinc-100 border-b">
        <div className="container">
          <header className="blog-header py-3">
            <div className="d-flex justify-content-around align-items-center">
              <div className="d-flex">
                <nav className="d-flex gap-3">
                  <Link to="/">Главная</Link>
                  <Link to="/">Для бизнеса</Link>
                  <Link to="/articles">Статьи</Link>
                  <Link to="/help">Помощь</Link>
                  <Link to="/about">О нас</Link>
                </nav>
              </div>
              <div className="d-flex align-items-center">
                {!isAuth ? (
                  <div className="d-flex align-items-center gap-3">
                    <Link to="/login">Войти</Link>
                    <span>/</span>
                    <Link to="/register">Регистрация</Link>
                    <Link
                      to="/products/create"
                      className="rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                    >
                      <PlusOutlined /> Разместить объявление
                    </Link>
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-3">
                    <Link to="/profile/chats">
                      <CommentOutlined className="text-lg" />
                    </Link>
                    <Link to="/profile">
                      <UserOutlined className="text-lg" />
                    </Link>
                    <LogoutOutlined className="text-lg" onClick={logOut} />
                    <Link
                      to="/products/create"
                      className="rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                    >
                      <PlusOutlined /> Разместить объявление
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </header>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
