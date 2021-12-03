import { ActionTypes } from "../../constants/action_types";

export const setProducts = (products) => {
    return {
        type: ActionTypes.SET_PRODUCTS,
        payload: products,
    }
}

export const selectedProduct = (product) => {
    return {
        type: ActionTypes.SELECTED_PRODUCT,
        payload: product,
    }
}
export const favoriteProducts = (products)=>{
    return{
        type:ActionTypes.SET_FAVORITE,
        payload:products,
    }
}