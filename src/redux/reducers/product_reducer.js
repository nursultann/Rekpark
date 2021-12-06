import { ActionTypes } from "../../constants/action_types"

const initialState = {
    products: [],
    productDetails: null,
}

export const productReducer = (state = initialState, {type, payload}) => {
    switch(type) {
        case ActionTypes.SET_PRODUCTS:
            return { ...state, products: payload };
        case ActionTypes.SET_SELECTED_PRODUCT:
            return { ...state, productDetails: payload };
        default: 
            return state;
    }
}