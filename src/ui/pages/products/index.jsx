import React, { } from "react";
import { useDispatch } from "react-redux";
import ProductItem, { ProductItemSkeleton } from "../../components/product/product_item";
import SearchBar from "../../components/search-bar";
import { useProductsPaginatedQuery } from "../../../hooks/product";

const ProductListPage = () => {
  const dispatch = useDispatch();

  const { products, reachEnd, isLoading, fetchProducts } = useProductsPaginatedQuery();

  const isRefreshing = isLoading && (products === null || products === undefined || products.length === 0);

  return (
    <div>
      <SearchBar />

      <div className="flex flex-col">
        <div className="grid grid-cols-3 gap-4 mt-[25px] xxl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 xs:grid-cols-1">
          {
            isRefreshing ? (Array.from(new Array(4))).map((item, index) => {
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
              disabled={isLoading}
            >
              {isLoading ? "Загрузка..." : "Загрузить еще"}
              {isLoading && <span className="ml-2"><i className="fa-solid fa-spinner-third animate-spin"></i></span>}
            </button>
          }
        </div>

        <div className="mt-8"></div>

      </div>
    </div>
  );
}

export default ProductListPage;