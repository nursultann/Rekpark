import img from '../img/logo.png';
import top from '../img/top.png';
import React from "react";
import {Link, useHistory } from "react-router-dom";
import { Button } from 'antd';

const Navbar = () => {
    
    const history = useHistory();

    const navigateTo = (page) => {
      history.push(page);
    };

    return (
      <div>
        <div className="container-fluid">
          <div>            
          <header className="blog-header py-3">
            <div className="row flex-nowrap justify-content-between align-items-center">
              <div className="col-4 col-md-3 text-center">
                <a className="blog-header-logo text-success" href="/"><img src={img} width="100%"/></a>
              </div>
              <div className="col-6 d-md-flex justify-content-end align-items-center">
                <Button onClick={() => navigateTo('/register')} classNameName="mr-2">Регистрация</Button>
                <Button onClick={() => navigateTo('/login')} classNameName="mr-2">Войти</Button>
                <Button onClick={() => navigateTo('/products/create')} type="primary">Добавить рекламу +</Button>
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