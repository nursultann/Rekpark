import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
class Articles extends React.Component{
    render(){
        return(
            <div>
            <Navbar/>
            <div className="row px-2">
            <div className="col-md-10">
               <div className="col-md-12">
                   <label style={{fontSize:28}} className="">Статьи и новости</label>
                    <hr/>
               </div>
               <a class="nav-link" href="/article">
                <div className="col-md-12 shadow-sm">
                    <div className="row">
                        <div className="col-md-3">
                        <img src="" width="100%"/>
                        </div>
                        <div className="col-md-9">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        
                        </div>
                    </div>
                <hr/>    
                </div>
                </a>
                <a class="nav-link" href="/article">
                <div className="col-md-12 shadow-sm">
                    <div className="row">
                        <div className="col-md-3">
                        <img src="" width="100%"/>
                        </div>
                        <div className="col-md-9">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        Подробнее
                        </div>
                    </div>
                <hr/>    
                </div>
                </a>            
            </div>
            <div className="col-md-2">

            </div>
            </div>
            <Footer/>
            </div>
        );
    }
}
export default Articles;