import React, { useState } from "react";
import { Form, Button, Input,InputNumber,Modal,Select } from 'antd';
import { CustomAttributeField } from "../custom_components";
const { Option } = Select;
const SubCategories = ({category, onSubmit}) => {
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [form] = Form.useForm();
    const onFinish = (values) => {
      console.log('Received values of form: ', values);
    };

    const onChange = () => {
      if (onSubmit != null) onSubmit(form);
      setVisible(false);
    };
    

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

    return(
      <>
        {category?.children?.length ?
          <>
          <div className="col-md-12 mt-3 pb-3 d-none d-xl-block">
          <label className="mb-3" style={{fontSize:20}}>Поиск</label>
            <Form
              form={form}
              name="advanced_search"
              className="ant-advanced-search-form"
              onFinish={onFinish}
            >
              <div className="row">
                {category?.custom_attribute != null ?  
                  category.custom_attribute.map((item) => (
                    <div className="col-xl-3">  
                      <Form.Item
                        key={item.name}
                        label={item.title}
                        name={item.name}
                        rules={[{required: item.is_required, message: item.placeholder}]}
                        className="label"
                      >
                        {CustomAttributeField(item)}
                      </Form.Item>
                    </div>
                  ))
                : <></>}
               <div className="col-xl-9">
                  <div className="row">
                    <div className="col-xl-4">
                    <Form.Item
                    key={"price_from"}
                    label={"Цена от:"}
                    name={"price_from"}
                    rules={[{required:"", message:""}]}
                    className="label"
                    >
                      <InputNumber id="price_at" placeholder="Цена от" initialValues={0} className="w-100 mb-2" />
                    </Form.Item>
                    </div>
                    <div className="col-xl-4">
                    <Form.Item
                    key={"price_to"}
                    label={"Цена до:"}
                    name={"price_to"}
                    rules={[{required: "", message:""}]}
                    className="label"
                    >
                      <InputNumber id="price_to" placeholder="Цена до" initialValues={0} className="w-100 mb-2" />
                    </Form.Item>
                    </div>
                    <div className="col-xl-3">
                      <Form.Item
                      key={"currency_id"}
                      label={"Валюта:"}
                      name={"currency_id"}
                      rules={[{required: "", message:""}]}
                      className="label"
                      >
                        <Select defaultValue="валюта">
                          <Option value="1">доллар</Option>
                          <Option value="2">руб</Option>
                          <Option value="3">сом</Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4">
                <Form.Item
                      key={"currency_id"}
                      label={"Валюта:"}
                      name={"currency_id"}
                      rules={[{required: "", message:""}]}
                      className="label"
                      >
                        <Select defaultValue="валюта">
                          <Option value="1">доллар</Option>
                          <Option value="2">руб</Option>
                          <Option value="3">сом</Option>
                        </Select>
                      </Form.Item>
                </div>
              </div>
              <div className="col-xl-12 d-xl-flex justify-content-end">
                <Button className="col-12 col-xl-2" onClick={onChange} style={{backgroundColor:"#184d9f",color:"#fff"}}>Поиск</Button>
              </div>
            </Form>
          </div>
          <div className="d-block d-xl-none my-4">
            <div className="text-center px-3">
            <button className="btn col-12 rounded" style={{backgroundColor:"#184d9f",color:"#fff"}} type="primary" onClick={showModal}>
              Поиск по фильтрам
            </button>
            </div>
            <Modal
              title="Поиск по фильтрам"
              visible={visible}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
              footer = {null}
              className="label"
            >
              <label className="mb-3" style={{fontSize:18}}>Поиск</label>
              <Form
                form={form}
                name="advanced_search"
                className="ant-advanced-search-form"
                onFinish={onFinish}
              >
                <div className="row">
                  {category?.custom_attribute != null ?  
                    category.custom_attribute.map((item) => (
                      <div className="col-xl-4">  
                        <Form.Item
                          key={item.name}
                          label={item.title}
                          name={item.name}
                          rules={[{required: item.is_required, message: item.placeholder}]}
                        >
                          {CustomAttributeField(item)}
                        </Form.Item>
                      </div>
                    ))
                  : <></>}
                <div className="col-xl-6">
                    <div className="row">
                      <div className="col-xl-6">
                      <Form.Item
                      key={"price_from"}
                      label={"Цена от:"}
                      name={"price_from"}
                      rules={[{required:"", message:""}]}
                      >
                        <InputNumber id="price_at" placeholder="Цена от" initialValues={0} className="w-100 mb-2" />
                      </Form.Item>
                      </div>
                      <div className="col-xl-6">
                      <Form.Item
                      key={"price_to"}
                      label={"Цена до:"}
                      name={"price_to"}
                      rules={[{required: "", message:""}]}
                      >
                        <InputNumber id="price_to" placeholder="Цена до" initialValues={0} className="w-100 mb-2" />
                      </Form.Item>
                      </div>
                      <div className="col-xl-6">
                      <Form.Item
                      key={"currency_id"}
                      label={"Цена до:"}
                      name={"currency_id"}
                      rules={[{required: "", message:""}]}
                      >
                        <Select defaultValue="валюта" loading>
                          <Option value="1">доллар</Option>
                          <Option value="2">руб</Option>
                          <Option value="3">сом</Option>
                        </Select>
                      </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-12 d-xl-flex justify-content-end">
                  <Button className="col-12 col-xl-2" onClick={onChange} style={{backgroundColor:"#184d9f",color:"#fff"}}>Поиск</Button>
                </div>
              </Form>
            </Modal>
          </div>
          <div className="col-md-12 py-2 bg-light">
            <label>По категориям</label>
            <div className="row">
              {category?.children?.map((category) =>
                <div className="col-3 col-md-2 mt-2 mt-md-2">
                  <a className="text-primary link" href={`/category/${category.id}`}>
                    {category.name}
                  </a>
                </div>
              )}
            </div>    
          </div>
         </> 
        :
          <></>
        } 
      </>
    );

};
export default SubCategories;