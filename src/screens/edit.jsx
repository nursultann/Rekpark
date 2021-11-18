import React, { Component } from "react";
import Navbar from "../components/navbar";

class EditAd extends Component {
    render() {
        return(
            <div>
            <Navbar/>
                <div className="col-md-8">
                <form>
                <div class="form-row">
                <div class="form-group col-md-6">
                    <label for="inputPassword4">Тип объявления</label>
                    <select className="form-control">
                        <option>Недвижимость</option>
                        <option>Авто</option>
                        <option>Услуги</option>
                        <option>Работа</option>
                    </select>
                    </div>
                    <div class="form-group col-md-6">
                    <label for="inputEmail4">Тип сделки</label>
                    <select className="form-control">
                        <option>Продажа</option>
                        <option>Аренда</option>
                        <option>Куплю</option>
                        <option>Сниму</option>
                    </select>
                    </div>
                    <div class="form-group col-md-6">
                    <label for="inputPassword4">Город</label>
                    <select className="form-control">
                        <option></option>
                        <option></option>
                    </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputAddress">Заголовок объявления</label>
                    <input type="text" class="form-control" id="inputAddress" placeholder="Заголовок объявления"/>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                    <label for="inputCity">Цена</label>
                    <input type="number" class="form-control" id="inputCity"/>
                    </div>
                    <div class="form-group col-md-4">
                    <label for="inputState">Валюта</label>
                    <select id="inputState" class="form-control">
                        <option selected>сом</option>
                        <option>$</option>
                    </select>
                    </div>
                </div>
                <h3>Настраиваемые поля</h3>
                
                <button type="submit" class="btn btn-primary">Опубликовать</button>
                </form> 
                                </div>
            </div>
        );
    }
}

export default EditAd;