import React from "react";
import Navbar from "./navbar";

class SearchResult extends React.Component{
    render(){
        return(
            <div>
                <Navbar />
            <h3>Результаты поиска</h3>
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-4 mt-2 mb-2">
                            <div class="card">
                                <img src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg" class="card-img-top" alt="..."/>
                                <div class="card-body">
                                    <h5 class="card-title">З</h5>
                                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <a href="/ad" class="badge badge-primary px-2 py-2">Подробнее</a>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
            </div> 
        );
    }
}
export default SearchResult;