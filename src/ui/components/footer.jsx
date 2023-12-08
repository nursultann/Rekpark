import React from "react";
import MobileBar from "./mobile_bar";
// import logo from '../../';
const Footer = () => {
  return (
    <footer>
      <div className="container-fluid text-white p-4 footer d-none d-lg-block">
        <div className="container">
          <div className="row mb-5">
            <div className="col-md-4">
              <a href="/" className="footer-site-logo"><img src={''} alt="" width={'200px'} /></a>
              <p>Сайт объявлений Кыргызстана</p>
            </div>
            <div className="col-5 text-white">
              <div className="col-12 d-flex justify-content-center text-center">
                <div className="col-4 ml-auto">
                  <a className="text-white" href="#">Для бизнеса</a>
                </div>
                <div className="col-4 ml-auto">
                  <a className="text-white" href="#">О проекте</a>
                </div>
                <div className="col-4 ml-auto">
                  <a className="text-white" href="#">Помощь</a>
                </div>
              </div>
              <div className="row pt-5">
                <div className="col-md-12 text-center">
                    <a className="text-white" href="/agreement">Пользовательское соглашение</a>
                    <a className="ml-4" href="/about">О сайте</a>
                    <a className="ml-4" href="/">Объявления</a>
                </div>
                <div className="col-md-12 text-center">
                    <a href="#"><span className="icon-twitter"></span></a>
                    <a href="#"><span className="icon-instagram"></span></a>
                    <a href="#"><span className="icon-facebook"></span></a>
                    <a href="#"><span className="icon-pinterest"></span></a>
                </div>
              </div>
              <div className="row pt-5">
                <div className="col-md-12 text-center">
                  <p><small>Все права защищены</small></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileBar />
    </footer>
  );
}

export default Footer;
{/*  */ }