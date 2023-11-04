import {useDispatch, useSelector} from "react-redux";
import * as api from "../api";
import {setCategories} from "../redux/actions/category_actions";
import {useEffectOnce} from "react-use";

export function useCategoriesTree() {
    const dispatch = useDispatch();
    const {categories} = useSelector((state) => state.category);

    const fetchCategoriesTree = async () => {
        const categories = await api.fetchCategoriesTree();
        if (categories != null) {
            dispatch(setCategories(categories));
        }
    };

    useEffectOnce(() => {
        fetchCategoriesTree().then();
    })

    return categories;
}