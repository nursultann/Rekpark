import React, { useEffect } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
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
import { useEffectOnce } from "react-use";
import { message, notification } from 'antd';

import 'moment/locale/ru';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-gallery-carousel/dist/index.css';
import 'react-alice-carousel/lib/alice-carousel.css';
import "./dist/css/app.css";
import Layout from './layouts/layout';
import ReactModal from 'react-modal';
import Profilelayout from './ui/pages/profile/layout';
import NotFound from './ui/pages/not_found';
import { useChatStore } from './store/chat_store';
import { useUserStore } from './store/user_store';
import { Slide, Snackbar } from '@mui/material';

import notificationSound from './dist/audio/notification.ogg';

const queryClient = new QueryClient();
ReactModal.setAppElement('#root');

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

const App = ({ match }) => {
  const chatStore = useChatStore();
  const { isAuthenticated } = useUserStore();

  const soundRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  useEffectOnce(() => {
    if (isAuthenticated) {
      chatStore.listenMessages();
    }
  });

  useEffect(() => {
    if (chatStore.lastMessage) {
      const { lastMessage } = chatStore;
      const { selectedChat } = chatStore;

      if (selectedChat && selectedChat.id == lastMessage.room_id) {
        // chatStore.fetchMessages(lastMessage.sender_id);
      } else {
        setOpen(true);
        // chatStore.fetchChats();
      }
      soundRef.current.play();
    }
  }, [chatStore.lastMessage]);

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
            <Route path="/search-result" element={<ProductsSearchResultPage />} />
            <Route path="/about_us" element={<AboutPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/articles" element={<ArticleListPage />} />
            <Route path="/article/:id" element={<ArticleDetailPage />} />
            <Route path="/articles_categories/:id" element={<ArticlesFilterPage />} />
            <Route path="/userAds/:id" element={<UserProductListPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path='/agreement' element={<AgreementPage />} />
          </Route>
          <Route element={<Layout requireAuth={true} />}>
            <Route path="/products/create" element={<CreateProductPage />} />
            <Route path="/products/:id/edit" element={<EditProductPage />} />
            <Route element={<Profilelayout />}>
              <Route path="/profile" element={<SettingsPage />} />
              <Route path="/profile/list" element={<ProfilePage />} />
              <Route path="/profile/favorites" element={<ProductFavoritesPage />} />
              <Route path="/profile/wallets" element={<WalletsPage />} />
              <Route path="/profile/complete" element={<CompletePage />} />
              <Route path="/profile/chats" element={<ChatListPage />} />
            </Route>
            <Route path="/chat/:id?/:ad_id" element={<ChatWithUserPage />} />
            <Route path="/business-profile" element={<BusinessProfile />} />
            <Route path="/business-settings" element={<BusinessSettings />} />
            <Route path="/business" element={<SetBusinessProfile />} />
            <Route path="/business-plan/:id/:period" element={<BusinessPlan />} />
            <Route path="/gallery" element={<Gallery />} />
          </Route>


        </Routes>
      </BrowserRouter>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={6000}
        key={'bottom' + 'right'}
        TransitionComponent={TransitionLeft}
      >
        <div className="alert alert-info flex flex-row gap-2 " role="alert">
          {chatStore.lastMessage?.senderImage
            ? <img src={chatStore.lastMessage?.senderImage} className="rounded-full w-10 h-10" />
            : <div className="rounded-full w-10 h-10 bg-gray-200"></div>}
          <div className="flex flex-col gap-1">
            <div
              className="text-base"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              Новое сообщение от <strong>{chatStore.lastMessage?.senderName}</strong>
            </div>
            <p
              className="text-sm text-gray-500"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {chatStore.lastMessage?.message}
            </p>
          </div>
        </div>
      </Snackbar>

      <audio ref={soundRef} id="audio" src={notificationSound} preload="auto"></audio>

    </QueryClientProvider >
  );
}
export default App;
