import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../../../api";
import { useNavigate } from "react-router-dom";
import { Form, notification } from "antd";
import { setUser } from "../../../redux/actions/user_actions";
import ProductFields from "./contents/product_fields";
import { useEffectOnce } from "react-use";

const CreateProductPage = () => {
    const history = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const fetchUserDetails = async () => {
        const userDetails = await api.userDetails();
        if (userDetails != null) {
            dispatch(setUser(userDetails));
        }
    };
    useEffectOnce(() => {
        fetchUserDetails();
    });
    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };
    return (
        <div>
            <div className="w-full p-3 mt-[70px]">
                <div className="flex flex-col justify-center items-center mb-[80px]">
                    <label style={{ fontSize: 25 }}>Создать новое объявление</label>
                    <p>Поля, обозначенные <span className="text-danger">*</span> - обязательные. После создания
                        объявления Вы можете редактировать и удалять его в Личном кабинете.</p>
                </div>
                <div className="col-xl-9 col-md-12 col-sm-12 col-xs-12 mx-auto">
                    <ProductFields
                        loading={loading}
                        onSend={async (data) => {
                            setLoading(true);
                            const response = await api.createProduct(data);
                            console.log(response);
                            if (response != null && response.success) {
                                openNotification('success', 'Объявление отправлено на модерацию!', null);
                                history(`/`);
                            } else {
                                openNotification('error', 'Не удалось опубликовать!', null);
                            }
                            setLoading(false);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
export default CreateProductPage;