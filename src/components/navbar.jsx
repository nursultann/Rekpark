import img from '../img/logo.png';
import top from '../img/top.png';
import React from "react";
import {Link, useHistory } from "react-router-dom";
import { DownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/user_actions";
import { userDetails } from "../api/user";
import { useEffect,useState } from "react";
import { Button, Dropdown, Menu, Space, Divider } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';

const Navbar = () => {
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
                <a className="blog-header-logo text-success" href="/"><img src={img} width="100%"/></a>
              </div>
              <div class="col-6 d-md-flex justify-content-end align-items-center">
                {token == null ?
                  <> 
                    <Button onClick={() => navigateTo('/register')} className="mr-2">Регистрация</Button>
                    <Button onClick={() => navigateTo('/login')} className="mr-2">Войти</Button> 
                  </>
                : 
                  <Space>
                    <Dropdown.Button overlay={menu}>
                      <Link to="/profile">Личный кабинет</Link>
                    </Dropdown.Button>
                    <Button 
                      type='primary'
                      onClick={() => navigateTo('/products/create')} 
                      disableElevation
                    >
                      Добавить рекламу
                    </Button>
                  </Space>  
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
          <hr/>  
        </div>

      </div>
    );
}

export default Navbar;