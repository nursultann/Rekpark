import { ActionTypes } from "../../constants/action_types";

export const setUser = (user) => {
    return {
        type: ActionTypes.SET_USER,
        payload: user,
    }
}