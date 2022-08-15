import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import '../../dist/css/custom_card.css';
import { setBussinessPlanDetails } from "../../redux/actions/bussiness_actions";
import { Button, message, Modal } from 'antd';
import { setBussinessPlan } from "../../api/bussiness";
import { userDetails } from "../../api/user";
const BussinessItem = ({ product,time }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { user } = useSelector((state) => state.user);
    const [period, setPeriod] = useState();
    const [itemPrice, setItemPrice] = useState(0);
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [sites, setSite] = useState();
    // const dispatch = useDispatch();
    // const history = useHistory();
    // const confirmBussinessAccount = async () => {
    //     const params = {
    //         plan_id: product.id,
    //         period: period,
    //         description: product.description,
    //         emails: email,
    //         sites: sites,
    //         phones: phone
    //     }
    //     console.log(params);
    //     // dispatch(setBussinessPlanDetails(params));
    //     // history.push(`/bussiness_plan/${product.id}`);
    //     const account = await setBussinessPlan(params);
    //     if (account != null) {
    //         console.log(account);
    //         message.success("Success!");
    //     } else {
    //         console.log(account);
    //     }
    // };
    // const showModal = () => {
    //     setIsModalVisible(true);
    // }
    // const handleOk = () => {
    //     setIsModalVisible(false);
    // };

    // const handleCancel = () => {
    //     setIsModalVisible(false);
    // };
    var interval = null;
    if (product.interval == "month") {
        interval = "Месяц";
    } else if (product.interval == "week") {
        interval = "Неделю";
    } else if (product.interval == "year") {
        interval = "Год"
    }
    return (
        <>
            {product.period == time ?
            <>
            {product.price}
            </>
            :
            <></>

            }   
        </>
    );
};

export default BussinessItem;