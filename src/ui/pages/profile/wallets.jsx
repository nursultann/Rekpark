import React, { useState } from 'react';
import { Card, Modal } from 'antd';
import { depositAmount } from "../../../api/user";
import { useUserStore } from '../../../store/user_store';

import bankCard from '../../../dist/icons/bank-card.svg';
import wallet from '../../../dist/icons/electronic-card.svg';

const WalletsPage = () => {
    const user = useUserStore(state => state.user);

    const [amount, setAmount] = useState(0);
    const [isModal, setModal] = useState(false);
    const [depositType, setDepositType] = useState(null);

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


    return (
        <>
            <div className='flex flex-col gap-[40px] mt-[60px]'>
                <div className='flex flex-row gap-[30px] items-center'>
                    <div className=' '>
                        <img className='rounded-full object-cover w-[120px] h-[120px]' src={user.image} alt="" />
                    </div>

                    <div className="">
                        <label>Имя пользователя: {user.name}</label><br />
                        <label>Пользователь: +{user.phone}</label><br />
                        <label>Баланс: {user.balance} сом</label>
                    </div>
                </div>


                <div className='flex flex-col gap-8'>
                    <p className='text-xl font-semibold'>Выберите способ оплаты</p>

                    <div className='flex flex-row md:flex-row sm:flex-col gap-5'>
                        <div className='max-w-[450px] w-full'>
                            <div
                                style={{
                                    height: 150,
                                    borderRadius: 13
                                }}
                                className='shadow py-5 px-4 d-flex justify-content-center align-items-center bg-gradient-to-t from-cyan-400 to-blue-400 rounded-[20px] backdrop-blur-[10px] cursor-pointer'
                                onClick={() => { openModal('bankcard') }}
                            >
                                <h6 className='text-center text-white flex flex-row gap-4 text-2xl font-semibold items-center'>
                                    <img src={bankCard} alt="" className='w-[50px] h-[50px]' />
                                    Банковской картой
                                </h6>
                            </div>
                        </div>
                        <div className='max-w-[450px] w-full'>
                            <div
                                style={{
                                    height: 150,
                                    borderRadius: 13
                                }}
                                className='col-12 shadow py-5 px-4 d-flex justify-content-center align-items-center bg-gradient-to-tr from-blue-500 to-fuchsia-400 rounded-[20px] backdrop-blur-[10px] cursor-pointer'
                                onClick={() => { openModal('wallet') }}
                            >
                                <h6 className='text-center text-white flex flex-row gap-4 text-2xl font-semibold items-center'>
                                    <img src={wallet} alt="" className='w-[50px] h-[50px]' />
                                    Электронные кошельки
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>

                <div></div>
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