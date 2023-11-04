import { ActionTypes } from "../../config/constants/action_types";

export const setUser = (user) => {
    return {
        type: ActionTypes.SET_USER,
        payload: user,
    }
}
export const setProductUserDetails = (user) => {
    return {
        type: ActionTypes.SET_PRODUCT_USER_DETAIL,
        payload: user,
    }
}