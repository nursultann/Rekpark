import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../api";
import { useHistory } from "react-router-dom";
import { 
  Form,
  notification
} from "antd";
import ProductFields from "../components/product/product_fields_update";
import { setUser } from "../redux/actions/user_actions";
import { setProductDetails } from "../redux/actions/product_actions";

const EditAd = ({match}) => {

    const history = useHistory();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { productDetails } = useSelector((state) => state.product);

    const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);

    const [form] = Form.useForm();

    const fetchProductDetails = async () => {
        const productDetails = await api.fetchProduct(match.params.id, {
            'with': 'category;customAttributeValues.customAttribute'
        });
        if (productDetails != null) {
            dispatch(setProductDetails(productDetails));
            setFields(productDetails);
        }
        setReady(true);
    };

    const fetchUserDetails = async () => {
      const userDetails = await api.userDetails();
      if (userDetails != null) {
          dispatch(setUser(userDetails));
      }
    };

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

    return(
        <div>
            <Navbar/>
            <div className="col-md-8 py-5">
                {ready ? <ProductFields
                    form={form} 
                    loading={loading}
                    onSend={async (model) => {
                        const valid = await form.validateFields();
                        if (valid) {
                          const formData = new FormData();
                          formData.append('currency_id', model.currency_id);
                            
                          model.files.forEach(file => {
                            formData.append('images[]', file);
                          });
                          for (const [key, value] of Object.entries(form.getFieldsValue())) {
                            formData.append(`${key}`, value);
                          }
                          setLoading(true);
                          console.log('formdata', formData);
                          const response = await api.updateProduct(match.params.id, formData);
                          if (response != null && response.success) {
                            openNotification('success', 'Изменения сохранены!', null);
                            history.push(`/products/${match.params.id}`);
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

export default EditAd;