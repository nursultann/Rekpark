import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import moment from 'moment';
import { notification, Modal, message } from "antd";
import {
    activate,
    deactivate,
    productMakeAutoUp,
    productMakeColored,
    productMakeUrgent,
    productMakeVip
} from "../../../api/product";
import { deleteAd } from "../../../api/user";
import { setProductDetails } from "../../../redux/actions/product_actions";
import { AppImage } from "../custom_components";
import '../../../dist/css/custom_card.css';

const ProductItem = ({ product }) => {
    const dispatch = useDispatch();
    const { productsPlans } = useSelector((state) => state.plans);
    const { user } = useSelector((state) => state.user);
    //modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [subPlans, setSubPlans] = useState();
    const [plan, setPlan] = useState(null);
    const [modalImage, setModalImage] = useState();
    const [productId, setProductId] = useState();
    const [interval, setInterval] = useState(null);
    const [periodId, setPeriodId] = useState();
    const [period, setPeriod] = useState(0);
    const [itemPrice, setItemPrice] = useState(0);
    const [color, setColor] = useState(null);
    const history = useNavigate();
    const navigateToProductDetailsPage = (product) => {
        dispatch(setProductDetails(product));
        history(`products/${product.id}`);
    };
    const subscriptionPlans = async () => {
        const plans = productsPlans;
        if (plans != null) {
            setSubPlans(plans);
        }
        // console.log('plans',subPlans);
    }
    const baseStyle = { height: 'auto' };
    if (typeof product.features === 'object' && !Array.isArray(product.features)) {
        if (product.features.color !== null) {
            baseStyle.backgroundColor = product.features.color;
        }
    }
    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };
    const removeAd = async () => {
        deleteAd(product.id);
        openNotification('success', 'Успешно удалено!', null);
        function reload() {
            window.location.href = "/profile";
        }
        setTimeout(reload, 1000);
    }
    const deactivateAd = async () => {
        deactivate(product.id);
        openNotification('success', 'Успешно деактивировано!', null);
        function reload() {
            window.location.href = "/profile";
        }
        setTimeout(reload, 1000);
    }
    const activateAd = async () => {
        activate(product.id);
        openNotification('success', 'Успешно активировано!', null);
        function reload() {
            window.location.href = "/profile";
        }
        setTimeout(reload, 1000);
    }
    //subscriptions
    const makeSubscriptionModal = async (id, name) => {
        var index = subPlans.findIndex(obj => obj.name == name);
        setPlan(subPlans[index]);
        console.log(plan);
        setProductId(id);
        if (plan != null) {
            if (plan.interval == 'day') {
                setInterval("день");
            } else if (plan.interval == 'week') {
                setInterval("неделя");
            } else if (plan.interval == 'month') {
                setInterval('месяц');
            }
            setIsModalVisible(true);
        }
    }
    const buyServiceBySelectedPeriod = async (balance) => {
        if (balance > itemPrice) {
            const params = {
                'period_id': periodId
            }
            console.log(params);
            const vip = await productMakeVip(productId, params);
            if (vip != null) {
                message.success("Успешно подключили услугу!");
                setIsModalVisible(false);
            } else {
                message.warning("Услуга уже подключена!");
                setIsModalVisible(false);
            }
        } else {
            message.error("Недостаточно средств чтобы подключить услугу!")
        }
    };
    const buyService = async (balance, plan) => {
        if (plan == "vip") {
            if (balance > itemPrice) {
                const params = {
                    'period': period
                }
                console.log(params);
                const vip = await productMakeVip(productId, params);
                if (vip != null) {
                    message.success("Успешно подключили услугу!");
                    setIsModalVisible(false);
                } else {
                    message.warning("Услуга уже подключена!");
                    setIsModalVisible(false);
                }
                // if (vip.status == 200) {
                //     message.success("Успешно подключили услугу!")
                // } else{
                //     message.info("Услуга уже подключена!")
                // }
            } else {
                message.error("Недостаточно средств чтобы подключить услугу!")
            }
        } else if (plan == "urgent") {
            if (balance > itemPrice) {
                const params = {
                    'period': period
                }
                console.log(params);
                const vip = await productMakeUrgent(productId, params);
                console.log(vip);
                if (vip != null) {
                    message.success("Успешно подключили услугу!");
                    setIsModalVisible(false);
                } else {
                    message.warning("Услуга уже подключена!");
                    setIsModalVisible(false);
                }
            } else {
                message.error("Недостаточно средств чтобы подключить услугу!")
            }
        } else if (plan == "colored") {
            console.log('balance', balance)

            if (balance > itemPrice) {
                if (color != null) {
                    const params = {
                        'period': period,
                        'color': color
                    }
                    console.log(params);
                    const vip = await productMakeColored(productId, params);
                    console.log(vip);
                    if (vip != null) {
                        message.success("Успешно подключили услугу!");
                        setIsModalVisible(false);
                    } else {
                        message.warning("Услуга уже подключена!");
                        setIsModalVisible(false);
                    }
                } else {
                    message.error("Не выбрали цвет!");
                }
            } else {
                message.error("Недостаточно средств чтобы подключить услугу!")
            }
        } else if (plan == "make_auto") {
            if (balance > itemPrice) {
                const params = {
                    'period': period
                }
                console.log(params);
                const vip = await productMakeAutoUp(productId, params);
                console.log(vip);
                if (vip != null) {
                    message.success("Успешно подключили услугу!");
                    setIsModalVisible(false);
                } else {
                    message.warning("Услуга уже подключена!");
                    setIsModalVisible(false);
                }
            } else {
                message.error("Недостаточно средств чтобы подключить услугу!")
            }
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    var time = moment(product.created_at, 'YYYYMMDD, h:mm:ss a');
    moment.locale('ru');
    console.log('product', product);
    var update = time.fromNow();
    const image = product.media?.length > 0
        ? product.media[0].original_url
        : '';
    useEffect(() => {
        subscriptionPlans();
    }, [])
    return (
        <>
            <div className="col-xl-12 bg-white border rounded-lg shadow-sm" style={{ ...baseStyle }}>
                <div className="row">
                    <div className="col-6">
                        <div className="row">
                            <div className="col-md-12 px-1 py-1" style={{ height: 150 }}>
                                <a onClick={() => navigateToProductDetailsPage(product)}>
                                <AppImage height={150} width="100%" src={image} className="card-img-top" style={{ objectFit: "cover" }} />
                                {product.is_vip && product.is_urgent ?
                                    <>
                                        <div style={{ position: "absolute", left: "10px", top: "10px", }}><span style={{ fontWeight: 400, backgroundColor: "#ff3b30" }} className="badge badge-danger p-1"><i className="fa-solid fa-crown"></i> VIP</span></div>
                                        <div style={{ position: "absolute", left: "52px", top: "10px", }}><span style={{ fontWeight: 400, backgroundColor: "#fecb00" }} className="badge badge-warning p-1"><i className="fa-solid fa-bolt"></i> Срочно</span></div>
                                    </>
                                    : <></>}
                                {product.is_urgent && product.is_vip == false ?
                                    <div style={{ position: "absolute", left: "10px", top: "10px", }}><span style={{ fontWeight: 400, backgroundColor: "#fecb00" }} className="badge badge-warning p-1"><i className="fa-solid fa-bolt"></i> Срочно</span></div>
                                    : <></>}
                                {product.is_vip && product.is_urgent == false ?
                                    <div style={{ position: "absolute", left: "10px", top: "10px", }}><span style={{ fontWeight: 400, backgroundColor: "#ff3b30" }} className="badge badge-danger p-1"><i className="fa-solid fa-crown"></i> VIP</span></div>
                                    : <></>}
                                </a>
                            </div>
                        </div>
                        <div className="card-body p-2">
                            <div className="row">
                                <label style={{ fontSize: 14, fontWeight: 600 }} className="mb-0 px-0 col-md-12 py-1 label">{product.title}</label>
                                <p
                                    style={{
                                        display: "-webkit-box",
                                        fontSize: 13,
                                        WebkitLineClamp: "2",
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden"
                                    }}
                                    className="mb-1 text-muted">{product.description}</p>
                                <span style={{
                                    fontSize: 14, fontFamily: "", whiteSpace: "nowrap", overflow: "hidden",
                                    columnWidth: "200px", fontWeight: 600
                                }} className="mb-0 px-0 py-0">{product.price + " " + product.currency_symbol}</span>
                            </div>
                            <div className="row">
                                <label style={{
                                    fontSize: 12,
                                    display: "-webkit-box",
                                    WebkitLineClamp: "2",
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    fontWeight: '420'
                                }}
                                    className="text-secondary mt-1 px-0 py-0 col-md-12">{product.region.name},{product.city.name}</label>
                                <label className="text-muted label" style={{ fontSize: 11 }}>
                                    {update}<br />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 py-2">
                        {product.status == "active" ?
                            <div className="col-12 p-1 mb-2 bg-success rounded text-center text-white">
                                Активен
                            </div>
                            : <></>
                        }
                        {product.status == "inactive" ?
                            <div className="col-12 p-1 mb-2 bg-danger rounded text-center text-white">
                                Неактивен
                            </div>
                            : <></>
                        }
                        {product.status == "moderation" ?
                            <div className="col-12 p-1 mb-2 bg-warning rounded text-center text-white">
                                На модерации
                            </div>
                            : <></>
                        }
                        {product.status == "disabled" ?
                            <div className="col-12 p-1 mb-2 bg-secondary rounded text-center text-white">
                                Отключен
                            </div>
                            : <></>
                        }
                        <Link style={{ fontSize: 13 }} className="mt-4" to={"/products/" + product.id + "/edit"}><i className="far fa-edit text-white bg-dark p-1 rounded-circle"></i> Редактировать</Link><br />
                        <Link style={{ fontSize: 13 }} className="mt-4" onClick={removeAd}><i className="fas fa-trash-alt text-white bg-dark p-1 rounded-circle"></i> Удалить</Link><br />
                        {product.status == "active" ?
                            <>
                                <Link style={{ fontSize: 13 }} className="mt-4" onClick={deactivateAd}><i className="fas fa-ban text-white bg-dark p-1 rounded-circle"></i> Деактивировать</Link><br />
                            </>
                            :
                            <></>
                        }
                        {product.status == "inactive" ?
                            <>
                                <Link style={{ fontSize: 13 }} className="mt-4" onClick={activateAd}><i className="fas fa-plus-circle text-white bg-dark p-1 rounded-circle"></i> Активировать</Link>
                            </>
                            :
                            <>

                            </>
                        }
                        <div className="row mt-3 mt-xl-5">
                            <div className="col-12 pl-4">
                                {product.status != 'disabled' && product.status != 'inactive'
                                    && product.status != 'moderation' ?
                                    <>
                                        <span className="text-muted" style={{ fontSize: 13 }}>Платные услуги</span><br />
                                        {subPlans != null ?
                                            <>
                                                {
                                                    subPlans.map((item) =>
                                                        <div className="">
                                                            <img src={item.image} width="10" height="10" /><a className="text-dark" onClick={() => makeSubscriptionModal(product.id, item.name)}>{item.title}</a>
                                                        </div>
                                                    )
                                                }
                                            </>
                                            : <></>
                                        }
                                    </> : <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {plan != null ?
                <Modal title={
                    <>
                        <img src={plan.image} width="20" height="20" /> {plan.title}
                    </>
                }
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    // onOk = {false}
                    cancelText="Отмена"
                    footer={
                        plan.periods?.length > 0 ?
                            <>
                                <button className="my-2 btn text-white" style={{ backgroundColor: "rgb(9, 72, 130)" }} onClick={() => buyServiceBySelectedPeriod(user.balance, plan.name)}>Подключить услугу</button>
                            </>
                            :
                            <>
                                <button className="my-2 btn text-white" style={{ backgroundColor: "rgb(9, 72, 130)" }} onClick={() => buyService(user.balance, plan.name)}>Подключить услугу</button>
                            </>
                    }
                >
                    {plan != null ?
                        <>
                            <p>
                                {plan.description}
                            </p>
                            <p>
                                Промежуток: {interval != null ? interval : <></>}
                            </p>
                            <p>
                                Ваш баланс: {user.balance} сом
                            </p>
                            <hr />
                            {plan.periods?.length > 0 ?
                                <>
                                    <h6>Выберите период действия услуги:</h6>
                                    <div className="border rounded p-2">
                                        {
                                            plan.periods.map((item) =>
                                                <div className="border rounded alert alert-light p-2 my-2">
                                                    <input type="radio" value={item.id} onChange={(e) => {
                                                        if (e.target.checked)
                                                            setPeriodId(item.id)
                                                        setItemPrice(item.price)
                                                    }} name="period" />
                                                    <span className="ml-2 text-primary label">{item.price} {plan.currency}</span> ({item.period + " " + interval})
                                                </div>
                                            )
                                        }
                                    </div>
                                </>
                                :
                                <>
                                    {plan.name == "colored" ?
                                        <>
                                            <div className="">Выберите цвет для закраски
                                            </div>
                                            {/* <input type="color" onChange={(e) => { setColor(e.target.value) }} /> */}
                                            <button className="btn" style={{ backgroundColor: "#fcc7c7" }} onClick={(e) => { setColor("#fcc7c7") }}>Выбрать цвет</button>
                                            <button className="btn ml-2" style={{ backgroundColor: "#d8c7fc" }} onClick={() => { setColor("#d8c7fc") }}>Выбрать цвет</button>
                                            <button className="btn ml-2" style={{ backgroundColor: "#c7fcd6" }} onClick={() => { setColor("#c7fcd6") }}>Выбрать цвет</button>
                                            <button className="btn mt-2" style={{ backgroundColor: "#b8dcff" }} onClick={() => { setColor("#b8dcff") }}>Выбрать цвет</button>
                                            <button className="btn mt-2 ml-2" style={{ backgroundColor: "#f7ffbf" }} onClick={() => { setColor("#f7ffbf") }}>Выбрать цвет</button>
                                            <button className="btn mt-2 ml-2" style={{ backgroundColor: "#e8e8e8" }} onClick={() => { setColor("#e8e8e8") }}>Выбрать цвет</button>
                                            {color != null ?
                                                <div className="d-flex mt-2">
                                                    выбранный цвет: <div className="rounded-circle" style={{ width: 20, height: 20, backgroundColor: color }} ></div>
                                                </div>
                                                : <></>}
                                        </>
                                        : <></>
                                    }
                                    <h6 className="mt-3">Выберите период действия услуги:</h6>
                                    {plan.price * period} {plan.currency}
                                    <input defaultValue={1} type="range" className="range col-12" onChange={(e) => {
                                        setPeriod(e.target.value)
                                        setItemPrice(plan.price * period)
                                    }} /> {period} {interval != null ? interval : <></>}
                                </>
                            }
                        </>
                        :
                        <></>
                    }
                </Modal>
                : <></>
            }
        </>
    );
};

export default ProductItem;