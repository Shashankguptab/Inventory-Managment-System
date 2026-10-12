import { useEffect, useState } from "react";
import api from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const initialFormData = {
    name: "",
    sku: "",
    category: "",
    description: "",
    price: "",
    quantity: "",
    low_stock_threshold: 5,
  };

  const [formData, setFormData] = useState(initialFormData);

  // Read Products
  const fetchProducts = async () => {
    try {
      const response = await api.get("products/");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load products.");
    }
  };

  // Read Cateories

  const fetchCategories = async () => {
    try {
      const response = await api.get("categories/");
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load categories.");
    }
  };

  // Run when page loads
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);


  // HANDLE FORM INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //// CREATE OR UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        // UPDATE
        await api.put(`products/${editingId}/`, formData);
      } else {
        // CREATE
        await api.post("products/", formData);
      }

      // Clear form
      setFormData(initialFormData);
      setEditingId(null);

      // Reload products
      fetchProducts();

    } catch (error) {
      console.error(error.response?.data || error);
      setError("Unable to save product.");
    }
  };

  // EDIT PRODUCT
  const handleEdit = (product) => {
    setEditingId(product.id);

    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      low_stock_threshold: product.low_stock_threshold,
    });
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`products/${id}/`);

      fetchProducts();

    } catch (error) {
      console.error(error.response?.data || error);
      setError("Unable to delete product.");
    }
  };

  // CANCEL EDIT
  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialFormData);
  };

  return (
    <div>
      <h1>Products</h1>
      {/* PRODUCT FORM */}
      <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name: </label>
          <input type="text"name="name"value={formData.name}onChange={handleChange}required/>
        </div>

        <br />

        <div>
          <label>SKU: </label>
          <input type="text"name="sku"value={formData.sku}onChange={handleChange}required/>
        </div>

        <br />

        <div>
          <label>Category: </label>
          <select name="category"value={formData.category}onChange={handleChange}required>
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category.id}value={category.id}>{category.name} </option>
            ))}

          </select>
        </div>

        <br />

        <div>
          <label>Description: </label>
          <input type="text"name="description"value={formData.description}onChange={handleChange}/>
        </div>

        <br />

        <div>
          <label>Price: </label>
          <input type="number"step="0.01"name="price"value={formData.price}onChange={handleChange}required/>
        </div>

        <br />

        <div>
          <label>Quantity: </label>
          <input type="number"min="0"name="quantity"value={formData.quantity}onChange={handleChange}required />
        </div>

        <br />

        <div>
          <label>Low Stock Threshold: </label>
          <input type="number" min="0" name="low_stock_threshold" value={formData.low_stock_threshold} onChange={handleChange}required/>
        </div>

        <br />

        <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
        {editingId && (
            <button type="button" onClick={handleCancel}>Cancel</button>
        )}
      </form>
      {error && <p>{error}</p>}
      <hr />

      {/* PRODUCT TABLE */}
      <h2>Product List</h2>

      {products.length === 0 ? ( <p>No products available.</p> ) : (
        <table border="1" cellPadding="10">

          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.category_name}</td>
                <td>₹{product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  {product.is_low_stock ? "Low Stock": "In Stock"}
                </td>
                <td>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  {" "}
                  <button onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}

          </tbody>

        </table>
      )}

    </div>
  );
}

export default Products;