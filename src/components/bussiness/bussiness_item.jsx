import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import '../../dist/css/custom_card.css';
import { setBussinessPlanDetails } from "../../redux/actions/bussiness_actions";
import { Button, message, Modal } from 'antd';
import { setBussinessPlan } from "../../api/bussiness";
const BussinessItem = ({ product }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { user } = useSelector((state) => state.user);
    const [period, setPeriod] = useState();
    const [itemPrice, setItemPrice] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [sites, setSite] = useState();
    // const dispatch = useDispatch();
    // const history = useHistory();
    const confirmBussinessAccount = async () => {
        const params = {
            plan_id: product.id,
            period: period,
            description: product.description,
            emails: email,
            sites: sites,
            phones: phone
        }
        console.log(params);
        // dispatch(setBussinessPlanDetails(params));
        // history.push(`/bussiness_plan/${product.id}`);
        const account = await setBussinessPlan(params);
        if (account != null) {
            console.log(account);
            message.success("Success!");
        } else {
            console.log(account);
        }
    };
    const showModal = () => {
        setIsModalVisible(true);
    }
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    var currency = 0;
    if (product.currency_id == 1) {
        currency = "$";
    } else if (product.currency_id == 2) {
        currency = "руб";
    } else if (product.currency_id == 3) {
        currency = "сом";
    }
    var interval = null;
    if (product.interval == "month") {
        interval = "Месяц";
    } else if (product.interval == "week") {
        interval = "Неделю";
    } else if (product.interval == "year") {
        interval = "Год"
    }
    return (
        <div className="col-12 col-xl-4 mt-3 mt-xl-0">
            <div class="border">
                <div class="card-body">
                    <h5 class="card-title">{product.name}</h5>
                    <hr />
                    <h6 class="card-subtitle mb-2 text-center py-4">{product.price} {currency}/ <small className="text-muted label">{interval}</small></h6>
                    <a href="#" class="btn btn-primary rounded-pill col-12 text-white" onClick={() => showModal()}>Подробнее</a>
                    {/* <hr/>
                        <div className="border p-2 rounded">
                        <span className="label"><strong>Описание</strong></span>
                        <p class="card-text label text-muted">{product.description}</p>
                        <hr/>
                        </div> */}
                </div>
            </div>
            <Modal
                title={product.name}
                visible={isModalVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <p>
                    {product.description}
                </p>
                <p>
                    Промежуток: {interval != null ? interval : <></>}
                </p>
                <p>
                    Ваш баланс: {0}
                </p>
                <h6>Выберите период действия услуги:</h6>
                {product.price * period} {product.currency}
                <p>Интервал: {interval}</p>
                <input type="range" className="col-12" onChange={(e) => {
                    setPeriod(e.target.value)
                    setItemPrice(product.price * period)
                }} />
                {period} {interval != null ? interval : <></>}
                <br />
                <div className="col-12 pt-3">
                    <input
                        type="email"
                        placeholder="E-mail"
                        className="form-control"
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                    <input
                        type="tel"
                        placeholder="Номер телефона"
                        className="form-control mt-3"
                        onChange={(e) => { setPhone(e.target.value) }}
                    />
                    <input
                        type="url"
                        placeholder="Website"
                        className="form-control mt-3"
                        onChange={(e) => { setSite(e.target.value) }}
                    />
                </div>
                <div className="col-12 text-right pt-3">
                    <button className="btn btn-primary" onClick={confirmBussinessAccount}>Подключить</button>
                </div>
            </Modal>
        </div>
    );
};

export default BussinessItem;