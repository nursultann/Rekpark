import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import { useDispatch } from "react-redux";
import * as api from "../../../api";
import { useNavigate } from "react-router-dom";
import {
  Form,
  notification
} from "antd";
import { setUser } from "../../../redux/actions/user_actions";
import { setProductDetails } from "../../../redux/actions/product_actions";
import ProductFields from "./contents/product_fields";

const EditProductPage = ({ match }) => {

  const history = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [location, setLocation] = useState(null);
  const [form] = Form.useForm();
  const [product, setProduct] = useState();

  const fetchProductDetails = async () => {
    const productDetails = await api.fetchProduct(match.params.id, {
      'with': 'category;customAttributeValues.customAttribute'
    });
    if (productDetails != null) {
      dispatch(setProductDetails(productDetails));
      setFields(productDetails);
      setProduct(productDetails);
      setLocation(JSON.parse(productDetails.location));
    }
    setReady(true);
  };

  if (ready == true) {
    var DG = require('2gis-maps');
    var marker;
    var map = null;
    //2gis map
    DG.then(function () {
      map = DG.map('map', {
        'center': [location.latitude, location.longitude],
        'zoom': 13
      });
      marker = DG.marker([location.latitude, location.longitude], {
        draggable: true
      }).addTo(map);
      marker.on('drag', function (e) {
        var lat = e.target._latlng.lat.toFixed(3);
        var lng = e.target._latlng.lng.toFixed(3);
        setLocation({ latitude: lat, longitude: lng });
      });
    });
  }

  const fetchUserDetails = async () => {
    const userDetails = await api.userDetails();
    if (userDetails != null) {
      dispatch(setUser(userDetails));
    }
  };

  console.log("location", location);
  console.log("productDetails", product);

  useEffect(() => {
    fetchUserDetails();
    fetchProductDetails();
  }, []);

  const setFields = (productDetails) => {
    if (productDetails != null) {
      const data = {
        category_id: productDetails.category_id,
        title: productDetails.title,
        description: productDetails.description,
        price: productDetails.price,
        region_id: productDetails.region_id,
        currency_id: productDetails.currency_id,
        city_id: productDetails.city_id,
        district: productDetails.district,
        can_comment: productDetails.can_comment,
        phones: productDetails.phones
      };
      if (productDetails.has_custom_attribute_values) {
        productDetails.custom_attribute_values.forEach((item) => {
          data[item.custom_attribute.name] = item.value;
        });
        form.setFieldsValue(data);
      }
      console.log('data', data);
      form.setFieldsValue({
        ...data,
      });
    }
  };

  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };
  document.title = "Редактирование";
  return (
    <div>
      <div className="col-12 mt-3">
        <nav className="col-12 text-center pb-3">
          <a href="/"> Главная страница</a> | <a className="text-primary" href="#">Редактировать объявление</a>
        </nav>
      </div>
      <div className="col-md-8 py-5">
        <center className="pb-4">
          <label style={{ fontSize: 25 }}>Редактировать объявление</label>
          <p>Поля, обозначенные <span className="text-danger">*</span>  - обязательные. После создания объявления Вы можете редактировать и удалять его в Личном кабинете.</p>
        </center>
        {ready ? <ProductFields
          form={form}
          loading={loading}
          onSend={async (model) => {
            const valid = await form.validateFields();
            if (valid) {
              const formData = new FormData();
              formData.append('currency_id', model.currency_id);
              formData.append('location', JSON.stringify(location));
              model.files.forEach(file => {
                formData.append('images[]', file);
              });
              let characteristicIndex = 0;
              for (const [key, value] of Object.entries(form.getFieldsValue())) {
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
              console.log('formdata', formData);
              const response = await api.updateProduct(match.params.id, formData);
              if (response != null && response.success) {
                openNotification('success', 'Изменения сохранены!', null);
                history(`/profile/`);
              } else {
                openNotification('error', 'Не удалось сохранить!', null);
              }
              setLoading(false);
            }
          }}
        /> : <></>}
      </div>
    </div>
  );
}

export default EditProductPage;
