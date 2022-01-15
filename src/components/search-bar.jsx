import {useState,useEffect,Link} from 'react';
import React from "react";
import CategorySlider from "./category/category_slider";
import {Button} from 'antd';
import { Cascader } from 'antd';
import { Input, Space } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { setCategories } from "../redux/actions/category_actions";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../api";
import { TreeSelect } from 'antd';
const { Search } = Input;
const { TreeNode } = TreeSelect;
const SearchBar = () => {
  const [value, setValue] = useState(undefined);
  const onChange = () => {
    setValue(value);
  }
  const dispatch = useDispatch();
    const {categories} = useSelector((state) => state.category);

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
// const content = (category) => {
//   return (
//     <>
//     <Link to={`/category/${category.id}`}></Link>
//     </>
//   );
// };
        return(
            <div>
            <div class="col-md-12">
    <div class="row mt-4">
        <div class="col-md-12 d-flex justify-content-center px-5">
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
                  category.children?.length ? 
                  <TreeNode 
                      className="col-md-4"  
                      placement="bottom"
                      id={category.id} 
                      value={category.name} 
                      title={category.name}
                  >
                      {childrenContent(category.children)}
                  </TreeNode> 
                  : <TreeNode 
                  id={category.id} 
                  value={category.name} 
                  title={category.name}>
                  </TreeNode>
                  )  
              })}
        </TreeSelect>
        <Search className="ml-2" placeholder="Поиск..." style={{ width: "100%" }} />
        <Button type="primary">
              Поиск
        </Button>
        </div>
    </div>
    <div className="col-md-12 py-3">
      <hr/>
      <center><CategorySlider /></center>
    </div>
    
  </div>
  <hr/>
  </div>
        );
    }
export default SearchBar;