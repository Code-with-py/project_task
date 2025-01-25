import React, { useState, useEffect } from 'react';
import api from '../api';
import '../App.css';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: 0, image: null, subcategory: '' });
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch products
        api.get('/products/')
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });

        // Fetch subcategories
        api.get('/subcategories/')
            .then(response => {
                setSubcategories(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleImageChange = (e) => {
        setNewProduct({ ...newProduct, image: e.target.files[0] });
    };

    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price);
        if (newProduct.image) {
            formData.append('image', newProduct.image);
        }
        formData.append('subcategory', newProduct.subcategory);

        if (editingProduct) {
            api.put(`/products/${editingProduct.id}/`, formData)
                .then(response => {
                    const updatedProducts = products.map(prod =>
                        prod.id === editingProduct.id ? response.data : prod
                    );
                    setProducts(updatedProducts);
                    setEditingProduct(null);
                    setNewProduct({ name: '', price: 0, image: null, subcategory: '' });
                })
                .catch(error => {
                    console.error('Error updating product:', error.response ? error.response.data : error.message);
                });
        } else {
            api.post('/products/', formData)
                .then(response => {
                    setProducts([...products, response.data]);
                    setNewProduct({ name: '', price: 0, image: null, subcategory: '' });
                })
                .catch(error => {
                    console.error('Error adding product:', error.response ? error.response.data : error.message);
                });
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setNewProduct({ name: product.name, price: product.price, image: null, subcategory: product.subcategory });
    };

    const handleDeleteProduct = (productId) => {
        api.delete(`/products/${productId}/`)
            .then(() => {
                setProducts(products.filter(product => product.id !== productId));
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div>
            <h2>Products</h2>
            {loading ? (
                <p>Loading products...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Subcategory</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.subcategory.name}</td>
                                <td>
                                    <button style={{ backgroundColor: 'blue', color: 'white' }} onClick={() => handleEditProduct(product)}>Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={newProduct.price}
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
                    name="subcategory"
                    value={newProduct.subcategory}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select Subcategory</option>
                    {subcategories.map(subcategory => (
                        <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                    ))}
                </select>
                <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
            </form>
        </div>
    );
};

export default ProductPage;
