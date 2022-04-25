import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import { Drawer, Button, Dropdown, Menu, Space, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
  FileAddOutlined,
  UserAddOutlined,
  DesktopOutlined,
  SettingOutlined,
  LogoutOutlined,
  StarOutlined
} from '@ant-design/icons';
import logo from "../../src/img/logo.png";
const { SubMenu } = Menu;
const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [collapse, setCollapse] = useState(true);

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

  const menu = (
    <Menu onClick={(menu) => {
      switch (menu.key) {
        case 'settings':
          navigateTo('/settings');
          break;
        case 'logout':
          logOut();
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
      <Menu.Item key="logout">
        Выйти
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <div className="container-fluid shadow-sm">
        <div>
          <header className="blog-header py-3">
            <div className="row flex-nowrap justify-content-between align-items-center">
              <div className="col-4 col-lg-2 text-center">
                <a className="navbar-brand" href="/" >
                  <img src='https://www.bazar.kg/build/images/bazarkg-logo.39b422a5.svg' style={{ width: "100%" }} />
                </a>
              </div>
              {/*
              <div className='col-5 d-none d-md-block'>
                <nav className="nav d-flex justify-content-center">
                  <a className="p-2 px-4" href="/about_us">О нас</a>
                  <a className="p-2 px-4" href="/articles">Статьи</a>
                  <a className="p-2 px-4" href="/contacts">Контакты</a>
                  <a className="p-2 px-4" href="/ad_manage">Рекламодателям</a>
                </nav>
              </div> 
              */}
              <div class="col-6 d-lg-flex justify-content-end align-items-center">
                {token == null ?
                  <>
                    <div className="d-none d-lg-block">
                      <Button onClick={() => navigateTo('/register')} className="mr-2 rounded-pill" style={{ backgroundColor: '#184d9f', color: "#fff" }}>Регистрация</Button>
                      <Button onClick={() => navigateTo('/login')} className="mr-2 rounded-pill" style={{ borderColor: '#184d9f', color: '#184d9f' }}>Войти</Button>
                    </div>
                    <div class="d-xs-block d-lg-none text-right">
                      <Button onClick={show}>
                        <i class="fas fa-bars"></i>
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
                    <div class="d-xs-block d-lg-none text-right">
                      <Button onClick={show}>
                        <i class="fas fa-bars"></i>
                      </Button>
                      <Drawer
                        title=""
                        placement="left"
                        closable={true}
                        onClose={hide}
                        visible={visible}
                      >
                        <div style={{ width: "100%"}}>
                          <Menu
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                            theme="light"
                          >
                            <Menu.Item onClick={() => navigateTo('/products/create')} key="1" icon={<FileAddOutlined />}>
                              + Добавить рекламу
                            </Menu.Item>
                            <Menu.Item onClick={() => navigateTo('/profile')} key="2" icon={<DesktopOutlined />}>
                              Личный кабинет
                            </Menu.Item>
                            <Menu.Item onClick={() => navigateTo('/favorites')} key="2" icon={<StarOutlined />}>
                              Избранные
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
                        <Dropdown.Button className="" overlay={menu}>
                          <Link to="/profile">Личный кабинет</Link>
                        </Dropdown.Button>
                        <Button
                          className="rounded-pill"
                          type='primary'
                          onClick={() => navigateTo('/products/create')}
                          disableElevation
                          style={{ backgroundColor: '#184d9f' }}
                        >
                          + Добавить рекламу
                        </Button>
                      </Space>
                    </div>
                  </>
                }

              </div>
            </div>
          </header>
          {/* <div className="nav-scroller mb-2 rounded px-2 py-1" > */}

          {/* </div> */}
        </div>
      </div>

    </div>
  );
}

export default Navbar;