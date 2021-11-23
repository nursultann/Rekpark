import React from "react";
import {Link} from 'react-router-dom';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
class Profile extends React.Component{
    render() {
        return(
            <div>
            <Navbar/>
            <div className="row px-4">
                <div className="col-md-4 border">
                      <div className="col-md-12 py-2">
                            <div className="row">
                                <div className="col-6">
                                    <img src="https://funpick.ru/wp-content/uploads/2018/02/ava-vats-1.jpg" height="90" width="90" style={{borderRadius:"%50"}}/>
                                </div>
                                <div className="col-6 py-2">
                                    <p style={{padding:"0px",margin:"0px"}}>Пользователь</p>
                                    <p style={{padding:"0px",margin:"0px"}}>+996 555 555 555</p>
                                </div>
                            </div> 
                      </div>
                      <hr/>
                      <div className="col-md-12">
                          <label>Баланс:</label>0 сом
                          <br/>
                          <label>Лицевой счет:</label>
                          <br/>
                          <Link to="/wallet">Пополнить</Link>
                      </div>
                      <hr/>
                </div>
                <div className="col-md-8">
                        <nav>
                            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                <a class="nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-ad" role="tab" aria-controls="nav-home" aria-selected="true">Мои объявления</a>
                                <a class="nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-active" role="tab" aria-controls="nav-profile" aria-selected="false">Активные</a>
                                <a class="nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-notactive" role="tab" aria-controls="nav-contact" aria-selected="false">Неактивные</a>
                            </div>
                        </nav>
                        <div class="tab-content" id="nav-tabContent">
                            <div class="tab-pane fade show active" id="nav-ad" role="tabpanel" aria-labelledby="nav-home-tab">
                                <div className="row">
                                    <div className="col-md-4 mt-2 mb-2">
                                        <div class="card">
                                        <img src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg" class="card-img-top" alt="..."/>
                                        <div class="card-body">
                                            <h5 class="card-title">З</h5>
                                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                            <a href="#" class="badge badge-primary">Редактировать</a>
                                            <a href="#" class="badge badge-primary">Деактивировать</a>
                                            <a href="#" class="badge badge-primary">Поднять</a>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="nav-active" role="tabpanel" aria-labelledby="nav-profile-tab">
                            <div className="row">
                                    <div className="col-md-4 mt-2 mb-2">
                                        <div class="card">
                                        <img src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg" class="card-img-top" alt="..."/>
                                        <div class="card-body">
                                            <h5 class="card-title">З</h5>
                                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                            <a href="#" class="btn btn-primary">Редактировать</a>
                                            <a href="#" class="btn btn-primary mt-2">Деактивировать</a>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="nav-notactive" role="tabpanel" aria-labelledby="nav-contact-tab">...</div>
                        </div>
                </div>
            </div>
            <Footer/>
            </div>
        );
    }
}
export default Profile;