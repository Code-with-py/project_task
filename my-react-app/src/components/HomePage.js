import React from 'react';
import '../App.css';

const HomePage = () => {
    return (
        <div className="homepage-container">
            <div className="hero-section">
                <h1 className="hero-title">Admin Dashboard</h1>
                <p className="hero-description">
                    Seamlessly manage your categories, subcategories, and products with our intuitive dashboard.
                </p>
                <button className="cta-button">Get Started</button>
            </div>
            <div className="features-section">
                <h2 className="features-title">Key Features</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Categories</h3>
                        <p>Easily add, edit, or delete product categories.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Subcategories</h3>
                        <p>Organize your products into detailed subcategories.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Products</h3>
                        <p>Manage product listings with descriptions, prices, and images.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

