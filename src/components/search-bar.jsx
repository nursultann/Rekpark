import { useState, useEffect } from 'react';
import React from "react";
import CategorySlider from "./category/category_slider";
import { Button } from 'antd';
import { Input } from 'antd';
import { setCategories } from "../redux/actions/category_actions";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../api";
import { TreeSelect } from 'antd';
import { useHistory } from "react-router-dom";
import BussinessProfiles from './bussiness_profiles';
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

  const fetchCategoriesTree = async () => {
    const categories = await api.fetchCategoriesTree();
    if (categories != null) {
      dispatch(setCategories(categories));
    }
  };

  useEffect(() => {
    fetchCategoriesTree();
  }, []);

  const childrenContent = (children) => (
    <>
      {children.map((item) => (<>
        <TreeNode
          id={item.id}
          value={item.name}
          title={item.name}
        >
        </TreeNode>
      </>))}

    </>
  );

  return (
    <div>
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <div className='row pt-2 px-0 px-lg-0 d-md-flex align-items-center'>
              <div className='col-lg-12 mt-3 mt-xl-0 px-3 pt-2'>
                <div className='col-12 mr-2 rounded alert alert-info'>
                  <div className='row'>
                    {/* <div className='col-lg-3 px-2 px-lg-1 py-2 py-lg-2'>
                      <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        value={value}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="Категории"
                        allowClear
                        treeDefaultExpandAll
                        onChange={onChange}
                      >
                        {categories.map((category) => {
                          return (
                            category.children != null && category.children.length > 0 ?
                              <TreeNode
                                placement="bottom"
                                id={category.id}
                                value={category.name}
                                title={category.name}
                              >
                                {childrenContent(category.children)}
                              </TreeNode>
                              :
                              <TreeNode
                                id={category.id}
                                value={category.name}
                                title={category.name}>
                              </TreeNode>
                          )
                        })}
                      </TreeSelect>
                    </div> */}
                    <div className="col-lg-10 px-0 px-lg-2 mt-2 mt-lg-0 py-1 py-lg-2" >
                      <input type={"search"} className='col-lg-12 form-control' placeholder="Поиск..." onChange={(e) => { setSearch(e.target.value) }} style={{ width: "100%" }} />
                    </div>
                    <div className='col-lg-2 px-0 px-lg-1 py-2 py-lg-2'>
                      <button className='btn btn-outline-light text-white col-12 rounded' type="primary" style={{ backgroundColor: '#184d9f' }} onClick={Search}>
                        Найти
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 pb-4 px-0">
          <hr />
          <center>
            <CategorySlider />
          </center>
        </div>
        <div className='col-xl-12'>
          {/* <Bussiness/> */}
        </div>
      </div>
      <hr />
    </div>
  );
}

export default SearchBar;