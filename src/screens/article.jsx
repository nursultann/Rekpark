import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
class Article extends React.Component{
    render(){
        return(
            <div>
                <Navbar/>
            <div className="row">
                <div className="col-md-12">
                    <img src="" width="100%" />
                </div>
                <div className="col-md-12">
                    
                </div>
            </div>
            <Footer/>
            </div>
        );
    }
}
export default Article;