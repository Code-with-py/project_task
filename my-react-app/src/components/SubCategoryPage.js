// SubCategoryPage component
import React, { useState, useEffect } from 'react';
import api from '../api';
import '../App.css';

const SubCategoryPage = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newSubCategory, setNewSubCategory] = useState({ name: '', image: null, category: '' });
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/subcategories/')
            .then(response => {
                setSubcategories(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });

        api.get('/categories/')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleImageChange = (e) => {
        setNewSubCategory({ ...newSubCategory, image: e.target.files[0] });
    };

    const handleChange = (e) => {
        setNewSubCategory({ ...newSubCategory, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newSubCategory.name);
        if (newSubCategory.image) {
            formData.append('image', newSubCategory.image);
        }
        formData.append('category', newSubCategory.category);

        if (editingSubCategory) {
            api.put(`/subcategories/${editingSubCategory.id}/`, formData)
                .then(response => {
                    const updatedSubCategories = subcategories.map(subcat =>
                        subcat.id === editingSubCategory.id ? response.data : subcat
                    );
                    setSubcategories(updatedSubCategories);
                    setEditingSubCategory(null);
                    setNewSubCategory({ name: '', image: null, category: '' });
                })
                .catch(error => {
                    console.error('Error updating subcategory:', error);
                });
        } else {
            api.post('/subcategories/', formData)
                .then(response => {
                    setSubcategories([...subcategories, response.data]);
                    setNewSubCategory({ name: '', image: null, category: '' });
                })
                .catch(error => {
                    console.error('Error adding subcategory:', error);
                });
        }
    };

    const handleEditSubCategory = (subcategory) => {
        setEditingSubCategory(subcategory);
        setNewSubCategory({ name: subcategory.name, image: null, category: subcategory.category });
    };

    const handleDeleteSubCategory = (subcategoryId) => {
        api.delete(`/subcategories/${subcategoryId}/`)
            .then(() => {
                setSubcategories(subcategories.filter(subcategory => subcategory.id !== subcategoryId));
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div>
            <h2>Subcategories</h2>
            {loading ? (
                <p>Loading subcategories...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subcategories.map(subcategory => (
                            <tr key={subcategory.id}>
                                <td>{subcategory.name}</td>
                                <td>{subcategory.category.name}</td>
                                <td>
                                    <button style={{ backgroundColor: 'blue', color: 'white' }} onClick={() => handleEditSubCategory(subcategory)}>Edit</button>
                                    <button onClick={() => handleDeleteSubCategory(subcategory.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <h3>{editingSubCategory ? 'Edit Subcategory' : 'Add New Subcategory'}</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Subcategory Name"
                    value={newSubCategory.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <select
                    name="category"
                    value={newSubCategory.category}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select Category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <button type="submit">{editingSubCategory ? 'Update Subcategory' : 'Add Subcategory'}</button>
            </form>
        </div>
    );
};

export default SubCategoryPage;