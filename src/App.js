import React from 'react';
import top from './dist/img/topbanner.png';
import { Route, BrowserRouter, Router, Routes } from 'react-router-dom';
import ProductDetailPage from './ui/pages/products/detail';
import HomePage from './ui/pages/home';
import SignInPage from './ui/pages/auth/sign_in';
import CreateProductPage from './ui/pages/products/create';
import EditProductPage from './ui/pages/products/edit';
import ProfilePage from './ui/pages/profile';
import ProductListPage from './ui/pages/products';
import ProductsFilterPage from './ui/pages/products/filter';
import AboutPage from './ui/pages/about';
import ArticleListPage from './ui/pages/articles';
import ArticleDetailPage from './ui/pages/articles/detail';
import ContactsPage from './ui/pages/profile/contacts';
import SignUpPage from './ui/pages/auth/sign_up';
import SettingsPage from './ui/pages/profile/settings';
import WalletsPage from './ui/pages/profile/wallets';
import ForgotPasswordPage from './ui/pages/auth/forgot_password';
import ProductsSearchResultPage from './ui/pages/products/search_result';
import ProductFavoritesPage from './ui/pages/products/favorites';
import Footer from './ui/components/footer';
import UserProductListPage from './ui/pages/products/user_products';
import ChatListPage from './ui/pages/chat';
import ChatWithUserPage from './ui/pages/chat/detail';
import BusinessProfile from './ui/pages/business/bussiness_profile_page';
import BusinessSettings from './ui/pages/business/bussiness_settings';
import SetBusinessProfile from './ui/pages/business/bussiness';
import BusinessPlan from './ui/pages/business/bussiness_plan';
import Gallery from './ui/pages/business/photo_gallery';
import ArticlesFilterPage from './ui/pages/articles/filter';
import AgreementPage from './ui/pages/profile/agreement';
import CompletePage from './ui/pages/profile/complete';
import { QueryClient, QueryClientProvider } from "react-query";
import SocketHelper from './helpers/pusher';
import eventBus from './helpers/event_bus';
import { message as antMessage } from 'antd';
import Navbar from './ui/components/navbar';
import { useEffectOnce } from "react-use";
import { userDetails } from './api';

import 'moment/locale/ru';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-gallery-carousel/dist/index.css';
import 'react-alice-carousel/lib/alice-carousel.css';
import "./dist/css/app.css";
import Layout from './layouts/layout';

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
        <Routes>
          <Route element={<Layout requireAuth={false} />}>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/forgot_password" element={<ForgotPasswordPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/category/:id" element={<ProductsFilterPage />} />
            <Route path="/search_result/:search" element={<ProductsSearchResultPage />} />
            <Route path="/about_us" element={<AboutPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/articles" element={<ArticleListPage />} />
            <Route path="/article/:id" element={<ArticleDetailPage />} />
            <Route path="/articles_categories/:id" element={<ArticlesFilterPage />} />
            <Route path={"/userAds/:id"} element={<UserProductListPage />} />
            <Route path={"/about"} element={<AboutPage />} />
            <Route path={'/agreement'} element={<AgreementPage />} />
          </Route>

          <Route element={<Layout requireAuth={true} />}>
            <Route path="/products/create" element={<CreateProductPage />} />
            <Route path="/products/:id/edit" element={<EditProductPage />} />
            <Route path="/myads" element={<ProfilePage />} />
            <Route path="/favorites" element={<ProductFavoritesPage />} />
            <Route path="/profile" element={<SettingsPage />} />
            <Route path="/wallets" element={<WalletsPage />} />
            <Route path="/complete" element={<CompletePage />} />
            <Route path={"/chats"} element={<ChatListPage />} />
            <Route path={"/chat/:id?/:ad_id"} element={<ChatWithUserPage />} />
            <Route path="/business-profile" element={<BusinessProfile />} />
            <Route path="/business-settings" element={<BusinessSettings />} />
            <Route path="/business" element={<SetBusinessProfile />} />
            <Route path={"/business-plan/:id/:period"} element={<BusinessPlan />} />
            <Route path={"/gallery"} element={<Gallery />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </QueryClientProvider >
  );
}

export default App;
