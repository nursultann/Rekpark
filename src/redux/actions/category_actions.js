import { ActionTypes } from "../../config/constants/action_types";

export const setCategories = (categories) => {
    return {
        type: ActionTypes.SET_CATEGORIES,
        payload: categories,
    }
}