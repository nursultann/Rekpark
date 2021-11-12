import React from "react";
import Navbar from "./navbar";

class Signin extends React.Component{
render(){
    return(
        <div>
            <Navbar/>
            <div className="row">
                <div className="col-md-8">
                <div className="col-md-8 px-3 py-3"> 
                <h5>Регистрация</h5>   
                <form>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email или телефон</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        <small id="emailHelp" class="form-text text-muted">Мы никогда не делимся вашими данными</small>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Пароль</label>
                        <input type="password" class="form-control" id="password1"/>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Повторить пароль</label>
                        <input type="password" class="form-control" id="password2"/>
                        <label id="passcheck"></label>
                    </div>
                    <div class="form-group form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
                        <label class="form-check-label" for="exampleCheck1">Запомнить</label>
                    </div>
                    <button type="submit" class="btn btn-primary">Зарегистрироваться</button>
                    </form>
                </div>    
                </div>
                <div className="col-md-4">

                </div>
            </div>
        </div>
    );
}

}

export default Signin;