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
      <div class="col-4 pt-1">
        <a class="text-muted" href="/ad add">Добавить рекламу + </a>
      </div>
      <div class="col-4 text-center">
        <a class="blog-header-logo text-dark" href="/">Ош Парк</a>
      </div>
      <div class="col-4 d-md-flex justify-content-end align-items-center">
        <Link class="btn btn-sm btn-outline-secondary" to="/signin">Регистрация</Link>
        <Link class="btn btn-sm btn-outline-secondary" to="/login">Войти</Link>
      </div>
    </div>
  </header>
  <div class="nav-scroller py-1 mb-2">
    <nav class="nav d-flex justify-content-between">
      <a class="p-2 text-muted" href="/about-us">О нас</a>
      <a class="p-2 text-muted" href="/ads">Объявления</a>
      <a class="p-2 text-muted" href="/articles">Статьи</a>
      <a class="p-2 text-muted" href="/contacts">Контакты</a>
      <a class="p-2 text-muted" href="/ad-manage">Рекламодателям</a>
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