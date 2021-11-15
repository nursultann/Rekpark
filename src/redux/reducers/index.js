import { combineReducers } from "redux";
import { productReducer } from "./product_reducer"; 
import { categoryReducer } from "./category_reducer";

export const reducers = combineReducers({
    product: productReducer,
    category: categoryReducer,
});