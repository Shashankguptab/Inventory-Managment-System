import { useEffect, useState } from "react";
import api from "../api/axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const initialFormData = {
    name: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // READ CATEGORIES
  const fetchCategories = async () => {
    try {
      const response = await api.get("categories/");
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // HANDLE FORM INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  // CREATE OR UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        // UPDATE 
        await api.put( `categories/${editingId}/`,formData);
      } else {
        // CREATE
        await api.post("categories/",formData);
      }

      setFormData(initialFormData);
      setEditingId(null);

      fetchCategories();

    } catch (error) {
      console.error(error.response?.data || error);
      setError("Unable to save category.");
    }
  };

  // EDIT
  const handleEdit = (category) => {
    setEditingId(category.id);

    setFormData({
      name: category.name,
      description: category.description,
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`categories/${id}/`);
      fetchCategories();
    } catch (error) {
      console.error(error.response?.data || error);

      setError(
        "Unable to delete category. It may be used by a product."
      );
    }
  };

  // CANCEL EDIT
  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialFormData);
  };


  return (
    <div>

      <h1>Categories</h1>
      <h2>
        {editingId
          ? "Edit Category"
          : "Add Category"}
      </h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Category Name: </label>
          <input type="text"  name="name" value={formData.name} onChange={handleChange}required
          />
        </div>

        <br />

        <div>
          <label>Description: </label>
          <input type="text"name="description"value={formData.description}onChange={handleChange}/>
        </div>

        <br />

        <button type="submit">
          {editingId
            ? "Update Category"
            : "Add Category"}</button>

        {editingId && (
          <button type="button"onClick={handleCancel}>Cancel</button>
        )}

      </form>

      {error && <p>{error}</p>}

      <hr />

      <h2>Category List</h2>

      {categories.length === 0 ? (
        <p>No categories available.</p>
      ) : (
        <table border="1" cellPadding="10">

          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  {new Date(category.created_at).toLocaleDateString()}
                </td>

                <td>
                  <button onClick={() =>handleEdit(category)}>Edit</button>

                  {" "}
                  <button onClick={() =>handleDelete(category.id)}>Delete</button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      )}

    </div>
  );
}

export default Categories;