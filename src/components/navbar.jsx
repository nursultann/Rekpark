import img from '../img/logo.png';
import top from '../img/top.png';
import React from "react";
import {Link} from "react-router-dom";

class Navbar extends React.Component{
    render(){
       return(
           <div>
               <div class="container-fluid">
  <div>            
  <header class="blog-header py-3">
    <div class="row flex-nowrap justify-content-between align-items-center">
      <div class="col-4 pt-1 sm-px-2 px-3">
        <a class="badge badge-danger px-2 py-2" href="/products/create">Добавить рекламу + </a>
      </div>
      <div class="col-4 col-md-3 text-center">
        <a class="blog-header-logo text-success" href="/"><img src={img} width="100%"/></a>
      </div>
      <div class="col-4 d-md-flex justify-content-end align-items-center">
        <Link class="badge badge-sm badge-primary px-2 py-2 mr-2" to="/register">Регистрация</Link>
        <Link class="badge badge-sm badge-primary px-2 py-2" to="/login">Войти</Link>
      </div>
    </div>
  </header>
  <div class="nav-scroller py-3 mb-2">
    <nav class="nav d-flex justify-content-between">
      <a class="p-2 badge badge-danger" href="/about-us">О нас</a>
      <a class="p-2 badge badge-danger" href="products">Объявления</a>
      <a class="p-2 badge badge-danger" href="/articles">Статьи</a>
      <a class="p-2 badge badge-danger" href="/contacts">Контакты</a>
      <a class="p-2 badge badge-danger" href="/ad-manage">Рекламодателям</a>
    </nav>
  </div>
</div>
  <hr/>
  
</div>

           </div>
       );
    }
}
export default Navbar;