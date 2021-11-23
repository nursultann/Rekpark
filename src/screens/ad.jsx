import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

class Ad extends React.Component {
    render() {
        return(
            <div>
                <Navbar />
                
                    <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-3">
                                <img src="https://www.bazar.kg/build/images/no-avatar.451f5561.svg" style={{borderRadius:"50%",width:"50px", height:"50px"}}/>
                                <label className="ml-2">Пользователь</label>
                                </div>
                                <div className="col-md-4 mt-2">
                                <hr className="d-block d-md-none" />    
                                <label>Поделиться</label>    
                                <div class="ya-share2" data-curtain data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,whatsapp"></div>
                                </div>
                                <div className="col-md-6 mt-2">
                                <hr className="d-block d-md-none" /> 
                                <a class="btn btn-primary" data-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1">Телефон</a>
                                    <div class="collapse multi-collapse" id="multiCollapseExample1">
                                        <div class="card card-body">
                                        <a href="tel:+78142332211">+7(814)-233-22-11</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <hr/>
                    </div>
                    
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-9">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="row">
                                            <div className="col-md-8" style={{fontSize:"13px",whiteSpace:"normal"}}>
                                                <h5>Объявление 1</h5>
                                                <label>Тип предложения</label><br/>
                                                <label>Тип рекламы</label><br/>
                                                <label>Тип недвижимости</label><br/>
                                                <label>Количество комнат</label><br/>
                                                <label>Этаж</label><br/>
                                                <label>Состояние</label><br/>
                                                <label>Канализация</label><br/>
                                                <label>Питьевая вода</label><br/>
                                                <label>Электричество</label><br/>
                                                <label>Газ</label><br/>
                                                <label>Интернет</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div class="fotorama"  class="fotorama" data-nav="thumbs" data-maxwith="700" data-maxheight="100%" data-transitions="crossfade" data-allowfullscreen="native">
                                            <img src="http://fotorama.ucoz.org/images/1.jpg"/>
                                            <img src="http://fotorama.ucoz.org/images/6.jpg"/>
                                            <img src="http://fotorama.ucoz.org/images/8.jpg" alt=""/>
                                            <img src="http://fotorama.ucoz.org/images/1.jpg"/>
                                            <img src="http://fotorama.ucoz.org/images/6.jpg"/>
                                            <img src="http://fotorama.ucoz.org/images/8.jpg" alt=""/>
                                            <img src="http://fotorama.ucoz.org/images/1.jpg"/>
                                            <img src="http://fotorama.ucoz.org/images/6.jpg"/>
                                            <img src="http://fotorama.ucoz.org/images/8.jpg" alt=""/>
                                         </div>
                                    </div>
                                </div>
                                <hr/>
                                <div className="col-md-12">
                                <h5>Описание</h5>
                                <p>The href attribute requires a valid value to be accessible. Provide a valid, navigable address as the href value. If you cannot provide a valid href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md  jsx-a11y/anchor-is-valid</p>
                                </div>
                            </div>
                            <div className="col-md-3">

                            </div>
                        </div>
                    </div>
                    <Footer/>  
            </div>
        );
    }
}
export default Ad;