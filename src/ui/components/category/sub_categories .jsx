import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Form, InputNumber, Modal, Select } from 'antd';
import { setCurrencies, setRegions } from "../../../redux/actions/main_actions";
import * as api from "../../../api";
import { CustomAttributeField } from "../custom_components";

const { Option } = Select;

const SubCategories = ({ category, onSubmit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  
  // State management
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
  const [options, setOptions] = useState([]);
  
  const { currencies, regions } = useSelector((state) => state.main);

  // API calls
  const fetchRegions = async () => {
    try {
      const [regionsData, currenciesData] = await Promise.all([
        api.fetchRegions(),
        api.fetchCurrencies()
      ]);

      if (regionsData) {
        dispatch(setRegions(regionsData));
        handleInitialRegion(regionsData);
      }

      if (currenciesData) {
        dispatch(setCurrencies(currenciesData));
        handleInitialCurrency(currenciesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInitialRegion = (regionsData) => {
    if (!regionsData.length) return;
    
    const currentRegionId = form.getFieldValue("region_id");
    const region = currentRegionId 
      ? regionsData.find(r => r.id === currentRegionId)
      : regionsData[0];
      
    selectRegion(region);
  };

  const handleInitialCurrency = (currenciesData) => {
    if (!currenciesData.length) return;
    
    const currentCurrencyId = form.getFieldValue("currency_id");
    const currencyId = currentCurrencyId 
      ? currenciesData.find(c => c.id === currentCurrencyId)?.id
      : currenciesData[0].id;
      
    setSelectedCurrencyId(currencyId);
  };

  // Form handlers
  const selectRegion = (region) => {
    if (!region) return;

    form.setFieldsValue({ region_id: region.id });
    setCities(region.cities || []);

    const currentCityId = form.getFieldValue("city_id");
    const city = currentCityId 
      ? region.cities?.find(c => c.id === currentCityId)
      : region.cities?.[0];

    if (city) {
      selectCity(city);
    }
  };

  const selectCity = (city) => {
    if (!city) return;
    
    form.setFieldsValue({ city_id: city.id });
    setDistricts(city.districts || []);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(form);
    }
    setIsModalVisible(false);
  };

  const handleCategoryChange = (categoryId) => {
    navigate(`/category/${categoryId}`);
    fetchRegions();
    window.location.reload(); // Consider removing this and handling navigation properly
  };

  // Category options management
  const initializeCategoryOptions = (categoryData) => {
    if (!categoryData?.children) return;

    const newOptions = categoryData.children.map(item => ({
      label: item.name,
      value: item.id
    }));

    setOptions(newOptions);
  };

  useEffect(() => {
    fetchRegions();
    initializeCategoryOptions(category);
  }, [category]);

  if (!category?.children?.length) {
    return null;
  }

  const renderSearchForm = () => (
    <Form
      form={form}
      name="advanced_search"
      className="ant-advanced-search-form"
      onFinish={handleSubmit}
    >
      <div className="row">
        {/* Custom Attributes */}
        {category?.custom_attribute?.map((item) => (
          <div key={item.name} className="col-xl-3">
            <Form.Item
              label={item.title}
              name={item.name}
              rules={[{ required: item.is_required, message: item.placeholder }]}
            >
              {CustomAttributeField(item)}
            </Form.Item>
          </div>
        ))}

        {/* Price Range and Currency */}
        <div className="col-xl-9">
          <div className="row">
            <div className="col-xl-4">
              <Form.Item label="Цена от:" name="price_from">
                <InputNumber placeholder="Цена от" className="w-100 mb-2" />
              </Form.Item>
            </div>
            <div className="col-xl-4">
              <Form.Item label="Цена до:" name="price_to">
                <InputNumber placeholder="Цена до" className="w-100 mb-2" />
              </Form.Item>
            </div>
            <div className="col-xl-3">
              <Form.Item label="Валюта:" name="currency_id">
                <Select 
                  value={selectedCurrencyId} 
                  onChange={setSelectedCurrencyId}
                  className="select-after"
                >
                  {currencies.map((item) => (
                    <Option key={item.id} value={item.id}>{item.symbol}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
        </div>

        {/* Region and City Selection */}
        <div className="col-xl-3">
          <Form.Item label="Регион" name="region_id">
            <Select
              placeholder="Выберите регион"
              onChange={(id) => selectRegion(regions.find(r => r.id === id))}
            >
              {regions.map((item) => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="col-xl-3">
          <Form.Item label="Город" name="city_id">
            <Select
              placeholder="Выберите город"
              onChange={(id) => selectCity(cities.find(c => c.id === id))}
            >
              {cities.map((item) => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>

      {/* Submit Button */}
      <div className="col-xl-12 d-xl-flex justify-content-end">
        <button 
          type="submit" 
          className="btn btn-primary col-12 col-xl-2"
        >
          Поиск
        </button>
      </div>
    </Form>
  );

  return (
    <>
      {/* Desktop Search Form */}
      <div className="col-md-12 pb-3 d-none d-xl-block">
        <label className="" style={{ fontSize: 18 }}>Поиск</label>
        <div className="mb-3" />
        {renderSearchForm()}
      </div>

      {/* Mobile Search Button and Modal */}
      <div className="d-block d-xl-none my-4">
        <div className="text-center px-3">
          <button 
            className="btn btn-primary col-12 rounded" 
            onClick={() => setIsModalVisible(true)}
          >
            Поиск по фильтрам
          </button>
        </div>
        <Modal
          title="Поиск по фильтрам"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          {renderSearchForm()}
        </Modal>
      </div>

      {/* Desktop Category Links */}
      <div className="col-md-12 py-0 py-md-2 bg-light d-none d-md-block">
        <label>По категориям</label>
        <div className="row">
          {category.children.map((cat) => (
            <div key={cat.id} className="col-3 col-md-2 mt-2 mt-md-2">
              <Link 
                className="cat-link text-primary" 
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.name}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Category Dropdown */}
      <div className="col-md-12 py-2 bg-light d-block d-md-none">
        <label>По категориям</label>
        <div className="col-12">
          {options.length > 0 && (
            <Select
              defaultValue={category.name}
              style={{ width: "100%" }}
              onChange={(value) => handleCategoryChange(value)}
              options={options}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SubCategories;