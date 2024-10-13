import { useEffect, useState } from "react";
import { fetchCategoryDetails, fetchCategoryProducts, fetchProducts } from "../api";
import { Button, Grid, Skeleton } from "antd";
import Navbar from "../components/navbar";
import ProductItem from "../components/product/product_item";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
const SearchFilter = () => {
    const params = useParams();
    const product = JSON.parse(params.form);
    console.log('product', product);
    const [products, setProducts] = useState(null);
    const [loading, setIsLoading] = useState(false);
    const [category, setCategory] = useState();
    const limit = 20;
    const [offset, setOffset] = useState(0);
    const fetchCategory = async (searchAttributes = {}) => {
        setIsLoading(true);
        const category = await fetchCategoryDetails(product.filter_attributes.category_id);
        const products = await fetchCategoryProducts(product.filter_attributes.category_id, searchAttributes ?? {});
        console.log('attr', searchAttributes);
        if (products != null) {
            setCategory(category);
            setProducts(products);
            // dispatch(setPr);
            setOffset(offset + limit);
            document.title = "Поиск по категории: " + category.name;
        }
        setIsLoading(false);
    };
    console.log('products', products);
    useEffect(() => {
        fetchCategory();
    }, [])
    return (
        <>
            <Navbar />
            <div className="row px-3">
                <div className="col-lg-9">
                    <div className="row mt-3">
                        {products != null ?
                            <>
                                {products.map((item) =>
                                    <div className="col-lg-4 mb-3">
                                        <ProductItem product={item} />
                                    </div>
                                )
                                }
                            </>
                            :
                            <></>
                        }
                    </div>
                </div>
            </div>

        </>
    )
}
export default SearchFilter;