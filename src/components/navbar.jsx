import img from '../img/logo.png';
import top from '../img/top.png';
import React from "react";
import {Link, useHistory } from "react-router-dom";
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/user_actions";
import { userDetails } from "../api/user";
import { useEffect,useState } from "react";
import { Button } from 'antd';

const Navbar = () => {
    const history = useHistory();
    const navigateTo = (page) => {
      history.push(page);
    };
    const token = localStorage.getItem('token');
    const logOut = ()=>{
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const fetchUserDetails = async () => { 
        const user = await userDetails(); 
        if(user != null){
            dispatch(setUser(user));
        }
    };    
    useEffect(() => {
        fetchUserDetails();
    }, []);
let menu = null;    
if(user != null){
  menu = (
    <Menu>
      <Menu.Item>
      <a onClick={() => navigateTo('/profile')}>Личный кабинет</a>
      </Menu.Item>
      <Menu.Item>
      <a onClick={() => navigateTo('/settings')}>Настройки</a>
      </Menu.Item>
      <Menu.Item>
      <a onClick={() => navigateTo('/wallets')}>Пополнить баланс {user.balance}сом</a>
      </Menu.Item>
      <Menu.Item danger><a onClick={logOut}>Выйти</a></Menu.Item>
    </Menu>
  );
}           
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
                <Button onClick={() => navigateTo('/register')} variant="outlined" size="small" disableElevation className="mr-2">Регистрация</Button>
                <Button onClick={() => navigateTo('/login')} variant="outlined" size="small" disableElevation className="mr-2">Войти</Button> 
                </>
                : 
                <>
                <Dropdown overlay={menu} className='mr-3'>
                  <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    Личный кабинет<DownOutlined />
                  </a>
                </Dropdown>
                <Button onClick={() => navigateTo('/products/create')} className='mt-2 mt-md-0' variant="contained" size="small" disableElevation>Добавить рекламу +</Button>
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
          <hr/>  
        </div>

      </div>
    );
}
export default Navbar;