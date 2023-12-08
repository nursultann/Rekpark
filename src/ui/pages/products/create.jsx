import React, { useState } from "react";
import Navbar from "../../components/navbar";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../../../api";
import { useNavigate } from "react-router-dom";
import { Form, notification } from "antd";
import ProductFields from "../../components/product/product_fields";
import { setUser } from "../../../redux/actions/user_actions";
import { useEffectOnce } from "react-use";

const DG = require('2gis-maps');

const CreateProductPage = () => {
    const history = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [form] = Form.useForm();

    const fetchUserDetails = async () => {
        const userDetails = await api.userDetails();
        if (userDetails != null) {
            dispatch(setUser(userDetails));
        }
    };

    useEffectOnce(() => {
        fetchUserDetails();

        let marker;
        let map = null;
        //2gis map
        DG.then(function () {
            map = DG.map('map', {
                'center': [40.500305, 72.814718],
                'zoom': 13
            });
            marker = DG.marker([40.500305, 72.814718], {
                draggable: true
            }).addTo(map);
            marker.on('drag', function (e) {
                let lat = e.target._latlng.lat.toFixed(3);
                let lng = e.target._latlng.lng.toFixed(3);
                setLocation({ latitude: lat, longitude: lng });
            });
        });
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
                <div className=" flex flex-col justify-center items-center mb-[80px]">
                    <label style={{ fontSize: 25 }}>Создать новое объявление</label>
                    <p>Поля, обозначенные <span className="text-danger">*</span> - обязательные. После создания
                        объявления Вы можете редактировать и удалять его в Личном кабинете.</p>
                </div>
                <div className="col-xl-9 col-md-12 col-sm-12 col-xs-12 mx-auto">
                    <ProductFields
                        form={form}
                        loading={loading}
                        onSend={async (model) => {
                            console.log('phones', form.getFieldValue('phones'));
                            console.log('video', form.getFieldValue('video'));
                            console.log('fields', form.getFieldsValue());

                            const valid = await form.validateFields();
                            if (valid) {
                                const formData = new FormData();
                                formData.append('user_id', user.id);
                                formData.append('currency_id', model.currency_id);
                                formData.append('location', JSON.stringify(location));
                                model.files.forEach(file => {
                                    formData.append('images[]', file);
                                });
                                let characteristicIndex = 0;
                                for (const [key, value] of Object.entries(form.getFieldsValue())) {
                                    if (value == null || value === '' || value === undefined || value === "undefined") {
                                        continue;
                                    }

                                    if (key.startsWith('car_attributes')) {
                                        const s = key.split('.');
                                        if (s[1] === 'characteristics') {
                                            const json = JSON.parse(value);
                                            formData.append(`car_attributes[${s[1]}][${characteristicIndex}][characteristic_id]`, json.characteristic_id);
                                            formData.append(`car_attributes[${s[1]}][${characteristicIndex}][id]`, json.key);
                                            formData.append(`car_attributes[${s[1]}][${characteristicIndex}][value]`, json.value);
                                            characteristicIndex++;
                                        } else {
                                            formData.append(`car_attributes[${s[1]}]`, value);
                                        }
                                    } else {
                                        formData.append(`${key}`, value);
                                    }
                                }
                                setLoading(true);
                                const response = await api.createProduct(formData);
                                console.log(response);
                                if (response != null && response.success) {
                                    openNotification('success', 'Объявление отправлено на модерацию!', null);
                                    history(`/`);
                                } else {
                                    openNotification('error', 'Не удалось опубликовать!', null);
                                }
                                setLoading(false);
                            }
                        }}
                    />

                </div>


            </div>
        </div>
    );
}


export default CreateProductPage;