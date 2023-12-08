import React, { useState } from 'react';
import Footer from '../../components/footer';
import Navbar from '../../components/navbar';
import { Card, Modal } from 'antd';
import { depositAmount, userDetails } from "../../../api/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/actions/user_actions";
import Skeleton from '@mui/material/Skeleton';

const { Meta } = Card;

const WalletsPage = () => {
    if (!localStorage.getItem('token')) {
        window.location.href = '/';
    }

    const [amount, setAmount] = useState(0);
    const [isModal, setModal] = useState(false);
    const [depositType, setDepositType] = useState(null);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const fetchUserDetails = async () => {
        const user = await userDetails();
        if (user != null) {
            dispatch(setUser(user));
            console.log('user', user);
        }
    };

    const closeModal = () => {
        setModal(false);
        setAmount(0);
    }

    const deposit = async () => {
        if (amount > 0 || amount != '') {
            if (depositType == 'bankcard') {
                const data = await depositAmount({
                    amount: amount,
                    success_url: 'https://rekpark.kg/complete',
                    payment_method: depositType
                })
                // console.log('data',data);
                if (data.redirect_url != null) {
                    window.location.href = data.redirect_url;
                }
            }
            if (depositType == 'wallet') {
                const data = await depositAmount({
                    amount: amount,
                    success_url: 'https://rekpark.kg/complete',
                    payment_method: depositType
                })
                // console.log('data',data);
                if (data.redirect_url != null) {
                    window.location.href = data.redirect_url;
                }
            }
        }
    }

    const openModal = (type) => {
        if (type == 'bankcard') {
            setModal(true);
            setDepositType(type);
        }
        if (type == 'wallet') {
            setModal(true);
            setDepositType(type);
        }
    }

    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <>
            <div className='row py-3 px-3'>
                <div className='col-md-2 '>
                    <img className='rounded-circle' src={user.media[0].original_url} width={120} height={120} alt="" />
                </div>
                <div className="col-md-10 py-3">
                    <label>Имя пользователя: {user.name}</label><br />
                    <label>Пользователь: +{user.phone}</label><br />
                    <label>Баланс: {user.balance} сом</label>
                </div>

                <div className='col-md-12 mt-3'>
                    <h5>Выберите способ оплаты</h5>
                    <div className='row'>
                        <div className='col-md-5'>
                            <div style={{
                                backgroundImage: 'url(https://t4.ftcdn.net/jpg/02/64/69/07/360_F_264690777_OanWQuVyQJsG6ntNOwSykFaeMlUM1W3G.jpg)',
                                backgroundSize: 'cover',
                                height: 150,
                                borderRadius: 13
                            }}
                                className='col-12 shadow py-5 px-4 d-flex justify-content-center align-items-center'>
                                <h6 className='text-center text-white'><a onClick={() => { openModal('bankcard') }}><i className="fa-solid fa-money-check-dollar"></i> Банковской картой</a></h6>
                            </div>
                        </div>
                        <div className='col-md-5'>
                            <div
                                style={{
                                    backgroundImage: 'url(https://img.freepik.com/free-photo/vivid-blurred-colorful-wallpaper-background_58702-2422.jpg)',
                                    backgroundSize: 'cover',
                                    height: 150,
                                    borderRadius: 13
                                }}
                                className='col-12 shadow py-5 px-4 d-flex justify-content-center align-items-center'>
                                <h6 className='text-center text-white'><a onClick={() => { openModal('wallet') }}><i className="fa-solid fa-money-check"></i> Электронные кошельки</a></h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="Пополнение счета"
                visible={isModal}
                onCancel={closeModal}
                okText="пополнить сумму"
                cancelText='отмена операции'
                onOk={deposit}>
                <div className='col-12'>
                    <div className='alert alert-primary'>
                        Введите пополнения сумму пополнения
                    </div>
                    <input
                        value={amount}
                        type={'number'}
                        placeholder='сумма пополнения'
                        className='form-control'
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
            </Modal>
        </>
    );
}

export default WalletsPage; 