import { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/navbar";


const BussinessPlan = () =>{
    const { bussinessPlan } = useSelector((state) => state.bussiness);
    const bussinessPlanDetails = async ()=>{
    if(bussinessPlan != null){
    const plan = bussinessPlan;
    console.log(plan, "Plan Details");
    }
}
    useEffect(()=>{
        bussinessPlanDetails();
    })
    return(
        <>
        <Navbar/>
        </>
    );
}
export default BussinessPlan;