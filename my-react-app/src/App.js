import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import SubCategoryPage from './components/SubCategoryPage';
import ProductPage from './components/ProductPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage'; // Import ForgotPasswordPage
import Sidebar from './components/sidebar'; // Abstracted Sidebar
import './App.css';

function App() {
    return (
        <Router>
            <div style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar /> {/* Using the extracted Sidebar component */}
                <div style={{ padding: '20px', flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/categories" element={<CategoryPage />} />
                        <Route path="/subcategories" element={<SubCategoryPage />} />
                        <Route path="/products" element={<ProductPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} /> {/* Add ForgotPasswordPage route */}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
