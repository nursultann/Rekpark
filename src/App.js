// import logo from './logo.svg';
import top from './img/top.png';
import {Route, BrowserRouter, Switch} from 'react-router-dom';
import React from 'react';
import Navbar from './components/navbar';
import Ad from './screens/ad';
import Main from './screens/main';
import Login from './screens/login';
import CreateAd from './screens/create';
import EditAd from './screens/edit';
import Profile from './screens/profile';
import Ads from './screens/ads';
import Category from './screens/category';
import About from './screens/about';
import Articles from './screens/articles';
import Article from './screens/article';
import Wallet from './screens/wallet';
import Contacts from './screens/contacts';
import Register from './screens/register';
import Footer from './components/footer';
import './dist/css/bootstrap.css';
import './blog.css';
import "./App.css";


class App extends React.Component{
  render(){
    return(
      <div className="container-fluid">
        <div className="row">
            <div className="col-md-1 px-0 d-none d-md-block text-white text-center" 
              style={{backgroundSize : "auto", backgroundPosition: "right top", 
                backgroundImage: "url('https://www.house.kg/build/images/banners/branding-left-imarat-20-may.e320d43f.png')",
                backgroundRepeat: "no-repeat"}}>
            </div>
            <div className="col-md-10 px-0" style={{ backgroundColor: '#fafafa' }}>
            <div className="col-md-12 bg-success px-0 text-white text-center">
                <img src={top} width="100%"/>
            </div>
            <BrowserRouter>
              <Switch>
                <Route exact path="/" component={Main}/>
                <Route path="/products/create" component={CreateAd}/>
                <Route path="/products/:id/edit" component={EditAd} />
                <Route path="/products/:id" component={Ad}/>
                <Route path="/products" component={Ads}/>
                <Route path="/products/create" component={CreateAd} />
                <Route path="/register" component={Register}/>
                <Route path="/profile"  component={Profile}/>
                <Route path="/category" component={Category}/>
                <Route path="/about" component={About}/>
                <Route path="/articles" component={Articles}/>
                <Route path="/article" component={Article} />
                <Route path="/wallet" component={Wallet}/>
                <Route path="/contacts" component={Contacts}/>
                <Route path="/login" component={Login}/>
              </Switch>
            </BrowserRouter>
            
            </div>
            <div className="col-md-1 px-0 d-none d-md-block text-white text-center" 
              style={{
                backgroundSize : "auto", 
                backgroundImage: "url('https://www.house.kg/build/images/banners/branding-left-imarat-20-may.e320d43f.png')",
                backgroundRepeat: "no-repeat"
                }}></div>
        </div>
      </div>
    );
  }
}


export default App;
