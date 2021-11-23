import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

class Login extends React.Component{
render(){
    return(
        <div>
            <Navbar/>
            <div className="row">
                <div className="col-md-12 d-flex justify-content-center">
                <div className="col-md-6 px-3 py-3 border my-3"> 
                <h5 className="text-center">Войти</h5>
                <hr/>   
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
                    <div class="form-group form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
                        <label class="form-check-label" for="exampleCheck1">Запомнить</label>
                    </div>
                    <button type="submit" class="btn btn-primary col-md-12">Войти</button>
                    </form>
                </div>    
                </div>
            </div>
            <Footer/>
        </div>
    );
}

}

export default Login;