import React from 'react';
import { NavLink } from 'react-router-dom';
import '../App.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul className="sidebar-links">
                <li>
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/categories" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                        Categories
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/subcategories" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                        Subcategories
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/products" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                        Products
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/register" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                        Register
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/login" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                        Login
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
