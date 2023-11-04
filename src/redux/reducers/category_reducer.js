import { ActionTypes } from "../../config/constants/action_types"

const initialState = {
    categories: []
}

export const categoryReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_CATEGORIES:
            return { ...state, categories: payload };
        default:
            return state;
    }
}