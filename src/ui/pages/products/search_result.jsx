import React, { useState, useEffect } from "react";
import { fetchSearchProducts } from "../../../api/product";
import ProductItem, { ProductItemSkeleton } from "../../components/product/product_item";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import SearchBar from "../../components/search-bar";

const ProductsSearchResultPage = ({ match }) => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState();
    const limit = 20;
    const [offset, setOffset] = useState(0);
    const [reachEnd, setReachEnd] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchQuery = searchParams.get('q');
    const fetchProducts = async () => {
        if (loading) return;
        setLoading(true);
        let prods = products.concat(await fetchSearchProducts({ offset: offset, 'with': 'user;region;city', 'searchText': searchQuery }));
        if (prods != null) {
            setProducts(prods);
            setOffset(offset + limit);
            if (prods.length < limit) {
                setReachEnd(true);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const isLoading = loading && (products === null || products === undefined || products.length === 0);

    return (
        <div>
            <Helmet>
                <title>Поиск</title>
            </Helmet>

            <SearchBar query={searchQuery} />

            <div className="flex flex-col py-3">

                <label className="pt-3 flex flex-row gap-4" style={{ fontSize: 20, color: "black" }}>
                    Результаты поиска: <span>{searchQuery}</span>
                </label>

                <hr className="pb-2 mt-2" />

                <div className="grid grid-cols-3 gap-4 mt-[25px] xxl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1">
                    {
                        isLoading ? (Array.from(new Array(4))).map((item, index) => {
                            return (
                                <ProductItemSkeleton
                                    key={index}
                                />
                            )
                        }) :
                            products?.map((item, index) => {
                                return (
                                    <ProductItem
                                        key={index}
                                        product={item}
                                        onClick={() => { }}
                                    />
                                )
                            })
                    }
                </div>
                <div className="flex flex-row justify-center mt-4">
                    {!reachEnd &&
                        <button
                            onClick={() => {
                                fetchProducts();
                            }}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Загрузить еще
                        </button>
                    }
                </div>

                <div className="mt-8"></div>
            </div>
        </div>
    );
}

export default ProductsSearchResultPage;