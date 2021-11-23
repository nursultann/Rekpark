import React, { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

const CreateAd = () => {
const [typeAd,setTypeAd] = useState();
const [dealAd,setTypeDeal]= useState();
const [region,setRegion] = useState();
const [title, setTitle] = useState();
const [city,setCity] = useState();
const [price,setPrice] = useState();
const [currency,setCurrency] = useState();
        return(
          <div>
            <Navbar/>
                <div className="col-md-8">
                <form>
  <div class="form-row">
  <div class="form-group col-md-6">
      <label for="inputPassword4">Тип объявления</label>
      <select className="form-control" onChange={(e)=>{setTypeAd(e.target.value)}}>
        <option selected disabled>Выберите тип объявления</option>
        <option>Недвижимость</option>
        <option>Авто</option>
        <option>Услуги</option>
        <option>Работа</option>
      </select>
    </div>
    <div class="form-group col-md-6">
      <label for="inputEmail4">Тип сделки</label>
      <select className="form-control" onChange={(e)=>{setTypeDeal(e.target.value)}}>
      <option selected disabled>Выберите тип сделки</option>
        <option>Продажа</option>
        <option>Аренда</option>
        <option>Куплю</option>
        <option>Сниму</option>
      </select>
    </div>
    <div class="form-group col-md-6">
      <label for="inputPassword4">Регион</label>
      <select className="form-control" onChange={(e)=>{setRegion(e.target.value)}}>
        <option selected disabled>Выберите регион</option>
        <option>Ош</option>
        <option>Бишкек</option>
      </select>
    </div>
    <div class="form-group col-md-6">
      <label for="inputPassword4">Город</label>
      <select className="form-control" onChange={(e)=>{setCity(e.target.value)}}>
        <option selected disabled>Выберите город</option>
        <option>Ош</option>
        <option>Бишкек</option>
      </select>
    </div>
  </div>
  <div class="form-group">
    <label for="inputAddress">Заголовок объявления</label>
    <input type="text" class="form-control" id="inputAddress" 
    placeholder="Заголовок объявления" onChange={(e)=>{setTitle(e.target.value)}}/>
  </div>
  <div class="form-row">
    <div class="form-group col-md-6">
      <label for="inputCity">Цена</label>
      <input type="number" class="form-control" id="inputCity" onChange={(e)=>{setPrice(e.target.value)}}/>
    </div>
    <div class="form-group col-md-4">
      <label for="inputState">Валюта</label>
      <select id="inputState" class="form-control" onChange={(e)=>{setCurrency(e.target.value)}}>
        <option selected>сом</option>
        <option>$</option>
      </select>
    </div>
  </div>
  <h3>Настраиваемые поля</h3>+
  <button type="submit" class="btn btn-primary">Опубликовать</button>
</form> 
                </div>
                </div>
                
        );
    }


export default CreateAd;