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
import '../../../dist/css/custom_card.css';
import editCircle from '../../../dist/icons/edit-circle.svg';
import deleteCircle from '../../../dist/icons/delete-circle.svg';
import { maxSymbolEllipsis } from "../../../helpers/functions";
import ProductItem from "./product_item";
import classNames from "classnames";
import { useEffectOnce } from "react-use";
import { useUserStore } from "../../../store/user_store";

const UserProductItem = ({ product }) => {
    const dispatch = useDispatch();
    const { productsPlans } = useSelector((state) => state.plans);
    const user = useUserStore().user;

    // modal
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

    useEffectOnce(() => {
        subscriptionPlans();
    })

    const byStatus = ({
        active = () => { },
        inactive = () => { },
        moderation = () => { },
        disabled = () => { },
        orElse = () => { }
    }) => {
        switch (product.status) {
            case 'active':
                return active();
            case 'inactive':
                return inactive();
            case 'moderation':
                return moderation();
            case 'disabled':
                return disabled();
            default:
                return orElse();
        }
    }

    return (
        <>
            <div className='max-w-[540px] relative mx-auto my-0 bg-[#fff] rounded-[20px] border-solid border-2 border-[#e2e2e2] flex flex-row'>
                <div
                    className='w-[50%] overflow-hidden'
                >
                    <ProductItem
                        product={product}
                        border={false}
                    />
                </div>


                <div className="w-[50%] pt-2 pb-2 pr-2 pl-4 flex flex-col mb-2">
                    <div className={classNames(
                        "w-100 mb-3 text-center text-white py-2 rounded-xl",
                        byStatus({
                            active: () => 'bg-green-500',
                            inactive: () => 'bg-yellow-500',
                            moderation: () => 'bg-blue-500',
                            disabled: () => 'bg-red-500',
                            orElse: () => 'bg-gray-500'
                        })
                    )}>
                        {byStatus({
                            active: () => 'Активно',
                            inactive: () => 'Неактивно',
                            moderation: () => 'На модерации',
                            disabled: () => 'Отключено',
                            orElse: () => 'Неизвестно'
                        })}
                    </div>

                    <div
                        className="flex flex-col justify-between gap-2"
                    >
                        <div className='flex gap-[11.009px] items-center shrink-0 flex-nowrap relative z-[8]'>
                            <img src={editCircle} className='w-[30px] h-[30px] shrink-0 basis-auto' />

                            <span
                                className="h-[17px] shrink-0 basis-auto font-['SF_UI_Display'] text-[14.01187801361084px] font-medium leading-[16.721px] text-[#222222] relative text-left whitespace-nowrap z-10 cursor-pointer"
                                onClick={() => history(`/products/${product.id}/edit`)}
                            >
                                Редактировать
                            </span>
                        </div>

                        {byStatus({
                            active: () => (
                                subPlans?.map((item) =>
                                    <div className="flex gap-[11.009px] items-center shrink-0 flex-nowrap relative z-[8]">
                                        <img src={item.image} className='w-[30px] h-[30px] shrink-0 basis-auto' />
                                        <span
                                            className="h-[17px] shrink-0 basis-auto font-['SF_UI_Display'] text-[14.01187801361084px] font-medium leading-[16.721px] text-[#222222] relative text-left whitespace-nowrap z-10 cursor-pointer"
                                            onClick={() => makeSubscriptionModal(product.id, item.name)}
                                        >
                                            {item.title}
                                        </span>
                                    </div>
                                )
                            )
                        })}

                        {byStatus({
                            active: () => (
                                <div className='flex gap-[11.009px] items-center shrink-0 flex-nowrap relative z-[8]'>
                                    <img src={editCircle} className='w-[30px] h-[30px] shrink-0 basis-auto' />

                                    <span
                                        className="h-[17px] shrink-0 basis-auto font-['SF_UI_Display'] text-[14.01187801361084px] font-medium leading-[16.721px] text-[#222222] relative text-left whitespace-nowrap z-10"
                                        onClick={deactivateAd}
                                    >
                                        Деактивировать
                                    </span>
                                </div>
                            ),
                            inactive: () => (
                                <div className='flex gap-[11.009px] items-center shrink-0 flex-nowrap relative z-[8]'>
                                    <img src={editCircle} className='w-[30px] h-[30px] shrink-0 basis-auto' />

                                    <span
                                        className="h-[17px] shrink-0 basis-auto font-['SF_UI_Display'] text-[14.01187801361084px] font-medium leading-[16.721px] text-[#222222] relative text-left whitespace-nowrap z-10"
                                        onClick={activateAd}
                                    >
                                        Активировать
                                    </span>
                                </div>
                            )
                        })}

                        <div className='flex gap-[11.009px] items-center shrink-0 flex-nowrap relative z-[8]'>
                            <img src={deleteCircle} className='w-[30px] h-[30px] shrink-0 basis-auto' />

                            <span
                                className="h-[17px] shrink-0 basis-auto font-['SF_UI_Display'] text-[14.01187801361084px] font-medium leading-[16.721px] text-[#222222] relative text-left whitespace-nowrap z-10"
                                onClick={removeAd}
                            >
                                Удалить
                            </span>
                        </div>
                    </div>



                </div>

            </div>


            <Modal
                title={
                    <>
                        <img src={plan?.image} width="20" height="20" /> {plan?.title}
                    </>
                }
                visible={isModalVisible}
                onCancel={handleCancel}
                // onOk = {false}
                cancelText="Отмена"
                footer={
                    plan?.periods?.length > 0 ?
                        <>
                            <button
                                className="my-2 btn text-white"
                                style={{ backgroundColor: "rgb(9, 72, 130)" }}
                                onClick={() => buyServiceBySelectedPeriod(user.balance, plan.name)}
                            >
                                Подключить услугу
                            </button>
                        </>
                        :
                        <>
                            <button
                                className="my-2 btn text-white"
                                style={{ backgroundColor: "rgb(9, 72, 130)" }}
                                onClick={() => buyService(user.balance, plan.name)}
                            >
                                Подключить услугу
                            </button>
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

        </>
    );
};

export default UserProductItem;