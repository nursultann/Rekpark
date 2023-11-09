import { useState } from "react";
import Navbar from "../components/navbar";
import { useParams } from "react-router-dom/cjs/react-router-dom";

const FilterSearch = ()=>{
    const [products,setProducts] = useState([]);
    const params = useParams();
    const product = params.form;
    console.log('product',JSON.parse(product));
    
    return(
        <>
            <Navbar/>

        
        
        </>
    )
}
export default FilterSearch;