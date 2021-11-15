import React from "react";
import Ad from "./ad";
import Navbar from "./navbar";
import SearchBar from "./search-bar";
class Ads extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          error:null,
          isLoaded:false,
          products:[]
        };
      }
      componentDidMount(){
        fetch("http://univerosh.kg/testapp/public/api/products?limit=20&offset=0")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded:true,
              products:result.data
            
            });
          },
          (error) => {
            this.setState({
                isLoaded:true,
                error
            });
          }
      )
  }
    render(){
        const {error,isLoaded, products} = this.state;
        if(error){
            return <p>Error {Error.message}</p>
          }else if(!isLoaded){
            return <p>Loading</p>
          }  
        return( 
            <div>
                <Navbar/>
                <SearchBar/>
            <div className="col-md-12">
                <div className="row">
                {products.map(item =>(
                     <div className="col-md-4 mt-2 mb-2" key={item.id}>
                            <div class="card">
                                <img src={item.media.original_url} class="card-img-top" alt="..."/>
                                <div class="card-body">
                                    <h5 class="card-title">{item.title}</h5>
                                    <p class="card-text">{item.description}</p>
                                    <a href={'/ad/id='+item.id} class="badge badge-primary px-2 py-2">Подробнее</a>
                                </div>
                            </div>
                    </div>
                ))}
                </div>
            </div>                  
            </div>
        );
    }
}
export default Ads;