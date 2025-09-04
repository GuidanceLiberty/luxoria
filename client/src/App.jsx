import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";

// Import pages/components
import Nav from "./Components/Nav/Nav";
import Index from "./Components/Pages/Index";
import ProductDetails from "./Components/Pages/ProductDetails";
import Wishlist from "./Components/Pages/Wishlist";
import Cart from "./Components/Pages/Cart";
import Checkout from "./Components/Pages/Checkout";
import Footer from "./Components/Footer/Footer";
import About from "./Components/Pages/About";
import Shop from "./Components/Pages/Shop";
import Store from "./Components/Pages/Store";
import Blog from "./Components/Pages/Blog";
import Contact from "./Components/Pages/Contact";
import Register from "./Components/Pages/Register";
import Login from "./Components/Pages/Login";
import CreateProduct from "./Components/Pages/CreateProduct";
import UpdateProduct from "./Components/Pages/UpdateProduct";
import CategoryPage from "./Components/Pages/CategoryPage";
import EditCategory from "./Components/Pages/EditCategory";
import Profile from "./Components/Pages/Profile";
import AccessDenied from "./Components/Pages/AccessDenied";
import ManageUsers from "./Components/Pages/ManageUsers";
import Categories from "./Components/Pages/Categories";
import NotFound from "./Components/Pages/NotFound";
import Payment from "./Components/Pages/Payment";

function App() {
  return (
    <AuthProvider>
      <Nav />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/store" element={<Store />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        <Route path="/category-page" element={<CategoryPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />

        {/* Protected Routes */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-product"
          element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-product/:product_id"
          element={
            <ProtectedRoute>
              <UpdateProduct />
            </ProtectedRoute>
          }
        />

        {/* The objects you had are converted to real <Route> entries */}
        <Route
          path="/category/products/:cate/:id"
          element={<ProductDetails />}
        />
        <Route path="/categories" element={<Categories />} />
        <Route
          path="/categories/edit/:category_id"
          element={<EditCategory />}
        />
        <Route path="/profile/:user_id" element={<Profile />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </AuthProvider>
  );
}

export default App;
