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
        <a class="text-primary" href="/products/create">Добавить рекламу + </a>
      </div>
      <div class="col-4 text-center">
        <a class="blog-header-logo text-success" href="/"></a>
      </div>
      <div class="col-4 d-md-flex justify-content-end align-items-center">
        <Link class="btn btn-sm btn-primary mr-2" to="/register">Регистрация</Link>
        <Link class="btn btn-sm btn-primary" to="/login">Войти</Link>
      </div>
    </div>
  </header>
  <div class="nav-scroller py-1 mb-2">
    <nav class="nav d-flex justify-content-between">
      <a class="p-2 text-primary" href="/about-us">О нас</a>
      <a class="p-2 text-primary" href="products">Объявления</a>
      <a class="p-2 text-primary" href="/articles">Статьи</a>
      <a class="p-2 text-primary" href="/contacts">Контакты</a>
      <a class="p-2 text-primary" href="/ad-manage">Рекламодателям</a>
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