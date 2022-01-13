import React, {useState} from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { login } from "../api/user";
import { message } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';
const key = 'updatable';
const Sign  = () => {
    const [phoneNumber, setLogin] = useState();
    const [password,setPassword]=useState();
    const signIn = async ()=>{
        if (password === "" || phoneNumber.length < 9) return;
        login(phoneNumber, password, onLoginSuccess, onLoginError);
    }

    const onLoginSuccess = (data) => {
        localStorage.setItem('token', data.api_token);
        message.loading({ content: 'Загрузка...', key });
                setTimeout(() => {
                    message.success({ content: 'Успешно!', key, duration: 2 });
                }, 1000);
        window.location.href = "/profile";
    };

    const onLoginError = (data) => {
        console.log('error', data);
        message.error('Номер или пароль указан неверно!', 10);
    };
    return(
        <div>
            <Navbar/>
                <div className="col-md-12 d-flex justify-content-center">
                    <div className="col-md-5 py-4 shadow my-3 bg-white text-center"> 
                    <label className="py-2" style={{fontSize:20}}>Вход</label>
                        <Form
                        name="basic"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 18 }}
                        initialValues={{ remember: true }}
                        autoComplete="off"
                        >
                        <Form.Item
                            label="Телефон"
                            name="phone"
                            rules={[{ required: true, message: 'Пожалуйста введите номер телефона!' }]}
                        >
                            <Input onChange={(e) => {setLogin(e.target.value)}} placeholder="996 XXX XXX XXX" />
                        </Form.Item>

                        <Form.Item
                            label="Пароль"
                            name="password"
                            rules={[{ required: true, message: 'Пожалуйста введите пароль!' }]}
                        >
                            <Input.Password onChange={(e)=> {setPassword(e.target.value)}} placeholder="Пароль" />
                        </Form.Item>
                        <Form.Item wrapperCol={{offset:0}}>
                            <Button className="col-md-7" htmlType="submit" onClick={signIn}>
                            Войти
                            </Button>
                        </Form.Item>
                        </Form>
                        <label>Вы не зарегистрированы?</label>
                        <a style={{color:"#000fa6"}} className="ml-2" href="/register">Зарегистроваться</a>
                    </div>
                </div>   
            <Footer/>
        </div>
    );
}
export default Sign;