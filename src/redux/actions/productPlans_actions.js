import { ActionTypes } from "../../config/constants/action_types";

export const setProductPlans = (productsPlans) => {
    return {
        type: ActionTypes.SET_PLANS,
        payload: productsPlans,
    }
}