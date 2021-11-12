// import logo from './logo.svg';
import './App.css';
import {Route, BrowserRouter, Switch} from 'react-router-dom';
import React from 'react';
import Navbar from './components/navbar';
import Ad from './components/ad';
import Main from './components/main';
import Login from './components/login';
import Add from './components/add ad';
import Lk from './components/lk';
import Ads from './components/ads';
import Category from './components/category';
import About from './components/about-us';
import Articles from './components/articles';
import Article from './components/article';
import Wallet from './components/wallet';
import Contacts from './components/contacts';
import Signin from './components/signin';

class App extends React.Component{
  render(){
    return(
      <div className="container-fluid">
        <div className="row">
            <div className="col-md-2 bg-success px-0 d-none d-md-block text-white text-center" style={{backgroundSize : "auto", backgroundPosition: "right top", backgroundImage: "url('https://www.house.kg/build/images/banners/branding-left-imarat-20-may.e320d43f.png')",backgroundRepeat: "no-repeat"}}>
            
            </div>
            <div className="col-md-8 px-0">
            <div className="col-md-12 bg-success px-0 text-white text-center">
                <img src="img/top.png" width="100%"/>
            </div>
            <BrowserRouter>
            <Switch>
            <Route exact path="/" component={Main}/>
            <Route path="/ad" component={Ad}/>
            <Route path="/signin" component={Signin}/>
            <Route path="/add" component={Add}/>
            <Route path="/lk"  component={Lk}/>
            <Route path="/ad add" component={Add}/>
            <Route path="/ads" component={Ads}/>
            <Route path="/category" component={Category}/>
            <Route path="/about-us" component={About}/>
            <Route path="/articles" component={Articles}/>
            <Route path="/article" component={Article} />
            <Route path="/wallet" component={Wallet}/>
            <Route path="/contacts" component={Contacts}/>
            <Route path="/login" component={Login}/>
            </Switch>
            </BrowserRouter>
            <footer class="blog-footer">
              <p>Ош Парк <script type="text/javascript">document.write(new Date().getFullYear());</script></p>
            </footer>
            </div>
            <div className="col-md-2 bg-success px-0 d-none d-md-block text-white text-center" style={{backgroundSize : "auto", backgroundImage: "url('https://www.house.kg/build/images/banners/branding-left-imarat-20-may.e320d43f.png')",backgroundRepeat: "no-repeat"}}>
                
            </div>
        </div>
      </div>
    );
  }
}


export default App;
