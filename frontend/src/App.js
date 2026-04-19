import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Shop from './Pages/Shop'; 
import Cart from './Pages/Cart'; 
import LoginSignup from './Pages/LoginSignup';
import ResetPassword from './Pages/ResetPassword'; 
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kid_banner from './Components/Assets/banner_kids.png';

// Correct imports for User Dashboard components
import UserDashboard from './Components/UserDashboard/UserDashboard'; 
import Profile from './Components/UserDashboard/Profile';
import OrderHistory from './Components/UserDashboard/OrderHistory';
import Wishlist from './Components/UserDashboard/Wishlist';
import AccountSettings from './Components/UserDashboard/AccountSettings';
import Notifications from './Components/UserDashboard/Notifications';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Shop />} />
          
          {/* Shop Categories Routes with dynamic banners */}
          <Route path="/mens" element={<ShopCategory banner={men_banner} category="men" />} />
          <Route path="/womens" element={<ShopCategory banner={women_banner} category="women" />} />
          <Route path="/kids" element={<ShopCategory banner={kid_banner} category="kids" />} />

          {/* Product Route */}
          <Route path="/product/:productId" element={<Product />} />
          
          {/* Cart & Auth Routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* User Dashboard Routes */}
          <Route path="/dashboard" element={<UserDashboard />}>
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
