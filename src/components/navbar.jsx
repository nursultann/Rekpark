import img from '../img/logo.png';
import top from '../img/top.png';
import React from "react";
import {Link, useHistory } from "react-router-dom";
import { DownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/user_actions";
import { userDetails } from "../api/user";
import { useEffect,useState } from "react";
import { Drawer,Button, Dropdown, Menu, Space, Divider } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import {
  FileAddOutlined,
  UserAddOutlined,
  DesktopOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;
const Navbar = () => {
    const [visible,setVisible] = useState(false);
    const [collapse,setCollapse] = useState(true);
    const show = ()=>{
      setVisible(true);
    }
    const hide = ()=>{
      setVisible(false);
    }
    const history = useHistory();
    const navigateTo = (page) => {
      history.push(page);
    };
    const token = localStorage.getItem('token');
    const logOut = ()=> {
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
          default:
        }
      }}>
        <Menu.Item key="settings">
          Настройки
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
              <div className="col-4 col-md-3 text-center">
                <a className="blog-header-logo" href="/"><img src={img} width={"100%"}/></a>
              </div>
              <div class="col-6 d-md-flex justify-content-end align-items-center">
                {token == null ?
                  <>
                  <div className="d-none d-md-block"> 
                    <Button  onClick={() => navigateTo('/register')} className="mr-2">Регистрация</Button>
                    <Button  onClick={() => navigateTo('/login')} className="mr-2">Войти</Button> 
                  </div>
                  <div class="d-xs-block d-md-none text-right">
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
                <div class="d-xs-block d-md-none text-right">
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
                          <Menu.Item onClick={() => navigateTo('/products/create')} key="1" icon={<FileAddOutlined />}>
                          + Добавить рекламу
                          </Menu.Item>
                          <Menu.Item onClick={() => navigateTo('/profile')} key="2" icon={<DesktopOutlined />}>
                            Личный кабинет
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
                <div className="d-none d-md-block">
                  <Space>
                    <Dropdown.Button className="" overlay={menu}>
                      <Link to="/profile">Личный кабинет</Link>
                    </Dropdown.Button>
                    <Button 
                      className=""
                      type='primary'
                      onClick={() => navigateTo('/products/create')} 
                      disableElevation
                      style={{backgroundColor:'#000fa6'}}
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
          <div className="nav-scroller mb-2 rounded px-2 py-1"  style={{backgroundColor:'#000fa6'}}>
            <nav className="nav d-flex justify-content-between">
              <a className="p-2 text-white" href="/about-us">О нас</a>
              <a className="p-2 text-white" href="products">Объявления</a>
              <a className="p-2 text-white" href="/articles">Статьи</a>
              <a className="p-2 text-white" href="/contacts">Контакты</a>
              <a className="p-2 text-white" href="/ad-manage">Рекламодателям</a>
            </nav>
          </div>
        </div> 
        </div>

      </div>
    );
}

export default Navbar;