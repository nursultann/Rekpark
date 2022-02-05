import React from "react";
import{ useEffect, useState } from "react";
import {Link} from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import SearchBar from "../components/search-bar";
import { setCategoryProducts } from "../redux/actions/product_actions";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryProducts } from "../api";
import { Skeleton, Grid } from "@mui/material";
import ProductItem from "../components/product/product_item";
import SubCategories from "../components/category/sub_categories ";
import {Button} from "antd";
const Category = ({match})=> {
    const dispatch = useDispatch();
    const [categoryProducts,setProducts] = useState();
    const [ category, setCategory ] = useState();
    const limit = 20;
    const [offset, setOffset] = useState(0);
    const fetchCategory = async () => {
        const sub = true;
        const wit = 'user';
        const category = await fetchCategoryProducts(match.params.id,sub,wit);
        if (category != null) {
            console.log(category.advertisements);
            setCategory(category);
            setProducts(category.advertisements);
            dispatch(setCategoryProducts(category.advertisements));
            setOffset(offset + limit);
        }
    };
  const fetchProducts = async () => {
    let prods = categoryProducts.concat(await fetchCategoryProducts({offset: offset}));
    if (prods != null) {
      dispatch(setProducts(prods));
      setOffset(offset + limit);
    }
  };
    useEffect(() => {
        fetchCategory();
      }, []);
        return(
            <div>
            <Navbar />
            <SubCategories category={category}/>
            <div className="row mx-0 mt-3">
                <div className="col-md-12">
                <label style={{fontSize:18}}>По категории</label>
                </div>
                    {categoryProducts === null || categoryProducts === undefined || categoryProducts.length === 0 ?
                    <div className="col-md-12 py-5"><center>Нет объявлений</center></div>
                : categoryProducts.map((product) => {
                    return (
                        <div className="col-6 col-sm-6 col-xl-3 mt-3 mb-3">
                        <ProductItem product={product} />
                        </div>            
                    )
                })}
                <div className="col-md-12 py-5">
                        <center className="">
                    <Button 
                        variant="outlined"
                        onClick={() => {
                        fetchProducts();
                        }}>
                        Показать еще
                    </Button>
                    </center> 
                </div>
            </div>   
            <Footer/>
           </div>
        );
}
export default Category;