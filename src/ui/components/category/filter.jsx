import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, InputNumber, Modal, Select } from 'antd';
import { useNavigate } from "react-router-dom";
import { useEffectOnce } from "react-use";
import * as api from "../../../api";
import { setCurrencies, setRegions } from "../../../redux/actions/main_actions";
import { CustomAttributeField } from "../custom_components";

const { Option } = Select;

const Filter = ({ category, onSubmit }) => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();
  const [cities, setCities] = useState([]);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
  const { currencies, regions } = useSelector((state) => state.main);
  const [districts, setDistricts] = useState([]);
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const fetchRegions = async () => {
    const regions = await api.fetchRegions();
    if (regions != null) {
      dispatch(setRegions(regions));
      if (regions.length) {
        if (form.getFieldValue("region_id")) {
          const region = regions.find(o => o.id === form.getFieldValue("region_id"));
          selectRegion(region);
        } else {
          selectRegion(regions[0]);
        }
      }
    }

    const currencies = await api.fetchCurrencies();
    if (currencies != null) {
      dispatch(setCurrencies(currencies));
      if (currencies.length) {
        if (form.getFieldValue("currency_id")) {
          const currency = currencies.find(o => o.id === form.getFieldValue("currency_id"));
          setSelectedCurrencyId(currency.id);
        } else {
          setSelectedCurrencyId(currencies[0].id);
        }
      }
    }
  }

  const selectRegion = (region) => {
    form.setFieldsValue({
      region_id: region.id
    });

    setCities(region.cities);
    if (region.cities != null && region.cities.length) {
      if (form.getFieldValue("city_id")) {
        const city = region.cities.find(o => o.id === form.getFieldValue("city_id"));
      } else {
        selectCity(region.cities[0]);
      }
    }
  }

  const selectCity = (city) => {
    form.setFieldsValue({
      city_id: city.id
    });

    setDistricts(city.districts);
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

  const newCategory = (category) => {
    history(category);
    fetchRegions();
    document.location.reload();
  }

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

  const [options, setOptions] = useState([]);

  const fetchCategoriesTree = async (category) => {
    category?.children?.map((item) =>
      setOptions(prevState => [...prevState, {
        label: item.name,
        value: item.id
      }])
    )
    console.log('options', options);
  }

  if (options.length == 0) {
    fetchCategoriesTree(1);
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    window.location.href = "/category/" + value;
  };
  useEffectOnce(() => {
    fetchRegions();
    fetchCategoriesTree(category);
  });

  return (
    <>
      {true ?
        <>
          <button className="btn border" style={{ borderRadius: '12px' }} onClick={showModal}>
            <img className="" src={filter} alt="" width={25} height={25}  />
          </button>

          <Modal
            title="Поиск по фильтрам"
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            footer={null}
          >
            <label className="mb-3" style={{ fontSize: 18 }}>Поиск</label>
            <Form
              form={form}
              name="advanced_search"
              className="ant-advanced-search-form"
              onFinish={onFinish}
              layout={'vertical'}
            >
              <div className="row">
                <div className="col-12">
                  <Form.Item
                    key="name"
                    label="Категория"
                    name="category_id"
                    className="mt-2"
                  >
                    <TreeSelect
                      showSearch
                      placeholder="Выберите категорию"
                      onChange={(item) => {
                        const category = categories.find(o => o.id === item);
                        setCategory(category);
                      }}
                      allowClear
                      value={selectedCategory?.id}
                      filterTreeNode={(search, item) => {
                        return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                      }}
                    >
                      {categories.map((item) => {
                        return (
                          <TreeNode value={item.id} title={item.name}>
                            {categoryTree(item.children)}
                          </TreeNode>
                        );
                      })}
                    </TreeSelect>
                  </Form.Item>
                </div>
                <div className="col-12">
                  {
                    selectedCategory != null ?
                      <>
                        {selectedCategory.custom_attribute?.map((item) => (
                          <Form.Item
                            key={item.name}
                            label={item.title}
                            name={item.name}
                            onChange={(item) => {
                              const category = categories.find(o => o.id === item);
                            }}
                            rules={[{ required: item.is_required, message: item.placeholder }]}
                          >
                            {CustomAttributeField(item)}
                          </Form.Item>
                        ))}
                        {selectedCategory.ca_groups?.map((group) => (
                          <>
                            {group.attributes.map((item) => (
                              <Form.Item
                                key={item.name}
                                label={item.title}
                                name={item.name}
                                onChange={(item) => {

                                }}
                                rules={[{ required: item.is_required, message: item.placeholder }]}
                              >
                                {CustomAttributeField(item)}
                              </Form.Item>
                            ))}
                          </>
                        ))}
                      </>
                      :
                      <>
                      </>
                  }
                </div>
                <div className="col-12">
                  {selectedCategory != null && selectedCategory.kind === 'cars' ? (
                    <>
                      <hr />
                      <h4>Дополнительные параметры</h4>
                      <CarAttributes form={form} />
                      <hr />
                    </>
                  ) : <></>
                  }
                </div>
                <div className="col-xl-12">
                  <div className="row">
                    <div className="col-xl-6">
                      <Form.Item
                        key={"price_from"}
                        label={"Цена от:"}
                        name={"price_from"}
                      >
                        <InputNumber id="price_at" placeholder="Цена от" initialValues={0} className="w-100 mb-2" />
                      </Form.Item>
                    </div>
                    <div className="col-xl-6">
                      <Form.Item
                        key={"price_to"}
                        label={"Цена до:"}
                        name={"price_to"}
                        rules={[{ required: "", message: "" }]}
                      >
                        <InputNumber id="price_to" placeholder="Цена до" initialValues={0} className="w-100 mb-2" />
                      </Form.Item>
                    </div>
                    <div className="col-xl-12">
                      <Form.Item
                        key={"currency_id"}
                        label={"Валюта:"}
                        name={"currency_id"}
                        rules={[{ required: "", message: "" }]}
                      >
                        <Select placeholder={'Валюта'} value={selectedCurrencyId} onChange={(value) => setSelectedCurrencyId(value)} className="select-after">
                          {currencies.map((item) => {
                            return (<Option value={item.id}>{item.symbol}</Option>);
                          })}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-12">
                <Form.Item
                  key="region_id"
                  label="Регион"
                  name="region_id"
                  rules={[{ required: true, message: 'Выберите регион!' }]}
                >
                  <Select
                    placeholder="Выберите регион"
                    onChange={(item) => {
                      const region = regions.find(o => o.id === item);
                      selectRegion(region);
                    }}
                  >
                    {regions.map((item) =>
                      (<Option value={item.id}>{item.name}</Option>)
                    )}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-xl-12">
                <Form.Item
                  key="city_id"
                  label="Город"
                  name="city_id"
                  rules={[{ required: true, message: 'Выберите город!' }]}
                >
                  <Select
                    placeholder="Выберите город"
                    onChange={(item) => {
                      const city = cities.find(o => o.id === item);
                      selectCity(city);
                    }}
                  >
                    {cities.map((item) =>
                      (<Option value={item.id}>{item.name}</Option>)
                    )}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-xl-12 d-xl-flex justify-content-end">
                <Button type="primary" className="col-12 col-xl-2" onClick={onChange}>Поиск</Button>
              </div>
            </Form>
          </Modal>
        </>
        :
        <></>
      }
    </>
  );
};
export default Filter;