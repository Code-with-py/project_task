import React, { useState, useEffect } from 'react';
import api from '../api';
import '../App.css';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', image: null });
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/categories/')
            .then(response => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewCategory({ ...newCategory, image: e.target.files[0] });
        } else {
            console.error('Error uploading image');
        }
    };

    const handleChange = (e) => {
        setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newCategory.name);
        if (newCategory.image) {
            formData.append('image', newCategory.image);
        }

        if (editingCategory) {
            api.put(`/categories/${editingCategory.id}/`, formData)
                .then(response => {
                    const updatedCategories = categories.map(cat =>
                        cat.id === editingCategory.id ? response.data : cat
                    );
                    setCategories(updatedCategories);
                    setEditingCategory(null);
                    setNewCategory({ name: '', image: null });
                })
                .catch(error => {
                    console.error('Error updating category:', error);
                });
        } else {
            api.post('/categories/', formData)
                .then(response => {
                    setCategories([...categories, response.data]);
                    setNewCategory({ name: '', image: null });
                })
                .catch(error => {
                    console.error('Error adding category:', error);
                });
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategory({ name: category.name, image: null });
    };

    const handleDeleteCategory = (categoryId) => {
        api.delete(`/categories/${categoryId}/`)
            .then(() => {
                setCategories(categories.filter(category => category.id !== categoryId));
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div>
            <h2>Categories</h2>
            {loading ? (
                <p>Loading categories...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td>{category.name}</td>
                                <td>
                                    <button style={{ backgroundColor: 'blue', color: 'white' }} onClick={() => handleEditCategory(category)}>Edit</button>
                                    <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Category Name"
                    value={newCategory.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <button type="submit">{editingCategory ? 'Update Category' : 'Add Category'}</button>
            </form>
        </div>
    );
};

export default CategoryPage;
