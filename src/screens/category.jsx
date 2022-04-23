import React from "react";
import{ useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryProducts, fetchCategoryDetails } from "../api";
import ProductItem from "../components/product/product_item";
import SubCategories from "../components/category/sub_categories ";
import {Button,Spin} from "antd";

const Category = ({match})=> {
    const dispatch = useDispatch();
    const [categoryProducts,setProducts] = useState();
    const [category, setCategory] = useState();
    const [formValues, setFormValues] = useState({});

    const limit = 20;
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCategory = async (searchAttributes = {}) => {
        setIsLoading(true);
        const category = await fetchCategoryDetails(match.params.id);
        const products = await fetchCategoryProducts(match.params.id, searchAttributes ?? {});
        if (products != null) {
            setCategory(category);
            setProducts(products);
            // dispatch(setPr);
            setOffset(offset + limit);
            document.title="Поиск по категории: "+category.name;
        }
        setIsLoading(false);
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        formValues['offset'] = offset;
        let prods = categoryProducts.concat(await fetchCategoryProducts(formValues));
        if (prods != null) {
            dispatch(setProducts(prods));
            setOffset(offset + limit);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCategory();
    }, []);
    return(
        <>
            <Navbar />
            <SubCategories category={category} onSubmit={(form) => {
                const values = {'filter_attributes': form.getFieldsValue()};
                console.log(values);
                setFormValues(values);
                fetchCategory(values);
            }} />
            {isLoading && !categoryProducts?.length ? 
                <div>
                    <center className="py-5">
                    <div class="spinner-border text-success" role="status">
                    <span class="sr-only">Loading...</span>
                    </div>
                    </center>
                </div> 
                :
                <div className="row mx-0 mt-3">
                    <div className="col-md-12">
                        <label style={{fontSize:18}}>По категории</label>
                    </div>
                    {(!categoryProducts?.length) ?
                        <div className="col-md-12 py-5">
                            <center>Нет объявлений</center>
                        </div>
                    : categoryProducts?.map((product) => {
                        return(
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
                            }}
                            style={{backgroundColor:"#184d9f",color:"#fff"}}
                            >
                                Показать еще
                            </Button>
                        </center> 
                    </div>
                </div>
            }   
        </>
    );
}

export default Category;