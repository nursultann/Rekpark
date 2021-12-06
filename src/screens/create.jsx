import React, { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { Select, MenuItem, InputLabel } from '@mui/material';
import { FormControl } from "@mui/material";

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
        <div className="col-md-8 py-5">
          <FormControl variant="filled">
            <div class="form-row">
              <div class="form-group col-md-6">
                <InputLabel id="demo-simple-select-filled-label">Age</InputLabel>
                <Select labelId="demo-simple-select-filled-label" className="w-100">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
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
            <h3>Настраиваемые поля</h3>
            <button type="submit" class="btn btn-outline-primary">Опубликовать</button>
          </FormControl> 
        </div>
      </div>     
    );
}


export default CreateAd;