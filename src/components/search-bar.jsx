import { useState, useEffect } from 'react';
import React from "react";
import CategorySlider from "./category/category_slider";
import logo from "../../src/img/logo.png";
import { Button, Popover } from 'antd';
import { Input } from 'antd';
import { setCategories } from "../redux/actions/category_actions";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../api";
import { TreeSelect, Select } from 'antd';
import { useHistory } from "react-router-dom";
import BussinessProfiles from './bussiness_profiles';
import Filter from './category/filter';
const { Search } = Input;
const { TreeNode } = TreeSelect;

const SearchBar = () => {
  const [value, setValue] = useState(undefined);
  const [search, setSearch] = useState();
  const history = useHistory();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const onChange = () => {
    setValue(value);
  }

  const Search = () => {
    history.push(`search_result/${search}`);
  }
  const [options, setOptions] = useState([]);
  const fetchCategoriesTree = async () => {
    const categories = await api.fetchCategoriesTree();
    if (categories != null) {
      dispatch(setCategories(categories));
      {
        categories.map((category) => {
          category.children != null && category.children.length > 0 ?
            <>
              {setOptions(prevState => [...prevState, {
                label: category.name,
                value: category.id
                // options: [
                //   category.children.map((item)=>
                //   {
                //     label: item.name,
                //     value: item.id,
                //   },
                //   )
                // ],
              }])
              }
            </>
            :
            <>
            </>
          console.log('options', categories);
        }
        )
      }
    }
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
    window.location.href = "/category/" + value;
  };
  const contentMake = (cat) => {
    if (cat.children.length > 0) {
      return (
        <>
        {cat.children.map((item)=>
        <div className='px-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
          <img src={item.image} width={35} alt="" />
          <a href={"/category/" + item.id} className="py-2">{item.name}</a>
        </div>
        )  
      }
        </>
      )
    }
  }

  useEffect(() => {
    fetchCategoriesTree();
  }, []);
//filter
const [category, setCategory] = useState();
const [formValues, setFormValues] = useState({});
const [isLoading, setIsLoading] = useState(false);
const fetchCategory = async (searchAttributes = {}) => {
  setIsLoading(true);
  const category = await api.fetchCategoryDetails(4);
  const products = await api.fetchCategoryProducts(4, searchAttributes ?? {});
  console.log('attr', searchAttributes);
  if (products != null) {
      setCategory(category);
      document.title = "Поиск по категории: " + category.name;
  }
  setIsLoading(false);
};
  return (
    <div>
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12">
            <div className='row pt-2 px-0 px-lg-0 d-md-flex align-items-center'>
              <div className='col-lg-12 mt-0 mt-lg-3 mt-xl-0 px-3 pt-2'>
                <div className='col-12 mr-2' style={{ borderRadius: "10px" }}>
                  <div className='row'>
                    <div className='col-lg-3 d-none d-lg-block'>
                      <a className="navbar-brand" href="/" ><img src={logo} style={{ width: "100%" }} /></a>
                    </div>
                    <div className='col-2 col-lg-1 px-3 px-lg-2 py-0 py-lg-2 mt-0 mt-lg-2'>
                      <Filter
                      category={category}
                      onSubmit={(form) => {
                          const values = { 'filter_attributes': form.getFieldsValue() };
                          console.log(values);
                          window.location.href = '/search-filter/'+JSON.stringify(values);
                          setFormValues(values);
                          fetchCategory(values);
                      }}
                      />
                    </div>
                    <div className="col-9 col-lg-6 px-1 px-lg-0 mt-0 mt-lg-2 mt-lg-0 py-0 py-lg-2" >
                      <input type={"search"} className='col-lg-12 form-control border-0 bg-light rounded-lg' placeholder="Поиск по объявлению..." onChange={(e) => { setSearch(e.target.value) }} style={{ width: "100%" }} />
                    </div>
                    <div className='col-1 col-lg-2 px-1 px-lg-1 py-0 py-lg-3'>
                      <button className='btn btn-primary col-12 rounded-lg d-none d-lg-block' type="primary" onClick={Search}>
                        Найти
                      </button>
                      <button className='btn d-block d-lg-none border' style={{ borderRadius: '12px' }} onClick={Search}>
                        <i class="fa-solid fa-magnifying-glass"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 mt-3 pb-1 px-0">
          {/* <h3 style={{color : "#424242", fontSize : "19px" }}>Категории</h3> */}
          {/* <hr /> */}
          <center>
            <CategorySlider />
          </center>
        </div>
        <div className='col-xl-12'>
          {/* <Bussiness/> */}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;