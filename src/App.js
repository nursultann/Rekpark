import React from 'react';
import top from './dist/img/topbanner.png';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Ad from './ui/screens/ad';
import Main from './ui/screens/main';
import Login from './ui/screens/login';
import CreateAd from './ui/screens/create';
import EditAd from './ui/screens/edit';
import Profile from './ui/screens/profile';
import Ads from './ui/screens/ads';
import Category from './ui/screens/category';
import About from './ui/screens/about';
import Articles from './ui/screens/articles';
import Article from './ui/screens/article';
import Contacts from './ui/screens/contacts';
import Register from './ui/screens/register';
import Settings from './ui/screens/userSettings';
import Wallets from './ui/screens/wallets';
import ForgotPassword from './ui/screens/forgot_password';
import SearchResult from './ui/screens/search_result';
import Favorites from './ui/screens/favorites';
import Footer from './ui/components/footer';
import UserAds from './ui/screens/user_ads';
import Chats from './ui/screens/chats';
import BusinessProfile from './ui/screens/bussiness_profile_page';
import BusinessSettings from './ui/screens/bussiness_settings';
import { userDetails } from './api';
import CategoryArticles from './ui/screens/category_article';
import SetBusinessProfile from './ui/screens/bussiness';
import BusinessPlan from './ui/screens/bussiness_plan';
import ChatUser from './ui/screens/chat';
import Gallery from './ui/screens/photo_gallery';
import Agreement from './ui/screens/agreement';
import Complete from './ui/screens/complete';
import { QueryClient, QueryClientProvider } from "react-query";
import SocketHelper from './helpers/pusher';
import eventBus from './helpers/event_bus';
import { message as antMessage } from 'antd';
import Navbar from './ui/components/navbar';
import { useEffectOnce } from "react-use";

import 'moment/locale/ru';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-gallery-carousel/dist/index.css';
import 'react-alice-carousel/lib/alice-carousel.css';
import "./dist/css/app.css";
import './dist/css/blog.css';

const queryClient = new QueryClient();

const App = ({ match }) => {
  const subscribe = async () => {
    const user = await userDetails();
    if (localStorage.getItem('token')) {
      const messages = SocketHelper.getInstance().subscribeTo(`chat.${user.id}`)
      for await (let message of messages) {
        message = JSON.parse(message);
        if (message['event'] == 'message-event') {

          const msg = JSON.stringify(message['data']);
          eventBus.dispatch('chat-message', msg);
          if (msg != null) {
            antMessage.info("Вам пришло сообщение!");
            // alert(messag);
          }
        }
      }
    }
  }

  useEffectOnce(() => {
    subscribe();
  });

  return (
    // url('https://www.house.kg/build/images/banners/branding-left-imarat-20-may.e320d43f.png')
    // url('https://www.house.kg/build/images/banners/branding-left-imarat-20-may.e320d43f.png')
    <QueryClientProvider client={queryClient}>

      <BrowserRouter>
        <Switch>
          <RouteLayout exact path="/" component={Main} />
          <RouteLayout path="/products/create" component={CreateAd} />
          <RouteLayout path="/products/:id/edit" component={EditAd} />
          <RouteLayout path="/products/:id" component={Ad} />
          <RouteLayout path="/products" component={Ads} />
          <RouteLayout path="/products/create" component={CreateAd} />
          <RouteLayout path="/register" component={Register} />
          <RouteLayout path="/myads" component={Profile} />
          <RouteLayout path="/favorites" component={Favorites} />
          <RouteLayout path="/category/:id" component={Category} />
          <RouteLayout path="/about_us" component={About} />
          <RouteLayout path="/contacts" component={Contacts} />
          <RouteLayout path="/login" component={Login} />
          <RouteLayout path="/profile" component={Settings} />
          <RouteLayout path="/forgot_password" component={ForgotPassword} />
          <RouteLayout path="/wallets" component={Wallets} />
          <RouteLayout path="/complete" component={Complete} />
          <RouteLayout path="/articles" component={Articles} />
          <RouteLayout path="/articles_categories/:id" component={CategoryArticles} />
          <RouteLayout path="/article/:id" component={Article} />
          <RouteLayout path="/search_result/:search" component={SearchResult} />
          <RouteLayout path={"/userAds/:id"} component={UserAds} />
          <RouteLayout path={"/chats"} component={Chats} />
          <RouteLayout path={"/chat/:id?/:ad_id"} component={ChatUser} />
          <RouteLayout path="/business-profile" component={BusinessProfile} />
          <RouteLayout path="/business-settings" component={BusinessSettings} />
          <RouteLayout path="/business" component={SetBusinessProfile} />
          <RouteLayout path={"/business-plan/:id/:period"} component={BusinessPlan} />
          <RouteLayout path={"/about"} component={About} />
          <RouteLayout path={"/gallery"} component={Gallery} />
          <RouteLayout path={'/agreement'} component={Agreement} />
        </Switch>
      </BrowserRouter>

    </QueryClientProvider>
  );
}

function RouteLayout({ path, component, ...rest }) {
  return (
    <Route
      path={path}
      {...rest}
      render={({ location }) => {
        return (
          <>
            <div className="col-lg-12 bg-success px-0 text-white text-center">
              <img src={top} width="100%" />
            </div>
            <Navbar />
            <div className="container-fluid p-0">

              <div className="row">
                <div className="col-1-5 px-0 d-none d-lg-block text-white text-center"
                  style={{
                    backgroundSize: "auto", backgroundPosition: "right top",
                    backgroundImage: "",
                    backgroundRepeat: "no-repeat"
                  }}>
                </div>
                <div className="col-lg-9 px-0" style={{ backgroundColor: '#fff', minHeight: "500px" }}>
                  {React.createElement(component, { location })}
                </div>
                <div className="col-1-5 px-0 d-none d-lg-block text-white text-center"
                  style={{
                    backgroundSize: "auto",
                    backgroundImage: "",
                    backgroundRepeat: "no-repeat"
                  }}>
                </div>
              </div>
            </div>
          </>
        )
      }}
    />
  );
}

export default App;
