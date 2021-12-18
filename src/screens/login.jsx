import React, {useState} from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { login } from "../api/user";

const Sign  = () => {
    const [phoneNumber, setLogin] = useState();
    const [password,setPassword]=useState();
    const signIn = async ()=>{
        if (password === "" || phoneNumber.length < 9) return;
        login(phoneNumber, password, onLoginSuccess, onLoginError);
    }

    const onLoginSuccess = (data) => {
        localStorage.setItem('token', data.api_token);
        window.location.href = "/profile";
    };

    const onLoginError = (data) => {
        console.log('error', data);
        alert("Логин или пароль введен неверно!");
    };
    
    return(
        <div>
            <Navbar/>
            <div className="row">
                <div className="col-md-12 d-flex justify-content-center">
                <div className="col-md-5 px-3 py-3 border my-3"> 
                <h5 className="text-center">Войти</h5>
                <hr/>   
                    <div class="form-group">
                        <label for="exampleInputEmail1">Телефон</label>
                        <input type="number" class="form-control" 
                        id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => {setLogin(e.target.value)}}/>
                        <small id="emailHelp" class="form-text text-muted">Мы никогда не делимся вашими данными</small>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1" >Пароль</label>
                        <input type="password" onChange={(e)=> {setPassword(e.target.value)}} class="form-control" id="password1"/>
                    </div>
                    <button class="btn btn-outline-primary col-md-12" onClick={signIn}>Войти</button>
                </div>    
                </div>
            </div>
            <Footer/>
        </div>
    );
}


export default Sign;