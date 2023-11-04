import { ActionTypes } from "../../config/constants/action_types"

const initialState = {
    productsPlans: [],
}

export const productPlansReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_PLANS:
            return { ...state, productsPlans: payload };
        default:
            return state;
    }
}