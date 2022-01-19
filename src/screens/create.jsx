import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../api";
import { useHistory } from "react-router-dom";
import { 
  Form,
  notification
} from "antd";
import ProductFields from "../components/product/product_fields";
import { setUser } from "../redux/actions/user_actions";
import Footer from "../components/footer";

const CreateAd = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const fetchUserDetails = async () => {
      const userDetails = await api.userDetails();
      if (userDetails != null) {
          dispatch(setUser(userDetails));
      }
    };

    useEffect(() => {
      fetchUserDetails();
    }, []);

    const openNotification = (type, message, description) => {
      notification[type]({
        message: message,
        description: description,
      });
    };

    return (
      <div>
        <Navbar/>
        <div className="col-md-8 py-5">
        <center className="pb-4">
        <label style={{fontSize:25}}>Создать новое объявление</label>
        </center>
          <ProductFields 
            form={form}
            loading={loading}
            onSend={async (model) => {
              console.log('phones', form.getFieldValue('phones'));
              const valid = await form.validateFields();
              if (valid) {
                const formData = new FormData();
                formData.append('user_id', user.id);
                formData.append('currency_id', model.currency_id);
                  
                model.files.forEach(file => {
                  formData.append('images[]', file);
                });
                for (const [key, value] of Object.entries(form.getFieldsValue())) {
                  formData.append(`${key}`, value);
                }
                setLoading(true);
                const response = await api.createProduct(formData);
                if (response != null && response.success) {
                  openNotification('success', 'Успешно сохранено!', null);
                  history.push(`/`);
                } else {
                  openNotification('error', 'Не удалось сохранить!', null);
                }
                setLoading(false);
              }
            }} 
          /> 
        </div>
        <Footer/>
      </div>     
    );
}


export default CreateAd;