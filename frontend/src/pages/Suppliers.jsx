import { useEffect, useState } from "react";
import api from "../api/axios";

function Suppliers() {
  // -----------------------------
  // STATE
  // -----------------------------

  const [suppliers, setSuppliers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const initialFormData = {
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // -----------------------------
  // READ SUPPLIERS
  // -----------------------------

  const fetchSuppliers = async () => {
    try {
      const response = await api.get("suppliers/");
      setSuppliers(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load suppliers.");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // -----------------------------
  // HANDLE FORM INPUT
  // -----------------------------

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------
  // CREATE OR UPDATE
  // -----------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        // UPDATE
        await api.put(
          `suppliers/${editingId}/`,
          formData
        );
      } else {
        // CREATE
        await api.post(
          "suppliers/",
          formData
        );
      }

      setFormData(initialFormData);
      setEditingId(null);

      fetchSuppliers();

    } catch (error) {
      console.error(error.response?.data || error);
      setError("Unable to save supplier.");
    }
  };

  // -----------------------------
  // EDIT
  // -----------------------------

  const handleEdit = (supplier) => {
    setEditingId(supplier.id);

    setFormData({
      name: supplier.name,
      contact_person: supplier.contact_person,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
    });
  };

  // -----------------------------
  // DELETE
  // -----------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`suppliers/${id}/`);

      fetchSuppliers();

    } catch (error) {
      console.error(error.response?.data || error);

      setError(
        "Unable to delete supplier. The supplier may have existing purchases."
      );
    }
  };

  // -----------------------------
  // CANCEL EDIT
  // -----------------------------

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialFormData);
  };

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div>

      <h1>Suppliers</h1>

      <h2>
        {editingId
          ? "Edit Supplier"
          : "Add Supplier"}
      </h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Supplier Name: </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Contact Person: </label>

          <input
            type="text"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Email: </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Phone: </label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Address: </label>

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <br />

        <button type="submit">
          {editingId
            ? "Update Supplier"
            : "Add Supplier"}
        </button>

        {editingId && (
          <>
            {" "}

            <button
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        )}

      </form>

      {error && <p>{error}</p>}

      <hr />

      <h2>Supplier List</h2>

      {suppliers.length === 0 ? (
        <p>No suppliers available.</p>
      ) : (
        <table border="1" cellPadding="10">

          <thead>
            <tr>
              <th>ID</th>
              <th>Supplier</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {suppliers.map((supplier) => (
              <tr key={supplier.id}>

                <td>{supplier.id}</td>

                <td>{supplier.name}</td>

                <td>{supplier.contact_person}</td>

                <td>{supplier.email}</td>

                <td>{supplier.phone}</td>

                <td>{supplier.address}</td>

                <td>

                  <button
                    onClick={() =>
                      handleEdit(supplier)
                    }
                  >
                    Edit
                  </button>

                  {" "}

                  <button
                    onClick={() =>
                      handleDelete(supplier.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>
      )}

    </div>
  );
}

export default Suppliers;